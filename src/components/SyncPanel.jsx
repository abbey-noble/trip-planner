import React, { useState, useEffect } from 'react'
import { readConfig, writeConfig, clearConfig, isConfigured } from '../supabase'
import {
  getSession, signIn, signInWithPassword, signUpWithPassword,
  signOut, onAuthChange, getJoinCode, joinTrip,
} from '../sync'

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
            <span className="location-selected-coords">connected</span>
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
              Works offline. Changes sync when you are back online.
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
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const submit = async () => {
    if (!email.trim() || (mode !== 'link' && password.length < 6)) return
    setState('working')
    setError('')
    setNotice('')
    try {
      if (mode === 'signin') {
        await signInWithPassword(email, password)
      } else if (mode === 'signup') {
        const { needsConfirmation } = await signUpWithPassword(email, password)
        if (needsConfirmation) {
          setNotice('Account created. Confirm it from the email just sent, then sign in.')
        }
      } else {
        await signIn(email)
        setNotice(`A sign-in link is on its way to ${email}. Open it on this device.`)
      }
      setState('idle')
    } catch (e) {
      setError(e?.message || 'That did not work.')
      setState('idle')
    }
  }

  return (
    <div className="form-group">
      <div className="mode-tabs">
        <button
          className={`filter-chip${mode === 'signin' ? ' active' : ''}`}
          onClick={() => { setMode('signin'); setError(''); setNotice('') }}
        >
          Sign in
        </button>
        <button
          className={`filter-chip${mode === 'signup' ? ' active' : ''}`}
          onClick={() => { setMode('signup'); setError(''); setNotice('') }}
        >
          Create account
        </button>
        <button
          className={`filter-chip${mode === 'link' ? ' active' : ''}`}
          onClick={() => { setMode('link'); setError(''); setNotice('') }}
        >
          Email a link
        </button>
      </div>

      <label className="form-label">Email</label>
      <input
        className="form-input"
        type="email"
        autoComplete="username"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
      />

      {mode !== 'link' && (
        <>
          <label className="form-label" style={{ marginTop: 16 }}>Password</label>
          <input
            className="form-input"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </>
      )}

      {mode === 'link' && (
        <div className="form-hint">The link works once. Open it on this device.</div>
      )}

      {error && <div className="form-hint" style={{ color: 'var(--danger)' }}>{error}</div>}
      {notice && <div className="form-hint">{notice}</div>}

      <button
        className="data-btn"
        style={{ marginTop: 12 }}
        onClick={submit}
        disabled={state === 'working' || !email.trim() || (mode !== 'link' && password.length < 6)}
      >
        {state === 'working'
          ? 'Working…'
          : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send link'}
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
