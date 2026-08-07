import React, { useState, useEffect } from 'react'
import { readConfig, writeConfig, clearConfig, isConfigured } from '../supabase'
import { getSession, signIn, signOut, onAuthChange, getJoinCode, joinTrip } from '../sync'

/** Connects this device to the shared copy of the trip. */
export default function SyncPanel() {
  const config = readConfig()
  const [session, setSession] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    getSession().then(s => { if (alive) { setSession(s); setReady(true) } })
    const unsub = onAuthChange(s => setSession(s))
    return () => { alive = false; unsub() }
  }, [])

  if (!isConfigured()) return <ConnectForm />

  return (
    <>
      <div className="form-group">
        <label className="form-label">Server</label>
        <div className="location-selected">
          <span className="location-selected-name">{config.url.replace(/^https?:\/\//, '')}</span>
          {config.fromEnv ? (
            <span className="location-selected-coords">from .env.local</span>
          ) : (
            <button
              className="location-clear"
              onClick={() => { clearConfig(); window.location.reload() }}
            >
              Change
            </button>
          )}
        </div>
      </div>

      {!ready ? (
        <div className="form-hint">Checking…</div>
      ) : session ? (
        <>
          <div className="form-group">
            <label className="form-label">Signed in</label>
            <div className="location-selected">
              <span className="location-selected-name">{session.user.email}</span>
              <button className="location-clear" onClick={() => signOut()}>Sign out</button>
            </div>
            <div className="form-hint">
              Changes save to this device first, then go to the server.
            </div>
          </div>

          <SharePanel />
        </>
      ) : (
        <SignInForm />
      )}
    </>
  )
}

function ConnectForm() {
  const [url, setUrl] = useState('')
  const [key, setKey] = useState('')

  const connect = () => {
    if (!url.trim() || !key.trim()) return
    writeConfig(url, key)
    window.location.reload()
  }

  return (
    <>
      <div className="form-hint" style={{ marginBottom: 16 }}>
        Create a free project at supabase.com, run the SQL in
        <code> supabase/schema.sql</code>, then paste the project URL and the
        anon key from Settings → API.
      </div>

      <div className="form-group">
        <label className="form-label">Project URL</label>
        <input
          className="form-input"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://xxxx.supabase.co"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Anon key</label>
        <input
          className="form-input"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="eyJ…"
        />
      </div>

      <button className="data-btn" onClick={connect} disabled={!url.trim() || !key.trim()}>
        Connect
      </button>
    </>
  )
}

function SignInForm() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  const send = async () => {
    if (!email.trim()) return
    setState('sending')
    setError('')
    try {
      await signIn(email)
      setState('sent')
    } catch (e) {
      setError(e?.message || 'Could not send the link.')
      setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="form-group">
        <label className="form-label">Check your email</label>
        <div className="form-hint">
          A sign-in link is on its way to {email}. Open it on this device.
        </div>
      </div>
    )
  }

  return (
    <div className="form-group">
      <label className="form-label">Email</label>
      <input
        className="form-input"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <div className="form-hint">
        You will be sent a sign-in link. No password to remember.
      </div>
      {error && <div className="form-hint" style={{ color: 'var(--danger)' }}>{error}</div>}
      <button
        className="data-btn"
        style={{ marginTop: 12 }}
        onClick={send}
        disabled={state === 'sending' || !email.trim()}
      >
        {state === 'sending' ? 'Sending…' : 'Send link'}
      </button>
    </div>
  )
}

/** Lets a second person plan the same trip. */
function SharePanel() {
  const [code, setCode] = useState(null)
  const [entry, setEntry] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    getJoinCode().then(r => { if (alive) setCode(r?.join_code || null) })
    return () => { alive = false }
  }, [])

  const join = async () => {
    if (!entry.trim()) return
    setState('joining')
    setError('')
    try {
      await joinTrip(entry)
      window.location.reload()
    } catch (e) {
      setError(e?.message || 'That code did not work.')
      setState('idle')
    }
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">Invite code</label>
        <div className="join-code">{code || '\u2014'}</div>
        <div className="form-hint">
          Give this to whoever you are travelling with. They sign in with their
          own email, then enter it below. You will both see the same trip.
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Join someone else's trip</label>
        <input
          className="form-input"
          value={entry}
          onChange={e => setEntry(e.target.value.toUpperCase())}
          placeholder="ABC123"
          maxLength={8}
        />
        <div className="form-hint">
          This replaces what is on this device with the shared trip. Export a
          backup first if you have planning here you want to keep.
        </div>
        {error && <div className="form-hint" style={{ color: 'var(--danger)' }}>{error}</div>}
        <button
          className="data-btn"
          style={{ marginTop: 12 }}
          onClick={join}
          disabled={state === 'joining' || !entry.trim()}
        >
          {state === 'joining' ? 'Joining…' : 'Join trip'}
        </button>
      </div>
    </>
  )
}
