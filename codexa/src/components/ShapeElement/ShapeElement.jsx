import { useState, useEffect, useRef } from 'react'

export function ShapeElement({ element, selected, onSelect, onUpdate, onContextMenu, onButtonPress, pages, currentPageIndex }) {
  const [mode, setMode] = useState(null)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [initial, setInitial] = useState(null)
  const [buttonMenu, setButtonMenu] = useState(null)
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
        let newWidth = Math.max(30, initial.elementWidth + deltaX)
        let newHeight = Math.max(30, initial.elementHeight + deltaY)

        if (resizeHandle === 'tl') {
          newX = initial.elementX + deltaX
          newY = initial.elementY + deltaY
          newWidth = Math.max(30, initial.elementWidth - deltaX)
          newHeight = Math.max(30, initial.elementHeight - deltaY)
        } else if (resizeHandle === 'tr') {
          newY = initial.elementY + deltaY
          newWidth = Math.max(30, initial.elementWidth + deltaX)
          newHeight = Math.max(30, initial.elementHeight - deltaY)
        } else if (resizeHandle === 'bl') {
          newX = initial.elementX + deltaX
          newWidth = Math.max(30, initial.elementWidth - deltaX)
          newHeight = Math.max(30, initial.elementHeight + deltaY)
        } else if (resizeHandle === 'br') {
          newWidth = Math.max(30, initial.elementWidth + deltaX)
          newHeight = Math.max(30, initial.elementHeight + deltaY)
        }

        onUpdate({
          ...element,
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
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

    // Ctrl+Click behavior: for text-input buttons open edit/select, otherwise open navigation menu
    if (e.ctrlKey && element.isButton) {
      if (element.buttonType === 'text-input') {
        onSelect()
        return
      }
      onSelect()
      setButtonMenu({
        x: e.clientX,
        y: e.clientY,
      })
      return
    }

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
      })
    } else {
      const handleMouseUp = () => {
        if (pressTimer.current) {
          clearTimeout(pressTimer.current)
          pressTimer.current = null
        }
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mouseup', handleMouseUp, { once: true })

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

  const renderShape = () => {
    const { shapeType, width, height, borderColor, borderWidth, isButton, fillType, fillColors, color } = element
    const bw = borderWidth || 2
    const buttonText = element.text || 'Button'
    
    // Support both old color property and new fillType/fillColors
    const fillColor = fillType === 'gradient' ? `url(#grad-${element.id})` : (fillColors?.[0] || color || '#ffffff')
    const gradientId = `grad-${element.id}`
    const gradColor1 = fillColors?.[0] || '#ffffff'
    const gradColor2 = fillColors?.[1] || '#ffffff'

    const gradientDef = (
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradColor1} />
          <stop offset="100%" stopColor={gradColor2} />
        </linearGradient>
      </defs>
    )

    switch (shapeType) {
      case 'circle':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <circle
              cx={width / 2}
              cy={height / 2}
              r={Math.min(width, height) / 2 - bw / 2}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'square':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect
              x={bw / 2}
              y={bw / 2}
              width={width - bw}
              height={height - bw}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'rectangle':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect
              x={bw / 2}
              y={bw / 2}
              width={width - bw}
              height={height - bw}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'triangle':
        const points = `${width / 2},${bw / 2} ${width - bw / 2},${height - bw / 2} ${bw / 2},${height - bw / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon
              points={points}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'oval':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={width / 2 - bw / 2}
              ry={height / 2 - bw / 2}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'pill':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect
              x={bw / 2}
              y={bw / 2}
              width={width - bw}
              height={height - bw}
              rx={height / 2}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            {isButton && element.buttonType !== 'text-input' && (
              <text
                x={width / 2}
                y={height / 2 + 5}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontFamily="Arial"
                fontWeight="500"
                pointerEvents="none"
              >
                {buttonText}
              </text>
            )}
          </svg>
        )
      case 'diamond':
        const diamondPoints = `${width / 2},${bw / 2} ${width - bw / 2},${height / 2} ${width / 2},${height - bw / 2} ${bw / 2},${height / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={diamondPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
            {isButton && element.buttonType !== 'text-input' && (
              <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize="12" fill="white" fontFamily="Arial" fontWeight="500" pointerEvents="none">{buttonText}</text>
            )}
          </svg>
        )
      case 'star':
        // Simple 5-point star calculation
        const cx = width / 2
        const cy = height / 2
        const outerR = Math.min(width, height) / 2 - bw
        const innerR = outerR * 0.5
        let starPoints = ''
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2
          const r = i % 2 === 0 ? outerR : innerR
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          starPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={starPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
            {isButton && element.buttonType !== 'text-input' && (
              <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize="12" fill="white" fontFamily="Arial" fontWeight="500" pointerEvents="none">{buttonText}</text>
            )}
          </svg>
        )
      case 'parallelogram':
        const offset = Math.min(20, width / 4)
        const paraPoints = `${offset},${bw / 2} ${width - bw / 2},${bw / 2} ${width - offset - bw / 2},${height - bw / 2} ${bw / 2},${height - bw / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={paraPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
            {isButton && (
              <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize="12" fill="white" fontFamily="Arial" fontWeight="500" pointerEvents="none">{buttonText}</text>
            )}
          </svg>
        )
      case 'pentagon': {
        const cx = width / 2
        const cy = height / 2
        const r = Math.min(width, height) / 2 - bw
        let pentPoints = ''
        for (let i = 0; i < 5; i++) {
          const angle = (2 * Math.PI * i / 5) - Math.PI / 2
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          pentPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={pentPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'hexagon': {
        const cx = width / 2
        const cy = height / 2
        const r = Math.min(width, height) / 2 - bw
        let hexPoints = ''
        for (let i = 0; i < 6; i++) {
          const angle = (2 * Math.PI * i / 6)
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          hexPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={hexPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'heptagon': {
        const cx = width / 2
        const cy = height / 2
        const r = Math.min(width, height) / 2 - bw
        let heptPoints = ''
        for (let i = 0; i < 7; i++) {
          const angle = (2 * Math.PI * i / 7) - Math.PI / 2
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          heptPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={heptPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'cross': {
        const size = Math.min(width, height)
        const strokeSize = size / 3
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <line x1={width / 2} y1={bw} x2={width / 2} y2={height - bw} stroke={borderColor} strokeWidth={strokeSize} />
            <line x1={bw} y1={height / 2} x2={width - bw} y2={height / 2} stroke={borderColor} strokeWidth={strokeSize} />
          </svg>
        )
      }
      case 'plus': {
        const thickness = bw * 3
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect x={width / 2 - thickness / 2} y={bw} width={thickness} height={height - 2 * bw} fill={borderColor} />
            <rect x={bw} y={height / 2 - thickness / 2} width={width - 2 * bw} height={thickness} fill={borderColor} />
          </svg>
        )
      }
      case 'x-mark': {
        const thickness = bw * 2
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <g stroke={borderColor} strokeWidth={thickness} strokeLinecap="round">
              <line x1={bw * 2} y1={bw * 2} x2={width - bw * 2} y2={height - bw * 2} />
              <line x1={width - bw * 2} y1={bw * 2} x2={bw * 2} y2={height - bw * 2} />
            </g>
          </svg>
        )
      }
      case 'checkmark': {
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <polyline points={`${width * 0.25},${height * 0.5} ${width * 0.45},${height * 0.7} ${width * 0.8},${height * 0.2}`} fill="none" stroke={borderColor} strokeWidth={bw * 2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      }
      case 'heart':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <path d={`M${width / 2},${height * 0.4} C${width * 0.25},${height * 0.1} ${bw},${height * 0.25} ${bw},${height * 0.45} C${bw},${height * 0.75} ${width / 2},${height * 0.95} ${width / 2},${height * 0.95} C${width / 2},${height * 0.95} ${width - bw},${height * 0.75} ${width - bw},${height * 0.45} C${width - bw},${height * 0.25} ${width * 0.75},${height * 0.1} ${width / 2},${height * 0.4} Z`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      case 'flower': {
        const cx = width / 2
        const cy = height / 2
        const r = Math.min(width, height) / 3
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            {[0, 60, 120, 180, 240, 300].map((angle) => {
              const rad = (angle * Math.PI) / 180
              const x = cx + r * Math.cos(rad)
              const y = cy + r * Math.sin(rad)
              return (
                <circle key={angle} cx={x} cy={y} r={r * 0.5} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
              )
            })}
            <circle cx={cx} cy={cy} r={r * 0.35} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'crescent': {
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <path d={`M${width * 0.25},${height / 2} A${width * 0.375},${height / 2} 0 1,0 ${width * 0.75},${height / 2} A${width * 0.25},${height / 2} 0 1,1 ${width * 0.25},${height / 2}`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'moon': {
        const r = Math.min(width, height) / 2 - bw
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <circle cx={width / 2} cy={height / 2} r={r} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
            <circle cx={width / 2 + r * 0.4} cy={height / 2} r={r * 0.8} fill="white" />
          </svg>
        )
      }
      case 'cloud': {
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <path d={`M${width * 0.2},${height * 0.5} Q${width * 0.1},${height * 0.3} ${width * 0.3},${height * 0.2} Q${width * 0.4},${height * 0.05} ${width * 0.6},${height * 0.2} Q${width * 0.8},${height * 0.1} ${width * 0.85},${height * 0.35} Q${width * 0.95},${height * 0.4} ${width * 0.95},${height * 0.5} L${width * 0.95},${height * 0.7} Q${width * 0.9},${height * 0.8} ${width * 0.75},${height * 0.8} L${width * 0.2},${height * 0.8} Q${width * 0.05},${height * 0.8} ${width * 0.05},${height * 0.65} L${width * 0.05},${height * 0.5} Q${width * 0.05},${height * 0.35} ${width * 0.2},${height * 0.5} Z`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'triangle-down': {
        const points = `${bw / 2},${bw / 2} ${width - bw / 2},${bw / 2} ${width / 2},${height - bw / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={points} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'triangle-left': {
        const points = `${width - bw / 2},${bw / 2} ${width - bw / 2},${height - bw / 2} ${bw / 2},${height / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={points} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'triangle-right': {
        const points = `${bw / 2},${bw / 2} ${bw / 2},${height - bw / 2} ${width - bw / 2},${height / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={points} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'rounded-square': {
        const r = Math.min(width, height) * 0.15
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect x={bw / 2} y={bw / 2} width={width - bw} height={height - bw} rx={r} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'trapezoid': {
        const offset = Math.min(25, width / 6)
        const points = `${offset},${bw / 2} ${width - offset},${bw / 2} ${width - bw / 2},${height - bw / 2} ${bw / 2},${height - bw / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={points} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'hourglass': {
        const points = `${bw},${bw} ${width - bw},${bw} ${width / 2},${height / 2} ${width - bw},${height - bw} ${bw},${height - bw} ${width / 2},${height / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={points} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'bowtie': {
        const points = `${bw},${bw} ${width / 2},${height / 2} ${bw},${height - bw} ${width / 2},${height / 2} ${width - bw},${bw} ${width / 2},${height / 2} ${width - bw},${height - bw} ${width / 2},${height / 2}`
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={`${bw},${bw} ${width / 2},${height / 2} ${bw},${height - bw}`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
            <polygon points={`${width - bw},${bw} ${width / 2},${height / 2} ${width - bw},${height - bw}`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'teardrop': {
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <path d={`M${width / 2},${bw} C${width - bw},${bw} ${width - bw},${height * 0.65} ${width / 2},${height - bw} C${bw},${height * 0.65} ${bw},${bw} ${width / 2},${bw} Z`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'ring': {
        const outerR = Math.min(width, height) / 2 - bw
        const innerR = outerR * 0.6
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <circle cx={width / 2} cy={height / 2} r={outerR} fill="none" stroke={borderColor} strokeWidth={outerR - innerR} />
          </svg>
        )
      }
      case 'semicircle': {
        const r = Math.min(width, height) / 2 - bw
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <path d={`M${bw},${height / 2} A${r},${r} 0 0,0 ${width - bw},${height / 2}`} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'star-6pt': {
        const cx = width / 2
        const cy = height / 2
        const outerR = Math.min(width, height) / 2 - bw
        const innerR = outerR * 0.5
        let starPoints = ''
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI / 6) * i - Math.PI / 2
          const r = i % 2 === 0 ? outerR : innerR
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          starPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={starPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'star-8pt': {
        const cx = width / 2
        const cy = height / 2
        const outerR = Math.min(width, height) / 2 - bw
        const innerR = outerR * 0.5
        let starPoints = ''
        for (let i = 0; i < 16; i++) {
          const angle = (Math.PI / 8) * i - Math.PI / 2
          const r = i % 2 === 0 ? outerR : innerR
          const x = cx + r * Math.cos(angle)
          const y = cy + r * Math.sin(angle)
          starPoints += `${x},${y} `
        }
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <polygon points={starPoints} fill={fillColor} stroke={borderColor} strokeWidth={bw} />
          </svg>
        )
      }
      case 'button':
        return (
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {fillType === 'gradient' && gradientDef}
            <rect
              x={bw / 2}
              y={bw / 2}
              width={width - bw}
              height={height - bw}
              rx={height / 4}
              fill={fillColor}
              stroke={borderColor}
              strokeWidth={bw}
            />
            <text
              x={width / 2}
              y={height / 2 + 5}
              textAnchor="middle"
              fontSize="14"
              fill="white"
              fontFamily="Arial"
            >
              {buttonText}
            </text>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div
        ref={elementRef}
        className={`shape-element ${selected ? 'selected' : ''}`}
        style={{
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          cursor: selected ? 'move' : 'default',
        }}
        onMouseDown={(e) => handleMouseDown(e)}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={onContextMenu}
      >
        {renderShape()}
        {element.isButton && element.buttonType === 'text-input' && element.fixedText && (
          <input
            type="text"
            value={element.inputValue || ''}
            placeholder={element.inputPlaceholder || ''}
            onChange={(e) => onUpdate({ ...element, inputValue: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: (element.borderWidth || 2) / 2,
              top: (element.borderWidth || 2) / 2,
              width: (element.width || 100) - (element.borderWidth || 2),
              height: (element.height || 40) - (element.borderWidth || 2),
              padding: '6px',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: element.textColor || '#000',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
        )}
        {selected && (
          <div className="resize-handles">
            <div className="resize-handle tl" onMouseDown={(e) => handleMouseDown(e, true, 'tl')} />
            <div className="resize-handle tr" onMouseDown={(e) => handleMouseDown(e, true, 'tr')} />
            <div className="resize-handle bl" onMouseDown={(e) => handleMouseDown(e, true, 'bl')} />
            <div className="resize-handle br" onMouseDown={(e) => handleMouseDown(e, true, 'br')} />
          </div>
        )}
      </div>

      {buttonMenu && (
        <>
          <div 
            className="button-menu-overlay"
            onClick={() => setButtonMenu(null)}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
          />
          <div 
            className="button-menu"
            style={{ 
              position: 'fixed', 
              top: buttonMenu.y, 
              left: buttonMenu.x,
              zIndex: 1000
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4>Select Page</h4>
            {pages && pages.length > 1 ? (
              pages.map((page, idx) => (
                currentPageIndex !== idx && (
                  <div
                    key={page.id}
                    className={`button-menu-item ${element.onPressPage === page.id ? 'selected' : ''}`}
                    onClick={() => {
                      onButtonPress(element.id, page)
                      setButtonMenu(null)
                    }}
                  >
                    {page.name}
                  </div>
                )
              ))
            ) : (
              <div className="button-menu-item disabled">No other pages</div>
            )}
          </div>
        </>
      )}
    </>
  )
}
