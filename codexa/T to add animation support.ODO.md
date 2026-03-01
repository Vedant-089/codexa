# Animation Feature Implementation TODO

## Phase 1: Add Animation Section to EditPanel
- [ ] Add Animation section with animation options to EditPanel.jsx
- [ ] Add CSS for animation section styling in EditPanel.css

## Phase 2: Add Animation Property to Elements
- [ ] Update addTextElement function to include animation property
- [ ] Update addShape function to include animation property
- [ ] Update addButton function to include animation property
- [ ] Update addArrow function to include animation property
- [ ] Update addGraphic function to include animation property

## Phase 3: Add Preview Mode
- [ ] Add isPreview state to App.jsx
- [ ] Add Present button onClick handler
- [ ] Pass isPreview prop to Canvas component

## Phase 4: Apply Animations in Canvas
- [ ] Add animation CSS classes in Canvas.css
- [ ] Modify Canvas.jsx to apply animation classes based on element animation property
- [ ] Add animation delay for staggered effect in Canvas.jsx

## Phase 5: Update Element Components
- [ ] Update TextElement to support animation in preview mode
- [ ] Update ShapeElement to support animation in preview mode
- [ ] Update ArrowElement to support animation in preview mode
- [ ] Check for graphic element support

## Animation Options
- None (default)
- Fade In
- Slide In Left
- Slide In Right
- Slide In Top
- Slide In Bottom
- Zoom In
- Bounce
