import React, { useState, useRef, useEffect } from 'react'

/**
 * Produces { lat, lng, label }. The label is stored so a saved place still
 * reads as a name when the form is reopened, not just coordinates.
 */
export default function LocationPicker({ value, onChange, placeholder }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  const handleSearch = (text) => {
    setQuery(text)
    setShowResults(true)
    clearTimeout(debounceRef.current)

    if (text.trim().length < 2) {
      setResults([])
      return
    }

    const fromLink = extractCoords(text)
    if (fromLink) {
      onChange({ ...fromLink, label: '' })
      setQuery('')
      setShowResults(false)
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(text)}`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const json = await res.json()
        setResults(json.map(r => ({
          full: r.display_name,
          label: r.display_name.split(',').slice(0, 2).join(', ').trim(),
          lat: parseFloat(r.lat),
          lng: parseFloat(r.lon),
        })))
      } catch {
        setResults([])
      }
      setSearching(false)
    }, 400)
  }

  const handleSelect = (result) => {
    onChange({ lat: result.lat, lng: result.lng, label: result.label })
    setQuery('')
    setShowResults(false)
    setResults([])
  }

  if (value) {
    return (
      <div className="location-selected">
        <span className="location-selected-name">
          {value.label || 'Pinned'}
        </span>
        <span className="location-selected-coords">
          {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
        </span>
        <button className="location-clear" type="button" onClick={() => onChange(null)}>
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="location-picker">
      <div className="location-search">
        <input
          className="form-input"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder={placeholder || 'Search, or paste a Maps link'}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />

        {searching && <div className="location-searching">Searching…</div>}

        {showResults && results.length > 0 && (
          <div className="location-results">
            {results.map((r, i) => (
              <button
                key={i}
                className="location-result"
                type="button"
                onMouseDown={() => handleSelect(r)}
              >
                {r.full}
              </button>
            ))}
          </div>
        )}

        {showResults && query.trim().length >= 3 && !searching && results.length === 0 && (
          <div className="location-searching">No results</div>
        )}
      </div>
    </div>
  )
}

function extractCoords(text) {
  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,          // Google Maps /@lat,lng
    /[?&]q=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,  // ?q=lat,lng
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,      // Google place URLs
    /^\s*(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s*$/, // raw "lat, lng"
  ]
  for (const re of patterns) {
    const m = text.match(re)
    if (m) {
      const lat = parseFloat(m[1])
      const lng = parseFloat(m[2])
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) return { lat, lng }
    }
  }
  return null
}
