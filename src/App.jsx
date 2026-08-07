import React, { useState, useCallback, useMemo, useEffect, createContext, useContext } from 'react'
import { loadData, saveData, generateId, normalise } from './store'
import { formatDateRange } from './utils'
import { isConfigured } from './supabase'
import { pull, schedulePush, flush, onStatus, onAuthChange, getSession } from './sync'
import Navigation from './components/Navigation'
import TripSettings from './components/TripSettings'
import RestaurantList from './components/RestaurantList'
import ExperienceList from './components/ExperienceList'
import LocationList from './components/LocationList'
import MapView from './components/MapView'
import Itinerary from './components/Itinerary'
import Board from './components/Board'
import ScheduleModal from './components/ScheduleModal'
import { Stamp, iconFor, cursorUrl, DEFAULT_ICONS } from './motifs'

const DataContext = createContext()

export function useData() {
  return useContext(DataContext)
}

/* Must match the 1024px breakpoint in index.css that reveals .map-pane. */
const SPLIT_BREAKPOINT = '(min-width: 1024px)'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    mql.addEventListener('change', onChange)
    setMatches(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

const SPLIT_TABS = ['restaurants', 'experiences', 'locations']

const SYNC_LABEL = {
  syncing: 'Saving',
  synced: 'Saved',
  offline: 'Offline',
}

export default function App() {
  const [data, setData] = useState(loadData)
  const [activeTab, setActiveTab] = useState('map')
  const [showSettings, setShowSettings] = useState(false)
  const [scheduling, setScheduling] = useState(null)
  const [focus, setFocus] = useState(null)

  // Map filter state lives here so the side pane and the Map tab agree.
  const [hiddenCategories, setHiddenCategories] = useState(() => new Set())

  const isWide = useMediaQuery(SPLIT_BREAKPOINT)

  const [syncStatus, setSyncStatus] = useState({ state: 'off' })

  // Applies data that came from the server, without pushing it straight back.
  const adoptRemote = useCallback((incoming) => {
    const next = normalise(incoming)
    saveData(next)
    setData(next)
  }, [])

  const updateData = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      next.updatedAt = new Date().toISOString()
      saveData(next)
      schedulePush(next, adoptRemote)
      return next
    })
  }, [adoptRemote])

  useEffect(() => onStatus(setSyncStatus), [])

  // On start, and whenever the signed-in user changes, reconcile with the
  // server. Newer wins; a tie or a missing row means this device publishes.
  const reconcile = useCallback(async () => {
    if (!isConfigured()) return
    const session = await getSession()
    if (!session) return
    try {
      const remote = await pull()
      const local = loadData()
      const localAt = local.updatedAt ? Date.parse(local.updatedAt) : 0
      const remoteAt = remote?.data?.updatedAt ? Date.parse(remote.data.updatedAt) : 0

      if (remote && remoteAt > localAt) {
        adoptRemote(remote.data)
      } else if (localAt > remoteAt || !remote) {
        schedulePush(local, adoptRemote)
        flush()
      }
    } catch {
      /* offline: the local copy is still fully usable */
    }
  }, [adoptRemote])

  useEffect(() => {
    reconcile()
    const unsub = onAuthChange(() => reconcile())
    const onFocus = () => reconcile()
    window.addEventListener('focus', onFocus)
    return () => { unsub(); window.removeEventListener('focus', onFocus) }
  }, [reconcile])

  const toggleCategory = useCallback((key) => {
    setHiddenCategories(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const showOnMap = useCallback((item) => {
    if (!item.coordinates) return
    setFocus({ ...item.coordinates, key: item.id, at: Date.now() })
    // With no side-by-side map, jump to the Map tab instead.
    if (!window.matchMedia(SPLIT_BREAKPOINT).matches) setActiveTab('map')
  }, [])

  const scheduledIds = useMemo(
    () => new Set(data.itinerary.map(i => i.itemId).filter(Boolean)),
    [data.itinerary]
  )

  const icons = useMemo(
    () => ({ ...DEFAULT_ICONS, ...(data.trip.icons || {}) }),
    [data.trip.icons]
  )

  // The pointer is a CSS variable so it can change without a rebuild.
  useEffect(() => {
    document.documentElement.style.setProperty('--cursor-icon', cursorUrl(icons.cursor))
  }, [icons.cursor])

  const ctx = useMemo(() => ({
    data,
    icons,
    updateData,
    generateId,
    hiddenCategories,
    toggleCategory,
    focus,
    showOnMap,
    scheduledIds,
    schedule: setScheduling,
    isWide,
  }), [data, icons, updateData, hiddenCategories, toggleCategory, focus, showOnMap, scheduledIds, isWide])

  const needsSetup = !data.trip.name && !data.trip.location
  const showSplit = isWide && SPLIT_TABS.includes(activeTab) && !needsSetup
  const dateRange = formatDateRange(data.trip.startDate, data.trip.endDate)

  const backdropStyle = data.trip.coverImage
    ? { backgroundImage: `url(${data.trip.coverImage})` }
    : undefined

  // The photo sits behind the masthead rather than in a strip of its own, so
  // it costs no extra height at any width.
  const mastheadPhoto = data.trip.bannerImage || data.trip.coverImage

  // The stamp carries the destination, falling back to the trip name.
  const stampLabel = (data.trip.location?.split(',')[0] || data.trip.name || 'Travels')
    .trim()
    .slice(0, 12)
    .toUpperCase()

  return (
    <DataContext.Provider value={ctx}>
      <div className="app">
        <div className="backdrop" style={backdropStyle} />

        <div className="notebook">
          <div className="notebook-inner">
          <header
            className={`masthead${mastheadPhoto ? ' has-photo' : ''}`}
            style={mastheadPhoto ? { '--masthead-photo': `url(${mastheadPhoto})` } : undefined}
          >
            <div className="masthead-text">
              <span className="masthead-eyebrow">Postcard from</span>
              <h1 className="header-title">{data.trip.name || 'Trip Planner'}</h1>
              {(data.trip.location || dateRange) && (
                <div className="header-sub">
                  {[data.trip.location, dateRange].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>

            <div className="masthead-right">
              <Stamp label={stampLabel} motif={iconFor('cursor', icons.cursor)} />
              <div className="header-actions">
                {syncStatus.state !== 'off' && (
                  <span
                    className={`sync-dot ${syncStatus.state}`}
                    title={syncStatus.message || SYNC_LABEL[syncStatus.state]}
                  >
                    {SYNC_LABEL[syncStatus.state]}
                  </span>
                )}
                <button className="header-btn" onClick={() => setShowSettings(true)}>
                  Trip
                </button>
              </div>
            </div>
          </header>

          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

          <main className={`main${showSplit ? ' split' : ''}`}>
            <div className="pane">
              {needsSetup ? (
                <div className="setup-prompt">
                  <h2>Start a trip</h2>
                  <p>Add where you are going, when, and where you are staying.</p>
                  <button onClick={() => setShowSettings(true)}>Set up trip</button>
                </div>
              ) : (
                <>
                  {activeTab === 'map' && <MapView />}
                  {activeTab === 'restaurants' && <RestaurantList />}
                  {activeTab === 'experiences' && <ExperienceList />}
                  {activeTab === 'locations' && <LocationList />}
                  {activeTab === 'board' && <Board />}
                  {activeTab === 'itinerary' && <Itinerary />}
                </>
              )}
            </div>

            {showSplit && (
              <div className="map-pane">
                <MapView compact />
              </div>
            )}
          </main>
          </div>
        </div>
      </div>

      {showSettings && <TripSettings onClose={() => setShowSettings(false)} />}

      {scheduling && (
        <ScheduleModal
          item={scheduling}
          onClose={() => setScheduling(null)}
          onDone={() => { setScheduling(null); setActiveTab('itinerary') }}
        />
      )}
    </DataContext.Provider>
  )
}
