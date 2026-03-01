import { useMemo, useState, useEffect, useRef } from 'react'
import { TextElement } from '../TextElement/TextElement'
import { ShapeElement } from '../ShapeElement/ShapeElement'
import { ArrowElement } from '../ArrowElement/ArrowElement'
import { GraphicElement } from '../GraphicElement/GraphicElement'

function computeAnimationDelayMap(elements) {
  const startTime = {}
  const endTime = {}
  const duration = {}
  const idSet = new Set(elements.map((el) => el.id))
  elements.forEach((el) => {
    duration[el.id] = (el.animation && el.animation !== 'none') ? (el.animationDuration ?? 0.5) : 0
  })
  for (let pass = 0; pass < 20; pass++) {
    let changed = false
    elements.forEach((el) => {
      const after = el.animationDelayAfter ?? 'screen'
      const delay = el.animationDelay ?? 0
      const afterId = after === 'screen' ? null : (typeof after === 'number' ? after : Number(after))
      const refId = afterId != null && idSet.has(afterId) ? afterId : null
      const prevStart = startTime[el.id]
      const newStart = refId == null ? delay : (endTime[refId] ?? 0) + delay
      if (prevStart !== newStart) changed = true
      startTime[el.id] = newStart
      endTime[el.id] = newStart + (duration[el.id] ?? 0)
    })
    if (!changed) break
  }
  return startTime
}

export function Canvas({
  activePage,
  selectedElementId,
  pages,
  currentPageIndex,
  onSelectElement,
  onUpdateElement,
  onElementContextMenu,
  onButtonPress,
  selectedElements,
  isPreviewMode = false
}) {
  const [scale, setScale] = useState(1)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const containerW = container.clientWidth
      const containerH = container.clientHeight

      const style = window.getComputedStyle(container)
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)

      const canvasW = 960
      const canvasH = 640

      // Calculate available space inside padding
      const availableW = containerW - paddingX - (isPreviewMode ? 0 : 40)
      const availableH = containerH - paddingY - (isPreviewMode ? 0 : 40)

      const scaleX = availableW / canvasW
      const scaleY = availableH / canvasH

      let newScale
      if (isPreviewMode) {
        // In preview mode, scale down slightly (0.85 of available space)
        // to ensure a gutter around the canvas for better focus.
        newScale = Math.min(scaleX, scaleY) * 0.85
      } else {
        // In editor mode, prioritize width but don't let it get ridiculously small
        // We'll use 0.95 of width to leave some gutter space
        newScale = Math.max(scaleX * 0.95, 0.75)
        // Cap it at a reasonable zoom level
        newScale = Math.min(newScale, 1.5)
      }

      setScale(newScale)
    }

    const observer = new ResizeObserver(handleResize)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    handleResize()
    return () => {
      observer.disconnect()
    }
  }, [isPreviewMode])

  const backgroundStyle =
    activePage.bgType === 'image'
      ? { backgroundImage: `url(${activePage.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : activePage.bgType === 'solid'
        ? { background: activePage.bgColors[0] }
        : {
          background: `linear-gradient(135deg, ${activePage.bgColors[0]}, ${activePage.bgColors[1]})`,
        }

  const canvasStyle = {
    ...backgroundStyle,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    ...(isPreviewMode && {
      boxShadow: '0 0 100px rgba(0,0,0,0.5)', // Enhanced shadow for floating effect
    })
  }

  const delayMap = useMemo(
    () => (isPreviewMode ? computeAnimationDelayMap(activePage.elements) : {}),
    [isPreviewMode, activePage.elements]
  )

  const renderPage = (page, index) => {
    const isPageActive = index === currentPageIndex
    const backgroundStyle =
      page.bgType === 'image'
        ? { backgroundImage: `url(${page.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : page.bgType === 'solid'
          ? { background: page.bgColors[0] }
          : {
            background: `linear-gradient(135deg, ${page.bgColors[0]}, ${page.bgColors[1]})`,
          }

    const canvasStyle = {
      ...backgroundStyle,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      ...(isPreviewMode && {
        boxShadow: '0 0 100px rgba(0,0,0,0.5)',
      }),
      // Add a border or shadow for the active page in editor mode
      ...(!isPreviewMode && isPageActive && {
        outline: '3px solid var(--primary)',
        outlineOffset: '4px',
      })
    }

    return (
      <div
        key={page.id}
        className={`canvas ${isPageActive ? 'active' : ''}`}
        style={canvasStyle}
        onClick={(e) => {
          e.stopPropagation()
          if (!isPageActive && onSelectElement) {
            onSelectElement(null, index)
          }
        }}
      >
        <div
          className="page-label"
          style={{
            position: 'absolute',
            top: '-30px',
            left: 0,
            color: 'var(--text-secondary)',
            fontSize: '0.8rem',
            display: isPreviewMode ? 'none' : 'block'
          }}
        >
          {page.name}
        </div>
        {page.elements.map((el) => {
          if (el.type === 'text') {
            return (
              <TextElement
                key={isPreviewMode ? `${el.id}-preview` : el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                onSelect={() => onSelectElement(el.id, index)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: el.isButton,
                    pageIndex: index,
                  })
                }}
                computedAnimationDelay={isPreviewMode ? (delayMap[el.id] ?? 0) : 0}
                canvasScale={scale}
              />
            )
          } else if (el.type === 'shape') {
            return (
              <ShapeElement
                key={isPreviewMode ? `${el.id}-preview` : el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                pages={pages}
                currentPageIndex={index}
                onSelect={() => onSelectElement(el.id, index)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onButtonPress={onButtonPress}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: el.isButton,
                    pageIndex: index,
                  })
                }}
                computedAnimationDelay={isPreviewMode ? (delayMap[el.id] ?? 0) : 0}
                canvasScale={scale}
              />
            )
          } else if (el.type === 'arrow') {
            return (
              <ArrowElement
                key={isPreviewMode ? `${el.id}-preview` : el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                pages={pages}
                currentPageIndex={index}
                onSelect={() => onSelectElement(el.id, index)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: false,
                    pageIndex: index,
                  })
                }}
                computedAnimationDelay={isPreviewMode ? (delayMap[el.id] ?? 0) : 0}
                canvasScale={scale}
              />
            )
          } else if (el.type === 'graphic') {
            return (
              <GraphicElement
                key={isPreviewMode ? `${el.id}-preview` : el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                onSelect={() => onSelectElement(el.id, index)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: false,
                    pageIndex: index,
                  })
                }}
                computedAnimationDelay={isPreviewMode ? (delayMap[el.id] ?? 0) : 0}
                canvasScale={scale}
              />
            )
          }
          return null
        })}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`canvas-area ${isPreviewMode ? 'preview' : ''}`} onClick={() => {
      // clicking on the area should maybe deselect everything? App.jsx already handles this
    }}>
      {isPreviewMode ? renderPage(activePage, currentPageIndex) : pages.map((page, index) => renderPage(page, index))}
    </div>
  )
}

