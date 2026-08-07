import { getClient } from './supabase'

/**
 * Sync model: localStorage stays the working copy so the app keeps working
 * with no signal. Supabase is the channel between devices. Whichever side has
 * the newer updatedAt wins, and pushes are debounced and retried when the
 * connection comes back.
 */

const TABLE = 'trips'
const MEMBERS = 'trip_members'
const BUCKET = 'trip-images'
const TRIP_KEY = 'trip-planner-trip-id'
const PUSH_DELAY = 1500

let pushTimer = null
let pending = null
let inFlight = false
let listeners = new Set()
let status = { state: 'off', message: '' }

export function onStatus(fn) {
  listeners.add(fn)
  fn(status)
  return () => listeners.delete(fn)
}

function setStatus(state, message = '') {
  status = { state, message }
  for (const fn of listeners) fn(status)
}

export function getStatus() {
  return status
}

/* ---- Auth ---- */

export async function getSession() {
  const client = getClient()
  if (!client) return null
  const { data } = await client.auth.getSession()
  return data.session || null
}

export async function signIn(email) {
  const client = getClient()
  if (!client) throw new Error('Sync is not set up yet.')
  const { error } = await client.auth.signInWithOtp({
    email: email.trim(),
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
  })
  if (error) throw error
}

export async function signOut() {
  const client = getClient()
  if (!client) return
  await client.auth.signOut()
  forgetTrip()
  setStatus('off')
}

export function onAuthChange(fn) {
  const client = getClient()
  if (!client) return () => {}
  const { data } = client.auth.onAuthStateChange((_event, session) => fn(session))
  return () => data.subscription.unsubscribe()
}

/* ---- Which trip this device is looking at ---- */

let tripId = null

export function getTripId() {
  return tripId || localStorage.getItem(TRIP_KEY)
}

function setTripId(id) {
  tripId = id
  if (id) localStorage.setItem(TRIP_KEY, id)
  else localStorage.removeItem(TRIP_KEY)
}

export function forgetTrip() {
  setTripId(null)
}

/**
 * Finds the trip this account belongs to, creating one on first sign-in.
 * A stored id is only trusted if the membership still exists.
 */
export async function ensureTrip() {
  const client = getClient()
  if (!client) return null
  const session = await getSession()
  if (!session) return null

  const { data: memberships, error } = await client
    .from(MEMBERS)
    .select('trip_id, joined_at')
    .order('joined_at', { ascending: true })
  if (error) throw error

  const ids = (memberships || []).map(m => m.trip_id)
  const stored = getTripId()

  if (stored && ids.includes(stored)) {
    tripId = stored
    return stored
  }
  if (ids.length) {
    setTripId(ids[0])
    return ids[0]
  }

  const { data: created, error: createError } = await client
    .from(TABLE)
    .insert({ owner: session.user.id, data: {} })
    .select('id')
    .single()
  if (createError) throw createError

  setTripId(created.id)
  return created.id
}

/** The code to hand to someone you want to plan with. */
export async function getJoinCode() {
  const client = getClient()
  const id = getTripId()
  if (!client || !id) return null
  const { data, error } = await client
    .from(TABLE)
    .select('join_code, owner')
    .eq('id', id)
    .maybeSingle()
  if (error) return null
  return data
}

/** Joins someone else's trip. Their copy becomes the shared one. */
export async function joinTrip(code) {
  const client = getClient()
  if (!client) throw new Error('Sync is not set up yet.')
  const { data, error } = await client.rpc('join_trip', { code })
  if (error) throw error
  setTripId(data)
  return data
}

/* ---- Images ---- */

/** crypto.randomUUID is unavailable outside secure contexts (e.g. plain http on a LAN). */
function randomName() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(',')
  const mime = /:(.*?);/.exec(meta)?.[1] || 'image/jpeg'
  const bytes = atob(b64)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

/**
 * Embedded images would make every sync re-upload the whole document, so any
 * data: URL is moved into the storage bucket and replaced by its public URL.
 * Anything that cannot be uploaded is simply left embedded.
 */
async function externaliseImages(data, userId) {
  const client = getClient()
  if (!client) return data

  let changed = false
  const next = structuredClone(data)

  const upload = async (dataUrl) => {
    const blob = dataUrlToBlob(dataUrl)
    const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
    const path = `${userId}/${randomName()}.${ext}`
    const { error } = await client.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type,
      upsert: false,
    })
    if (error) throw error
    return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  const swap = async (holder, field) => {
    const value = holder[field]
    if (typeof value === 'string' && value.startsWith('data:')) {
      try {
        holder[field] = await upload(value)
        changed = true
      } catch {
        /* keep it embedded and try again on the next sync */
      }
    }
  }

  for (const key of ['restaurants', 'experiences', 'locations']) {
    for (const item of next[key] || []) await swap(item, 'imageUrl')
  }
  for (const pin of next.board || []) await swap(pin, 'imageUrl')
  if (next.trip) await swap(next.trip, 'coverImage')

  return changed ? next : data
}

/* ---- Pull and push ---- */

export async function pull() {
  const client = getClient()
  if (!client) return null
  const id = await ensureTrip()
  if (!id) return null

  const { data, error } = await client
    .from(TABLE)
    .select('data, updated_at')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null
  return { data: data.data, updatedAt: data.updated_at }
}

async function performPush(payload) {
  const client = getClient()
  if (!client) return null
  const session = await getSession()
  if (!session) return null
  const id = await ensureTrip()
  if (!id) return null

  const withUrls = await externaliseImages(payload, session.user.id)

  const { error } = await client
    .from(TABLE)
    .update({ data: withUrls, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
  return withUrls
}

/**
 * Queues a push. Returns immediately; the caller is told about the outcome
 * through onStatus, and about rewritten image URLs through onUploaded.
 */
export function schedulePush(data, onUploaded) {
  pending = { data, onUploaded }
  if (!getClient()) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(flush, PUSH_DELAY)
}

export async function flush() {
  if (inFlight || !pending) return
  const job = pending
  pending = null
  inFlight = true
  setStatus('syncing')

  try {
    const result = await performPush(job.data)
    if (result === null) {
      setStatus('off')
    } else {
      setStatus('synced')
      if (result !== job.data) job.onUploaded?.(result)
    }
  } catch (e) {
    // Keep the work queued so it goes out when the connection returns.
    pending = pending || job
    setStatus('offline', e?.message || 'Could not reach the server')
  } finally {
    inFlight = false
    if (pending) {
      clearTimeout(pushTimer)
      pushTimer = setTimeout(flush, PUSH_DELAY * 4)
    }
  }
}

export function hasPending() {
  return pending !== null
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => { if (pending) flush() })
}
