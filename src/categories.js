export const RESTAURANT_CATEGORIES = [
  { id: 'cafe', label: 'Café / Breakfast' },
  { id: 'lunch-dinner', label: 'Lunch / Dinner' },
  { id: 'fancy', label: 'Fancy dinner' },
  { id: 'dessert', label: 'Dessert' },
]

export const EXPERIENCE_CATEGORIES = [
  { id: 'water', label: 'Water / Boat' },
  { id: 'food-drink', label: 'Food & drink' },
  { id: 'outdoors', label: 'Outdoors' },
  { id: 'culture', label: 'Culture' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'other', label: 'Other' },
]

export const LOCATION_CATEGORIES = [
  { id: 'beach', label: 'Beach' },
  { id: 'town', label: 'Town / Village' },
  { id: 'monument', label: 'Monument' },
  { id: 'sight', label: 'Sight' },
  { id: 'viewpoint', label: 'Viewpoint' },
  { id: 'other', label: 'Other' },
]

// Average speeds are deliberately conservative: they are applied to
// straight-line distance, which under-reads real road distance.
export const TRAVEL_MODES = [
  { id: 'walk', label: 'Walk', kmh: 4.5 },
  { id: 'drive', label: 'Drive', kmh: 32 },
  { id: 'taxi', label: 'Taxi', kmh: 32 },
  { id: 'boat', label: 'Boat', kmh: 18 },
  { id: 'bus', label: 'Bus', kmh: 20 },
]

export const TYPES = {
  restaurant: { label: 'Restaurants', color: '#A85238', plural: 'restaurants' },
  experience: { label: 'Experiences', color: '#3A6280', plural: 'experiences' },
  location: { label: 'Locations', color: '#5B7A4B', plural: 'locations' },
}

export const CATEGORIES_BY_TYPE = {
  restaurant: RESTAURANT_CATEGORIES,
  experience: EXPERIENCE_CATEGORIES,
  location: LOCATION_CATEGORIES,
}

export function categoryLabel(type, id) {
  const found = (CATEGORIES_BY_TYPE[type] || []).find(c => c.id === id)
  return found ? found.label : id
}

export function travelMode(id) {
  return TRAVEL_MODES.find(m => m.id === id) || null
}
