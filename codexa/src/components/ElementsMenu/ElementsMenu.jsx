export function ElementsMenu({ elementsMenuOpen, onAddTextElement, onAddShape }) {
  if (!elementsMenuOpen) return null

  return (
    <div className="elements-menu" onClick={(e) => e.stopPropagation()}>
      <div className="menu-section">
        <h4>Text</h4>
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

      <div className="menu-section">
        <h4>Shapes</h4>
        <div className="shape-option" onClick={() => onAddShape('circle')}>
          ● Circle
        </div>
        <div className="shape-option" onClick={() => onAddShape('square')}>
          ■ Square
        </div>
        <div className="shape-option" onClick={() => onAddShape('rectangle')}>
          ▭ Rectangle
        </div>
        <div className="shape-option" onClick={() => onAddShape('triangle')}>
          ▲ Triangle
        </div>
        <div className="shape-option" onClick={() => onAddShape('oval')}>
          ◯ Oval
        </div>
        <div className="shape-option" onClick={() => onAddShape('pill')}>
          ⬭ Pill
        </div>
        <div className="shape-option" onClick={() => onAddShape('diamond')}>
          ◆ Diamond
        </div>
        <div className="shape-option" onClick={() => onAddShape('star')}>
          ★ Star
        </div>
        <div className="shape-option" onClick={() => onAddShape('parallelogram')}>
          ▱ Parallelogram
        </div>
      </div>

      <div className="menu-section">
        <h4>Buttons</h4>
        <div className="shape-option" onClick={() => onAddShape('button-circle')}>
          ● Circle Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-square')}>
          ■ Square Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-rectangle')}>
          ▭ Rectangle Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-pill')}>
          ⬭ Pill Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-diamond')}>
          ◆ Diamond Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-star')}>
          ★ Star Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-parallelogram')}>
          ▱ Parallelogram Button
        </div>
        <div className="shape-option" onClick={() => onAddShape('button-rounded')}>
          ▬ Rounded Button
        </div>
      </div>
    </div>
  )
}
