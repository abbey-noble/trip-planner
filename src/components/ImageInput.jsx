import React, { useState, useRef } from 'react'

export default function ImageInput({ value, onChange, maxSize = 800, quality = 0.8 }) {
  const [dragOver, setDragOver] = useState(false)
  const dropRef = useRef(null)

  const handlePaste = (e) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault()
        const file = item.getAsFile()
        if (file) fileToDataUrl(file)
        return
      }
    }

    // If pasted text looks like a URL, use it directly
    const text = e.clipboardData.getData('text')
    if (text && isImageUrl(text)) {
      e.preventDefault()
      onChange(text)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      fileToDataUrl(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) fileToDataUrl(file)
  }

  const fileToDataUrl = (file) => {
    // Resize large images to keep localStorage reasonable
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize
            width = maxSize
          } else {
            width = (width / height) * maxSize
            height = maxSize
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        onChange(dataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  // Committed on blur or Enter, so typing a URL does not flip the
  // field into preview mode on the first character.
  const handleUrlCommit = (e) => {
    const text = e.target.value.trim()
    if (text) onChange(text)
  }

  const handleUrlKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleUrlCommit(e)
    }
  }

  const handleRemove = () => {
    onChange('')
  }

  if (value) {
    return (
      <div className="image-input-preview">
        <img src={value} alt="" className="image-preview" />
        <button className="image-remove" onClick={handleRemove} type="button">Remove</button>
      </div>
    )
  }

  return (
    <div
      ref={dropRef}
      className={`image-input-drop${dragOver ? ' drag-over' : ''}`}
      onPaste={handlePaste}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      tabIndex={0}
    >
      <div className="image-input-label">Paste, drop or choose an image.</div>
      <div className="image-input-actions">
        <label className="image-input-file-btn">
          Choose file
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input-hidden"
          />
        </label>
        <span className="image-input-or">or paste a URL</span>
      </div>
      <input
        className="form-input image-url-input"
        type="url"
        placeholder="https://"
        onPaste={handlePaste}
        onBlur={handleUrlCommit}
        onKeyDown={handleUrlKeyDown}
      />
    </div>
  )
}

function isImageUrl(text) {
  try {
    const url = new URL(text)
    return /https?:/.test(url.protocol)
  } catch {
    return false
  }
}
