export function PageThumbs({ pages, activeIndex, onPageSelect, onShowNameModal, onPageContextMenu }) {
  return (
    <div className="page-thumbs">
      {pages.map((page, index) => {
        const style =
          page.bgType === 'solid'
            ? { background: page.bgColors[0] }
            : {
                background: `linear-gradient(135deg, ${page.bgColors[0]}, ${page.bgColors[1]})`,
              }

        return (
          <div
            key={page.id}
            className={`page-thumb ${index === activeIndex ? 'active' : ''}`}
            title={page.name}
            onClick={(e) => {
              e.stopPropagation()
              onPageSelect(index)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onPageContextMenu({
                x: e.clientX,
                y: e.clientY,
                index,
              })
            }}
          >
            {page.name}
          </div>
        )
      })}

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
