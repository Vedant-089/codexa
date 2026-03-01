import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function exportToCode(pages) {
    const zip = new JSZip();
    const assetsFolder = zip.folder("assets");

    // Track unique assets to avoid duplicates
    const assetMap = new Map();
    let assetCounter = 0;

    const getAssetPath = (src) => {
        if (!src || !src.startsWith('data:')) return src; // Not a base64 asset
        if (assetMap.has(src)) return assetMap.get(src);

        const fileName = `asset_${assetCounter++}.${src.split(';')[0].split('/')[1]}`;
        const data = src.split(',')[1];
        assetsFolder.file(fileName, data, { base64: true });

        const path = `./assets/${fileName}`;
        assetMap.set(src, path);
        return path;
    };

    // 1. Generate Global CSS (Animations & General)
    const globalCSS = `
/* Codexa Generated Layouts */
:root {
    --primary: #8b5cf6;
}

body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    color: #fff;
    background: #000;
}

.presentation-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111;
}

.page {
    width: 960px;
    height: 640px;
    position: relative;
    overflow: hidden;
    display: none;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}

.page.active {
    display: block;
}

/* Base Elements */
.element {
    position: absolute;
    box-sizing: border-box;
}

.text-element { font-family: inherit; }
.shape-element svg { width: 100%; height: 100%; }

/* Navigation */
.nav-controls {
    position: fixed;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 12px;
    z-index: 9999;
}

.nav-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    backdrop-filter: blur(10px);
}

/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInTop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInBottom { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes zoomIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
@keyframes zoomOut { from { opacity: 0; transform: scale(1.5); } to { opacity: 1; transform: scale(1); } }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes elastic { 0% { transform: scale(0); } 45% { transform: scale(1.1); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
@keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }

.animated {
    animation-fill-mode: both;
}
`;
    zip.file("style.css", globalCSS);

    // 2. Generate Pages HTML
    let pagesHTML = '';
    const uniqueIcons = new Set();

    pages.forEach((page, index) => {
        const bgStyle = page.bgType === 'image'
            ? `background-image: url('${getAssetPath(page.bgImage)}'); background-size: cover; background-position: center;`
            : page.bgType === 'solid'
                ? `background-color: ${page.bgColors[0] || '#fff'};`
                : `background: linear-gradient(135deg, ${page.bgColors[0]}, ${page.bgColors[1]});`;

        let elementsHTML = '';
        page.elements.forEach((el) => {
            const isClickable = !!el.onPressPage;
            const commonStyle = `left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; opacity: ${el.opacity ?? 1}; ${el.animation && el.animation !== 'none' ? `animation: ${el.animation} ${el.animationDuration || 0.8}s ease ${el.animationDelay || 0}s both;` : ''} ${isClickable ? 'cursor: pointer;' : ''}`;
            const clickAttr = isClickable ? `onclick="navigateToPage('${el.onPressPage}')"` : '';

            if (el.type === 'text') {
                elementsHTML += `
            <div class="element text-element" ${clickAttr} style="${commonStyle} font-size: ${el.fontSize}px; color: ${el.color}; text-align: ${el.textAlign || 'left'}; font-weight: ${el.fontWeight || 'normal'}; letter-spacing: ${el.letterSpacing || 'normal'}; line-height: ${el.lineHeight || '1.2'}; text-shadow: ${el.textShadow || 'none'}; backdrop-filter: ${el.backdropFilter || 'none'}; display: flex; align-items: center; justify-content: ${el.textAlign === 'center' ? 'center' : (el.textAlign === 'right' ? 'flex-end' : 'flex-start')};">
                ${el.content}
            </div>`;
            } else if (el.type === 'shape') {
                elementsHTML += `
            <div class="element shape-element" ${clickAttr} style="${commonStyle} border-radius: ${el.borderRadius || (el.shapeType === 'pill' ? el.height / 2 : 0)}px; box-shadow: ${el.boxShadow || 'none'}; backdrop-filter: ${el.backdropFilter || 'none'}; overflow: visible;">
                ${renderShapeToHTML(el)}
            </div>`;
            } else if (el.type === 'graphic') {
                elementsHTML += `
            <div class="element graphic-element" ${clickAttr} style="${commonStyle}">
                <img src="${getAssetPath(el.iconPath)}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>`;
            }
        });

        pagesHTML += `
        <!-- ${page.name} -->
        <div class="page ${index === 0 ? 'active' : ''}" id="page-${page.id}" style="${bgStyle}">
            ${elementsHTML}
        </div>`;
    });

    const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Codexa Project</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="presentation-container">
        ${pagesHTML}
    </div>

    <div class="nav-controls">
        <button class="nav-btn" onclick="prevPage()">PREV</button>
        <button class="nav-btn" onclick="nextPage()">NEXT</button>
    </div>

    <script>
        let pages = Array.from(document.querySelectorAll('.page'));
        let current = 0;

        function showPage(index) {
            pages.forEach((p, i) => {
                p.classList.toggle('active', i === index);
                // Reset animations by re-triggering them
                if (i === index) {
                    const elements = p.querySelectorAll('.element');
                    elements.forEach(el => {
                        const style = el.getAttribute('style');
                        el.setAttribute('style', style);
                    });
                }
            });
        }

        function navigateToPage(pageId) {
            const index = pages.findIndex(p => p.id === 'page-' + pageId);
            if (index !== -1) {
                current = index;
                showPage(current);
            }
        }

        function nextPage() {
            current = (current + 1) % pages.length;
            showPage(current);
        }

        function prevPage() {
            current = (current - 1 + pages.length) % pages.length;
            showPage(current);
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') nextPage();
            if (e.key === 'ArrowLeft') prevPage();
        });
    </script>
</body>
</html>
`;
    zip.file("index.html", indexHTML);

    // 3. Finalize and Save
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "codexa_project.zip");
}

function renderShapeToHTML(el) {
    const { shapeType, width, height, borderColor, borderWidth, isButton, fillType, fillColors, color, text, fontSize, fontWeight, textColor } = el;
    const bw = borderWidth || 2;
    const buttonText = text || '';
    const fillColor = fillType === 'gradient' ? `url(#grad-${el.id})` : (fillColors?.[0] || color || '#ffffff');
    const gradColor1 = fillColors?.[0] || '#ffffff';
    const gradColor2 = fillColors?.[1] || '#ffffff';
    const gradientDef = fillType === 'gradient' ? `
    <defs>
        <linearGradient id="grad-${el.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${gradColor1}" />
            <stop offset="100%" stop-color="${gradColor2}" />
        </linearGradient>
    </defs>` : '';

    let shapeSVG = '';
    const textSVG = isButton ? `
    <text x="${width / 2}" y="${height / 2 + 5}" text-anchor="middle" font-size="${fontSize || 12}" fill="${textColor || 'white'}" font-family="Arial" font-weight="${fontWeight || '500'}">
        ${buttonText}
    </text>` : '';

    switch (shapeType) {
        case 'circle':
            shapeSVG = `<circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2 - bw / 2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'square':
        case 'rectangle':
            shapeSVG = `<rect x="${bw / 2}" y="${bw / 2}" width="${width - bw}" height="${height - bw}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'pill':
            shapeSVG = `<rect x="${bw / 2}" y="${bw / 2}" width="${width - bw}" height="${height - bw}" rx="${height / 2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'rounded-square':
            shapeSVG = `<rect x="${bw / 2}" y="${bw / 2}" width="${width - bw}" height="${height - bw}" rx="${Math.min(width, height) * 0.15}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'oval':
            shapeSVG = `<ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2 - bw / 2}" ry="${height / 2 - bw / 2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'diamond':
            shapeSVG = `<polygon points="${width / 2},${bw / 2} ${width - bw / 2},${height / 2} ${width / 2},${height - bw / 2} ${bw / 2},${height / 2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'triangle':
            shapeSVG = `<polygon points="${width / 2},${bw / 2} ${width - bw / 2},${height - bw / 2} ${bw / 2},${height - bw / 2}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        case 'star': {
            const cx = width / 2; const cy = height / 2; const outerR = Math.min(width, height) / 2 - bw; const innerR = outerR * 0.5;
            let starPoints = '';
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI / 5) * i - Math.PI / 2; const r = i % 2 === 0 ? outerR : innerR;
                starPoints += `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)} `;
            }
            shapeSVG = `<polygon points="${starPoints}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        }
        case 'button':
            shapeSVG = `<rect x="${bw / 2}" y="${bw / 2}" width="${width - bw}" height="${height - bw}" rx="${height / 4}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
            break;
        default:
            shapeSVG = `<rect x="${bw / 2}" y="${bw / 2}" width="${width - bw}" height="${height - bw}" fill="${fillColor}" stroke="${borderColor}" stroke-width="${bw}" />`;
    }

    return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow: visible;">
        ${gradientDef}
        ${shapeSVG}
        ${textSVG}
    </svg>`;
}
