export function EditPanel({ editPanel, activePage, onUpdateProperty, onClose }) {
  if (!editPanel.isOpen) return null

  const element = activePage.elements.find(e => e.id === editPanel.elementId)
  if (!element) return null

  const isShape = element.type === 'shape'
  const isButton = element.isButton

  return (
    <div className="edit-panel" onClick={(e) => e.stopPropagation()}>
      <div className="edit-header">
        <h3>{isButton ? 'Edit Button' : (isShape ? 'Edit Shape' : 'Edit Text')}</h3>
        <button onClick={onClose}>×</button>
      </div>

      {!isShape && (
        <>
          <div className="edit-section">
            <h4>Text</h4>
            <textarea
              value={element.content || ''}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'content', e.target.value)}
              placeholder="Edit text"
              rows={3}
              style={{ width: '100%', padding: '6px' }}
            />
          </div>
          <div className="edit-section">
            <h4>Fonts</h4>
            <select
              value={element.fontFamily || 'Arial'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>
          <div className="edit-section">
            <h4>Size</h4>
            <input
              type="range"
              min="10"
              max="100"
              value={element.fontSize || 14}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'fontSize', parseInt(e.target.value))}
            />
            <span>{element.fontSize || 14}px</span>
          </div>
        </>
      )}

      {isButton && (
        <>
          <div className="edit-section">
            <h4>Button Text</h4>
            <input
              type="text"
              value={element.text || 'Button'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'text', e.target.value)}
              placeholder="Button text"
            />
          </div>

          <div className="edit-section">
            <h4>Button Type</h4>
            <select
              value={element.buttonType || 'press'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'buttonType', e.target.value)}
              style={{ width: '100%', padding: '6px' }}
            >
              <option value="press">Press Button</option>
              <option value="text-input">Text Input Button</option>
            </select>
          </div>

          {((element.buttonType) || 'press') === 'text-input' && (
            <>
              <div className="edit-section">
                <h4>Input Placeholder</h4>
                <input
                  type="text"
                  value={element.inputPlaceholder || ''}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'inputPlaceholder', e.target.value)}
                  placeholder="Placeholder text"
                />
              </div>
              <div className="edit-section">
                <h4>Fix Text</h4>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>
                    <input
                      type="radio"
                      name="fixedText"
                      value="true"
                      checked={element.fixedText === true}
                      onChange={() => onUpdateProperty(editPanel.elementId, 'fixedText', true)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="fixedText"
                      value="false"
                      checked={element.fixedText === false}
                      onChange={() => onUpdateProperty(editPanel.elementId, 'fixedText', false)}
                    />
                    No
                  </label>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <div className="edit-section">
        <h4>Fill Colour</h4>
        {isShape && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ marginRight: '10px' }}>
                <input
                  type="radio"
                  name="fillType"
                  value="solid"
                  checked={element.fillType === 'solid'}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'fillType', 'solid')}
                />
                Solid
              </label>
              <label>
                <input
                  type="radio"
                  name="fillType"
                  value="gradient"
                  checked={element.fillType === 'gradient'}
                  onChange={(e) => onUpdateProperty(editPanel.elementId, 'fillType', 'gradient')}
                />
                Gradient
              </label>
            </div>
            {element.fillType === 'solid' ? (
              <input
                type="color"
                value={element.fillColors?.[0] || '#ffffff'}
                onChange={(e) => onUpdateProperty(editPanel.elementId, 'fillColors', [e.target.value])}
              />
            ) : (
              <>
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', color: '#999' }}>Color 1</label>
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
                <div>
                  <label style={{ fontSize: '12px', color: '#999' }}>Color 2</label>
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
              </>
            )}
          </>
        )}
        {!isShape && (
          <input
            type="color"
            value={element.color || '#000000'}
            onChange={(e) => onUpdateProperty(editPanel.elementId, 'color', e.target.value)}
          />
        )}
      </div>

      {isShape && (
        <>
          <div className="edit-section">
            <h4>Border Colour</h4>
            <input
              type="color"
              value={element.borderColor || '#000000'}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'borderColor', e.target.value)}
            />
          </div>
          <div className="edit-section">
            <h4>Border Width</h4>
            <input
              type="range"
              min="1"
              max="10"
              value={element.borderWidth || 2}
              onChange={(e) => onUpdateProperty(editPanel.elementId, 'borderWidth', parseInt(e.target.value))}
            />
            <span>{element.borderWidth || 2}px</span>
          </div>
        </>
      )}
    </div>
  )
}
