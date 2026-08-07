import { timeToMinutes } from './utils'

// Starts early enough to hold dawn flights and transfers. Anything earlier
// still renders, pinned to the top edge, rather than disappearing.
export const START_HOUR = 5
export const END_HOUR = 24
export const DAY_START = START_HOUR * 60
export const DAY_MINUTES = (END_HOUR - START_HOUR) * 60
export const DEFAULT_LENGTH = 60 // used when an entry has no end time
const MIN_HEIGHT_MINUTES = 25    // keeps very short entries legible

/**
 * Places a day's entries as percentage boxes within the column.
 * Entries that overlap in time share the width, so none is hidden.
 */
export function layoutDay(entries) {
  const spans = [...entries]
    .map(entry => {
      const start = timeToMinutes(entry.startTime)
      const end = entry.endTime ? timeToMinutes(entry.endTime) : start + DEFAULT_LENGTH
      return { entry, start, end: Math.max(end, start + MIN_HEIGHT_MINUTES) }
    })
    .sort((a, b) => a.start - b.start || a.end - b.end)

  // Group into clusters of entries that transitively overlap.
  const clusters = []
  let current = []
  let clusterEnd = -Infinity
  for (const span of spans) {
    if (current.length && span.start >= clusterEnd) {
      clusters.push(current)
      current = []
    }
    current.push(span)
    clusterEnd = Math.max(clusterEnd, span.end)
  }
  if (current.length) clusters.push(current)

  const out = []
  for (const cluster of clusters) {
    // Greedy column packing: reuse the first column that has freed up.
    const columns = []
    for (const span of cluster) {
      let index = columns.findIndex(col => col[col.length - 1].end <= span.start)
      if (index === -1) {
        columns.push([span])
        index = columns.length - 1
      } else {
        columns[index].push(span)
      }
      span.column = index
    }

    const total = columns.length
    for (const span of cluster) {
      const rawTop = ((span.start - DAY_START) / DAY_MINUTES) * 100
      const rawHeight = ((span.end - span.start) / DAY_MINUTES) * 100
      const top = Math.max(0, Math.min(100, rawTop))
      out.push({
        entry: span.entry,
        top,
        height: Math.max(1.6, Math.min(100 - top, rawHeight)),
        left: (span.column / total) * 100,
        width: 100 / total,
      })
    }
  }
  return out
}
