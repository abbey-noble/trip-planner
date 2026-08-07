import React from 'react'
import CollectionPage from './CollectionPage'
import { RESTAURANT_CATEGORIES } from '../categories'

export default function RestaurantList() {
  return (
    <CollectionPage
      type="restaurant"
      title="Restaurants"
      collectionKey="restaurants"
      categories={RESTAURANT_CATEGORIES}
      defaultCategory="lunch-dinner"
      addLabel="Add restaurant"
      emptyText="No restaurants saved."
      extraDefaults={{ cuisine: '', priceLevel: '', bookingRequired: false }}
      renderMeta={item => (
        <>
          {item.cuisine && <span className="meta-text">{item.cuisine}</span>}
          {item.priceLevel && <span className="meta-text">{item.priceLevel}</span>}
          {item.bookingRequired && <span className="meta-tag">Booking</span>}
        </>
      )}
      renderExtraFields={(form, set) => (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cuisine</label>
              <input
                className="form-input"
                value={form.cuisine}
                onChange={e => set('cuisine', e.target.value)}
                placeholder="Greek, seafood"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price</label>
              <select
                className="form-select"
                value={form.priceLevel}
                onChange={e => set('priceLevel', e.target.value)}
              >
                <option value="">Not set</option>
                <option value="€">€</option>
                <option value="€€">€€</option>
                <option value="€€€">€€€</option>
                <option value="€€€€">€€€€</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Booking required</label>
            <select
              className="form-select"
              value={form.bookingRequired ? 'yes' : 'no'}
              onChange={e => set('bookingRequired', e.target.value === 'yes')}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </>
      )}
    />
  )
}
