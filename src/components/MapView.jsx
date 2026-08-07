import React, { useState, useMemo, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { useData } from '../App'
import { TYPES, CATEGORIES_BY_TYPE, categoryLabel } from '../categories'
import { travelSummary } from '../utils'

const TYPE_ORDER = ['restaurant', 'experience', 'location']

const AREA_ZOOM = 10 // wide enough to hold the whole island

/** Frames everything saved, or falls back to the surrounding area. */
function frame(map, points, centre) {
  if (points.length > 1) {
    map.fitBounds(points, { padding: [44, 44], maxZoom: 14 })
  } else if (centre) {
    map.setView([centre.lat, centre.lng], AREA_ZOOM)
  }
}

/** Frames the trip on open, and again if the base location changes. */
function AutoFrame({ points, centre }) {
  const map = useMap()
  const prev = useRef(null)

  useEffect(() => {
    if (!centre) return
    const key = `${centre.lat},${centre.lng}`
    if (prev.current === key) return
    prev.current = key
    frame(map, points, centre)
  }, [centre, points, map])

  return null
}

/** Pans to an item when it is selected from a list. */
function FocusHandler({ focus }) {
  const map = useMap()
  const seen = useRef(null)

  useEffect(() => {
    if (!focus || seen.current === focus.at) return
    seen.current = focus.at
    map.flyTo([focus.lat, focus.lng], Math.max(map.getZoom(), 14), { duration: 0.6 })
  }, [focus, map])

  return null
}

/**
 * Leaflet caches its container size, so it renders grey gaps after the pane is
 * resized (window drag, rotation, the split view appearing). This re-measures.
 */
function ResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()
    let rafId = null
    const remeasure = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => map.invalidateSize())
    }

    const observer = new ResizeObserver(remeasure)
    observer.observe(container)

    // Rotation resizes after the event fires, so re-measure once it settles.
    const onOrientation = () => setTimeout(remeasure, 250)
    window.addEventListener('orientationchange', onOrientation)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      window.removeEventListener('orientationchange', onOrientation)
    }
  }, [map])

  return null
}

function FrameControl({ points, centre }) {
  const map = useMap()
  if (!centre) return null
  return (
    <button className="map-recenter" onClick={() => frame(map, points, centre)}>
      {points.length > 1 ? 'Show all' : 'Recentre'}
    </button>
  )
}

export default function MapView({ compact = false }) {
  const { data, hiddenCategories, toggleCategory, focus } = useData()
  const [legendOpen, setLegendOpen] = useState(!compact)

  const accommodation = data.trip.accommodation
  const centre = accommodation?.coordinates || data.trip.coordinates || null
  const hotelCoords = accommodation?.coordinates

  const collections = useMemo(() => ({
    restaurant: data.restaurants,
    experience: data.experiences,
    location: data.locations,
  }), [data.restaurants, data.experiences, data.locations])

  const markers = useMemo(() => {
    const out = []
    for (const type of TYPE_ORDER) {
      for (const item of collections[type]) {
        if (!item.coordinates) continue
        if (hiddenCategories.has(`${type}:${item.category}`)) continue
        out.push({ item, type })
      }
    }
    return out
  }, [collections, hiddenCategories])

  const plottedCount = TYPE_ORDER.reduce(
    (n, type) => n + collections[type].filter(i => i.coordinates).length, 0
  )

  const points = useMemo(() => {
    const out = markers.map(({ item }) => [item.coordinates.lat, item.coordinates.lng])
    if (hotelCoords) out.push([hotelCoords.lat, hotelCoords.lng])
    return out
  }, [markers, hotelCoords])

  if (!centre) {
    return (
      <div className="map-empty">
        Add the accommodation or destination location under Trip to use the map.
      </div>
    )
  }

  return (
    <div className="map-container">
      {plottedCount > 0 && (
      <div className="map-legend">
        <button
          className="map-legend-toggle"
          onClick={() => setLegendOpen(o => !o)}
        >
          Filter
          <span>{legendOpen ? '−' : '+'}</span>
        </button>

        {legendOpen && TYPE_ORDER.map(type => {
          const cats = CATEGORIES_BY_TYPE[type]
          const items = collections[type]
          if (items.length === 0) return null
          return (
            <div key={type} className="map-legend-group">
              <div className="map-legend-title">{TYPES[type].label}</div>
              {cats.map(cat => {
                const count = items.filter(i => i.category === cat.id && i.coordinates).length
                if (count === 0) return null
                const key = `${type}:${cat.id}`
                const active = !hiddenCategories.has(key)
                return (
                  <button
                    key={key}
                    className={`map-filter${active ? ' active' : ''}`}
                    style={{ '--dot-color': TYPES[type].color }}
                    onClick={() => toggleCategory(key)}
                  >
                    <span className="map-filter-dot" />
                    <span>{cat.label}</span>
                    <span className="map-filter-count">{count}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
      )}

      <MapContainer
        center={[centre.lat, centre.lng]}
        zoom={AREA_ZOOM}
        style={{ height: '100%', width: '100%' }}
        zoomControl
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ResizeHandler />
        <AutoFrame points={points} centre={centre} />
        <FocusHandler focus={focus} />
        <FrameControl points={points} centre={centre} />

        {accommodation?.coordinates && (
          <CircleMarker
            center={[accommodation.coordinates.lat, accommodation.coordinates.lng]}
            radius={8}
            fillColor="#191818"
            fillOpacity={1}
            color="#FFFFFF"
            weight={3}
          >
            <Popup>
              <div className="popup-name">{accommodation.name || 'Accommodation'}</div>
              <div className="popup-category">Staying here</div>
              {accommodation.address && (
                <div className="popup-detail">{accommodation.address}</div>
              )}
            </Popup>
          </CircleMarker>
        )}

        {markers.map(({ item, type }) => (
          <CircleMarker
            key={`${type}-${item.id}`}
            center={[item.coordinates.lat, item.coordinates.lng]}
            radius={6}
            fillColor={TYPES[type].color}
            fillOpacity={1}
            color="#FFFFFF"
            weight={2}
          >
            <Popup>
              <div className="popup-name">{item.name}</div>
              <div className="popup-category">{categoryLabel(type, item.category)}</div>
              {item.address && <div className="popup-detail">{item.address}</div>}
              {travelSummary(item, hotelCoords) && (
                <div className="popup-detail">{travelSummary(item, hotelCoords)}</div>
              )}
              {item.notes && <div className="popup-detail">{item.notes}</div>}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
