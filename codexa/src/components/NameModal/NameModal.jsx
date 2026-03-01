import { useState, useEffect } from 'react'

export function NameModal({ isOpen, onSave, onClose, initialValue = '' }) {
  const [name, setName] = useState(initialValue)

  useEffect(() => {
    if (isOpen) {
      setName(initialValue)
    }
  }, [initialValue, isOpen])

  if (!isOpen) return null

  const handleSave = () => {
    if (name.trim()) {
      onSave(name)
      setName('')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Name this Screen</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Give your new screen a descriptive name.</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Home Screen, Settings..."
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') onClose()
          }}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-primary)',
            fontSize: '1rem',
            marginBottom: '20px'
          }}
        />
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border)'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: 'var(--primary)',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '6px',
              fontWeight: '600'
            }}
          >
            Create Screen
          </button>
        </div>
      </div>
    </div>
  )
}
