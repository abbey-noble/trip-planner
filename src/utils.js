import { travelMode } from './categories'

/* ---- Distance ---- */

export function getDistance(coord1, coord2) {
  if (!coord1 || !coord2) return null
  const R = 6371
  const dLat = toRad(coord2.lat - coord1.lat)
  const dLng = toRad(coord2.lng - coord1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg) {
  return deg * (Math.PI / 180)
}

export function formatDistance(km) {
  if (km === null || km === undefined) return ''
  if (km < 1) return `${Math.round(km * 100) * 10} m`
  return `${km.toFixed(1)} km`
}

/**
 * Travel time for a straight-line distance under a given mode.
 * Straight-line under-reads real routes, so distance is scaled by a
 * detour factor before applying the mode's average speed.
 */
export function estimateTravelTime(km, modeId) {
  const mode = travelMode(modeId)
  if (km === null || km === undefined || !mode) return ''
  const detour = mode.id === 'boat' ? 1.1 : 1.3
  const minutes = Math.round((km * detour / mode.kmh) * 60)
  if (minutes < 5) return 'under 5 min'
  if (minutes < 60) return `${roundTo(minutes, 5)} min`
  const hours = Math.floor(minutes / 60)
  const rem = roundTo(minutes % 60, 5)
  if (rem === 0) return `${hours} hr`
  if (rem === 60) return `${hours + 1} hr`
  return `${hours} hr ${rem} min`
}

function roundTo(n, step) {
  return Math.round(n / step) * step
}

/**
 * The line shown under an item: distance from the hotel, plus travel
 * time when a mode is set. Manual travel time always wins over the estimate.
 */
export function travelSummary(item, hotelCoords) {
  if (!item.coordinates || !hotelCoords) return ''
  const km = getDistance(hotelCoords, item.coordinates)
  const parts = [`${formatDistance(km)} from hotel`]
  const mode = travelMode(item.travelMode)
  if (mode) {
    const time = item.travelTime?.trim() || estimateTravelTime(km, item.travelMode)
    parts.push(item.travelTime?.trim() ? `${mode.label} ${time}` : `${mode.label} ~${time}`)
  }
  return parts.join(' · ')
}

/* ---- Dates ---- */

/** Local-date ISO string. Avoids the UTC shift that toISOString() causes. */
export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function getDatesInRange(startDate, endDate) {
  if (!startDate || !endDate) return []
  const dates = []
  const current = parseISODate(startDate)
  const end = parseISODate(endDate)
  if (isNaN(current) || isNaN(end) || end < current) return []
  let guard = 0
  while (current <= end && guard < 400) {
    dates.push(toISODate(current))
    current.setDate(current.getDate() + 1)
    guard++
  }
  return dates
}

export function formatDate(dateStr) {
  return parseISODate(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

export function formatWeekday(dateStr) {
  return parseISODate(dateStr).toLocaleDateString('en-GB', { weekday: 'short' })
}

export function formatDayMonth(dateStr) {
  return parseISODate(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return ''
  const s = parseISODate(startDate)
  const e = parseISODate(endDate)
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()
  const sDay = s.toLocaleDateString('en-GB', { day: 'numeric', ...(sameMonth ? {} : { month: 'short' }) })
  const eDay = e.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${sDay} – ${eDay}`
}

/* ---- Time ---- */

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatTimeRange(startTime, endTime) {
  if (!endTime) return startTime
  return `${startTime} – ${endTime}`
}
