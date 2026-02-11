import { useState } from 'react'
import './ContextMenu.css'

export function ContextMenu({ menu, type, pages, onBackgroundColor, onCopy, onDuplicate, onDelete, onPaste, onUnlock, onSelectButtonTarget, onNavigate, onEdit, onClose }) {
  if (!menu) return null

  const isButton = type === 'element' && menu.isButton
  const isLocked = type === 'element' && menu.element && menu.element.lockedWith

  const handleNavigate = () => {
    if (menu.element && menu.element.onPressPage && onNavigate) {
      const targetPageIndex = pages.findIndex(p => p.id === menu.element.onPressPage)
      if (targetPageIndex !== -1) {
        onNavigate(targetPageIndex)
      }
    }
  }

  return (
    <div
      className="context-menu"
      style={{ top: menu.y, left: menu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === 'page' && (
        <>
          <div onClick={() => onBackgroundColor(menu.index)}>Background Colour</div>
          <div onClick={() => onCopy(menu.index)}>Copy</div>
          <div onClick={() => onDelete(menu.index)}>Delete</div>
        </>
      )}
      {type === 'element' && (
        <>
          <div onClick={() => onEdit && onEdit(menu.elementId)}>Edit</div>
          <div onClick={() => onCopy(menu.elementId)}>Copy</div>
          <div onClick={() => onDuplicate(menu.elementId)}>Duplicate</div>
          <div onClick={() => onDelete(menu.elementId)}>Delete</div>
          <div onClick={() => onPaste(menu.elementId)}>Paste</div>
          {isLocked && <div onClick={() => onUnlock(menu.elementId)}>Unlock</div>}
          {isButton && menu.element && menu.element.onPressPage && (
            <div onClick={handleNavigate} className="context-navigate-button">
              Navigate
            </div>
          )}
        </>
      )}
    </div>
  )
}
