// Navigation with History API
const validPages = ['home', 'why-harmonia', 'partnerships', 'team', 'local-network', 'p2p', 'contact'];
let currentPage = null;

function showPage(pageId, updateHistory = true) {
    // Validate pageId - fallback to home if invalid
    if (!validPages.includes(pageId)) {
        pageId = 'home';
    }

    // Close mobile nav if open
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    if (navLinks) navLinks.classList.remove('mobile-open');
    if (hamburger) hamburger.classList.remove('active');

    // Update pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
    
    const nav = document.getElementById('nav-' + pageId);
    if (nav) nav.classList.add('active');
    
    // Scroll to top
    window.scrollTo(0, 0);

    // Update browser history (only if page actually changed)
    if (updateHistory && pageId !== currentPage) {
        try {
            const hash = pageId === 'home' ? '' : '#' + pageId;
            history.pushState({ page: pageId }, '', window.location.pathname + hash);
        } catch (e) {
            // History API not available (e.g., sandboxed iframe)
        }
    }

    // Track current page
    currentPage = pageId;

    // Reset card animations when leaving Why Harmonia
    if (pageId !== 'why-harmonia') {
        if (window.resetVisualCardAnimation) {
            window.resetVisualCardAnimation();
        }
        if (window.resetPersonalityCardAnimation) {
            window.resetPersonalityCardAnimation();
        }
    }

    // On tablet, center on Joles when team page is shown
    if (pageId === 'team') {
        setTimeout(() => {
            const w = window.innerWidth;
            if (w >= 768 && w <= 1024) {
                const slider = document.getElementById('teamSlider');
                const cards = slider ? slider.querySelectorAll('.team-card') : [];
                if (slider && cards[3]) {
                    const card = cards[3];
                    const sliderWidth = slider.offsetWidth;
                    const cardLeft = card.offsetLeft;
                    const cardWidth = card.offsetWidth;
                    slider.scrollLeft = cardLeft - (sliderWidth / 2) + (cardWidth / 2);
                }
            }
        }, 50);
    }
}

// Handle browser back/forward buttons
window.onpopstate = function(event) {
    if (event.state && event.state.page) {
        showPage(event.state.page, false);
    } else {
        // No state = initial page load or home
        const hash = window.location.hash.slice(1);
        showPage(hash || 'home', false);
    }
};

// Initialize page from URL hash on load
function initFromHash() {
    const hash = window.location.hash.slice(1);
    const initialPage = validPages.includes(hash) ? hash : 'home';
    
    // Set initial history state
    try {
        history.replaceState({ page: initialPage }, '', window.location.pathname + (initialPage === 'home' ? '' : '#' + initialPage));
    } catch (e) {
        // History API not available (e.g., sandboxed iframe)
    }
    
    // Show the page without pushing new history
    showPage(initialPage, false);
}

// Home radar animation
const statusTexts = ['SYNTHESIZING...', 'ANALYZING HLA...', 'CHECKING RESONANCE...', 'CALCULATING...', 'MATCHING...'];
