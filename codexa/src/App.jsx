import { useState, useEffect } from 'react'
import './App.css'
import { Sidebar } from './components/Sidebar/Sidebar'
import './components/Sidebar/Sidebar.css'
import { PageThumbs } from './components/PageThumbs/PageThumbs'
import './components/PageThumbs/PageThumbs.css'
import { Canvas } from './components/Canvas/Canvas'
import './components/Canvas/Canvas.css'
import './components/TextElement/TextElement.css'
import './components/ShapeElement/ShapeElement.css'
import { EditPanel } from './components/EditPanel/EditPanel'
import './components/EditPanel/EditPanel.css'
import { ContextMenu } from './components/ContextMenu/ContextMenu'
import './components/ContextMenu/ContextMenu.css'
import { BgEditor } from './components/BgEditor/BgEditor'
import './components/BgEditor/BgEditor.css'
import { NameModal } from './components/NameModal/NameModal'
import './components/NameModal/NameModal.css'
import { BottomBar } from './components/BottomBar/BottomBar'
import './components/BottomBar/BottomBar.css'
import { TextMenu } from './components/TextMenu/TextMenu'
import './components/TextMenu/TextMenu.css'
import { ElementsPanel } from './components/ElementsPanel/ElementsPanel'
import './components/ElementsPanel/ElementsPanel.css'


export default function App() {
  const [isStartingPage, setIsStartingPage] = useState(true)

  const [pages, setPages] = useState([
    {
      id: Date.now(),
      name: 'Page 1',
      bgType: 'solid',
      bgColors: ['#ffffff'],
      elements: [],
    },
  ])

  const [activeIndex, setActiveIndex] = useState(0)
  const [contextMenu, setContextMenu] = useState(null)
  const [bgEditor, setBgEditor] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [textMenuOpen, setTextMenuOpen] = useState(false)
  const [elementsPanelOpen, setElementsPanelOpen] = useState(false)
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [elementContextMenu, setElementContextMenu] = useState(null)
  const [editPanel, setEditPanel] = useState({ isOpen: false, elementId: null })
  const [selectedElements, setSelectedElements] = useState([])
  const [lockModal, setLockModal] = useState(null)
  const [shiftPressed, setShiftPressed] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(true)
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Shift') {
        setShiftPressed(false)
        // Show lock modal if multiple elements selected
        if (selectedElements.length >= 2) {
          setLockModal({
            elements: selectedElements
          })
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectedElements])

  const activePage = pages[activeIndex]

  const canvasStyle =
    activePage.bgType === 'solid'
      ? { background: activePage.bgColors[0] }
      : {
          background: `linear-gradient(135deg, ${activePage.bgColors[0]}, ${activePage.bgColors[1]})`,
        }

  const updateActivePage = (updates) => {
    setPages((prev) =>
      prev.map((p, i) =>
        i === activeIndex ? { ...p, ...updates } : p
      )
    )
  }

  const updateElements = (elements) => {
    updateActivePage({ elements })
  }

  const createPage = () => {
    if (!newPageName.trim()) return

    setPages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newPageName,
        bgType: 'solid',
        bgColors: ['#ffffff'],
        elements: [],
      },
    ])

    setActiveIndex(pages.length)
    setNewPageName('')
    setShowNameModal(false)
  }

  const copyPage = (index) => {
    const page = pages[index]
    const copy = {
      ...page,
      id: Date.now(),
      name: page.name + ' Copy',
      elements: [...page.elements],
    }

    const newPages = [...pages]
    newPages.splice(index + 1, 0, copy)
    setPages(newPages)
    setActiveIndex(index + 1)
    setContextMenu(null)
  }

  const deletePage = (index) => {
    if (pages.length === 1) return
    setPages((prev) => prev.filter((_, i) => i !== index))
    setActiveIndex(Math.max(0, index - 1))
    setContextMenu(null)
  }

  const addTextElement = (type) => {
    const presets = {
      heading: { text: 'Heading', size: 32 },
      subheading: { text: 'Sub-heading', size: 20 },
      body: { text: 'Text', size: 14 },
    }

    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'text',
        content: presets[type].text,
        fontSize: presets[type].size,
        fontFamily: 'Arial',
        color: '#000000',
        x: 100,
        y: 100,
        width: 200,
        height: 60,
      },
    ])

    setTextMenuOpen(false)
  }

  const addShape = (shapeType) => {
    const isButton = shapeType.startsWith('button-')
    let actualShape = isButton ? shapeType.replace('button-', '') : shapeType

    // Map button-rounded to button shape type
    if (actualShape === 'rounded') {
      actualShape = 'button'
    }

    // Set appropriate dimensions for each shape type
    let width = 100
    let height = 100

    if (isButton) {
      if (actualShape === 'circle') {
        width = 100
        height = 100
      } else if (actualShape === 'square') {
        width = 80
        height = 80
      } else if (actualShape === 'rectangle' || actualShape === 'pill') {
        width = 150
        height = 50
      } else if (actualShape === 'button') {
        width = 120
        height = 45
      }
    }

    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'shape',
        shapeType: actualShape,
        buttonType: isButton ? 'press' : undefined,
        inputPlaceholder: isButton ? '' : undefined,
        fillType: 'solid',
        fillColors: isButton ? ['#808080'] : ['#ffffff'],
        borderColor: '#000000',
        borderWidth: 2,
        x: 100,
        y: 100,
        width: width,
        height: height,
        isButton: isButton,
        text: isButton ? 'Button' : undefined,
        fixedText: false,
      },
    ])

    setElementsPanelOpen(false)
  }

  const addButton = (buttonType) => {
    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'shape',
        shapeType: buttonType,
        buttonType: 'press',
        inputPlaceholder: '',
        buttonStyle: 'rounded',
        fillType: 'solid',
        fillColors: ['#808080'],
        borderColor: '#000000',
        borderWidth: 2,
        x: 100,
        y: 100,
        width: 120,
        height: 45,
        isButton: true,
        text: 'Button',
      },
    ])

    setElementsPanelOpen(false)
  }

  const addArrow = (arrowType) => {
    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'arrow',
        arrowType: arrowType,
        strokeColor: '#000000',
        strokeWidth: 2,
        fill: '#000000',
        rotation: 0,
        x: 100,
        y: 100,
        width: 60,
        height: 60,
      },
    ])

    setElementsPanelOpen(false)
  }

  const addGraphic = (iconPath) => {
    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'graphic',
        iconPath: iconPath,
        x: 100,
        y: 100,
        width: 50,
        height: 50,
      },
    ])

    setElementsPanelOpen(false)
  }

  const copyElement = (elementId) => {
    const el = activePage.elements.find(e => e.id === elementId)
    if (el) {
      navigator.clipboard.writeText(el.content).then(() => {
        setElementContextMenu(null)
      })
    }
  }

  const duplicateElement = (elementId) => {
    const el = activePage.elements.find(e => e.id === elementId)
    if (el) {
      updateElements([
        ...activePage.elements,
        {
          ...el,
          id: Date.now(),
          x: el.x + 10,
          y: el.y + 10,
        },
      ])
      setElementContextMenu(null)
    }
  }

  const deleteElement = (elementId) => {
    updateElements(activePage.elements.filter(e => e.id !== elementId))
    setElementContextMenu(null)
  }

  const pasteElement = (elementId) => {
    navigator.clipboard.readText().then(text => {
      const el = activePage.elements.find(e => e.id === elementId)
      if (el) {
        updateElements(
          activePage.elements.map(e =>
            e.id === elementId ? { ...e, content: text } : e
          )
        )
      }
      setElementContextMenu(null)
    })
  }

  const openEditPanel = (elementId) => {
    setEditPanel({ isOpen: true, elementId })
    setElementContextMenu(null)
  }

  const closeEditPanel = () => {
    setEditPanel({ isOpen: false, elementId: null })
    setSelectedElementId(null)
  }

  const updateElementProperty = (elementId, property, value) => {
    updateElements(
      activePage.elements.map(e =>
        e.id === elementId ? { ...e, [property]: value } : e
      )
    )
  }

  const handleSelectElement = (elementId) => {
    const element = activePage.elements.find(el => el.id === elementId)
    if (!element) return

    let group = [elementId]
    if (element.lockedWith) {
      group = [elementId, ...element.lockedWith]
    }

    if (shiftPressed) {
      // Multi-select mode
      setSelectedElements(prev => {
        const newSelected = [...prev]
        group.forEach(id => {
          if (newSelected.includes(id)) {
            newSelected.splice(newSelected.indexOf(id), 1)
          } else {
            newSelected.push(id)
          }
        })
        return newSelected
      })
      setSelectedElementId(null)
      setEditPanel({ isOpen: false, elementId: null })
    } else {
      // Single select mode
      setSelectedElementId(group[0])
      setSelectedElements(group)
      setEditPanel({ isOpen: true, elementId: group[0] })
    }
  }

  const handleUpdateElement = (elementId, updated) => {
    const element = activePage.elements.find(el => el.id === elementId)
    if (element.lockedWith) {
      const group = [elementId, ...element.lockedWith]
      const deltaX = updated.x - element.x
      const deltaY = updated.y - element.y
      updateElements(
        activePage.elements.map((e) =>
          group.includes(e.id) 
            ? { 
                ...e, 
                x: e.x + deltaX, 
                y: e.y + deltaY, 
                ...(e.id === elementId ? { width: updated.width, height: updated.height, fontSize: updated.fontSize } : {}) 
              } 
            : e
        )
      )
    } else {
      updateElements(
        activePage.elements.map((e) =>
          e.id === elementId ? updated : e
        )
      )
    }
  }

  const handleUnlockElement = (elementId) => {
    const element = activePage.elements.find(el => el.id === elementId)
    if (!element || !element.lockedWith) return

    const group = [elementId, ...element.lockedWith]
    updateElements(
      activePage.elements.map(el => {
        if (el.id === elementId) {
          return { ...el, lockedWith: undefined }
        } else if (group.includes(el.id)) {
          const newLockedWith = el.lockedWith.filter(id => id !== elementId)
          return { ...el, lockedWith: newLockedWith.length > 0 ? newLockedWith : undefined }
        }
        return el
      })
    )
    setElementContextMenu(null)
  }

  const handleSetButtonTarget = (buttonId, targetPage) => {
    updateElementProperty(buttonId, 'onPressPage', targetPage.id)
    setElementContextMenu(null)
  }

  const handleNavigate = (pageIndex) => {
    setActiveIndex(pageIndex)
  }

  if (isStartingPage) {
    return (
      <div className="starting-page">
        <div className="starting-content">
          <h1 className="codexa-title">Codexa</h1>
          <p className="codexa-quote">Where creativity meets simplicity – design beautiful interfaces effortlessly.</p>
          <button className="start-button" onClick={() => setIsStartingPage(false)}>
            Start designing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="app"
      onClick={(event) => {
        setContextMenu(null)
        setBgEditor(null)
        setTextMenuOpen(false)
        setElementsPanelOpen(false)
        setSelectedElementId(null)
        setElementContextMenu(null)
        closeEditPanel()
        // Clear selected elements when clicking canvas
        if (selectedElements.length > 0) {
          setSelectedElements([])
        }
      }}
    >
      <Sidebar
        onOpenBgEditor={() => setBgEditor({ x: 100, y: 100 })}
        onOpenElementsPanel={() => setElementsPanelOpen(true)}
        onToggleTextMenu={() => setTextMenuOpen(!textMenuOpen)}
        onShowNameModal={setShowNameModal}
      />

      <Canvas
        activePage={activePage}
        selectedElementId={selectedElementId}
        pages={pages}
        currentPageIndex={activeIndex}
        onSelectElement={handleSelectElement}
        onUpdateElement={handleUpdateElement}
        onElementContextMenu={(menu) => {
          const element = activePage.elements.find(el => el.id === menu.elementId)
          setElementContextMenu({ ...menu, currentPageIndex: activeIndex, element })
        }}
        onButtonPress={handleSetButtonTarget}
        selectedElements={selectedElements}
      />

      <PageThumbs
        pages={pages}
        activeIndex={activeIndex}
        onPageSelect={setActiveIndex}
        onShowNameModal={setShowNameModal}
        onPageContextMenu={setContextMenu}
      />

      <ContextMenu 
        menu={contextMenu}
        type="page"
        onBackgroundColor={(index) => {
          setActiveIndex(index)
          setBgEditor({
            x: contextMenu.x + 150,
            y: contextMenu.y,
          })
          setContextMenu(null)
        }}
        onCopy={copyPage}
        onDelete={deletePage}
      />

      <ContextMenu 
        menu={elementContextMenu}
        type="element"
        pages={pages}
        onCopy={copyElement}
        onDuplicate={duplicateElement}
        onDelete={deleteElement}
        onPaste={pasteElement}
        onUnlock={handleUnlockElement}
        onSelectButtonTarget={handleSetButtonTarget}
        onNavigate={handleNavigate}
        onEdit={handleSelectElement}
      />

      <EditPanel 
        editPanel={editPanel}
        activePage={activePage}
        onUpdateProperty={updateElementProperty}
        onClose={closeEditPanel}
      />

      <BgEditor 
        bgEditor={bgEditor}
        activePage={activePage}
        onUpdateBg={updateActivePage}
        onClose={() => setBgEditor(null)}
      />

      <NameModal 
        showNameModal={showNameModal}
        newPageName={newPageName}
        onPageNameChange={setNewPageName}
        onCreatePage={createPage}
        onClose={() => {
          setShowNameModal(false)
          setNewPageName('')
        }}
      />



      <TextMenu 
        textMenuOpen={textMenuOpen}
        onAddTextElement={addTextElement}
      />

      <ElementsPanel
        isOpen={elementsPanelOpen}
        onAddShape={addShape}
        onAddButton={addButton}
        onAddArrow={addArrow}
        onAddGraphic={addGraphic}
        onClose={() => setElementsPanelOpen(false)}
      />

      {lockModal && (
        <div className="modal-overlay" onClick={() => setLockModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Lock Elements</h3>
            <p>Do you want to lock these {lockModal.elements.length} elements together?</p>
            <button onClick={() => {
              // Lock elements together
              const elementsToLock = lockModal.elements
              updateElements(
                activePage.elements.map(el => {
                  if (elementsToLock.includes(el.id)) {
                    return {
                      ...el,
                      lockedWith: elementsToLock.filter(id => id !== el.id)
                    }
                  }
                  return el
                })
              )
              setLockModal(null)
              setSelectedElements([])
            }}>Yes</button>
            <button onClick={() => {
              setLockModal(null)
              setSelectedElements([])
            }}>No</button>
          </div>
        </div>
      )}

    </div>
  )
}
