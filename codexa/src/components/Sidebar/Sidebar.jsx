import {
  Layout,
  Type,
  Shapes,
  Image as ImageIcon,
  MoreHorizontal
} from 'lucide-react'
import './Sidebar.css'

export function Sidebar({ onOpenBgEditor, onOpenElementsPanel, onToggleTextMenu, onOpenUploadsPanel, onShowNameModal, onOpenAppsPanel }) {
  return (
    <div className="sidebar-content">
      <div className="sidebar-group">
        <button
          className="sidebar-btn"
          onClick={onOpenElementsPanel}
          title="Elements"
        >
          <Shapes size={24} />
          <span className="sidebar-label">Elements</span>
        </button>

        <button
          className="sidebar-btn"
          onClick={onToggleTextMenu}
          title="Text"
        >
          <Type size={24} />
          <span className="sidebar-label">Text</span>
        </button>

        <button
          className="sidebar-btn"
          onClick={onOpenBgEditor}
          title="Background"
        >
          <Layout size={24} />
          <span className="sidebar-label">Bkgrnd</span>
        </button>

        <button
          className="sidebar-btn"
          onClick={onOpenUploadsPanel}
          title="Uploads"
        >
          <ImageIcon size={24} />
          <span className="sidebar-label">Uploads</span>
        </button>

      </div>

      <div className="sidebar-group bottom">
        <button
          className="sidebar-btn"
          onClick={() => onShowNameModal(true)}
          title="Add Page"
        >
          <div style={{ position: 'relative' }}>
            <Layout size={24} />
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: 'var(--primary)',
              borderRadius: '50%',
              width: '14px',
              height: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              border: '2px solid var(--bg-secondary)'
            }}>+</div>
          </div>
          <span className="sidebar-label">Add Page</span>
        </button>

        <button
          className="sidebar-btn"
          onClick={onOpenAppsPanel}
          title="More"
        >
          <MoreHorizontal size={24} />
          <span className="sidebar-label">Apps</span>
        </button>
      </div>
    </div>
  )
}
