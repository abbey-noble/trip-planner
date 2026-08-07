import React from 'react'
import { formatWeekday } from '../utils'
import { TYPES } from '../categories'

const MAX_LINES = 4

/**
 * The whole week as blocks, for phones. Each day lists what is on rather than
 * scaling to the clock, so a week is readable at a glance on a small screen.
 * Tapping a block opens that day on the time grid.
 */
export default function WeekBlocks({ days, entriesByDate, today, onOpenDay }) {
  return (
    <div className="blocks">
      {days.map(date => {
        const entries = entriesByDate[date] || []
        const shown = entries.slice(0, MAX_LINES)
        const extra = entries.length - shown.length

        return (
          <button
            key={date}
            className={`block${date === today ? ' is-today' : ''}`}
            onClick={() => onOpenDay(date)}
          >
            <span className="block-head">
              <span className="block-weekday">{formatWeekday(date)}</span>
              <span className="block-date">{Number(date.slice(8, 10))}</span>
            </span>

            <span className="block-list">
              {shown.map(entry => (
                <span
                  key={entry.id}
                  className="block-item"
                  style={{ '--entry-color': TYPES[entry.type]?.color || 'var(--ink-faint)' }}
                >
                  <span className="block-time">{entry.startTime}</span>
                  <span className="block-title">{entry.title}</span>
                </span>
              ))}

              {extra > 0 && <span className="block-more">{extra} more</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
