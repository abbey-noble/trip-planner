import React, { useState } from 'react'
import { useData } from '../App'
import { generateId } from '../store'
import { travelSummary } from '../utils'
import { categoryLabel, TRAVEL_MODES } from '../categories'
import { iconFor, TYPE_SLOT } from '../motifs'
import LocationPicker from './LocationPicker'
import ImageInput from './ImageInput'

/**
 * Shared pinboard for restaurants, experiences and locations. Anything with a
 * photo becomes a photo card; anything without becomes a written note, so a
 * half-filled collection still reads as a composed board.
 */
export default function CollectionPage({
  type,
  title,
  collectionKey,
  categories,
  defaultCategory,
  emptyText,
  addLabel,
  extraDefaults = {},
  renderExtraFields,
  renderMeta,
}) {
  const { data, icons, updateData, showOnMap, schedule, scheduledIds } = useData()
  const [filter, setFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const Motif = iconFor(TYPE_SLOT[type], icons[TYPE_SLOT[type]])
  const items = data[collectionKey]
  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)
  const hotelCoords = data.trip.accommodation?.coordinates

  const handleSave = (item) => {
    updateData(prev => ({
      ...prev,
      [collectionKey]: editing
        ? prev[collectionKey].map(i => (i.id === editing.id ? { ...item, id: editing.id } : i))
        : [{ ...item, id: generateId() }, ...prev[collectionKey]],
    }))
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id) => {
    updateData(prev => ({
      ...prev,
      [collectionKey]: prev[collectionKey].filter(i => i.id !== id),
      itinerary: prev.itinerary.filter(e => e.itemId !== id),
    }))
  }

  const counts = categories.reduce((acc, c) => {
    acc[c.id] = items.filter(i => i.category === c.id).length
    return acc
  }, {})

  return (
    <div className={`page tone-${type}`}>
      <div className="collection-bar">
        <div className="filters">
        <button
          className={`filter-chip${filter === 'all' ? ' active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All{items.length ? ` ${items.length}` : ''}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`filter-chip${filter === cat.id ? ' active' : ''}`}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}{counts[cat.id] ? ` ${counts[cat.id]}` : ''}
          </button>
        ))}
        </div>
      </div>

      <div className="page-scroll">
      <div className="collage">
        {filtered.length === 0 && (
          <p className="collage-empty">
            {filter === 'all' ? emptyText : `Nothing under ${categoryLabel(type, filter)} yet.`}
          </p>
        )}

        {filtered.map(item => {
          const summary = travelSummary(item, hotelCoords)
          return (
            <article
              key={item.id}
              className={`card ${item.imageUrl ? 'card-photo' : 'card-note'} tone-${type}`}
            >
              {item.imageUrl && (
                <div className="card-image">
                  <img src={item.imageUrl} alt="" loading="lazy" />
                </div>
              )}

              <div className="card-body">
                <span className="card-cat">
                  <Motif className="card-cat-motif" />
                  {categoryLabel(type, item.category)}
                </span>

                <h3 className="card-name">{item.name}</h3>

                {(renderMeta?.(item) || item.address) && (
                  <div className="card-meta">
                    {renderMeta?.(item)}
                    {item.address && <span className="meta-text">{item.address}</span>}
                  </div>
                )}

                {item.notes && <p className="card-notes">{item.notes}</p>}

                {summary && <div className="card-distance">{summary}</div>}

                <div className="card-actions">
                  <button
                    className={`item-action-btn${scheduledIds.has(item.id) ? ' scheduled' : ''}`}
                    onClick={() => schedule({ ...item, type })}
                  >
                    {scheduledIds.has(item.id) ? 'Scheduled' : 'Schedule'}
                  </button>
                  {item.coordinates && (
                    <button className="item-action-btn" onClick={() => showOnMap(item)}>
                      Map
                    </button>
                  )}
                  {item.url && (
                    <a className="item-link" href={item.url} target="_blank" rel="noopener noreferrer">
                      Link
                    </a>
                  )}
                  <button
                    className="item-action-btn"
                    onClick={() => { setEditing(item); setShowForm(true) }}
                  >
                    Edit
                  </button>
                  <button className="item-action-btn delete" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      </div>

      <div className="page-foot">
        <button
          className="add-btn"
          onClick={() => { setEditing(null); setShowForm(true) }}
          title={addLabel}
        >
          <Motif className="add-btn-motif" />
          <span>Add</span>
        </button>
      </div>

      {showForm && (
        <ItemForm
          initial={editing}
          title={editing ? `Edit ${title.toLowerCase().replace(/s$/, '')}` : addLabel}
          categories={categories}
          defaultCategory={defaultCategory}
          extraDefaults={extraDefaults}
          renderExtraFields={renderExtraFields}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}

function ItemForm({
  initial, title, categories, defaultCategory, extraDefaults, renderExtraFields, onSave, onClose,
}) {
  const [form, setForm] = useState(() => initial || {
    name: '',
    category: defaultCategory,
    coordinates: null,
    address: '',
    notes: '',
    url: '',
    imageUrl: '',
    travelMode: '',
    travelTime: '',
    ...extraDefaults,
  })

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSave({ ...form, name: form.name.trim() })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Kept high in the form: the photo is what the card is built around. */}
        <div className="form-group">
          <label className="form-label">Photo</label>
          <ImageInput value={form.imageUrl} onChange={val => set('imageUrl', val)} />
        </div>

        {renderExtraFields?.(form, set)}

        <hr className="form-divider" />

        <div className="form-group">
          <label className="form-label">Location</label>
          <LocationPicker
            value={form.coordinates}
            onChange={coords => set('coordinates', coords)}
          />
          <div className="form-hint">
            Search by name, or paste a Google Maps link or “lat, lng”.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            className="form-input"
            value={form.address}
            onChange={e => set('address', e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Getting there</label>
            <select
              className="form-select"
              value={form.travelMode}
              onChange={e => set('travelMode', e.target.value)}
            >
              <option value="">Not set</option>
              {TRAVEL_MODES.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Travel time</label>
            <input
              className="form-input"
              value={form.travelTime}
              onChange={e => set('travelTime', e.target.value)}
              placeholder="Estimated"
            />
          </div>
        </div>

        <hr className="form-divider" />

        <div className="form-group">
          <label className="form-label">Link</label>
          <input
            className="form-input"
            value={form.url}
            onChange={e => set('url', e.target.value)}
            placeholder="https://"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>

        <button className="form-submit" onClick={handleSubmit}>
          {initial ? 'Save changes' : 'Add'}
        </button>
      </div>
    </div>
  )
}
