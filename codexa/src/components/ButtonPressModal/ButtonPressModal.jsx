import './ButtonPressModal.css'

export function ButtonPressModal({ isOpen, pages, currentPageIndex, onSelectPage, onClose }) {
  if (!isOpen) return null

  const otherPages = pages.filter((_, index) => index !== currentPageIndex)

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Navigate To Page</h3>
        <p className="modal-subtitle">Select a page to open when this button is pressed</p>
        
        <div className="pages-list">
          {otherPages.length > 0 ? (
            otherPages.map((page, index) => (
              <div
                key={page.id}
                className="page-option"
                onClick={() => {
                  onSelectPage(page)
                  onClose()
                }}
              >
                <div className="page-thumbnail" style={{
                  background: page.bgType === 'solid'
                    ? page.bgColors[0]
                    : `linear-gradient(135deg, ${page.bgColors[0]}, ${page.bgColors[1]})`
                }} />
                <span className="page-name">{page.name}</span>
              </div>
            ))
          ) : (
            <p className="no-pages">No other pages available</p>
          )}
        </div>

        <button className="modal-cancel" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}
