export function Sidebar({ onOpenBgEditor, onOpenElementsPanel, onToggleTextMenu, onShowNameModal }) {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <button
          className="sidebar-icon"
          onClick={(e) => {
            e.stopPropagation()
            onOpenBgEditor()
          }}
          title="Background Settings"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"/>
            <path d="M12 22L10.91 15.74L4 15L10.91 14.26L12 8L13.09 14.26L20 15L13.09 15.74L12 22Z" fill="white"/>
            <circle cx="12" cy="12" r="4" fill="white"/>
          </svg>
        </button>

        <button
          className="sidebar-icon"
          onClick={(e) => {
            e.stopPropagation()
            onOpenElementsPanel()
          }}
          title="Elements"
        >
          <svg width="48000000" height="48000000" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="3" stroke="white" stroke-width="2"/>
            <circle cx="16" cy="8" r="3" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="16" r="3" stroke="white" stroke-width="2"/>
          </svg>
        </button>

        <button
          className="sidebar-icon"
          onClick={(e) => {
            e.stopPropagation()
            onToggleTextMenu()
          }}
          title="Text"
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20M7 7h10M7 12h6M7 17h4" stroke="white" stroke-width="4" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <button
        className="add-page"
        onClick={(e) => {
          e.stopPropagation()
          onShowNameModal(true)
        }}
      >
        +
      </button>
    </div>
  )
}
