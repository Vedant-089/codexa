import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Plus, Check } from 'lucide-react'
import './ReferenceModal.css'

export function ReferenceModal({ isOpen, onClose, onConfirm, onGlobalUpload }) {
    const [backgrounds, setBackgrounds] = useState([])
    const [elements, setElements] = useState([])
    const bgInputRef = useRef(null)
    const elInputRef = useRef(null)

    if (!isOpen) return null

    const handleUpload = (e, type) => {
        const files = Array.from(e.target.files)
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const src = event.target.result
                    if (type === 'bg') {
                        setBackgrounds(prev => [...prev, src])
                    } else {
                        setElements(prev => [...prev, src])
                    }
                    if (onGlobalUpload) onGlobalUpload(src)
                }
                reader.readAsDataURL(file)
            }
        })
        e.target.value = ''
    }

    const removeImage = (index, type) => {
        if (type === 'bg') {
            setBackgrounds(prev => prev.filter((_, i) => i !== index))
        } else {
            setElements(prev => prev.filter((_, i) => i !== index))
        }
    }

    const handleDone = () => {
        onConfirm({ backgrounds, elements })
        onClose()
    }

    return (
        <div className="reference-modal-overlay">
            <div className="reference-modal" onClick={(e) => e.stopPropagation()}>
                <div className="ref-modal-header">
                    <h2>Reference Assets</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="ref-modal-content">
                    <section className="ref-section">
                        <div className="section-header">
                            <h3>Backgrounds</h3>
                            <span className="hint">Min 2 photos recommended for variety</span>
                        </div>
                        <div className="asset-grid">
                            {backgrounds.map((src, i) => (
                                <div key={i} className="asset-card">
                                    <img src={src} alt="bg" />
                                    <button className="remove-asset" onClick={() => removeImage(i, 'bg')}><X size={12} /></button>
                                </div>
                            ))}
                            <button className="add-asset-btn" onClick={() => bgInputRef.current?.click()}>
                                <Plus size={24} />
                                <span>Add BG</span>
                                <input type="file" ref={bgInputRef} onChange={(e) => handleUpload(e, 'bg')} multiple hidden accept="image/*" />
                            </button>
                        </div>
                    </section>

                    <section className="ref-section">
                        <div className="section-header">
                            <h3>Elements</h3>
                            <span className="hint">Reference elements or logos</span>
                        </div>
                        <div className="asset-grid">
                            {elements.map((src, i) => (
                                <div key={i} className="asset-card">
                                    <img src={src} alt="el" />
                                    <button className="remove-asset" onClick={() => removeImage(i, 'el')}><X size={12} /></button>
                                </div>
                            ))}
                            <button className="add-asset-btn" onClick={() => elInputRef.current?.click()}>
                                <Plus size={24} />
                                <span>Add Item</span>
                                <input type="file" ref={elInputRef} onChange={(e) => handleUpload(e, 'el')} multiple hidden accept="image/*" />
                            </button>
                        </div>
                    </section>
                </div>

                <div className="ref-modal-footer">
                    <button className="done-btn" onClick={handleDone}>
                        <Check size={18} />
                        <span>Done</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
