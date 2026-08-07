import React, { useState, useMemo, useEffect } from 'react'
import { useData } from '../App'
import { generateId } from '../store'
import {
  getDatesInRange, formatDate, timeToMinutes, toISODate,
} from '../utils'
import { TYPES, categoryLabel } from '../categories'
import WeekAgenda from './WeekAgenda'
import DayGrid from './DayGrid'
import WeekBlocks from './WeekBlocks'

const WEEK_LENGTH = 7

export default function Itinerary() {
  const { data, updateData, isWide } = useData()
  const dates = useMemo(
    () => getDatesInRange(data.trip.startDate, data.trip.endDate),
    [data.trip.startDate, data.trip.endDate]
  )

  const [activeDate, setActiveDate] = useState('')
  const [weekIndex, setWeekIndex] = useState(0)
  const [view, setView] = useState('week')
  const [editing, setEditing] = useState(null)

  const currentDate = dates.includes(activeDate) ? activeDate : (dates[0] || '')
  const today = toISODate(new Date())

  const weeks = useMemo(() => {
    const out = []
    for (let i = 0; i < dates.length; i += WEEK_LENGTH) {
      out.push(dates.slice(i, i + WEEK_LENGTH))
    }
    return out
  }, [dates])

  // Keep the visible week in range if the trip dates change.
  useEffect(() => {
    if (weekIndex > weeks.length - 1) setWeekIndex(Math.max(0, weeks.length - 1))
  }, [weeks.length, weekIndex])

  const entriesByDate = useMemo(() => {
    const map = {}
    for (const entry of data.itinerary) {
      ;(map[entry.date] ||= []).push(entry)
    }
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
    }
    return map
  }, [data.itinerary])

  const saveEntry = (entry) => {
    updateData(prev => ({
      ...prev,
      itinerary: prev.itinerary.some(e => e.id === entry.id)
        ? prev.itinerary.map(e => (e.id === entry.id ? entry : e))
        : [...prev.itinerary, entry],
    }))
    setEditing(null)
  }

  const removeEntry = (id) => {
    updateData(prev => ({ ...prev, itinerary: prev.itinerary.filter(e => e.id !== id) }))
    setEditing(null)
  }

  const blankEntry = (date, startTime) => ({
    id: generateId(),
    date,
    startTime,
    endTime: '',
    type: 'custom',
    itemId: null,
    title: '',
    notes: '',
    isNew: true,
  })

  const addAt = (date, time) => setEditing(blankEntry(date, time))

  if (dates.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          Set the trip dates under Trip to build the itinerary.
        </div>
      </div>
    )
  }

  const editor = editing && (
    <EntryEditor
      entry={editing}
      data={data}
      onSave={saveEntry}
      onRemove={removeEntry}
      onClose={() => setEditing(null)}
    />
  )

  const week = weeks[Math.min(weekIndex, weeks.length - 1)] || []
  const dayIndex = dates.indexOf(currentDate)
  const showFoot = view === 'day' || weeks.length > 1

  const nav = showFoot && (
    <div className="itin-foot">
      {view === 'day' && (
        <button className="itin-back" onClick={() => setView('week')}>
          All week
        </button>
      )}

      <div className="itin-nav">
        <button
          className="itin-nav-btn"
          onClick={() => view === 'day'
            ? setActiveDate(dates[Math.max(0, dayIndex - 1)])
            : setWeekIndex(i => Math.max(0, i - 1))}
          disabled={view === 'day' ? dayIndex <= 0 : weekIndex === 0}
          aria-label={view === 'day' ? 'Previous day' : 'Previous week'}
        >
          &#8592;
        </button>

        <span className="itin-nav-label">
          {view === 'day'
            ? formatDate(currentDate)
            : `${formatDate(week[0])} \u2013 ${formatDate(week[week.length - 1])}`}
        </span>

        <button
          className="itin-nav-btn"
          onClick={() => view === 'day'
            ? setActiveDate(dates[Math.min(dates.length - 1, dayIndex + 1)])
            : setWeekIndex(i => Math.min(weeks.length - 1, i + 1))}
          disabled={view === 'day'
            ? dayIndex === dates.length - 1
            : weekIndex >= weeks.length - 1}
          aria-label={view === 'day' ? 'Next day' : 'Next week'}
        >
          &#8594;
        </button>
      </div>
    </div>
  )

  const openDay = (date) => { setActiveDate(date); setView('day') }

  /* ---- Narrow screens: the week as blocks, or one day on the grid ---- */
  if (!isWide) {
    return (
      <div className="itinerary">
        {view === 'week' ? (
          <WeekBlocks
            days={week}
            entriesByDate={entriesByDate}
            today={today}
            onOpenDay={openDay}
          />
        ) : (
          <DayGrid
            date={currentDate}
            entries={entriesByDate[currentDate] || []}
            onAdd={addAt}
            onEdit={setEditing}
          />
        )}
        {nav}
        {editor}
      </div>
    )
  }

  /* ---- Wide screens: the week as an agenda, or one day on the grid ---- */
  return (
    <div className="itinerary">
      {view === 'week' ? (
        <WeekAgenda
          days={week}
          entriesByDate={entriesByDate}
          today={today}
          onAdd={addAt}
          onEdit={setEditing}
          onOpenDay={openDay}
        />
      ) : (
        <DayGrid
          date={currentDate}
          entries={entriesByDate[currentDate] || []}
          onAdd={addAt}
          onEdit={setEditing}
        />
      )}

      {nav}

      {editor}
    </div>
  )
}

function EntryEditor({ entry, data, onSave, onRemove, onClose }) {
  const isNew = !!entry.isNew
  const [mode, setMode] = useState('details')
  const [form, setForm] = useState(entry)

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const saved = useMemo(() => ([
    { type: 'restaurant', items: data.restaurants },
    { type: 'experience', items: data.experiences },
    { type: 'location', items: data.locations },
  ]), [data.restaurants, data.experiences, data.locations])

  const hasSaved = saved.some(g => g.items.length > 0)
  const invalidRange = form.endTime && timeToMinutes(form.endTime) <= timeToMinutes(form.startTime)

  const pickSaved = (item, type) => {
    const { isNew: _drop, ...rest } = form
    onSave({ ...rest, type, itemId: item.id, title: item.name })
  }

  const submit = () => {
    if (!form.title.trim() || invalidRange) return
    const { isNew: _drop, ...rest } = form
    onSave({ ...rest, title: form.title.trim() })
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {isNew ? `${formatDate(entry.date)}, ${entry.startTime}` : 'Edit entry'}
          </h2>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>

        {isNew && (
          <div className="mode-tabs">
            <button
              className={`filter-chip${mode === 'details' ? ' active' : ''}`}
              onClick={() => setMode('details')}
            >
              Add event
            </button>
            <button
              className={`filter-chip${mode === 'saved' ? ' active' : ''}`}
              onClick={() => setMode('saved')}
            >
              From saved
            </button>
          </div>
        )}

        {isNew && mode === 'saved' ? (
          <div className="item-picker">
            {!hasSaved && (
              <div className="form-hint" style={{ padding: '16px 0' }}>
                Nothing saved yet. Add restaurants, experiences or locations first.
              </div>
            )}
            {saved.map(group => group.items.length > 0 && (
              <div key={group.type}>
                <div className="item-picker-group-label">{TYPES[group.type].label}</div>
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className="item-picker-option"
                    onClick={() => pickSaved(item, group.type)}
                  >
                    <span className="option-name">{item.name}</span>
                    <span className="option-type">{categoryLabel(group.type, item.category)}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start</label>
                <input
                  className="form-input"
                  type="time"
                  step="900"
                  value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End</label>
                <input
                  className="form-input"
                  type="time"
                  step="900"
                  value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                />
              </div>
            </div>

            {invalidRange && (
              <div className="form-hint">End time must be after the start time.</div>
            )}

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-input"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
              />
            </div>

            <button className="form-submit" onClick={submit} disabled={invalidRange}>
              {isNew ? 'Add' : 'Save changes'}
            </button>

            {!isNew && (
              <div className="form-group" style={{ marginTop: 18 }}>
                <button className="data-btn" onClick={() => onRemove(form.id)}>
                  Remove from itinerary
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
