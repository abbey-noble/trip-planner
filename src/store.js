import { DEFAULT_ICONS } from './motifs'

const STORAGE_KEY = 'trip-planner-data'

const defaultData = {
  trip: {
    name: '',
    location: '',
    coordinates: null,
    startDate: '',
    endDate: '',
    coverImage: '',
    bannerImage: '',
    icons: { ...DEFAULT_ICONS },
    accommodation: {
      name: '',
      coordinates: null,
      address: '',
    },
  },
  restaurants: [],
  experiences: [],
  locations: [],
  itinerary: [],
  board: [],
  updatedAt: null,
}

export { defaultData }

/** Normalises anything (local or remote) into a complete data object. */
export function normalise(parsed) {
  const data = {
    ...defaultData,
    ...parsed,
    trip: {
      ...defaultData.trip,
      ...parsed?.trip,
      accommodation: {
        ...defaultData.trip.accommodation,
        ...(parsed?.trip?.accommodation || {}),
      },
      icons: { ...DEFAULT_ICONS, ...(parsed?.trip?.icons || {}) },
    },
  }

  // "Food & drink" was removed from Do; Eat covers it.
  for (const item of data.experiences || []) {
    if (item.category === 'food-drink') item.category = 'other'
  }
  for (const key of ['restaurants', 'experiences', 'locations', 'itinerary', 'board']) {
    if (!Array.isArray(data[key])) data[key] = []
  }
  return data
}

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return normalise(JSON.parse(raw))
  } catch (e) {
    console.error('Failed to load data:', e)
  }
  return { ...defaultData }
}

let quotaWarned = false

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    // Embedded images are stored as data URLs and can exhaust the ~5MB
    // localStorage quota. Silent failure here would look like lost work.
    const isQuota = e instanceof DOMException && (
      e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )
    if (isQuota && !quotaWarned) {
      quotaWarned = true
      alert(
        'Storage for this trip is full, so that change was not saved.\n\n' +
        'Remove some images, or export the trip to a file first.'
      )
    }
    console.error('Failed to save data:', e)
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11)
}

export function exportData() {
  const data = loadData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `trip-planner-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        if (!parsed || typeof parsed !== 'object' || !parsed.trip) {
          throw new Error('Not a trip planner file')
        }
        const data = normalise(parsed)
        data.updatedAt = new Date().toISOString()
        saveData(data)
        resolve(data)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
