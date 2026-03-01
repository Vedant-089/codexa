import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Layout, Image as ImageIcon, ArrowRight, Loader2, CheckCircle, Wand, Upload } from 'lucide-react'
import './AIDesigner.css'

const STEPS = [
    { id: 'ASSETS', label: 'Reference' },
    { id: 'STYLE', label: 'Style' },
    { id: 'PROMPT', label: 'Concept' },
    { id: 'DESIGN', label: 'Creation' }
]

export function AIDesigner({ isOpen, onClose, pages, setPages, onUpload }) {
    const [phase, setPhase] = useState('ASSETS')
    const [bgs, setBgs] = useState([])
    const [els, setEls] = useState([])
    const [analysis, setAnalysis] = useState('')
    const [prompt, setPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const bgInputRef = useRef(null)
    const elInputRef = useRef(null)

    useEffect(() => {
        let timer
        if (cooldown > 0) {
            timer = setInterval(() => setCooldown(c => c - 1), 1000)
        }
        return () => clearInterval(timer)
    }, [cooldown])

    if (!isOpen) return null

    const handleFile = (e, type) => {
        const files = Array.from(e.target.files)
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = (ev) => {
                const src = ev.target.result
                if (type === 'bg') setBgs(prev => [...prev, src])
                else setEls(prev => [...prev, src])
                onUpload(src)
            }
            reader.readAsDataURL(file)
        })
    }

    const startAnalysis = async () => {
        setIsLoading(true)
        setPhase('ANALYZING')

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) throw new Error('API Key missing')

            // We send images to Gemini for a deep visual audit
            const stylePrompt = `Perform a comprehensive UI/UX audit of these reference images. 
            Background Analysis: Identify 'Safe Zones' (empty/blurred areas) for text placement. For each background, specify if text should be LEFT, RIGHT, or CENTERED based on the image subject.
            Color Palette: Extract a JSON-like list of exactly 5 hex codes: [Primary, Secondary, Accent, Background_Base, Text_Contrast].
            Vibe: Describe the required font weight and button styling (e.g., 'Sharp/Hard' vs 'Soft/Rounded').
            
            Format your response as a "Visual Strategy Report" that a designer can follow blindly.`

            const imageParts = [
                ...bgs.map(src => ({ inlineData: { mimeType: "image/jpeg", data: src.split(',')[1] } })),
                ...els.map(src => ({ inlineData: { mimeType: "image/jpeg", data: src.split(',')[1] } }))
            ]

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: stylePrompt }, ...imageParts] }]
                })
            })

            const data = await response.json()
            const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Professional design logic initialized."
            setAnalysis(resultText)
            setPhase('ANALYSIS_RESULT')
        } catch (err) {
            setAnalysis("Ready to design based on your vision.")
            setPhase('ANALYSIS_RESULT')
        } finally {
            setIsLoading(false)
        }
    }

    const [error, setError] = useState(null)

    const generateDesign = async () => {
        setIsLoading(true)
        setPhase('GENERATING')
        setError(null)

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            const systemPrompt = getSystemPrompt(analysis)

            const imageParts = [
                ...bgs.map(src => ({ inlineData: { mimeType: "image/jpeg", data: src.split(',')[1] } })),
                ...els.map(src => ({ inlineData: { mimeType: "image/jpeg", data: src.split(',')[1] } }))
            ]

            const requestParts = [{ text: `User Prompt: ${prompt}\n\nStyle Analysis to follow: ${analysis}` }]
            if (imageParts.length > 0) {
                requestParts.push(...imageParts)
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: requestParts }],
                    systemInstruction: { parts: [{ text: systemPrompt }] }
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error?.message || `API Error: ${response.status}`)
            }

            const data = await response.json()
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

            if (!aiResponse) throw new Error('AI returned an empty response (possibly safety filtered).')

            // Robust JSON extraction
            const firstBrace = aiResponse.indexOf('{')
            const lastBrace = aiResponse.lastIndexOf('}')
            if (firstBrace === -1 || lastBrace === -1) {
                throw new Error('AI failed to return valid design data.')
            }
            const cleanedJson = aiResponse.substring(firstBrace, lastBrace + 1)
            let designData
            try {
                designData = JSON.parse(cleanedJson)
            } catch (e) {
                console.log('Failed to parse JSON:', cleanedJson)
                throw new Error('Design data was malformed. Please try again.')
            }

            if (designData && designData.pages) {
                const timestamp = Date.now()
                const newPages = designData.pages.map((page, pIdx) => {
                    let bgImg = page.bgImage
                    if (page.bgType === 'image' && bgImg?.startsWith('USER_BG_')) {
                        const idx = parseInt(bgImg.split('_')[2])
                        if (bgs[idx]) bgImg = bgs[idx]
                    }

                    return {
                        id: timestamp + pIdx,
                        name: page.name || `Page ${pIdx + 1}`,
                        bgType: page.bgType || 'solid',
                        bgColors: page.bgColors || ['#ffffff'],
                        bgImage: bgImg,
                        elements: (page.elements || []).map((el, eIdx) => {
                            const isText = el.type === 'text'
                            const isShape = el.type === 'shape'
                            const isGraphic = el.type === 'graphic'

                            let finalEl = {
                                id: timestamp + (pIdx + 1) * 100 + eIdx,
                                x: 0, y: 0,
                                width: isText ? 400 : (isShape ? 240 : 120),
                                height: isText ? 60 : (isShape ? 56 : 120),
                                animation: 'none',
                                animationDelay: 0,
                                animationDuration: 0.8,
                                opacity: 1,
                                borderRadius: 0,
                                fontWeight: '400',
                                fontSize: isText ? 18 : 14,
                                textAlign: 'left',
                                letterSpacing: 'normal',
                                lineHeight: '1.2',
                                ...el
                            }

                            // Keep elements within canvas (960x640)
                            finalEl.x = Math.max(0, Math.min(finalEl.x, 900))
                            finalEl.y = Math.max(0, Math.min(finalEl.y, 600))

                            if (isGraphic && el.iconPath?.startsWith('USER_EL_')) {
                                const idx = parseInt(el.iconPath.split('_')[2]) || 0
                                if (els[idx]) finalEl.iconPath = els[idx]
                            }
                            return finalEl
                        })
                    }
                })
                setPages(newPages)
                setPhase('SUCCESS')
            } else {
                throw new Error('Incomplete design data received.')
            }
        } catch (err) {
            console.error('AI Generation Error:', err)
            setError(err.message)
            setPhase('PROMPT') // Go back on error
        } finally {
            setIsLoading(false)
            setCooldown(60) // Enforce 60s cooldown for Gemini 2.0 Flash Free Tier
        }
    }

    const getCurrentStepIndex = () => {
        if (phase === 'ASSETS') return 0
        if (phase === 'ANALYZING' || phase === 'ANALYSIS_RESULT') return 1
        if (phase === 'PROMPT') return 2
        return 3
    }

    return (
        <div className="ai-designer-overlay" onClick={onClose}>
            <div className="ai-designer-modal" onClick={e => e.stopPropagation()}>
                <div className="ai-modal-header">
                    <h2><Sparkles size={24} /> AI Creative Studio</h2>
                    <button className="close-modal-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="ai-modal-content">
                    <div className="ai-steps-container">
                        <div className="ai-steps">
                            {STEPS.map((s, i) => (
                                <div key={s.id} className={`step-item ${getCurrentStepIndex() === i ? 'active' : ''} ${getCurrentStepIndex() > i ? 'completed' : ''}`}>
                                    <span className="step-label">{s.label}</span>
                                    <div className="step-pill" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {phase === 'ASSETS' && (
                        <div className="asset-phase">
                            <div className="asset-grid">
                                <div className="upload-card" onClick={() => bgInputRef.current?.click()}>
                                    <div className="upload-icon-wrapper"><ImageIcon size={32} /></div>
                                    <h3>Backgrounds</h3>
                                    <p>Select textures or scenes for the page base.</p>
                                    <div className="thumb-grid">
                                        {bgs.map((src, i) => <img key={i} src={src} className="asset-thumb" />)}
                                        <div className="asset-thumb empty"><Upload size={16} /></div>
                                    </div>
                                    <input type="file" ref={bgInputRef} hidden multiple onChange={e => handleFile(e, 'bg')} />
                                </div>
                                <div className="upload-card" onClick={() => elInputRef.current?.click()}>
                                    <div className="upload-icon-wrapper"><Layout size={32} /></div>
                                    <h3>Elements</h3>
                                    <p>Upload logos, icons, or decorative elements.</p>
                                    <div className="thumb-grid">
                                        {els.map((src, i) => <img key={i} src={src} className="asset-thumb" />)}
                                        <div className="asset-thumb empty"><Upload size={16} /></div>
                                    </div>
                                    <input type="file" ref={elInputRef} hidden multiple onChange={e => handleFile(e, 'el')} />
                                </div>
                            </div>
                            <div className="phase-actions">
                                {bgs.length === 0 && els.length === 0 ? (
                                    <button className="btn-primary" onClick={() => {
                                        setAnalysis("Clean minimal aesthetic with premium typography and balanced whitespace.")
                                        setPhase('ANALYSIS_RESULT')
                                    }}>
                                        Skip: Design with AI <Sparkles size={20} />
                                    </button>
                                ) : (
                                    <button className="btn-primary" onClick={startAnalysis} disabled={isLoading || cooldown > 0}>
                                        {cooldown > 0 ? `Wait ${cooldown}s...` : <>Next: Analyze Style <ArrowRight size={20} /></>}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {phase === 'ANALYZING' && (
                        <div className="analysis-phase">
                            <Loader2 size={48} className="spin" color="var(--primary)" />
                            <h2>Analyzing Visual Data...</h2>
                            <p>Gemini is extracting colors and contrast patterns from your assets.</p>
                        </div>
                    )}

                    {phase === 'ANALYSIS_RESULT' && (
                        <div className="prompt-phase">
                            <div className="style-card">
                                <h3><Wand size={20} /> Style Brief Detected</h3>
                                <p>{analysis}</p>
                            </div>
                            <div className="phase-actions">
                                <button className="btn-primary" onClick={() => setPhase('PROMPT')}>
                                    Looks Good: Define Concept <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === 'PROMPT' && (
                        <div className="prompt-phase">
                            {error && (
                                <div className="error-banner" style={{
                                    padding: '12px 16px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                    borderRadius: '12px',
                                    color: '#f87171',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <X size={16} /> {error}
                                </div>
                            )}
                            <p className="instruction-text">Now, describe your project. How many pages? What's the main call to action? The AI will use your Style Brief to build it.</p>
                            <div className="big-prompt-box">
                                <textarea
                                    placeholder="e.g., A 3-page landing page for a tech startup. Page 1: Hero with high contrast. Page 2: Features. Page 3: Pricing."
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="phase-actions">
                                <button className="btn-primary" disabled={!prompt.trim() || isLoading || cooldown > 0} onClick={generateDesign}>
                                    {cooldown > 0 ? `Wait ${cooldown}s...` : <>Generate Master Design <Sparkles size={20} /></>}
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === 'GENERATING' && (
                        <div className="analysis-phase">
                            <Loader2 size={48} className="spin" color="var(--primary)" />
                            <h2>Crafting your design...</h2>
                            <p>Executing your visual brief and mapping assets to the canvas.</p>
                        </div>
                    )}

                    {phase === 'SUCCESS' && (
                        <div className="analysis-phase">
                            <CheckCircle size={64} color="#10b981" />
                            <h2 style={{ marginTop: '20px' }}>Design Ready!</h2>
                            <p>Your design has been injected into the editor.</p>
                            <button className="btn-primary" style={{ background: '#10b981', marginTop: '30px' }} onClick={onClose}>
                                Start Editing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function getSystemPrompt(styleAnalysis) {
    return `You are a visionary UI/UX designer. Your goal is to convert the User Prompt into a SUPER PREMIUM design using the following Visual Strategy Report.

[CRITICAL VISUAL STRATEGY REPORT]
${styleAnalysis}

[DESIGN PHILOSOPHY: THE "SUPER" STANDARD]
- AESTHETICS: Use Rich Aesthetics. Vibrant colors, sleek dark modes, glassmorphism, and dynamic animations.
- TYPOGRAPHY: Headlines should use premium font-weights (700, 800) and letter-spacing (-0.02em to -0.05em). Body text at 400. Captions and tags at 500. Use 'Inter' or 'sans-serif'.
- LAYOUT: Use modern grids. Avoid placing elements in random spots. Use consistent 24px, 48px, or 64px gaps.
- COLORS: Use the provided palette but create DEPTH. Use gradients for buttons and shapes. Use transparency (rgba) for overlays.
- ANIMATIONS: Every element must have an animation. Use 'fadeInUp', 'zoomIn', 'elastic', 'float' for a high-end feel. Stagger 'animationDelay' (0, 0.2, 0.4, 0.6) for a cascading entrance.

JSON DESIGN SCHEMA:
{
  "pages": [
    {
      "name": "Page Title",
      "bgType": "solid" | "gradient" | "image",
      "bgColors": ["#hex", "#hex"],
      "bgImage": "USER_BG_0" (if background provided),
      "elements": [
        {
          "type": "text",
          "content": "Premium Copy (High-End Marketing Tone)",
          "textAlign": "center" | "left" | "right",
          "x": number, "y": number, "width": number, "height": number,
          "fontSize": number, "color": "#hex",
          "fontWeight": "400" | "500" | "600" | "700" | "800",
          "letterSpacing": "string" (e.g., "-0.02em"),
          "lineHeight": "string" (e.g., "1.2"),
          "animation": "fadeInUp" | "zoomIn" | "slideInLeft" | "slideInRight" | "elastic" | "float" | "pulse" | "bounceIn",
          "animationDuration": number (0.5 to 1.5),
          "animationDelay": number (0.0 to 2.0),
          "opacity": number (0 to 1),
          "textShadow": "string" (e.g., "0 4px 12px rgba(0,0,0,0.1)")
        },
        {
          "type": "shape",
          "shapeType": "pill" | "rectangle" | "circle" | "rounded-square" | "parallelogram",
          "isButton": boolean, "text": "Label",
          "x": number, "y": number, "width": number, "height": number,
          "fillType": "solid" | "gradient",
          "fillColors": ["#hex", "#hex"],
          "borderColor": "#hex", "borderWidth": number,
          "animation": "fadeInUp" | "zoomIn" | "slideInBottom" | "elastic" | "pulse",
          "animationDuration": number, "animationDelay": number,
          "borderRadius": number, "boxShadow": "string" (e.g., "0 10px 30px rgba(0,0,0,0.2)"),
          "backdropFilter": "string" (e.g., "blur(10px)")
        },
        {
          "type": "graphic",
          "iconPath": "USER_EL_0" (if provided),
          "x": number, "y": number, "width": number, "height": number,
          "animation": "fadeIn" | "float",
          "animationDuration": number, "animationDelay": number
        }
      ]
    }
  ]
}

PLACEMENT & DESIGN INTELLIGENCE RULES (THE PRECISION ENGINE):
1. CANVAS SPECS: 960x640. Center X is 480. Margins: 80px.
2. SIZING FORMULA (CRITICAL):
   - Text Width: width = (charLength * fontSize * 0.6). Never let text width exceed 800px.
   - Headline Height: ~fontSize * 1.5.
   - Body Height: ~fontSize * 2.5 (for wrapping).
   - Buttons: Width 220-280px, Height 54-60px.
3. ADAPTIVE LAYOUT PATTERNS:
   - CENTERED HERO: Headline at (X: 80, Y: 150, W: 800, H: 120), Subtitle below, Button at X: 360 (for 240w).
   - SPLIT SCREEN: If "Visual Report" says subject is LEFT, place text at X: 520, W: 360. If subject is RIGHT, place text at X: 80, W: 360.
   - FEATURE GRID: Y starting at 380. 3 items at X: 80, 360, 640. Width: 240 each.
4. SPACING: Stack elements with exactly 24px (tight) or 48px (loose) vertical gaps.
5. HIERARCHY:
   - H1: 56-72px, Weight 800.
   - H2: 32-40px, Weight 700.
   - Body: 16-18px, Weight 400.
   - Labels: 12-14px, Weight 600, Uppercase.
6. GRAPHICS: Logos/Icons should be 60x60 up to 120x120. Never distort.
7. COMPOSITION: Always balance the "Visual Report's" subject. If the image has a person on the right, the AI MUST move text to the left half (X: 80-440).`;
}
