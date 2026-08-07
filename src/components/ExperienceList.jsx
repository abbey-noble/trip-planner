import React from 'react'
import CollectionPage from './CollectionPage'
import { EXPERIENCE_CATEGORIES } from '../categories'

export default function ExperienceList() {
  return (
    <CollectionPage
      type="experience"
      title="Experiences"
      collectionKey="experiences"
      categories={EXPERIENCE_CATEGORIES}
      defaultCategory="outdoors"
      addLabel="Add experience"
      emptyText="No experiences saved."
      extraDefaults={{ duration: '', cost: '', provider: '', bookingRequired: false }}
      renderMeta={item => (
        <>
          {item.duration && <span className="meta-text">{item.duration}</span>}
          {item.cost && <span className="meta-text">{item.cost}</span>}
          {item.provider && <span className="meta-text">{item.provider}</span>}
          {item.bookingRequired && <span className="meta-tag">Booking</span>}
        </>
      )}
      renderExtraFields={(form, set) => (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                className="form-input"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                placeholder="2 hours"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cost</label>
              <input
                className="form-input"
                value={form.cost}
                onChange={e => set('cost', e.target.value)}
                placeholder="€40 per person"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Provider</label>
              <input
                className="form-input"
                value={form.provider}
                onChange={e => set('provider', e.target.value)}
              />
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
          </div>
        </>
      )}
    />
  )
}
