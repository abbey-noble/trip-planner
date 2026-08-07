import React, { useMemo, useRef, useEffect } from 'react'
import { formatTimeRange } from '../utils'
import { TYPES } from '../categories'
import { layoutDay, START_HOUR, END_HOUR, DAY_START, DAY_MINUTES } from '../weekLayout'

const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i)

/**
 * One day at full width on a real time grid. Because a single day gets the
 * whole pane, even a short entry has room for its title on one line.
 */
export default function DayGrid({ date, entries, onAdd, onEdit }) {
  const scrollRef = useRef(null)
  const placed = useMemo(() => layoutDay(entries), [entries])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const first = entries.length
      ? Math.min(...placed.map(p => p.top))
      : ((9 * 60 - DAY_START) / DAY_MINUTES) * 100
    el.scrollTop = Math.max(0, (first / 100) * el.scrollHeight - 24)
    // Re-frames only when the day changes, not on every edit.
  }, [date])

  const handleBackgroundClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientY - rect.top) / rect.height
    const snapped = Math.round((DAY_START + ratio * DAY_MINUTES) / 15) * 15
    const h = Math.min(Math.floor(snapped / 60), 23)
    const m = snapped % 60
    onAdd(date, `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }

  return (
    <div className="daygrid" ref={scrollRef}>
      <div className="daygrid-inner">
        <div className="daygrid-times">
          {HOURS.map(h => (
            <div key={h} className="daygrid-time">
              <span>{String(h).padStart(2, '0')}:00</span>
            </div>
          ))}
        </div>

        <div className="daygrid-col">
          <button
            className="daygrid-bg"
            onClick={handleBackgroundClick}
            aria-label="Add an entry"
          />

          {placed.map(({ entry, top, height, left, width }) => (
            <button
              key={entry.id}
              className="daygrid-entry"
              style={{
                top: `${top}%`,
                height: `${height}%`,
                left: `${left}%`,
                width: `${width}%`,
                '--entry-color': TYPES[entry.type]?.color || 'var(--ink)',
              }}
              onClick={() => onEdit(entry)}
            >
              <span className="daygrid-entry-time">
                {formatTimeRange(entry.startTime, entry.endTime)}
                {entry.type !== 'custom' &&
                  ` · ${TYPES[entry.type]?.label.replace(/s$/, '') || ''}`}
              </span>
              <span className="daygrid-entry-title">{entry.title}</span>
              {entry.notes && (
                <span className="daygrid-entry-notes">{entry.notes}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
