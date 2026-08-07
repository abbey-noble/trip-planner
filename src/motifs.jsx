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
      <path d="M44 4 4 18l14 4 4 8 6-9" />
      <path d="M44 4 18 22" />
      <path d="M44 4 28 30l-6-8" />
    </svg>
  )
}

export function Balloon(props) {
  return (
    <svg viewBox="0 0 36 44" {...base} {...props}>
      <path d="M18 3c7 0 12 5.4 12 12 0 6.5-5.6 12.4-9 16h-6c-3.4-3.6-9-9.5-9-16C6 8.4 11 3 18 3Z" />
      <path d="M18 3c-3.6 4-5.2 9-5.2 12s1.6 8 5.2 12M18 3c3.6 4 5.2 9 5.2 12s-1.6 8-5.2 12" />
      <path d="M14 33h8l-1 5h-6l-1-5Z" />
      <path d="M15 38v3M21 38v3M15 41h6" />
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

export function Compass(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="16" />
      <path d="m27 13-5 9-9 5 5-9 9-5Z" />
      <circle cx="20" cy="20" r="1.2" fill="currentColor" stroke="none" />
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

export function Cherries(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <path d="M14 28c0-8 4-14 12-20M26 28c0-9 2-14 0-20" />
      <path d="M26 8c4-2.5 8-2.5 11 0-3 2.5-7 2.8-11 0Z" />
      <circle cx="11" cy="31" r="6" />
      <circle cx="29" cy="31" r="6" />
    </svg>
  )
}

export function Noodles(props) {
  return (
    <svg viewBox="0 0 48 36" {...base} {...props}>
      <path d="M6 16h30c0 8-6.5 14-15 14S6 24 6 16Z" />
      <path d="M3 16h36" />
      <path d="M14 11c0-3 2-4 2-6M22 10c0-3 2-4 2-6M30 11c0-3 2-4 2-6" />
      <path d="M38 14 46 6" />
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

export function ShoppingBag(props) {
  return (
    <svg viewBox="0 0 36 40" {...base} {...props}>
      <path d="M5 12h26l-2.5 25h-21L5 12Z" />
      <path d="M12 16V9a6 6 0 0 1 12 0v7" />
    </svg>
  )
}

export function Snorkel(props) {
  return (
    <svg viewBox="0 0 48 34" {...base} {...props}>
      <path d="M8 9h26v10c0 5-4 8-8.5 8S17 24 17 19v-2h-2v2c0 5-3.5 8-8 8S-.5 24 4 19" />
      <path d="M8 9c0-2.5 1.5-4 4-4h18c2.5 0 4 1.5 4 4" />
      <path d="M38 5v18a5 5 0 0 1-5 5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ see */

export function Shell(props) {
  return (
    <svg viewBox="0 0 48 34" {...base} {...props}>
      <path d="M24 31C10.5 31 4 21.5 6 12 10 3.5 38 3.5 42 12c2 9.5-4.5 19-18 19Z" />
      <path d="M24 31 8.5 12M24 31 15.5 7M24 31V6M24 31l8.5-24M24 31l15.5-19" />
    </svg>
  )
}

export function Temple(props) {
  return (
    <svg viewBox="0 0 48 36" {...base} {...props}>
      <path d="M24 3 4 13h40L24 3Z" />
      <path d="M8 13v17M18 13v17M30 13v17M40 13v17" />
      <path d="M3 30h42M6 33h36" />
    </svg>
  )
}

export function Flower(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="4" />
      <path d="M20 16c-1.5-5 0-9 0-9s1.5 4 0 9ZM24 20c5-1.5 9 0 9 0s-4 1.5-9 0ZM20 24c1.5 5 0 9 0 9s-1.5-4 0-9ZM16 20c-5 1.5-9 0-9 0s4-1.5 9 0Z" />
      <path d="M23 17c4-3.5 8-4 8-4s-.5 4-4 8M17 23c-4 3.5-8 4-8 4s.5-4 4-8" />
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
      <path d="M31 24.5A14 14 0 0 1 15.5 9a14 14 0 1 0 15.5 15.5Z" />
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

export function Rabbit(props) {
  return (
    <svg viewBox="0 0 48 44" {...base} {...props}>
      <path d="M19 16c-2.5-4-4.5-9-3.5-12.5S21 5 22 12M29 16c2.5-4 4.5-9 3.5-12.5S27 5 26 12" />
      <path d="M17 22c0-4.5 3-7.5 7-7.5s7 3 7 7.5-3 7.5-7 7.5-7-3-7-7.5Z" />
      <path d="M21.5 21h.01M26.5 21h.01" />
      <path d="M24 24v1.5M22.5 27h3" />
      <path d="M18 29c-2.5 2.5-4 6-4 10h20c0-4-1.5-7.5-4-10" />
      <circle cx="35" cy="35" r="3.5" />
    </svg>
  )
}

/* ------------------------------------------------------------ registries */

export const ICON_SETS = {
  cursor: [
    { id: 'fish', label: 'Fish', Icon: Fish },
    { id: 'plane', label: 'Paper plane', Icon: PaperPlane },
    { id: 'balloon', label: 'Balloon', Icon: Balloon },
  ],
  map: [
    { id: 'wave', label: 'Waves', Icon: Wave },
    { id: 'mountain', label: 'Mountain', Icon: Mountain },
    { id: 'compass', label: 'Compass', Icon: Compass },
  ],
  restaurants: [
    { id: 'olive', label: 'Olives', Icon: Olive },
    { id: 'cherries', label: 'Cherries', Icon: Cherries },
    { id: 'noodles', label: 'Noodles', Icon: Noodles },
  ],
  experiences: [
    { id: 'boat', label: 'Boat', Icon: Boat },
    { id: 'bag', label: 'Shopping', Icon: ShoppingBag },
    { id: 'snorkel', label: 'Snorkel', Icon: Snorkel },
  ],
  locations: [
    { id: 'shell', label: 'Shell', Icon: Shell },
    { id: 'temple', label: 'Temple', Icon: Temple },
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
    { id: 'rabbit', label: 'Rabbit', Icon: Rabbit },
  ],
}

export const ICON_SLOTS = [
  { key: 'cursor', label: 'Pointer' },
  { key: 'map', label: 'Map' },
  { key: 'restaurants', label: 'Eat' },
  { key: 'experiences', label: 'Do' },
  { key: 'locations', label: 'See' },
  { key: 'board', label: 'Inspiration' },
  { key: 'itinerary', label: 'Itinerary' },
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

// Kept simple and chunky: a pointer is rendered at about 28px.
const CURSOR_PATHS = {
  fish: "%3Cpath d='M4 16c0-5.2 6-9.2 13-9.2s13 4 13 9.2-6 9.2-13 9.2S4 21.2 4 16Z'/%3E%3Cpath d='M30 16l12-7v14l-12-7Z'/%3E",
  plane: "%3Cpath d='M44 4 4 18l14 4 4 8 6-9'/%3E%3Cpath d='M44 4 28 30l-6-8'/%3E",
  balloon: "%3Cpath d='M24 4c8 0 13 6 13 13 0 7-6 13-9 17h-8c-3-4-9-10-9-17 0-7 5-13 13-13Z'/%3E%3Cpath d='M20 34h8l-1 5h-6l-1-5Z'/%3E",
}

export function cursorUrl(id) {
  const paths = CURSOR_PATHS[id] || CURSOR_PATHS.fish
  const box = id === 'balloon' ? '0 0 48 44' : '0 0 48 32'
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='22' viewBox='${box}'%3E%3Cg fill='none' stroke='%231F1C18' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E${paths}%3C/g%3E%3C/svg%3E")`
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
