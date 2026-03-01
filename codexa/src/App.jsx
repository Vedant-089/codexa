import { useState, useEffect } from 'react'
import {
  Type,
  Square,
  Image as ImageIcon,
  MousePointer2,
  Hand,
  ZoomIn,
  ZoomOut,
  Layout,
  Settings,
  Download,
  Share2,
  ChevronDown,
  Play,
  Plus,
  X,
  Code
} from 'lucide-react'
import './App.css'
import { exportToCode } from './utils/Exporter'
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
import { UploadsPanel } from './components/UploadsPanel/UploadsPanel'
import './components/UploadsPanel/UploadsPanel.css'
import { AppsPanel } from './components/AppsPanel/AppsPanel'
import './components/AppsPanel/AppsPanel.css'
import { AIDesigner } from './components/AIDesigner/AIDesigner'
// Removed duplicate CSS import here as it's inside AIDesigner.jsx already


export default function App() {
  const [isStartingPage, setIsStartingPage] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

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
  const [activeSidePanel, setActiveSidePanel] = useState(null)
  const [contextMenu, setContextMenu] = useState(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [newPageName, setNewPageName] = useState('')
  const [selectedElementId, setSelectedElementId] = useState(null)
  const [elementContextMenu, setElementContextMenu] = useState(null)
  const [editPanel, setEditPanel] = useState({ isOpen: false, elementId: null })
  const [selectedElements, setSelectedElements] = useState([])
  const [lockModal, setLockModal] = useState(null)
  const [shiftPressed, setShiftPressed] = useState(false)
  const [pageDropdownOpen, setPageDropdownOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [isAIDesignerOpen, setIsAIDesignerOpen] = useState(false)

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

  const createPage = (name) => {
    if (!name || !name.trim()) return

    const newPage = {
      id: Date.now(),
      name: name,
      bgType: 'solid',
      bgColors: ['#ffffff'],
      elements: [],
    }

    setPages((prev) => {
      const newPages = [...prev, newPage]
      // Set active index to the newly created page
      setActiveIndex(newPages.length - 1)
      return newPages
    })

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
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])

    setActiveSidePanel(null)
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
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])

    setActiveSidePanel(null)
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
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])

    setActiveSidePanel(null)
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
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])

    setActiveSidePanel(null)
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
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])

    setActiveSidePanel(null)
  }

  const addUploadedImage = (src) => {
    updateElements([
      ...activePage.elements,
      {
        id: Date.now(),
        type: 'graphic',
        iconPath: src,
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        animation: 'none',
        animationDuration: 0.5,
        animationDelay: 0,
        animationDelayAfter: 'screen',
      },
    ])
    setActiveSidePanel(null)
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
    }
    )
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

  const handleSelectElement = (elementId, pageIndex) => {
    // If pageIndex is provided, update activeIndex
    if (pageIndex !== undefined && pageIndex !== activeIndex) {
      setActiveIndex(pageIndex)
    }

    if (!elementId) {
      setSelectedElementId(null)
      setSelectedElements([])
      setEditPanel({ isOpen: false, elementId: null })
      return
    }

    const page = pageIndex !== undefined ? pages[pageIndex] : activePage
    const element = page.elements.find(el => el.id === elementId)
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
            Start Designing
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`app ${isPreviewMode ? 'preview-mode' : ''}`}
      style={{ '--side-panel-width': activeSidePanel ? '300px' : '0px' }}
      onClick={(e) => {
        setContextMenu(null)
        // Close side panel if clicking outside (unless clicking sidebar)
        if (!e.target.closest('.side-panel') && !e.target.closest('.sidebar')) {
          setActiveSidePanel(null)
        }
        setSelectedElementId(null)
        setElementContextMenu(null)
        closeEditPanel()
        setPageDropdownOpen(false)
        if (selectedElements.length > 0) setSelectedElements([])
      }}>

      {isPreviewMode && (
        <button
          className="exit-preview-btn"
          onClick={() => setIsPreviewMode(false)}
        >
          <X size={18} />
          <span>Exit Present</span>
        </button>
      )}

      {/* HEADER */}
      {!isPreviewMode && (
        <header className="header" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>Codexa</div>
            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>

            <div style={{ position: 'relative' }}>
              <div
                onClick={(e) => { e.stopPropagation(); setPageDropdownOpen(!pageDropdownOpen); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', background: 'var(--bg-tertiary)' }}
              >
                <span>{activePage.name}</span>
                <ChevronDown size={14} />
              </div>
              {pageDropdownOpen && (
                <div className="page-dropdown" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  padding: '8px',
                  minWidth: '200px',
                  zIndex: 100,
                  boxShadow: 'var(--shadow-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  border: '1px solid var(--border)'
                }} onClick={(e) => e.stopPropagation()}>
                  {pages.map((page, index) => (
                    <div key={page.id}
                      onClick={() => { setActiveIndex(index); setPageDropdownOpen(false); }}
                      style={{
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        background: index === activeIndex ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: index === activeIndex ? 'var(--primary)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => { if (index !== activeIndex) e.currentTarget.style.background = 'var(--bg-secondary)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <span>{page.name}</span>
                    </div>
                  ))}
                  <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>
                  <div
                    onClick={() => {
                      setPageDropdownOpen(false);
                      setShowNameModal(true);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--text-secondary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Plus size={14} />
                    <span>Add Page</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button title="Zoom Out"><ZoomOut size={18} color="var(--text-secondary)" /></button>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>100%</span>
            <button title="Zoom In"><ZoomIn size={18} color="var(--text-secondary)" /></button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setIsPreviewMode(prev => !prev); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px'
              }}>
              <Play size={16} fill="currentColor" />
              <span>{isPreviewMode ? 'Exit Present' : 'Present'}</span>
            </button>
            <button title="Share"><Share2 size={20} color="var(--text-secondary)" /></button>
            <button title="Export Design"><Download size={20} color="var(--text-secondary)" /></button>
            <button
              title="Convert to Code"
              onClick={(e) => { e.stopPropagation(); exportToCode(pages); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--primary)',
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Code size={18} />
              <span>Convert to Code</span>
            </button>
          </div>
        </header>
      )}

      {/* SIDEBAR - Replaced simplistic Sidebar component with inline structure for new layout or wrapping existing */}
      {!isPreviewMode && (
        <div className="sidebar" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: '24px',
          backgroundColor: 'var(--bg-secondary)'
        }} onClick={(e) => e.stopPropagation()}>
          {/* We can refactor existing Sidebar logic into this or just use this as container */}
          <Sidebar
            onOpenBgEditor={(e) => { e.stopPropagation(); setActiveSidePanel(prev => prev === 'bg' ? null : 'bg'); }}
            onOpenElementsPanel={(e) => { e.stopPropagation(); setActiveSidePanel(prev => prev === 'elements' ? null : 'elements'); }}
            onToggleTextMenu={(e) => { e.stopPropagation(); setActiveSidePanel(prev => prev === 'text' ? null : 'text'); }}
            onOpenUploadsPanel={(e) => { e.stopPropagation(); setActiveSidePanel(prev => prev === 'uploads' ? null : 'uploads'); }}
            onOpenAppsPanel={(e) => { e.stopPropagation(); setActiveSidePanel(prev => prev === 'apps' ? null : 'apps'); }}
            onShowNameModal={setShowNameModal}
            onCreatePage={createPage}
          />
        </div>
      )}

      {/* SIDE PANEL - EXPANDABLE AREA */}
      {!isPreviewMode && (
        <div className="side-panel" onClick={(e) => e.stopPropagation()}>
          {activeSidePanel === 'elements' && (
            <ElementsPanel
              isOpen={true}
              inline={true}
              onAddShape={addShape}
              onAddButton={addButton}
              onAddArrow={addArrow}
              onAddGraphic={addGraphic}
              onClose={() => setActiveSidePanel(null)}
            />
          )}
          {activeSidePanel === 'text' && (
            <TextMenu
              textMenuOpen={true}
              inline={true}
              onAddTextElement={addTextElement}
            />
          )}
          {activeSidePanel === 'bg' && (
            <BgEditor
              bgEditor={true}
              inline={true}
              activePage={activePage}
              onUpdateBg={updateActivePage}
              onClose={() => setActiveSidePanel(null)}
            />
          )}
          {activeSidePanel === 'uploads' && (
            <UploadsPanel
              uploadedImages={uploadedImages}
              onUpload={(src) => setUploadedImages([...uploadedImages, src])}
              onSelectImage={addUploadedImage}
              inline={true}
            />
          )}
          {activeSidePanel === 'apps' && (
            <AppsPanel
              isOpen={true}
              onClose={() => setActiveSidePanel(null)}
              pages={pages}
              setPages={setPages}
              uploadedImages={uploadedImages}
              onUpload={(src) => setUploadedImages([...uploadedImages, src])}
              onOpenAIDesigner={() => {
                setIsAIDesignerOpen(true)
                setActiveSidePanel(null)
              }}
            />
          )}
        </div>
      )}

      {/* CANVAS */}
      <div className="canvas-container">
        <Canvas
          activePage={activePage}
          selectedElementId={selectedElementId}
          pages={pages}
          currentPageIndex={activeIndex}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          onElementContextMenu={(menu) => {
            const page = pages[menu.pageIndex || activeIndex]
            const element = page.elements.find(el => el.id === menu.elementId)
            setElementContextMenu({ ...menu, currentPageIndex: menu.pageIndex || activeIndex, element })
          }}
          onButtonPress={handleSetButtonTarget}
          selectedElements={selectedElements}
          isPreviewMode={isPreviewMode}
        />
      </div>

      {/* RIGHT PANEL - PROPERTIES */}
      {!isPreviewMode && (
        <div className="properties-panel" style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', overflowY: 'auto' }}>
          {selectedElementId || selectedElements.length > 0 ? (
            <EditPanel
              editPanel={{ isOpen: true, elementId: selectedElementId || selectedElements[0] }}
              activePage={activePage}
              onUpdateProperty={updateElementProperty}
              onClose={() => {
                setSelectedElementId(null)
                setSelectedElements([])
              }}
              inline={true}
            />
          ) : (
            <div className="empty-properties">
              <p>Select an element to edit properties</p>
            </div>
          )}
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="bottom-bar" style={{ display: 'none' }}>
      </div>

      {/* OVERLAYS & MODALS */}
      <ContextMenu
        menu={contextMenu}
        type="page"
        onBackgroundColor={(index) => {
          setActiveIndex(index)
          setActiveSidePanel('bg')
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

      {/* Floating Menus - positioned relatively or absolutely as needed */}
      <NameModal
        isOpen={showNameModal}
        onSave={createPage}
        onClose={() => setShowNameModal(false)}
      />

      {
        lockModal && (
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
        )
      }
      {isAIDesignerOpen && (
        <AIDesigner
          isOpen={isAIDesignerOpen}
          onClose={() => setIsAIDesignerOpen(false)}
          pages={pages}
          setPages={setPages}
          onUpload={(src) => setUploadedImages(prev => [...prev, src])}
        />
      )}

    </div >
  )
}
