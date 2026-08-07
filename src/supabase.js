import { createClient } from '@supabase/supabase-js'

const CONFIG_KEY = 'trip-planner-supabase'

/**
 * Credentials come from .env.local if present, otherwise from whatever was
 * pasted into Trip settings. The anon key is a public key: it is safe in the
 * browser because row level security restricts every row to its owner.
 */
export function readConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (envUrl && envKey) return { url: envUrl, key: envKey, fromEnv: true }

  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.url && parsed.key) return { ...parsed, fromEnv: false }
    }
  } catch {
    /* ignore malformed config */
  }
  return null
}

export function writeConfig(url, key) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify({
    url: url.trim().replace(/\/+$/, ''),
    key: key.trim(),
  }))
  client = undefined
}

export function clearConfig() {
  localStorage.removeItem(CONFIG_KEY)
  client = undefined
}

let client

/** The shared client, or null when sync has not been set up. */
export function getClient() {
  if (client !== undefined) return client
  const config = readConfig()
  if (!config) {
    client = null
    return client
  }
  try {
    client = createClient(config.url, config.key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  } catch {
    client = null
  }
  return client
}

export function isConfigured() {
  return getClient() !== null
}
