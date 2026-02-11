import { TextElement } from '../TextElement/TextElement'
import { ShapeElement } from '../ShapeElement/ShapeElement'
import { ArrowElement } from '../ArrowElement/ArrowElement'

export function Canvas({ 
  activePage, 
  selectedElementId, 
  pages,
  currentPageIndex,
  onSelectElement, 
  onUpdateElement, 
  onElementContextMenu,
  onButtonPress,
  selectedElements
}) {
  const canvasStyle =
    activePage.bgType === 'solid'
      ? { background: activePage.bgColors[0] }
      : {
          background: `linear-gradient(135deg, ${activePage.bgColors[0]}, ${activePage.bgColors[1]})`,
        }

  return (
    <div className="canvas-area">
      <div className="canvas" style={canvasStyle}>
        {activePage.elements.map((el) => {
          if (el.type === 'text') {
            return (
              <TextElement
                key={el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                onSelect={() => onSelectElement(el.id)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: el.isButton,
                  })
                }}
              />
            )
          } else if (el.type === 'shape') {
            return (
              <ShapeElement
                key={el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                pages={pages}
                currentPageIndex={currentPageIndex}
                onSelect={() => onSelectElement(el.id)}
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
                  })
                }}
              />
            )
          } else if (el.type === 'arrow') {
            return (
              <ArrowElement
                key={el.id}
                element={el}
                selected={selectedElementId === el.id || selectedElements.includes(el.id)}
                pages={pages}
                currentPageIndex={currentPageIndex}
                onSelect={() => onSelectElement(el.id)}
                onUpdate={(updated) => onUpdateElement(el.id, updated)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onElementContextMenu({
                    x: e.clientX,
                    y: e.clientY,
                    elementId: el.id,
                    isButton: false,
                  })
                }}
              />
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

