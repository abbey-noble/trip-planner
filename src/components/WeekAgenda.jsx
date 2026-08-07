import React from 'react'
import { formatWeekday, formatDayMonth, formatTimeRange, timeToMinutes, minutesToTime } from '../utils'
import { TYPES } from '../categories'

/**
 * The week at a glance. Entries are listed in order at their natural height
 * rather than scaled to duration, so a half-hour coffee reads as clearly as a
 * whole afternoon. Use the day view when exact placement matters.
 */
export default function WeekAgenda({ days, entriesByDate, today, onAdd, onEdit, onOpenDay }) {
  return (
    <div className="agenda" style={{ '--day-count': days.length }}>
      {days.map(date => {
        const entries = entriesByDate[date] || []
        return (
          <section key={date} className={`agenda-col${date === today ? ' is-today' : ''}`}>
            <button
              className="agenda-head"
              onClick={() => onOpenDay(date)}
              title="Open this day"
            >
              <span className="agenda-head-day">{formatWeekday(date)}</span>
              <span className="agenda-head-date">{formatDayMonth(date)}</span>
              {entries.length > 0 && (
                <span className="agenda-head-count">{entries.length}</span>
              )}
            </button>

            <div className="agenda-body">
              {entries.map(entry => (
                <button
                  key={entry.id}
                  className="agenda-entry"
                  style={{ '--entry-color': TYPES[entry.type]?.color || 'var(--ink)' }}
                  onClick={() => onEdit(entry)}
                >
                  <span className="agenda-entry-time">
                    {formatTimeRange(entry.startTime, entry.endTime)}
                  </span>
                  <span className="agenda-entry-title">{entry.title}</span>
                  {entry.notes && (
                    <span className="agenda-entry-notes">{entry.notes}</span>
                  )}
                </button>
              ))}

              <button
                className="agenda-add"
                onClick={() => onAdd(date, nextFreeTime(entries))}
                aria-label={`Add an entry on ${date}`}
              >
                +
              </button>
            </div>
          </section>
        )
      })}
    </div>
  )
}

/** Suggests a start time just after whatever is already booked that day. */
function nextFreeTime(entries) {
  if (!entries.length) return '09:00'
  const last = entries.reduce((latest, e) => {
    const end = timeToMinutes(e.endTime || e.startTime) + (e.endTime ? 0 : 60)
    return Math.max(latest, end)
  }, 0)
  return minutesToTime(Math.min(Math.ceil(last / 30) * 30, 22 * 60))
}
