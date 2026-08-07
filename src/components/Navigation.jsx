import React, { useRef, useEffect } from 'react'
import { iconFor } from '../motifs'
import { useData } from '../App'

const tabs = [
  { id: 'map', label: 'Map' },
  { id: 'restaurants', label: 'Eat' },
  { id: 'experiences', label: 'Do' },
  { id: 'locations', label: 'See' },
  { id: 'board', label: 'Inspiration' },
  { id: 'itinerary', label: 'Itinerary' },
]

export default function Navigation({ activeTab, onTabChange }) {
  const { icons } = useData()
  const navRef = useRef(null)

  // On narrow screens the strip scrolls, so keep the current tab in view.
  useEffect(() => {
    const el = navRef.current?.querySelector('.nav-tab.active')
    el?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' })
  }, [activeTab])

  return (
    <nav className="nav" ref={navRef}>
      {tabs.map(tab => {
        const Motif = iconFor(tab.id, icons[tab.id])
        return (
          <button
            key={tab.id}
            className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Motif className="nav-motif" />
            <span>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
