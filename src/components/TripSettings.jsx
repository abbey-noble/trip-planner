import React, { useState, useRef } from 'react'
import { useData } from '../App'
import { exportData, importData } from '../store'
import LocationPicker from './LocationPicker'
import ImageInput from './ImageInput'
import SyncPanel from './SyncPanel'
import { ICON_SETS, ICON_SLOTS, DEFAULT_ICONS } from '../motifs'

export default function TripSettings({ onClose }) {
  const { data, updateData } = useData()
  const [form, setForm] = useState(() => ({
    ...data.trip,
    accommodation: { ...data.trip.accommodation },
  }))
  const fileInputRef = useRef(null)

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const setStay = (field, value) => setForm(prev => ({
    ...prev,
    accommodation: { ...prev.accommodation, [field]: value },
  }))

  const datesInvalid = form.startDate && form.endDate && form.endDate < form.startDate

  const handleSave = () => {
    if (datesInvalid) return
    updateData(prev => ({ ...prev, trip: form }))
    onClose()
  }

  const handleImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await importData(file)
      updateData(imported)
      onClose()
    } catch {
      alert('That file could not be read.')
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Trip</h2>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        <div className="form-group">
          <label className="form-label">Trip name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Corfu"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Destination</label>
          <input
            className="form-input"
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="Corfu, Greece"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Destination location</label>
          <LocationPicker
            value={form.coordinates}
            onChange={coords => set('coordinates', coords)}
            placeholder="Search destination"
          />
          <div className="form-hint">Used to centre the map if no accommodation is set.</div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start date</label>
            <input
              className="form-input"
              type="date"
              value={form.startDate}
              onChange={e => set('startDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End date</label>
            <input
              className="form-input"
              type="date"
              value={form.endDate}
              onChange={e => set('endDate', e.target.value)}
            />
          </div>
        </div>

        {datesInvalid && (
          <div className="form-hint">The end date must be on or after the start date.</div>
        )}

        <div className="form-group">
          <label className="form-label">Banner photo</label>
          <ImageInput
            value={form.bannerImage}
            onChange={val => set('bannerImage', val)}
            maxSize={1600}
            quality={0.72}
          />
          <div className="form-hint">A strip across the top of the card.</div>
        </div>

        <div className="form-group">
          <label className="form-label">Cover photo</label>
          <ImageInput
            value={form.coverImage}
            onChange={val => set('coverImage', val)}
            maxSize={1600}
            quality={0.72}
          />
          <div className="form-hint">Sits behind the pages.</div>
        </div>

        <hr className="form-divider" />
        <h3 className="form-section-title">Icons</h3>

        <div className="icon-grid">
          {ICON_SLOTS.map(slot => (
            <div key={slot.key} className="icon-col">
              <div className="icon-col-label">{slot.label}</div>
              {ICON_SETS[slot.key].map(({ id, label, Icon }) => {
                const chosen = (form.icons?.[slot.key] || DEFAULT_ICONS[slot.key]) === id
                return (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    aria-label={`${slot.label}: ${label}`}
                    aria-pressed={chosen}
                    className={`icon-choice${chosen ? ' chosen' : ''}`}
                    onClick={() => set('icons', {
                      ...DEFAULT_ICONS,
                      ...form.icons,
                      [slot.key]: id,
                    })}
                  >
                    <Icon />
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <hr className="form-divider" />
        <h3 className="form-section-title">Accommodation</h3>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={form.accommodation.name}
            onChange={e => setStay('name', e.target.value)}
            placeholder="Domes Miramare"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            value={form.accommodation.address}
            onChange={e => setStay('address', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Location</label>
          <LocationPicker
            value={form.accommodation.coordinates}
            onChange={coords => setStay('coordinates', coords)}
            placeholder="Search accommodation"
          />
          <div className="form-hint">
            The map centres here, and all distances are measured from this point.
          </div>
        </div>

        <button className="form-submit" onClick={handleSave} disabled={datesInvalid}>
          Save
        </button>

        <hr className="form-divider" />
        <h3 className="form-section-title">Sync</h3>
        <SyncPanel />

        <hr className="form-divider" />
        <h3 className="form-section-title">Backup</h3>

        <div className="form-group">
          <div className="data-actions">
            <button className="data-btn" onClick={exportData}>Export file</button>
            <button className="data-btn" onClick={() => fileInputRef.current?.click()}>
              Import file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="file-input-hidden"
              onChange={handleImport}
            />
          </div>
          <div className="form-hint">
            Saves the whole trip to a file. Importing replaces everything currently saved.
          </div>
        </div>
      </div>
    </div>
  )
}
