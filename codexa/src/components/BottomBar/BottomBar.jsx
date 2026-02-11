export function BottomBar({ textMenuOpen, onToggleTextMenu, onShowElementsPanel }) {
  return (
    <div className="bottom-bar" onClick={(e) => e.stopPropagation()}>
      <div
        className="bottom-item"
        onClick={() => onToggleTextMenu()}
      >
        Text
      </div>

      <div className="bottom-add">+</div>

      <div
        className="bottom-item"
        onClick={() => onShowElementsPanel()}
      >
        Elements
      </div>
    </div>
  )
}
