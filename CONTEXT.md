# Harmonia - The Compatibility Engine
## Project Documentation & Context

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Deployment (Render.com)](#deployment-rendercom)
3. [File Structure](#file-structure)
4. [WebGL System](#webgl-system)
5. [CSS Architecture](#css-architecture)
6. [JavaScript Modules](#javascript-modules)
7. [HTML Structure](#html-structure)
8. [Design System](#design-system)
9. [Animation System](#animation-system)
10. [Page System](#page-system)
11. [Responsive Design](#responsive-design)
12. [Dark Mode Implementation](#dark-mode-implementation)
13. [Dependencies](#dependencies)
14. [Browser Compatibility](#browser-compatibility)

---

## 🎯 Project Overview

**Harmonia** is a sophisticated, single-page web application serving as the marketing and demonstration platform for a compatibility engine designed for dating platforms. The application combines:
- Visual attraction analysis
- Psychological compatibility matching
- Genetic chemistry profiling

### Core Philosophy
The tagline encapsulates the product's mission: *"They designed addiction. We designed compatibility."* This positions Harmonia as an ethical alternative to engagement-maximizing dating apps.

### Technical Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Pure CSS with CSS Custom Properties (CSS Variables)
- **Animations**: CSS Keyframe animations + JavaScript-driven SVG animations
- **WebGL**: Custom particle system + neural network shader background
- **Server**: Node.js with Express (for Render.com deployment)
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans)

---

## 🚀 Deployment (Render.com)

### Quick Deploy

1. **Push to GitHub** (or GitLab/Bitbucket)
2. **Connect to Render.com**:
   - Create a new "Web Service"
   - Connect your repository
   - Render auto-detects the `render.yaml` configuration

### Manual Configuration

If not using `render.yaml`:
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/`

### Files for Deployment

| File | Purpose |
|------|---------|
| `package.json` | Node.js dependencies & scripts |
| `server.js` | Express server configuration |
| `render.yaml` | Render.com deployment config |
| `public/` | Static files served by Express |

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port (Render sets this automatically) |
| `NODE_ENV` | production | Environment mode |

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Server runs at http://localhost:3000
```

### Server Features

- **Compression**: Gzip enabled for all responses
- **Security Headers**: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Static Caching**: 1-day cache for static assets
- **SPA Support**: All routes serve `index.html`

---

## 📁 File Structure

```
harmonia-separated/
├── package.json            # Node.js configuration
├── server.js               # Express server
├── render.yaml             # Render.com deployment config
├── CONTEXT.md              # This documentation
├── public/                 # Static files (served by Express)
│   ├── index.html          # Main HTML entry point
│   ├── css/
│   │   └── main.css        # Complete stylesheet (~6,200 lines)
│   └── js/
│       ├── logo.js         # Logo SVG data and initialization
│       ├── navigation.js   # Page navigation, routing, mobile menu
│       ├── sliders.js      # Science cards & team sliders
│       ├── partnerships.js # Dynamic tier system
│       ├── animations.js   # SVG card animations
│       └── webgl.js        # WebGL particle system & shaders
└── (development files)
    ├── body_content.html   # Extracted HTML body (reference)
    └── original.html       # Original monolithic file (reference)
```

---

## 🎮 WebGL System

The application features a custom WebGL implementation providing real-time visual effects.

### Components

#### 1. Neural Network Background (`NeuralBackground` class)
- **Location**: Hero section background
- **Canvas ID**: `#webgl-hero`
- **Effects**: 
  - Animated neural network nodes
  - Connection lines with pulse animation
  - Simplex noise texture overlay
  - Theme-aware color adaptation

#### 2. Particle System (`ParticleSystem` class)
- **Location**: Global overlay
- **Canvas ID**: `#webgl-particles`
- **Effects**:
  - 80 floating particles
  - Gold/maroon color scheme (theme-aware)
  - Soft circular particles with glow
  - Wave motion animation

### Shader Architecture

```
public/js/webgl.js
├── WebGLUtils              # Utility functions
├── PARTICLE_VERTEX_SHADER  # Particle positioning
├── PARTICLE_FRAGMENT_SHADER # Circular particle rendering
├── NEURAL_VERTEX_SHADER    # Fullscreen quad
├── NEURAL_FRAGMENT_SHADER  # Neural network visualization
├── DNA_VERTEX_SHADER       # (Reserved for genetic section)
├── DNA_FRAGMENT_SHADER     # (Reserved for genetic section)
├── ParticleSystem          # Particle management class
├── NeuralBackground        # Neural shader class
└── HarmoniaWebGL           # Global manager
```

### Neural Network Shader Details

The neural network shader creates a procedurally animated background:

```glsl
// Key features:
// 1. 5x4 grid of animated nodes
// 2. Connecting lines with pulse effect
// 3. Simplex noise for organic texture
// 4. Vignette effect for depth
// 5. Dark/light mode color adaptation
```

### Particle System Details

```javascript
// Configuration options:
{
    particleCount: 80,        // Number of particles
    colorPrimary: [0.83, 0.66, 0.33],   // Gold RGB
    colorSecondary: [0.45, 0.18, 0.22], // Maroon RGB
    maxSize: 3,               // Max particle size in pixels
    minSize: 1,               // Min particle size
    speed: 0.3                // Movement speed
}
```

### Theme Integration

WebGL colors automatically update when theme changes:

```javascript
// Light mode
colorPrimary: [0.83, 0.66, 0.33]   // #D4A853 (Gold)
colorSecondary: [0.45, 0.18, 0.22] // #722F37 (Maroon)

// Dark mode
colorPrimary: [0.94, 0.78, 0.43]   // #F0C86E (Bright Gold)
colorSecondary: [0.55, 0.23, 0.27] // #8B3A45 (Light Maroon)
```

### Performance Optimizations

1. **Visibility API**: Animation pauses when tab is hidden
2. **Reduced Motion**: WebGL disabled if `prefers-reduced-motion` is set
3. **Graceful Fallback**: CSS-only mode if WebGL unavailable
4. **Efficient Rendering**: Single draw call for all particles

### CSS for WebGL

```css
#webgl-hero {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 0;
    pointer-events: none;
}

#webgl-particles {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    z-index: 1;
    pointer-events: none;
    opacity: 0.6;
}
```

---

## 🎨 CSS Architecture

### CSS Custom Properties (Design Tokens)

```css
:root {
    /* Light Mode - Warm Parchment Base */
    --cream: #FAF6F1;
    --blush: #F5EDE6;
    --rose: #EFE5DC;
    --card-bg: #F0E8DF;
    
    /* Accent Colors */
    --gold: #D4A853;
    --gold-light: rgba(212, 168, 83, 0.15);
    --gold-champagne: #E8C97A;
    --gold-rose: #D4A574;
    --maroon: #722F37;
    --maroon-deep: #5C1A1B;
    --maroon-light: rgba(114, 47, 55, 0.12);
    --wine: #8B3A3A;
    --wine-light: rgba(139, 58, 58, 0.15);
    
    /* Mediterranean Blues */
    --navy: #1E293B;
    --navy-med: #2C3E50;
    --slate: #475569;
    --blue-med: #3B5998;
    
    /* Dark Mode Surfaces - Wine Black */
    --dark-bg: #12090A;
    --dark-surface: #2D1A1C;
    --dark-border: #3D2426;
    --gray-light: #E8E0D8;
}
```

### Major CSS Sections

1. **Base & Reset** (Lines 1-130)
   - CSS reset
   - Typography defaults
   - iOS Safari fixes
   - Safe area insets

2. **Navigation** (Lines 128-430)
   - Fixed navbar with blur backdrop
   - Hamburger menu animation
   - Mobile overlay navigation
   - Theme toggle switch

3. **Hero Section** (Lines 422-750)
   - Grid-based layout
   - Animated radar chart background
   - Responsive tagline typography
   - Button group styling

4. **Science Cards/Slider** (Lines 1075-2200)
   - Horizontal scroll slider
   - Card animations (Eye, Personality, Genetic, Synthesis)
   - Complex SVG styling
   - Phase-based animation classes

5. **Partnerships Section** (Lines 3400-4700)
   - Dynamic tier system
   - Feature boxes
   - Modal styling
   - Form styling

6. **Team Section** (Lines 4700-5270)
   - Card grid layout
   - Cultural symbol SVG animations
   - Radar pulse effects

7. **Contact Section** (Lines 5267-5900)
   - Form validation states
   - Card selection system
   - Input group styling

8. **Footer** (Lines 671-740)
   - Multi-column layout
   - Dark mode variants

9. **Responsive Breakpoints** (Lines 738-end)
   - 1024px (tablet landscape)
   - 768px (tablet portrait)
   - 480px (mobile)
   - 375px (small mobile)

---

## ⚡ JavaScript Modules

### 1. logo.js
**Purpose**: Defines and injects the Harmonia logo throughout the application.

```javascript
// Key exports:
const HARMONIA_LOGO = 'data:image/png;base64,...'; // Base64 encoded PNG
function initHarmoniaLogos() { /* Injects logo to all [data-harmonia-logo] elements */ }
```

**Usage**: Any `<img data-harmonia-logo>` element automatically receives the logo.

---

### 2. navigation.js
**Purpose**: Handles SPA-style navigation and routing.

**Key Functions**:
- `toggleTheme()` - Switches between light/dark mode
- `toggleMobileNav()` - Opens/closes hamburger menu
- `showPage(pageName)` - Navigates to a page section
- History API integration for back/forward buttons

**Event Listeners**:
- `popstate` for browser navigation
- DOMContentLoaded for initial setup

---

### 3. sliders.js
**Purpose**: Touch-enabled horizontal sliders for cards.

**Features**:
- "Why Harmonia" science cards slider
- Team members slider
- Touch/swipe support
- Dot indicators
- Auto-scroll on card visibility

**Key State Objects**:
```javascript
// Science Slider
{
    track, container, cards, arrows,
    cardWidth, currentIndex, totalCards,
    touchStartX, touchCurrentX, isDragging
}

// Team Slider  
{
    slider, cards, dots,
    totalCards, currentIndex
}
```

---

### 4. partnerships.js
**Purpose**: Dynamic content system for partnership tiers.

**Tier Structure**:
```javascript
const tierData = {
    visual: {
        title: "Visual Intelligence",
        desc: "AI-powered image analysis...",
        bullets: [...],
        icon: `<svg>...</svg>`
    },
    personality: {...},
    genetic: {...}
}
```

**Features**:
- Click-to-expand modals
- Tier tab selection
- Dynamic icon rendering
- Form field population

---

### 5. animations.js
**Purpose**: Complex, multi-phase SVG animations for science cards.

**Animation Controllers**:

#### Visual Card (Eye Animation)
```javascript
visualEyeState = {
    card, upperLid, lowerLid,
    isOpen: false,
    animating: false,
    hasTriggeredOnce: false,
    hasTriggeredThisVisit: false
}
```
- Eyelid path morphing (SVG path `d` attribute animation)
- First-time: 3 second animation
- Subsequent: 1.5 second animation

#### Personality Card
```javascript
personalityState = {
    card, isOpen: false, animating: false,
    hasAnimatedOnce: false, timeouts: []
}
```
- Phase-based animation with 7 states
- Icon movement with scaling
- Circle expansion
- Text cascade reveal

#### Genetic Card
```javascript
geneticState = {
    card, isOpen: false, animating: false,
    hasAnimatedOnce: false, timeouts: []
}
```
- DNA helix formation animation
- Rung animation (horizontal lines)
- Color crackle effect

#### Synthesis Card
```javascript
synthesisState = {
    card, isOpen: false, animating: false,
    hasAnimatedOnce: false, timeouts: []
}
```
- Icons rush to center
- Impact flash + sparks (9 color-coded sparks)
- Fog/glow effect
- Logo spin and travel
- Text cascade reveal

**Global Animation Control**:
```javascript
let globalAnimationsPaused = false;
function toggleAllAnimations() { /* Pause/resume all card animations */ }
```

---

## 🏗 HTML Structure

### Page System
The application uses a single-page architecture with hidden/shown sections:

```html
<div class="page active" id="page-home">...</div>
<div class="page" id="page-why-harmonia">...</div>
<div class="page" id="page-partnerships">...</div>
<div class="page" id="page-team">...</div>
<div class="page" id="page-local-network">...</div>
<div class="page" id="page-p2p">...</div>
<div class="page" id="page-contact">...</div>
```

### Key HTML Components

1. **Navigation Bar**
   - Logo (clickable, returns to home)
   - Nav links (desktop)
   - Hamburger menu (mobile)
   - Theme toggle switch

2. **Hero Section**
   - Animated tagline with word reveals
   - Interactive radar chart (SVG)
   - CTA button group

3. **Science Cards** (Why Harmonia)
   - Visual Card (Eye animation)
   - Personality Card (Personality icon animation)
   - Genetic Card (DNA helix animation)
   - Synthesis Card (Logo fusion animation)

4. **Partnerships Section**
   - Tier selection tabs
   - Feature boxes with icons
   - Modal system
   - Contact form

5. **Team Section**
   - Profile cards with cultural symbols
   - Animated radar avatars
   - Founding story

6. **Footer**
   - Links
   - Copyright

---

## 🎨 Design System

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | Cormorant Garamond | 400-700 | clamp(2rem, 4vw, 3.8rem) |
| Body | DM Sans | 400-700 | 0.85rem - 1.15rem |
| Labels | DM Sans | 500-600 | 0.7rem - 0.9rem |
| Buttons | DM Sans | 500-600 | 0.85rem - 0.95rem |

### Color Palette

**Light Mode**:
- Background: #FAF6F1 (warm cream)
- Text: #1E293B (navy)
- Accent Primary: #722F37 (maroon)
- Accent Secondary: #D4A853 (gold)

**Dark Mode**:
- Background: #12090A (wine black)
- Text: #F5F0E8 (light cream)
- Accent Primary: #F0C86E (bright gold)
- Accent Secondary: #722F37 (maroon)

### Spacing Scale
- XS: 0.5rem
- SM: 1rem
- MD: 1.5rem
- LG: 2rem
- XL: 3rem
- XXL: 4rem

### Border Radius
- Cards: 4px - 8px
- Buttons: 4px
- Badges: 20px (pill)

---

## 🎬 Animation System

### CSS Keyframe Animations

```css
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInWord { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-20px, -20px) rotate(2deg); } }
@keyframes radarPulse { 0% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.05); opacity: 0.8; } 100% { transform: scale(1); opacity: 0.6; } }
@keyframes symbolRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes symbolPulse { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.08); opacity: 0.85; } }
```

### JavaScript-Driven SVG Animations

The science cards use JavaScript to animate SVG path `d` attributes for smooth morphing:

```javascript
// Example: Eye lid morphing
const closedY = { upper: [50, 35, 50], lower: [50, 65, 50] };
const openY = { upper: [40, 20, 40], lower: [70, 85, 70] };

function animate(now) {
    const t = easeInOutCubic(progress);
    upperLid.setAttribute('d', `M30 ${lerp(startY, endY, t)} Q50 ${...} 70 ${...}`);
    requestAnimationFrame(animate);
}
```

### Animation Timing

| Animation | First Time | Subsequent |
|-----------|------------|------------|
| Visual Eye | 3000ms | 1500ms |
| Personality | 4000ms | 2500ms |
| Genetic | 4000ms | 2500ms |
| Synthesis | 4000ms | 2500ms |

---

## 📱 Responsive Design

### Breakpoints

```css
/* Desktop (default) */
@media (max-width: 1024px) { /* Tablet landscape */ }
@media (min-width: 768px) and (max-width: 1024px) { /* Tablet portrait specific */ }
@media (max-width: 768px) { /* Mobile */ }
@media (max-width: 480px) { /* Small mobile */ }
@media (max-width: 375px) { /* Extra small mobile */ }
@media (max-height: 800px) { /* Short screens / laptops */ }
```

### Mobile-Specific Features
- Hamburger menu with full-screen overlay
- Touch-enabled sliders with swipe
- Larger tap targets (min 44px)
- iOS Safari 100vh fix
- Safe area insets for notched devices

---

## 🌙 Dark Mode Implementation

### Toggle Mechanism
```javascript
function toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
```

### CSS Variable Override
```css
[data-theme="dark"] {
    --cream: #12090A;
    --blush: #1A0F10;
    --card-bg: #2D1A1C;
    --navy: #F5F0E8;
    --slate: #C4B8B0;
    --gold: #F0C86E;
    --gold-champagne: #F5D98A;
    --gold-light: rgba(240, 200, 110, 0.2);
}
```

---

## 📦 Dependencies

### NPM Dependencies (package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4"
  }
}
```

### External Resources
- **Google Fonts**: Cormorant Garamond (400-700), DM Sans (400-700)
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  ```

### No Frontend Build Tools Required
- No Webpack, Vite, or other bundlers
- No CSS preprocessors (Sass/Less)
- No transpilation (Babel)
- Vanilla ES6+ JavaScript

---

## 🌐 Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### CSS Features Used
- CSS Custom Properties (variables)
- Flexbox
- CSS Grid
- `clamp()` for fluid typography
- `backdrop-filter: blur()` (with `-webkit-` prefix)
- `env()` for safe-area-inset
- `@keyframes` animations

### Mobile Support
- iOS Safari 13+
- Chrome for Android 80+
- Samsung Internet 12+

### Known Limitations
- `backdrop-filter` may not work in older Firefox
- Some SVG path animations may be choppy on low-end devices

---

## 🔧 Usage Instructions

### Development
1. Open `index.html` in a browser
2. For hot reloading, use a local server:
   ```bash
   python3 -m http.server 8000
   # or
   npx serve
   ```

### Customization
- **Colors**: Modify CSS variables in `:root` and `[data-theme="dark"]`
- **Content**: Update tier data in `partnerships.js`
- **Logo**: Replace Base64 string in `logo.js`

### Adding New Pages
1. Add navigation link in HTML
2. Add page section: `<div class="page" id="page-newpage">...</div>`
3. Add case in `showPage()` function
4. Add footer to new page section

---

## 📝 Version History

- **v32** (Current): Full separation of HTML/CSS/JS
- Original: Monolithic 8,553-line HTML file

---

## 🤝 Credits

**Harmonia Engine** © 2026

Built with care for authentic human connection.

---

*This documentation was generated to accompany the separated codebase. For questions or issues, refer to the original integrated file for comparison.*
