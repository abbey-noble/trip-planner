import React, { useState } from 'react'
import { useData } from '../App'
import { generateId } from '../store'
import { getDatesInRange, formatDate, timeToMinutes } from '../utils'

const DEFAULT_TIMES = {
  cafe: '09:00',
  'lunch-dinner': '13:00',
  fancy: '20:00',
  dessert: '16:00',
}

/** Places a saved item onto a day in the itinerary. */
export default function ScheduleModal({ item, onClose, onDone }) {
  const { data, updateData } = useData()
  const dates = getDatesInRange(data.trip.startDate, data.trip.endDate)

  const existing = data.itinerary.filter(e => e.itemId === item.id)

  const [date, setDate] = useState(dates[0] || '')
  const [startTime, setStartTime] = useState(DEFAULT_TIMES[item.category] || '10:00')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')

  if (dates.length === 0) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal">
          <div className="modal-header">
            <h2 className="modal-title">Schedule</h2>
            <button className="modal-close" onClick={onClose}>Close</button>
          </div>
          <p className="form-hint">Set the trip dates first, under Trip.</p>
        </div>
      </div>
    )
  }

  const invalidRange = endTime && timeToMinutes(endTime) <= timeToMinutes(startTime)

  const handleAdd = () => {
    if (!date || invalidRange) return
    updateData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        id: generateId(),
        date,
        startTime,
        endTime,
        type: item.type,
        itemId: item.id,
        title: item.name,
        notes,
      }],
    }))
    onDone()
  }

  const handleUnschedule = (entryId) => {
    updateData(prev => ({
      ...prev,
      itinerary: prev.itinerary.filter(e => e.id !== entryId),
    }))
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{item.name}</h2>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        {existing.length > 0 && (
          <div className="form-group">
            <label className="form-label">Already scheduled</label>
            {existing.map(e => (
              <div key={e.id} className="location-selected">
                <span className="location-selected-name">
                  {formatDate(e.date)} · {e.startTime}{e.endTime ? ` – ${e.endTime}` : ''}
                </span>
                <button className="location-clear" onClick={() => handleUnschedule(e.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Day</label>
          <select className="form-select" value={date} onChange={e => setDate(e.target.value)}>
            {dates.map(d => (
              <option key={d} value={d}>{formatDate(d)}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Start</label>
            <input
              className="form-input"
              type="time"
              step="900"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">End</label>
            <input
              className="form-input"
              type="time"
              step="900"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {invalidRange && (
          <div className="form-hint">End time must be after the start time.</div>
        )}

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button className="form-submit" onClick={handleAdd} disabled={invalidRange}>
          Add to itinerary
        </button>
      </div>
    </div>
  )
}
