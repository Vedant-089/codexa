import { useState, useEffect, useRef } from 'react'

export function TextElement({ element, selected, onSelect, onUpdate, onContextMenu }) {
  const [mode, setMode] = useState(null) // 'dragging' or 'resizing'
  const [resizeHandle, setResizeHandle] = useState(null) // handle type: 'tl', 'tr', 'bl', 'br', 't', 'b', 'l', 'r'
  const [initial, setInitial] = useState(null)
  const pressTimer = useRef(null)
  const elementRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mode || !initial) return

      if (mode === 'dragging') {
        const deltaX = e.clientX - initial.x
        const deltaY = e.clientY - initial.y
        onUpdate({
          ...element,
          x: initial.elementX + deltaX,
          y: initial.elementY + deltaY,
        })
      } else if (mode === 'resizing') {
        const deltaX = e.clientX - initial.x
        const deltaY = e.clientY - initial.y
        let newX = initial.elementX
        let newY = initial.elementY
        let newWidth = initial.elementWidth
        let newHeight = initial.elementHeight
        let newFontSize = initial.fontSize

        const isCorner = ['tl', 'tr', 'bl', 'br'].includes(resizeHandle)
        const isSide = ['t', 'b', 'l', 'r'].includes(resizeHandle)

        if (isSide) {
          // Sides: change dimensions only
          if (resizeHandle === 'l') {
            newWidth = Math.max(50, initial.elementWidth - deltaX)
            newX = initial.elementX + (initial.elementWidth - newWidth)
          } else if (resizeHandle === 'r') {
            newWidth = Math.max(50, initial.elementWidth + deltaX)
          } else if (resizeHandle === 't') {
            newHeight = Math.max(30, initial.elementHeight - deltaY)
            newY = initial.elementY + (initial.elementHeight - newHeight)
          } else if (resizeHandle === 'b') {
            newHeight = Math.max(30, initial.elementHeight + deltaY)
          }
        } else if (isCorner) {
          // Corners: change font size only
          const scaleX = deltaX / initial.elementWidth
          const scaleY = deltaY / initial.elementHeight
          const scale = Math.max(0.5, 1 + (scaleX + scaleY) / 2) // average scale, min 0.5
          newFontSize = Math.max(10, initial.fontSize * scale)
        }

        onUpdate({
          ...element,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
          fontSize: newFontSize,
        })
      }
    }

    const handleMouseUp = () => {
      setMode(null)
      setResizeHandle(null)
      setInitial(null)
      if (pressTimer.current) {
        clearTimeout(pressTimer.current)
        pressTimer.current = null
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    if (mode) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [mode, initial, resizeHandle, element, onUpdate])

  const handleMouseDown = (e, isHandle = false, handleType = null) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Clear any pending timers
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }

    onSelect()

    if (isHandle) {
      setMode('resizing')
      setResizeHandle(handleType)
      setInitial({
        x: e.clientX,
        y: e.clientY,
        elementX: element.x,
        elementY: element.y,
        elementWidth: element.width,
        elementHeight: element.height,
        fontSize: element.fontSize,
      })
    } else {
      // Set up mouseup listener immediately to catch releases
      const handleMouseUp = () => {
        if (pressTimer.current) {
          clearTimeout(pressTimer.current)
          pressTimer.current = null
        }
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mouseup', handleMouseUp, { once: true })

      // Start long-press timer for dragging
      pressTimer.current = setTimeout(() => {
        setMode('dragging')
        setInitial({
          x: e.clientX,
          y: e.clientY,
          elementX: element.x,
          elementY: element.y,
        })
        pressTimer.current = null
      }, 500)
    }
  }

  return (
    <div
      ref={elementRef}
      className={`text-element ${selected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        color: element.color,
        cursor: selected ? 'move' : 'default',
      }}
      onMouseDown={(e) => handleMouseDown(e)}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={onContextMenu}
    >
      {element.content}
      {selected && (
        <div className="resize-handles">
          {/* Corner handles */}
          <div className="resize-handle tl" onMouseDown={(e) => handleMouseDown(e, true, 'tl')} />
          <div className="resize-handle tr" onMouseDown={(e) => handleMouseDown(e, true, 'tr')} />
          <div className="resize-handle bl" onMouseDown={(e) => handleMouseDown(e, true, 'bl')} />
          <div className="resize-handle br" onMouseDown={(e) => handleMouseDown(e, true, 'br')} />
          {/* Side handles */}
          <div className="resize-handle t" onMouseDown={(e) => handleMouseDown(e, true, 't')} />
          <div className="resize-handle b" onMouseDown={(e) => handleMouseDown(e, true, 'b')} />
          <div className="resize-handle l" onMouseDown={(e) => handleMouseDown(e, true, 'l')} />
          <div className="resize-handle r" onMouseDown={(e) => handleMouseDown(e, true, 'r')} />
        </div>
      )}
    </div>
  )
}
