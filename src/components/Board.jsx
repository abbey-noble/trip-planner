import React, { useState } from 'react'
import { useData } from '../App'
import { generateId } from '../store'
import ImageInput from './ImageInput'
import { Sun } from '../motifs'

/** A visual scrapbook: pinned images with an optional note and link. */
export default function Board() {
  const { data, updateData } = useData()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const pins = data.board

  const handleSave = (pin) => {
    updateData(prev => ({
      ...prev,
      board: editing
        ? prev.board.map(p => (p.id === editing.id ? { ...pin, id: editing.id } : p))
        : [{ ...pin, id: generateId() }, ...prev.board],
    }))
    setShowForm(false)
    setEditing(null)
  }

  const handleDelete = (id) => {
    updateData(prev => ({ ...prev, board: prev.board.filter(p => p.id !== id) }))
    setLightbox(null)
  }

  return (
    <div className="page tone-board">
      <div className="collection-bar">
        <span className="board-count">{pins.length} pinned</span>
      </div>

      <div className="page-scroll">
      <div className="board-grid">
        {pins.length === 0 && (
          <p className="collage-empty">
            Places, food and views worth remembering.
          </p>
        )}

        {pins.map(pin => (
          <figure key={pin.id} className="pin">
            <button
              className="pin-image"
              onClick={() => setLightbox(pin)}
              aria-label={pin.caption || 'Open image'}
            >
              <img src={pin.imageUrl} alt={pin.caption || ''} loading="lazy" />
            </button>
            {(pin.caption || pin.url) && (
              <figcaption className="pin-caption">
                {pin.caption}
                {pin.url && (
                  <a
                    className="pin-link"
                    href={pin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      </div>

      <div className="page-foot">
        <button
          className="add-btn"
          onClick={() => { setEditing(null); setShowForm(true) }}
          title="Pin an image"
        >
          <Sun className="add-btn-motif" />
          <span>Add</span>
        </button>
      </div>

      {lightbox && (
        <div className="modal-overlay lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            <img src={lightbox.imageUrl} alt={lightbox.caption || ''} />
            <div className="lightbox-bar">
              <span className="lightbox-caption">{lightbox.caption}</span>
              <span className="lightbox-actions">
                <button
                  className="item-action-btn"
                  onClick={() => { setEditing(lightbox); setLightbox(null); setShowForm(true) }}
                >
                  Edit
                </button>
                <button
                  className="item-action-btn delete"
                  onClick={() => handleDelete(lightbox.id)}
                >
                  Delete
                </button>
                <button className="item-action-btn" onClick={() => setLightbox(null)}>
                  Close
                </button>
              </span>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <PinForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}

function PinForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => initial || { imageUrl: '', caption: '', url: '' })
  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const submit = () => {
    if (!form.imageUrl) return
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit pin' : 'Pin an image'}</h2>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        <div className="form-group">
          <label className="form-label">Image</label>
          <ImageInput value={form.imageUrl} onChange={val => set('imageUrl', val)} />
        </div>

        <div className="form-group">
          <label className="form-label">Caption</label>
          <input
            className="form-input"
            value={form.caption}
            onChange={e => set('caption', e.target.value)}
            placeholder="What is this?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Link</label>
          <input
            className="form-input"
            value={form.url}
            onChange={e => set('url', e.target.value)}
            placeholder="https://"
          />
        </div>

        <button className="form-submit" onClick={submit} disabled={!form.imageUrl}>
          {initial ? 'Save changes' : 'Pin'}
        </button>
      </div>
    </div>
  )
}
