import { useState } from 'react'
import arrowUpSVG from '../../arrows/arrow-up.svg?url'
import arrowDownSVG from '../../arrows/arrow-down.svg?url'
import arrowLeftSVG from '../../arrows/arrow-left.svg?url'
import arrowRightSVG from '../../arrows/arrow-right.svg?url'
import arrowUpRightSVG from '../../arrows/arrow-up-right.svg?url'
import arrowDownRightSVG from '../../arrows/arrow-down-right.svg?url'
import arrowDownLeftSVG from '../../arrows/arrow-down-left.svg?url'
import arrowUpLeftSVG from '../../arrows/arrow-up-left.svg?url'
import shapesImage from '../../UI/shapes.png'
import buttonsImage from '../../UI/button.png'
import graphicsImage from '../../UI/graphics.png'

const arrowSVGs = {
  up: arrowUpSVG,
  down: arrowDownSVG,
  left: arrowLeftSVG,
  right: arrowRightSVG,
  'up-right': arrowUpRightSVG,
  'down-right': arrowDownRightSVG,
  'down-left': arrowDownLeftSVG,
  'up-left': arrowUpLeftSVG,
}

export function ElementsPanel({ isOpen, onAddShape, onAddButton, onAddArrow, onAddGraphic, onClose }) {
  const [expandedSections, setExpandedSections] = useState({
    shapes: false,
    buttons: false,
    graphics: false,
  })

  const [expandedCategories, setExpandedCategories] = useState({
    shapes: false,
    arrows: false,
    buttons: false,
    appIcons: false,
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  if (!isOpen) return null

  const shapes = [
    { name: 'Circle', icon: '●', type: 'circle' },
    { name: 'Square', icon: '■', type: 'square' },
    { name: 'Rectangle', icon: '▭', type: 'rectangle' },
    { name: 'Triangle', icon: '▲', type: 'triangle' },
    { name: 'Oval', icon: '◯', type: 'oval' },
    { name: 'Pill', icon: '⬭', type: 'pill' },
    { name: 'Diamond', icon: '◆', type: 'diamond' },
    { name: 'Star', icon: '★', type: 'star' },
    { name: 'Star 6pt', icon: '✡', type: 'star-6pt' },
    { name: 'Star 8pt', icon: '✦', type: 'star-8pt' },
    { name: 'Parallelogram', icon: '▱', type: 'parallelogram' },
    { name: 'Pentagon', icon: '⬠', type: 'pentagon' },
    { name: 'Hexagon', icon: '⬡', type: 'hexagon' },
    { name: 'Heptagon', icon: '⬢', type: 'heptagon' },
    { name: 'Cross', icon: '✚', type: 'cross' },
    { name: 'Plus', icon: '+', type: 'plus' },
    { name: 'X Mark', icon: '✕', type: 'x-mark' },
    { name: 'Checkmark', icon: '✓', type: 'checkmark' },
    { name: 'Heart', icon: '❤', type: 'heart' },
    { name: 'Flower', icon: '✿', type: 'flower' },
    { name: 'Crescent', icon: '☾', type: 'crescent' },
    { name: 'Moon', icon: '◐', type: 'moon' },
    { name: 'Cloud', icon: '☁', type: 'cloud' },
    { name: 'Triangle Alt', icon: '▼', type: 'triangle-down' },
    { name: 'Triangle Left', icon: '◄', type: 'triangle-left' },
    { name: 'Triangle Right', icon: '►', type: 'triangle-right' },
    { name: 'Rounded Square', icon: '▬', type: 'rounded-square' },
    { name: 'Trapezoid', icon: '⬛', type: 'trapezoid' },
    { name: 'Hourglass', icon: '⧗', type: 'hourglass' },
    { name: 'Bowtie', icon: '⧓', type: 'bowtie' },
    { name: 'Teardrop', icon: '◆', type: 'teardrop' },
    { name: 'Ring', icon: '◯', type: 'ring' },
    { name: 'Semicircle', icon: '◓', type: 'semicircle' },
  ]

  const buttons = [
    { name: 'Circle Button', icon: '●', type: 'circle' },
    { name: 'Square Button', icon: '■', type: 'square' },
    { name: 'Rectangle Button', icon: '▭', type: 'rectangle' },
    { name: 'Triangle Button', icon: '▲', type: 'triangle' },
    { name: 'Oval Button', icon: '◯', type: 'oval' },
    { name: 'Pill Button', icon: '⬭', type: 'pill' },
    { name: 'Diamond Button', icon: '◆', type: 'diamond' },
    { name: 'Star Button', icon: '★', type: 'star' },
    { name: 'Parallelogram Button', icon: '▱', type: 'parallelogram' },
  ]

  const arrows = [
    { name: 'Up', icon: 'up', type: 'up' },
    { name: 'Down', icon: 'down', type: 'down' },
    { name: 'Left', icon: 'left', type: 'left' },
    { name: 'Right', icon: 'right', type: 'right' },
    { name: 'Up Right', icon: 'up-right', type: 'up-right' },
    { name: 'Down Right', icon: 'down-right', type: 'down-right' },
    { name: 'Down Left', icon: 'down-left', type: 'down-left' },
    { name: 'Up Left', icon: 'up-left', type: 'up-left' },
  ]

  const appIcons = [
    { name: 'Adobe XD', icon: 'icons8-adobe-xd-50.svg?url', type: 'adobe-xd' },
    { name: 'App Store', icon: 'icons8-app-store-50.svg', type: 'app-store' },
    { name: 'App Store 2', icon: 'icons8-app-store-50-2.svg', type: 'app-store-2' },
    { name: 'Apps', icon: 'icons8-apps-50.svg', type: 'apps' },
    { name: 'Apps Tab', icon: 'icons8-apps-tab-50.svg', type: 'apps-tab' },
    { name: 'Apps Tab 2', icon: 'icons8-apps-tab-50-2.svg', type: 'apps-tab-2' },
    { name: 'BTS Logo', icon: 'icons8-bts-logo-50.svg', type: 'bts-logo' },
    { name: 'Ferrari', icon: 'icons8-ferrari-50.svg', type: 'ferrari' },
    { name: 'Ferrari 2', icon: 'icons8-ferrari-50-2.svg', type: 'ferrari-2' },
    { name: 'Gmail', icon: 'icons8-gmail-logo-50.svg', type: 'gmail' },
    { name: 'Google Calendar', icon: 'icons8-google-calendar-50.svg', type: 'google-calendar' },
    { name: 'Google Contacts', icon: 'icons8-google-contacts-50.svg', type: 'google-contacts' },
    { name: 'Google Contacts 2', icon: 'icons8-google-contacts-50-2.svg', type: 'google-contacts-2' },
    { name: 'Google Docs', icon: 'icons8-google-docs-50.svg', type: 'google-docs' },
    { name: 'Google Meet', icon: 'icons8-google-meet-50.svg', type: 'google-meet' },
    { name: 'Google Meet 2', icon: 'icons8-google-meet-50-2.svg', type: 'google-meet-2' },
    { name: 'Google Meet 3', icon: 'icons8-google-meet-50-3.svg', type: 'google-meet-3' },
    { name: 'Google Photos', icon: 'icons8-google-photos-50.svg', type: 'google-photos' },
    { name: 'Google Play', icon: 'icons8-google-play-50.svg', type: 'google-play' },
    { name: 'Google Plus', icon: 'icons8-google-plus-50.svg', type: 'google-plus' },
    { name: 'Minecraft', icon: 'icons8-minecraft-logo-50.svg', type: 'minecraft' },
    { name: 'Snapchat', icon: 'icons8-snapchat-squared-50.svg', type: 'snapchat' },
    { name: 'Steam', icon: 'icons8-steam-circled-50.svg', type: 'steam' },
    { name: 'Windows 10', icon: 'icons8-windows-10-50.svg', type: 'windows-10' },
    { name: 'YouTube', icon: 'icons8-youtube-logo-50.svg', type: 'youtube' },
    { name: 'YouTube 2', icon: 'icons8-youtube-logo-50-2.svg', type: 'youtube-2' },
    { name: 'YouTube 3', icon: 'icons8-youtube-logo-50-3.svg', type: 'youtube-3' },
  ]

  return (
    <>
      <div className="elements-panel-overlay" onClick={onClose} />
      <div className="elements-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Elements</h3>
          <button onClick={onClose}>×</button>
        </div>

        {/* Category Cards */}
        <div className="category-cards">
          <div
            className={`category-card ${expandedSections.shapes ? 'active' : ''}`}
            onClick={() => toggleSection('shapes')}
          >
            <img src={shapesImage} alt="Shapes" className="category-image" />
            <span className="category-name">Shapes</span>
          </div>

          <div
            className={`category-card ${expandedSections.buttons ? 'active' : ''}`}
            onClick={() => toggleSection('buttons')}
          >
            <img src={buttonsImage} alt="Buttons" className="category-image" />
            <span className="category-name">Buttons</span>
          </div>

          <div
            className={`category-card ${expandedSections.graphics ? 'active' : ''}`}
            onClick={() => toggleSection('graphics')}
          >
            <img src={graphicsImage} alt="Graphics" className="category-image" />
            <span className="category-name">Graphics</span>
          </div>
        </div>

        {/* Shapes Section (with nested Arrows) */}
        {expandedSections.shapes && (
          <div className="panel-section">
            {/* Shapes Subsection */}
            <div className="subsection-container">
              <div className="subsection-header-with-button">
                <h4>Shapes</h4>
                <button 
                  className="go-to-btn"
                  onClick={() => toggleCategory('shapes')}
                >
                  {expandedCategories.shapes ? 'Show Less' : 'Go To'}
                </button>
              </div>
              <div className={`shape-grid ${expandedCategories.shapes ? 'expanded' : ''}`}>
                {(expandedCategories.shapes ? shapes : shapes.slice(0, 3)).map(shape => (
                  <div
                    key={`shape-${shape.type}`}
                    className="shape-grid-item"
                    onClick={() => {
                      onAddShape(shape.type)
                      onClose()
                    }}
                    title={shape.name}
                  >
                    <span className="shape-grid-icon">{shape.icon}</span>
                    <span className="shape-grid-name">{shape.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows Subsection inside Shapes */}
            <div className="subsection-container">
              <div className="subsection-header-with-button">
                <h5>Arrows</h5>
                <button 
                  className="go-to-btn"
                  onClick={() => toggleCategory('arrows')}
                >
                  {expandedCategories.arrows ? 'Show Less' : 'Go To'}
                </button>
              </div>
              <div className={`shape-grid ${expandedCategories.arrows ? 'expanded' : ''}`}>
                {(expandedCategories.arrows ? arrows : arrows.slice(0, 3)).map(arrow => (
                  <div
                    key={`arrow-${arrow.type}`}
                    className="shape-grid-item"
                    onClick={() => {
                      onAddArrow(arrow.type)
                      onClose()
                    }}
                    title={arrow.name}
                  >
                    <span className="arrow-grid-icon">
                      <img src={arrowSVGs[arrow.icon]} alt={arrow.name} width="24" height="24" />
                    </span>
                    <span className="shape-grid-name">{arrow.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons Section */}
        {expandedSections.buttons && (
          <div className="panel-section">
            <div className="subsection-container">
              <div className="subsection-header-with-button">
                <h4>Buttons</h4>
                <button
                  className="go-to-btn"
                  onClick={() => toggleCategory('buttons')}
                >
                  {expandedCategories.buttons ? 'Show Less' : 'Go To'}
                </button>
              </div>
              <div className={`shape-grid ${expandedCategories.buttons ? 'expanded' : ''}`}>
                {(expandedCategories.buttons ? buttons : buttons.slice(0, 3)).map(button => (
                  <div
                    key={`button-${button.type}`}
                    className="shape-grid-item"
                    onClick={() => {
                      onAddButton(button.type)
                      onClose()
                    }}
                    title={button.name}
                  >
                    <span className="button-grid-icon">{button.icon}</span>
                    <span className="shape-grid-name">{button.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Graphics Section */}
        {expandedSections.graphics && (
          <div className="panel-section">
            <div className="subsection-container">
              <div className="subsection-header-with-button">
                <h4>App Icons</h4>
                <button
                  className="go-to-btn"
                  onClick={() => toggleCategory('appIcons')}
                >
                  {expandedCategories.appIcons ? 'Show Less' : 'Go To'}
                </button>
              </div>
              <div className={`shape-grid ${expandedCategories.appIcons ? 'expanded' : ''}`}>
                {(expandedCategories.appIcons ? appIcons : appIcons.slice(0, 3)).map(icon => (
                  <div
                    key={`icon-${icon.type}`}
                    className="shape-grid-item"
                    onClick={() => {
                      onAddGraphic(`../graphics/App Icons/${icon.icon}`)
                      onClose()
                    }}
                    title={icon.name}
                  >
                    <span className="icon-grid-icon">
                      <img src={`../graphics/App Icons/${icon.icon}`} alt={icon.name} width="32" height="32" />
                    </span>
                    <span className="shape-grid-name">{icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
