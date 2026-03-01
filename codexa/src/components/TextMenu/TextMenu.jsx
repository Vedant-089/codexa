export function TextMenu({ textMenuOpen, onAddTextElement, inline = false }) {
  if (!textMenuOpen && !inline) return null

  return (
    <div className={`text-menu ${inline ? 'inline' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="text-option heading" onClick={() => onAddTextElement('heading')}>
        Heading
      </div>
      <div className="text-option subheading" onClick={() => onAddTextElement('subheading')}>
        Sub-heading
      </div>
      <div className="text-option body" onClick={() => onAddTextElement('body')}>
        Text
      </div>
    </div>
  )
}
