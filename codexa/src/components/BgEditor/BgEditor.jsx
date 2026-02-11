export function BgEditor({ bgEditor, activePage, onUpdateBg, onClose }) {
  if (!bgEditor) return null

  return (
    <div
      className="bg-editor"
      style={{ top: bgEditor.y, left: bgEditor.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="toggle">
        <button
          className={activePage.bgType === 'solid' ? 'active' : ''}
          onClick={() =>
            onUpdateBg({
              bgType: 'solid',
              bgColors: [activePage.bgColors[0]],
            })
          }
        >
          Solid
        </button>
        <button
          className={activePage.bgType === 'gradient' ? 'active' : ''}
          onClick={() =>
            onUpdateBg({
              bgType: 'gradient',
              bgColors: [
                activePage.bgColors[0],
                activePage.bgColors[1] || '#000000',
              ],
            })
          }
        >
          Gradient
        </button>
      </div>

      {activePage.bgType === 'solid' && (
        <input
          type="color"
          value={activePage.bgColors[0]}
          onChange={(e) =>
            onUpdateBg({ bgColors: [e.target.value] })
          }
        />
      )}

      {activePage.bgType === 'gradient' && (
        <div className="gradient-pickers">
          <input
            type="color"
            value={activePage.bgColors[0]}
            onChange={(e) =>
              onUpdateBg({
                bgColors: [e.target.value, activePage.bgColors[1]],
              })
            }
          />
          <input
            type="color"
            value={activePage.bgColors[1]}
            onChange={(e) =>
              onUpdateBg({
                bgColors: [activePage.bgColors[0], e.target.value],
              })
            }
          />
        </div>
      )}
    </div>
  )
}
