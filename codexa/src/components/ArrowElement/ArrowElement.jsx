import { useState, useRef, useEffect } from 'react'
import arrowUpSVG from '../../arrows/arrow-up.svg?url'
import arrowDownSVG from '../../arrows/arrow-down.svg?url'
import arrowLeftSVG from '../../arrows/arrow-left.svg?url'
import arrowRightSVG from '../../arrows/arrow-right.svg?url'
import arrowUpRightSVG from '../../arrows/arrow-up-right.svg?url'
import arrowDownRightSVG from '../../arrows/arrow-down-right.svg?url'
import arrowDownLeftSVG from '../../arrows/arrow-down-left.svg?url'
import arrowUpLeftSVG from '../../arrows/arrow-up-left.svg?url'

const arrowSVGs = {
  up: arrowUpSVG,
  down: arrowDownSVG,
  left: arrowLeftSVG,
  right: arrowRightSVG,
  'up-right': arrowUpRightSVG,
  'down-right': arrowDownRightSVG,
  'down-left': arrowDownLeftSVG,
  'up-left': arrowUpLeftSVG,
}

export function ArrowElement({ element, selected, onSelect, onUpdate, onContextMenu, pages, currentPageIndex }) {
  const [mode, setMode] = useState(null)
  const [initial, setInitial] = useState(null)
  const elementRef = useRef(null)

  const getArrowSVGPath = () => {
    return arrowSVGs[element.arrowType] || arrowUpSVG
  }

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

  return (
    <div
      ref={elementRef}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        cursor: 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu(e)
      }}
    >
      {/* Arrow SVG image */}
      <img
        src={getArrowSVGPath()}
        alt={element.arrowType}
        width="100%"
        height="100%"
        style={{
          filter: selected ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
          color: element.fill || '#000000',
        }}
      />

      {/* Selection border */}
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
          {/* Resize handle */}
          <div
            onMouseDown={handleResizeDown}
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
            }}
          />
        </>
      )}
    </div>
  )
}
