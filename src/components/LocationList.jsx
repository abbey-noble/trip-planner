import React from 'react'
import CollectionPage from './CollectionPage'
import { LOCATION_CATEGORIES } from '../categories'

export default function LocationList() {
  return (
    <CollectionPage
      type="location"
      title="Locations"
      collectionKey="locations"
      categories={LOCATION_CATEGORIES}
      defaultCategory="beach"
      addLabel="Add location"
      emptyText="No locations saved."
      extraDefaults={{ bestTime: '' }}
      renderMeta={item => (
        item.bestTime ? <span className="meta-text">{item.bestTime}</span> : null
      )}
      renderExtraFields={(form, set) => (
        <div className="form-group">
          <label className="form-label">Best time to go</label>
          <input
            className="form-input"
            value={form.bestTime}
            onChange={e => set('bestTime', e.target.value)}
            placeholder="Morning, before the crowds"
          />
        </div>
      )}
    />
  )
}
