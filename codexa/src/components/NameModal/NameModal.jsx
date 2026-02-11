export function NameModal({ showNameModal, newPageName, onPageNameChange, onCreatePage, onClose }) {
  if (!showNameModal) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Name this Screen</h3>
        <input
          value={newPageName}
          onChange={(e) => onPageNameChange(e.target.value)}
          placeholder="Enter screen name"
        />
        <button onClick={onCreatePage}>Create</button>
      </div>
    </div>
  )
}
