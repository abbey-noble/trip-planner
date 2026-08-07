import React from 'react'

/**
 * Line motifs for the tabs, the stamp and the pointer. All inherit
 * currentColor and scale with font-size, so they sit inside text.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

/* ---------------------------------------------------------- pointer / stamp */

export function Fish(props) {
  return (
    <svg viewBox="0 0 48 32" {...base} {...props}>
      <path d="M4 16c0-5.2 6-9.2 13-9.2s13 4 13 9.2-6 9.2-13 9.2S4 21.2 4 16Z" />
      <path d="M30 16l12-7v14l-12-7Z" />
      <path d="M17 7c-2.2 4-2.2 14 0 18" />
      <circle cx="10.5" cy="13" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PaperPlane(props) {
  return (
    <svg viewBox="0 0 48 32" {...base} {...props}>
      <path d="M4 4 44 18l-14 4-4 8-6-9" />
      <path d="M4 4 30 22" />
      <path d="M4 4 20 30l6-8" />
    </svg>
  )
}

export function Pencil(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M6.5 33.5 9 26 27 8l5 5-18 18-7.5 2.5Z" />
      <path d="M25 10l5 5" />
      <path d="M9 26l5 5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ map */

export function Wave(props) {
  return (
    <svg viewBox="0 0 48 20" {...base} {...props}>
      <path d="M2 7c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
      <path d="M2 15c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
    </svg>
  )
}

export function Mountain(props) {
  return (
    <svg viewBox="0 0 48 32" {...base} {...props}>
      <path d="M2 28 17 6l10 14" />
      <path d="M21 28 33 11l13 17H2" />
      <path d="M12.5 13.5h9M28.5 17h9" />
    </svg>
  )
}

export function ScrollMap(props) {
  return (
    <svg viewBox="0 0 48 36" {...base} {...props}>
      <path d="M5 8c4-2.5 8-2.5 12 0s8 2.5 12 0 8-2.5 12 0v20c-4-2.5-8-2.5-12 0s-8 2.5-12 0-8-2.5-12 0V8Z" />
      <path d="M13 25c2-7 5.5-9.5 9.5-7.5S30 15 32 10" strokeDasharray="2.5 3.5" />
      <path d="M30 8.5 34 13M34 8.5 30 13" />
      <circle cx="13" cy="25" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* ------------------------------------------------------------------ eat */

export function Olive(props) {
  return (
    <svg viewBox="0 0 48 32" {...base} {...props}>
      <path d="M5 27C14 22 28 14 44 6" />
      <path d="M17 19c-1.5-4 .5-7.5 5-8.5-.5 4.5-2 7-5 8.5Z" />
      <path d="M28 13c-1.5-4 .5-7.5 5-8.5-.5 4.5-2 7-5 8.5Z" />
      <ellipse cx="14" cy="12" rx="3.4" ry="4.2" transform="rotate(-28 14 12)" />
      <ellipse cx="25.5" cy="22" rx="3.4" ry="4.2" transform="rotate(-28 25.5 22)" />
    </svg>
  )
}

export function Strawberry(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M20 13c8 0 13 4.5 13 10 0 6.5-7 14-13 14S7 29.5 7 23c0-5.5 5-10 13-10Z" />
      <path d="M20 13V6" />
      <path d="M20 12c-3.5-3.5-8-4-11-2.5 2 3 5.5 4.5 11 4.5M20 12c3.5-3.5 8-4 11-2.5-2 3-5.5 4.5-11 4.5" />
      <path d="M16 21h.01M24 21h.01M20 26h.01M13.5 27h.01M26.5 27h.01" />
    </svg>
  )
}

export function Coffee(props) {
  return (
    <svg viewBox="0 0 44 40" {...base} {...props}>
      <path d="M7 14h24v9c0 6-5.5 10-12 10s-12-4-12-10v-9Z" />
      <path d="M31 17h4a4.5 4.5 0 0 1 0 9h-4" />
      <path d="M3 36h32" />
      <path d="M15 9c0-2.5 2-3 2-5.5M23 9c0-2.5 2-3 2-5.5" />
    </svg>
  )
}

/* ------------------------------------------------------------------- do */

export function Boat(props) {
  return (
    <svg viewBox="0 0 48 36" {...base} {...props}>
      <path d="M6 25h36l-5 7H11l-5-7Z" />
      <path d="M24 25V4" />
      <path d="M24 7c6 1.5 10 4.5 12 9H24" />
      <path d="M22 22c-4-.5-7-2-9-4.5 3-2 6-3.5 9-4" />
    </svg>
  )
}

export function Bags(props) {
  return (
    <svg viewBox="0 0 48 34" {...base} {...props}>
      <path d="M4 13.5h16L18.6 30H5.4L4 13.5Z" />
      <path d="M8.4 13.5V10a3.6 3.6 0 0 1 7.2 0v3.5" />
      <path d="M28 13.5h16L42.6 30H29.4L28 13.5Z" />
      <path d="M32.4 13.5V10a3.6 3.6 0 0 1 7.2 0v3.5" />
    </svg>
  )
}

export function Music(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M14 30V9l20-5v21" />
      <path d="M14 14.5 34 9.5" />
      <ellipse cx="9.5" cy="30.5" rx="4.8" ry="3.6" transform="rotate(-16 9.5 30.5)" />
      <ellipse cx="29.5" cy="25.5" rx="4.8" ry="3.6" transform="rotate(-16 29.5 25.5)" />
    </svg>
  )
}

/* ------------------------------------------------------------------ see */

export function Camera(props) {
  return (
    <svg viewBox="0 0 46 36" {...base} {...props}>
      <rect x="3" y="9" width="40" height="24" rx="3.5" />
      <path d="M16 9l2.5-4.5h9L30 9" />
      <circle cx="23" cy="21" r="7.5" />
      <circle cx="23" cy="21" r="3.4" />
      <rect x="33" y="13" width="5.5" height="4" rx="1.2" />
    </svg>
  )
}

export function Shell(props) {
  return (
    <svg viewBox="0 0 48 34" {...base} {...props}>
      <path d="M24 31C10.5 31 4 21.5 6 12 10 3.5 38 3.5 42 12c2 9.5-4.5 19-18 19Z" />
      <path d="M24 31 8.5 12M24 31 15.5 7M24 31V6M24 31l8.5-24M24 31l15.5-19" />
    </svg>
  )
}

export function Flower(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <ellipse cx="20" cy="11" rx="4.3" ry="6" />
      <ellipse cx="28.6" cy="17.2" rx="4.3" ry="6" transform="rotate(72 28.6 17.2)" />
      <ellipse cx="25.3" cy="27.3" rx="4.3" ry="6" transform="rotate(144 25.3 27.3)" />
      <ellipse cx="14.7" cy="27.3" rx="4.3" ry="6" transform="rotate(216 14.7 27.3)" />
      <ellipse cx="11.4" cy="17.2" rx="4.3" ry="6" transform="rotate(288 11.4 17.2)" />
      <circle cx="20" cy="20" r="3.6" />
    </svg>
  )
}

/* ---------------------------------------------------------- inspiration */

export function Sun(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="8" />
      <path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M32 8l-3.5 3.5M11.5 28.5 8 32" />
    </svg>
  )
}

export function Moon(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M23.5 5.5a14.5 14.5 0 1 0 10.5 24.8A11.6 11.6 0 0 1 23.5 5.5Z" />
    </svg>
  )
}

export function Stars(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M14 5l2.4 6.6L23 14l-6.6 2.4L14 23l-2.4-6.6L5 14l6.6-2.4L14 5Z" />
      <path d="M29 21l1.5 4.2L35 27l-4.5 1.8L29 33l-1.5-4.2L23 27l4.5-1.8L29 21Z" />
    </svg>
  )
}

/* ------------------------------------------------------------ itinerary */

export function Cat(props) {
  return (
    <svg viewBox="0 0 48 40" {...base} {...props}>
      <path d="M17.5 12.5 15 6l6 3.2M30.5 12.5 33 6l-6 3.2" />
      <circle cx="24" cy="15" r="6.5" />
      <path d="M19.5 20.5c-2.5 3-4 7-4 12.5h17c0-6-1.5-9.5-4-12" />
      <path d="M32.5 33c4.5.5 7.5-2.5 7-7.5" />
      <path d="M21.5 15h.01M26.5 15h.01" />
    </svg>
  )
}

export function Dog(props) {
  return (
    <svg viewBox="0 0 48 40" {...base} {...props}>
      <path d="M15 9c-3 1-4.5 5-4 10M33 9c3 1 4.5 5 4 10" />
      <path d="M16 12c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5v6c0 5-3.5 8-8 8s-8-3-8-8v-6Z" />
      <path d="M21 15h.01M27 15h.01" />
      <path d="M24 19v2M22 22h4" />
      <path d="M18 25c-2 3-3 6-3 9h18c0-3-1-6-3-9" />
      <path d="M33 34c4-1 5.5-4 4.5-8" />
    </svg>
  )
}

export function Notebook(props) {
  return (
    <svg viewBox="0 0 40 44" {...base} {...props}>
      <path d="M12 4h21a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H12V4Z" />
      <path d="M12 10H7.5a2.5 2.5 0 1 1 0-5H12M12 19H7.5a2.5 2.5 0 1 1 0-5H12M12 28H7.5a2.5 2.5 0 1 1 0-5H12M12 37H7.5a2.5 2.5 0 1 1 0-5H12" />
      <path d="M18 13h12M18 20h12M18 27h12M18 34h8" />
    </svg>
  )
}

/* ------------------------------------------------------- interface icons */

const ui = { ...base, strokeWidth: 1.7 }

export function Clock(props) {
  return (
    <svg viewBox="0 0 24 24" {...ui} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.5l3.5 2.5" />
    </svg>
  )
}

export function Pin(props) {
  return (
    <svg viewBox="0 0 24 24" {...ui} {...props}>
      <path d="M12 21.5s7-6.4 7-11.5a7 7 0 1 0-14 0c0 5.1 7 11.5 7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function Edit(props) {
  return (
    <svg viewBox="0 0 24 24" {...ui} {...props}>
      <path d="M4 20.5 4.8 16 16 4.8 19.2 8 8 19.2 4 20.5Z" />
      <path d="M14.5 6.3 17.7 9.5" />
    </svg>
  )
}

export function Cross(props) {
  return (
    <svg viewBox="0 0 24 24" {...ui} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function LinkOut(props) {
  return (
    <svg viewBox="0 0 24 24" {...ui} {...props}>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
    </svg>
  )
}

/* ------------------------------------------------------------ registries */

export const ICON_SETS = {
  cursor: [
    { id: 'fish', label: 'Fish', Icon: Fish },
    { id: 'plane', label: 'Plane', Icon: PaperPlane },
    { id: 'pencil', label: 'Pencil', Icon: Pencil },
  ],
  map: [
    { id: 'wave', label: 'Waves', Icon: Wave },
    { id: 'mountain', label: 'Mountains', Icon: Mountain },
    { id: 'scroll', label: 'Map scroll', Icon: ScrollMap },
  ],
  restaurants: [
    { id: 'olive', label: 'Olives', Icon: Olive },
    { id: 'strawberry', label: 'Strawberry', Icon: Strawberry },
    { id: 'coffee', label: 'Coffee', Icon: Coffee },
  ],
  experiences: [
    { id: 'boat', label: 'Boat', Icon: Boat },
    { id: 'bag', label: 'Shopping', Icon: Bags },
    { id: 'music', label: 'Music', Icon: Music },
  ],
  locations: [
    { id: 'shell', label: 'Shell', Icon: Shell },
    { id: 'camera', label: 'Camera', Icon: Camera },
    { id: 'flower', label: 'Flower', Icon: Flower },
  ],
  board: [
    { id: 'sun', label: 'Sun', Icon: Sun },
    { id: 'moon', label: 'Moon', Icon: Moon },
    { id: 'stars', label: 'Stars', Icon: Stars },
  ],
  itinerary: [
    { id: 'cat', label: 'Cat', Icon: Cat },
    { id: 'dog', label: 'Dog', Icon: Dog },
    { id: 'notebook', label: 'Notebook', Icon: Notebook },
  ],
}

export const ICON_SLOTS = [
  { key: 'cursor', label: 'Pointer' },
  { key: 'map', label: 'Map' },
  { key: 'restaurants', label: 'Eat' },
  { key: 'experiences', label: 'Do' },
  { key: 'locations', label: 'See' },
  { key: 'board', label: 'Ideas' },
  { key: 'itinerary', label: 'Days' },
]

export const DEFAULT_ICONS = Object.fromEntries(
  ICON_SLOTS.map(({ key }) => [key, ICON_SETS[key][0].id])
)

/** Resolves a stored id back to its component, falling back to the default. */
export function iconFor(slot, id) {
  const set = ICON_SETS[slot] || []
  return (set.find(o => o.id === id) || set[0]).Icon
}

/** The three collections share their tab motif. */
export const TYPE_SLOT = {
  restaurant: 'restaurants',
  experience: 'experiences',
  location: 'locations',
}

/* --------------------------------------------------------------- pointer */

// Stripped back: a pointer is only about 28px across.
const CURSORS = {
  fish: {
    box: '0 0 48 32',
    d: "%3Cpath d='M4 16c0-5.2 6-9.2 13-9.2s13 4 13 9.2-6 9.2-13 9.2S4 21.2 4 16Z'/%3E%3Cpath d='M30 16l12-7v14l-12-7Z'/%3E",
  },
  plane: {
    box: '0 0 48 32',
    d: "%3Cpath d='M4 4 44 18l-14 4-4 8-6-9'/%3E%3Cpath d='M4 4 20 30l6-8'/%3E",
  },
  pencil: {
    box: '0 0 40 40',
    d: "%3Cpath d='M6.5 33.5 9 26 27 8l5 5-18 18-7.5 2.5Z'/%3E%3Cpath d='M9 26l5 5'/%3E",
  },
}

export function cursorUrl(id) {
  const { box, d } = CURSORS[id] || CURSORS.fish
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='22' viewBox='${box}'%3E%3Cg fill='none' stroke='%231F1C18' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E${d}%3C/g%3E%3C/svg%3E")`
}

/* ----------------------------------------------------------------- stamp */

export function Stamp({ label = 'CORFU', motif: Motif = Fish }) {
  return (
    <div className="stamp" aria-hidden="true">
      <div className="stamp-inner">
        <Motif className="stamp-motif" />
        <span className="stamp-label">{label}</span>
      </div>
      <svg className="postmark" viewBox="0 0 70 70" fill="none" stroke="currentColor">
        <circle cx="35" cy="35" r="26" strokeWidth="1.2" strokeDasharray="3 4" />
        <circle cx="35" cy="35" r="20" strokeWidth="0.9" />
        <path d="M14 30h42M14 40h42" strokeWidth="0.9" />
      </svg>
    </div>
  )
}
