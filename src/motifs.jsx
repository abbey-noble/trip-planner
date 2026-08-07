import React from 'react'

/**
 * Line motifs drawn in the local idiom: fish, olives, shells, the island cats.
 * All inherit currentColor and scale with font-size, so they sit in text.
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

export function Shell(props) {
  return (
    <svg viewBox="0 0 48 34" {...base} {...props}>
      <path d="M24 31C10.5 31 4 21.5 6 12 10 3.5 38 3.5 42 12c2 9.5-4.5 19-18 19Z" />
      <path d="M24 31 8.5 12M24 31 15.5 7M24 31V6M24 31l8.5-24M24 31l15.5-19" />
    </svg>
  )
}

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

export function Sun(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="20" r="8" />
      <path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5 32 32M32 8l-3.5 3.5M11.5 28.5 8 32" />
    </svg>
  )
}

export function Wave(props) {
  return (
    <svg viewBox="0 0 48 20" {...base} {...props}>
      <path d="M2 7c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
      <path d="M2 15c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
    </svg>
  )
}

export function Kumquat(props) {
  return (
    <svg viewBox="0 0 40 40" {...base} {...props}>
      <circle cx="20" cy="23" r="13" />
      <path d="M20 10c0-4 2.5-6.5 6.5-7-.5 4-2.5 6.5-6.5 7Z" />
      <path d="M20 10v26M8 20c8 3 16 3 24 0M8 26c8 3 16 3 24 0" />
    </svg>
  )
}

export function Clip(props) {
  return (
    <svg viewBox="0 0 24 48" {...base} {...props}>
      <path d="M17 14v20a5.5 5.5 0 0 1-11 0V11a3.5 3.5 0 0 1 7 0v22a1.8 1.8 0 0 1-3.6 0V14" />
    </svg>
  )
}

/** Motif shown against each collection. */
export const TYPE_MOTIF = {
  restaurant: Olive,
  experience: Boat,
  location: Shell,
}

export const TAB_MOTIF = {
  map: Wave,
  restaurants: Olive,
  experiences: Boat,
  locations: Shell,
  board: Sun,
  itinerary: Cat,
}

/**
 * The postmarked stamp in the masthead. The perforated edge is a CSS mask,
 * so it stays crisp at any size.
 */
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
