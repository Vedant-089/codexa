import { useState, useRef, useEffect } from 'react'

export function GraphicElement({ element, selected, onSelect, onUpdate, onContextMenu, computedAnimationDelay = 0, canvasScale = 1 }) {
  const [mode, setMode] = useState(null)
  const [initial, setInitial] = useState(null)
  const elementRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!mode || !initial) return

      // Adjust deltas by canvas scale
      const deltaX = (e.clientX - initial.x) / canvasScale
      const deltaY = (e.clientY - initial.y) / canvasScale

      if (mode === 'dragging') {
        onUpdate({
          ...element,
          x: initial.elementX + deltaX,
          y: initial.elementY + deltaY,
        })
      } else if (mode === 'resizing') {
        const newWidth = Math.max(20, initial.elementWidth + deltaX)
        const newHeight = Math.max(20, initial.elementHeight + deltaY)

        onUpdate({
          ...element,
          width: newWidth,
          height: newHeight,
        })
      }
    }

    const handleMouseUp = () => {
      setMode(null)
      setInitial(null)
    }

    if (mode) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [mode, initial, element, onUpdate])

  const handleMouseDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()

    setMode('dragging')
    setInitial({
      x: e.clientX,
      y: e.clientY,
      elementX: element.x,
      elementY: element.y,
    })
  }

  const handleResizeDown = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setMode('resizing')
    setInitial({
      x: e.clientX,
      y: e.clientY,
      elementWidth: element.width,
      elementHeight: element.height,
    })
  }

  const hasAnimation = element.animation && element.animation !== 'none'
  const duration = element.animationDuration ?? 0.5
  const delay = computedAnimationDelay ?? 0
  const delayOnly = delay > 0 && !hasAnimation

  return (
    <div
      ref={elementRef}
      className={`graphic-element animation-${element.animation || 'none'} ${delayOnly ? 'animation-delayOnly' : ''}`}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: selected ? 'move' : 'grab',
        userSelect: 'none',
        ...(hasAnimation && { animationDuration: `${duration}s` }),
        ...(delay > 0 && { animationDelay: `${delay}s` }),
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu(e)
      }}
    >
      <img
        src={element.iconPath}
        alt="Graphic"
        width="100%"
        height="100%"
        style={{
          objectFit: 'contain',
          pointerEvents: 'none',
          filter: selected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
        }}
        draggable={false}
        onError={(e) => {
          e.target.style.display = 'none'
        }}
      />

      {selected && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              border: '2px solid #3b82f6',
              pointerEvents: 'none',
            }}
          />
          <div
            onMouseDown={handleResizeDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              border: '2px solid white',
              borderRadius: '2px',
              cursor: 'se-resize',
              boxShadow: '0 0 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          />
        </>
      )}
    </div>
  )
}
