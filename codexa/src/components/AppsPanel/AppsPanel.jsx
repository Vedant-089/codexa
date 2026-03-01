import { Sparkles, X, Layout } from 'lucide-react'
import './AppsPanel.css'

export function AppsPanel({ isOpen, onClose, onOpenAIDesigner }) {
    if (!isOpen) return null

    return (
        <div className="apps-panel" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header">
                <div className="header-title">
                    <Layout size={20} />
                    <h3>Apps</h3>
                </div>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="panel-content">
                <div className="apps-grid">
                    <div className="app-card" onClick={onOpenAIDesigner}>
                        <div className="app-icon ai">
                            <Sparkles size={24} />
                        </div>
                        <span className="app-name">AI Designer</span>
                        <p className="app-desc">Smart multi-step design assistant.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
