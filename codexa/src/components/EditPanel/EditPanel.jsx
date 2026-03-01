import { useState } from 'react'
import { Type, Palette, Layout, MousePointer2, Zap, Settings } from 'lucide-react'
import './EditPanel.css'

// Animation options
const ANIMATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'fadeIn', label: 'Fade In' },
  { value: 'fadeInUp', label: 'Fade In Up' },
  { value: 'fadeInDown', label: 'Fade In Down' },
  { value: 'slideInLeft', label: 'Slide In Left' },
  { value: 'slideInRight', label: 'Slide In Right' },
  { value: 'slideInTop', label: 'Slide In Top' },
  { value: 'slideInBottom', label: 'Slide In Bottom' },
  { value: 'zoomIn', label: 'Zoom In' },
  { value: 'zoomOut', label: 'Zoom Out' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'bounceIn', label: 'Bounce In' },
  { value: 'flipInX', label: 'Flip In X' },
  { value: 'flipInY', label: 'Flip In Y' },
  { value: 'rotateIn', label: 'Rotate In' },
  { value: 'rollIn', label: 'Roll In' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'swing', label: 'Swing' },
  { value: 'wobble', label: 'Wobble' },
  { value: 'shake', label: 'Shake' },
  { value: 'spin', label: 'Spin' },
  { value: 'rubberBand', label: 'Rubber Band' },
  { value: 'tada', label: 'Tada' },
  { value: 'elastic', label: 'Elastic' },
  { value: 'float', label: 'Float' },
]

export function EditPanel({ editPanel, activePage, onUpdateProperty, onClose, inline }) {
  const [activeSubsection, setActiveSubsection] = useState('standard')

  if (!editPanel.isOpen && !inline) return null

  const element = activePage.elements.find(e => e.id === editPanel.elementId)
  if (!element) return null

  const isShape = element.type === 'shape'
  const isButton = element.isButton
  const isText = element.type === 'text'

  const elementLabel = isButton ? 'Button' : (isShape ? 'Shape' : element.type === 'graphic' ? 'Graphic' : element.type === 'arrow' ? 'Arrow' : 'Text')

  return (
    <div className={`edit-panel-content ${inline ? 'inline' : ''}`} onClick={(e) => e.stopPropagation()}>
      {/* Sub-section chooser: Standard | Advanced */}
      <div className="subsection-chooser">
        <button
          type="button"
          className={`subsection-tab ${activeSubsection === 'standard' ? 'active' : ''}`}
          onClick={() => setActiveSubsection('standard')}
        >
          <Settings size={14} />
          <span>Standard</span>
        </button>
        <button
          type="button"
          className={`subsection-tab ${activeSubsection === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveSubsection('advanced')}
        >
          <Settings size={14} />
          <span>Advanced</span>
        </button>
      </div>

      {activeSubsection === 'standard' && (
      <div className="subsection-body subsection-standard-body">
          <div className="property-group-header">
            <span className="group-title">{elementLabel} Properties</span>
          </div>

      {isText && (
        <div className="property-section">
          <div className="section-label"><Type size={14} /> Typography</div>

          <div className="property-row">
            <textarea
              className="property-input textarea"
              value={element.content || ''}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'content', e.target.value)}
              placeholder="Enter text..."
              rows={3}
            />
          </div>

          <div className="property-row">
            <select
              className="property-input"
              value={element.fontFamily || 'Arial'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Inter">Inter</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div className="property-row">
            <label className="row-label">Size</label>
            <div className="range-wrapper">
              <input
                type="range"
                min="10"
                max="200"
                value={element.fontSize || 14}
                onChange={(e) => onUpdateProperty(editPanel.elementId, 'fontSize', parseInt(e.target.value))}
              />
              <span className="value-display">{element.fontSize || 14}px</span>
            </div>
          </div>

          <div className="property-row">
            <label className="row-label">Color</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={element.color || '#000000'}
                onChange={(e) => onUpdateProperty(editPanel.elementId, 'color', e.target.value)}
              />
              <span className="color-value">{element.color || '#000000'}</span>
            </div>
          </div>
        </div>
      )}

      {isButton && (
        <div className="property-section">
          <div className="section-label"><MousePointer2 size={14} /> Interaction</div>

          <div className="property-row">
            <label className="row-label">Label</label>
            <input
              type="text"
              className="property-input"
              value={element.text || 'Button'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'text', e.target.value)}
              placeholder="Button label"
            />
          </div>

          <div className="property-row">
            <label className="row-label">Type</label>
            <select
              className="property-input"
              value={element.buttonType || 'press'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'buttonType', e.target.value)}
            >
              <option value="press">Clickable</option>
              <option value="text-input">Input Field</option>
            </select>
          </div>

          {((element.buttonType) || 'press') === 'text-input' && (
            <>
              <div className="property-row">
                <label className="row-label">Placeholder</label>
                <input
                  type="text"
                  className="property-input"
                  value={element.inputPlaceholder || ''}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'inputPlaceholder', e.target.value)}
                  placeholder="Placeholder..."
                />
              </div>

              <div className="property-row checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={element.fixedText === true}
                    onChange={(e) => onUpdateProperty(editPanel.elementId, 'fixedText', e.target.checked)}
                  />
                  Uneditable Text
                </label>
              </div>
            </>
          )}
        </div>
      )}

      {(isShape || isButton) && (
        <div className="property-section">
          <div className="section-label"><Palette size={14} /> Appearance</div>

          <div className="property-row">
            <label className="row-label">Fill Style</label>
            <div className="segment-control">
              <button
                className={element.fillType === 'solid' ? 'active' : ''}
                onClick={() => onUpdateProperty(editPanel.elementId, 'fillType', 'solid')}
              >Solid</button>
              <button
                className={element.fillType === 'gradient' ? 'active' : ''}
                onClick={() => onUpdateProperty(editPanel.elementId, 'fillType', 'gradient')}
              >Gradient</button>
            </div>
          </div>

          {element.fillType === 'solid' ? (
            <div className="property-row">
              <label className="row-label">Fill Color</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  value={element.fillColors?.[0] || '#ffffff'}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'fillColors', [e.target.value])}
                />
                <span className="color-value">{element.fillColors?.[0] || '#ffffff'}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="property-row">
                <label className="row-label">Start Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={element.fillColors?.[0] || '#ffffff'}
                    onChange={(e) => {
                      const colors = [...(element.fillColors || ['#ffffff', '#ffffff'])]
                      colors[0] = e.target.value
                      onUpdateProperty(editPanel.elementId, 'fillColors', colors)
                    }}
                  />
                </div>
              </div>
              <div className="property-row">
                <label className="row-label">End Color</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={element.fillColors?.[1] || '#ffffff'}
                    onChange={(e) => {
                      const colors = [...(element.fillColors || ['#ffffff', '#ffffff'])]
                      colors[1] = e.target.value
                      onUpdateProperty(editPanel.elementId, 'fillColors', colors)
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="property-row">
            <label className="row-label">Border</label>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={element.borderColor || '#000000'}
                onChange={(e) => onUpdateProperty(editPanel.elementId, 'borderColor', e.target.value)}
              />
            </div>
          </div>

          <div className="property-row">
            <label className="row-label">Thickness</label>
            <div className="range-wrapper">
              <input
                type="range"
                min="0"
                max="20"
                value={element.borderWidth || 0}
                onChange={(e) => onUpdateProperty(editPanel.elementId, 'borderWidth', parseInt(e.target.value))}
              />
              <span className="value-display">{element.borderWidth || 0}px</span>
            </div>
          </div>
        </div>
      )}

      <div className="property-section">
        <div className="section-label"><Layout size={14} /> Layout</div>
        <div className="grid-2-col">
          <div className="property-col">
            <label>X</label>
            <input
              type="number"
              className="number-input"
              value={Math.round(element.x)}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'x', parseInt(e.target.value))}
            />
          </div>
          <div className="property-col">
            <label>Y</label>
            <input
              type="number"
              className="number-input"
              value={Math.round(element.y)}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'y', parseInt(e.target.value))}
            />
          </div>
          <div className="property-col">
            <label>W</label>
            <input
              type="number"
              className="number-input"
              value={Math.round(element.width)}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'width', parseInt(e.target.value))}
            />
          </div>
          <div className="property-col">
            <label>H</label>
            <input
              type="number"
              className="number-input"
              value={Math.round(element.height)}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'height', parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="property-section">
        <div className="animation-section-header">
          <div className="section-label"><Zap size={14} /> Animation</div>
          {(element.animation || 'none') !== 'none' && (
            <div className="animation-duration-control">
              <input
                type="number"
                min={0.1}
                max={5}
                step={0.1}
                list="duration-presets"
                className="animation-duration-input"
                value={element.animationDuration ?? 0.5}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  if (Number.isFinite(v)) {
                    const clamped = Math.min(5, Math.max(0.1, v))
                    onUpdateProperty(editPanel.elementId, 'animationDuration', clamped)
                  }
                }}
              />
              <span className="animation-duration-unit">s</span>
              <datalist id="duration-presets">
                {[0.3, 0.5, 0.75, 1, 1.5, 2].map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
          )}
        </div>
        <div className="animation-options">
          {ANIMATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`animation-option ${(element.animation || 'none') === option.value ? 'active' : ''}`}
              onClick={() => onUpdateProperty(editPanel.elementId, 'animation', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      </div>
      )}

      {activeSubsection === 'advanced' && (
        <div className="subsection-body subsection-advanced-body">
          <div className="advanced-section">
            <div className="section-label">Animation delay</div>
            <div className="property-row">
              <label className="row-label">Delay (seconds)</label>
              <input
                type="number"
                min={0}
                max={30}
                step={0.5}
                className="property-input advanced-delay-input"
                value={element.animationDelay ?? 0}
                onChange={(e) => {
                  const v = parseFloat(e.target.value)
                  if (Number.isFinite(v) && v >= 0) {
                    const clamped = Math.min(30, Math.max(0, v))
                    onUpdateProperty(editPanel.elementId, 'animationDelay', clamped)
                  }
                }}
              />
            </div>
            {(element.animationDelay ?? 0) > 0 && (
              <div className="property-row">
                <label className="row-label">Start after</label>
                <select
                  className="property-input"
                  value={element.animationDelayAfter ?? 'screen'}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'animationDelayAfter', e.target.value === 'screen' ? 'screen' : e.target.value)}
                >
                  <option value="screen">Screen</option>
                  {(() => {
                    const others = activePage.elements.filter((e) => e.id !== editPanel.elementId)
                    return others.map((el) => {
                      const typeLabel = el.type === 'text' ? 'Text' : el.type === 'shape' ? (el.isButton ? 'Button' : 'Shape') : el.type === 'arrow' ? 'Arrow' : 'Graphic'
                      const sameType = others.filter((e) => e.type === el.type && (el.type !== 'shape' || !!e.isButton === !!e.isButton))
                      const order = sameType.indexOf(el) + 1
                      return (
                        <option key={el.id} value={el.id}>
                          {typeLabel} {order}
                        </option>
                      )
                    })
                  })()}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
