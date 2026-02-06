// =============================================
// GLOBAL ANIMATION PAUSE STATE
// =============================================
let globalAnimationsPaused = false;

// =============================================
// VISUAL CARD EYE ANIMATION
// =============================================
let visualEyeState = {
    card: null,
    upperLid: null,
    lowerLid: null,
    isOpen: false,
    animating: false,
    hasTriggeredOnce: false,  // Track if this is the first time ever
    hasTriggeredThisVisit: false  // Track if triggered during this page visit
};

function initVisualCardAnimation() {
    const card = document.querySelector('.science-card.visual-card');
    if (!card) return;

    visualEyeState.card = card;
    visualEyeState.upperLid = card.querySelector('.upper-lid');
    visualEyeState.lowerLid = card.querySelector('.lower-lid');
    
    // Set up scroll listener for Why Harmonia section
    const whySection = document.getElementById('page-why-harmonia');
    if (whySection) {
        let scrollHandler = () => {
            if (!visualEyeState.hasTriggeredThisVisit && visualEyeState.card) {
                // Check if Visual card is in view
                const rect = visualEyeState.card.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (inView) {
                    visualEyeState.hasTriggeredThisVisit = true;
                    window.triggerVisualCardAnimation(true);
                }
            }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        // Also check on page show
        whySection.addEventListener('transitionend', () => {
            if (whySection.classList.contains('active') && !visualEyeState.hasTriggeredThisVisit) {
                setTimeout(scrollHandler, 100);
            }
        });
    }
}

function triggerVisualCardAnimation(shouldOpen) {
    const { card, upperLid, lowerLid, isOpen, animating } = visualEyeState;
    const hasTriggeredOnce = visualEyeState.hasTriggeredOnce;
    
    if (!card || !upperLid || !lowerLid) return;
    if (globalAnimationsPaused) return; // Don't animate if paused
    if (shouldOpen === isOpen && !animating) return;

    visualEyeState.animating = true;

    // First time opening = 3 seconds, otherwise 1.5 seconds
    const isFirstTime = shouldOpen && !hasTriggeredOnce;
    const duration = isFirstTime ? 3000 : 1500;
    const durationCSS = isFirstTime ? '3s' : '1.5s';
    
    // Set CSS custom property for transitions
    card.style.setProperty('--eye-duration', durationCSS);

    // Closed: eyelids form an almond/circle shape (curves meeting at center)
    // Upper curves slightly up (control y=35), Lower curves slightly down (control y=65)
    const closedY = { 
        upper: [50, 35, 50],  // M30 50 Q50 35 70 50
        lower: [50, 65, 50]   // M35 50 Q50 65 65 50
    };
    
    // Open: eyelids separated wide to show pupil
    // Upper curves up (control y=20), Lower curves down (control y=85)
    const openY = { 
        upper: [40, 20, 40],  // M30 40 Q50 20 70 40
        lower: [70, 85, 70]   // M35 70 Q50 85 65 70
    };

    const startUpper = upperLid.getAttribute('d').match(/M\d+\s+(\d+)\s+Q\d+\s+(\d+)\s+\d+\s+(\d+)/);
    const startLower = lowerLid.getAttribute('d').match(/M\d+\s+(\d+)\s+Q\d+\s+(\d+)\s+\d+\s+(\d+)/);
    
    if (!startUpper || !startLower) return;

    const startUpperY = [parseFloat(startUpper[1]), parseFloat(startUpper[2]), parseFloat(startUpper[3])];
    const startLowerY = [parseFloat(startLower[1]), parseFloat(startLower[2]), parseFloat(startLower[3])];
    
    const targetUpperY = shouldOpen ? openY.upper : closedY.upper;
    const targetLowerY = shouldOpen ? openY.lower : closedY.lower;

    // Toggle CSS class for other transitions (position, opacity)
    if (shouldOpen) {
        card.classList.add('eye-open');
    } else {
        card.classList.remove('eye-open');
    }

    // Mark that we've triggered at least once
    if (isFirstTime) {
        visualEyeState.hasTriggeredOnce = true;
    }
    
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease in-out
        const t = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const uY1 = startUpperY[0] + (targetUpperY[0] - startUpperY[0]) * t;
        const uY2 = startUpperY[1] + (targetUpperY[1] - startUpperY[1]) * t;
        const uY3 = startUpperY[2] + (targetUpperY[2] - startUpperY[2]) * t;
        
        const lY1 = startLowerY[0] + (targetLowerY[0] - startLowerY[0]) * t;
        const lY2 = startLowerY[1] + (targetLowerY[1] - startLowerY[1]) * t;
        const lY3 = startLowerY[2] + (targetLowerY[2] - startLowerY[2]) * t;

        upperLid.setAttribute('d', `M30 ${uY1} Q50 ${uY2} 70 ${uY3}`);
        lowerLid.setAttribute('d', `M35 ${lY1} Q50 ${lY2} 65 ${lY3}`);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            visualEyeState.isOpen = shouldOpen;
            visualEyeState.animating = false;
        }
    }

    requestAnimationFrame(animate);
}

// Reset the trigger state when navigating away from Why Harmonia
// This resets the eye to closed state so it can animate again next visit
function resetVisualCardAnimation() {
    visualEyeState.hasTriggeredThisVisit = false;
    visualEyeState.isOpen = false;
    
    // Reset to closed state immediately (no animation)
    if (visualEyeState.upperLid && visualEyeState.lowerLid && visualEyeState.card) {
        visualEyeState.upperLid.setAttribute('d', 'M30 50 Q50 35 70 50');
        visualEyeState.lowerLid.setAttribute('d', 'M35 50 Q50 65 65 50');
        visualEyeState.card.classList.remove('eye-open');
    }
}

// Make it globally accessible
window.triggerVisualCardAnimation = triggerVisualCardAnimation;
window.resetVisualCardAnimation = resetVisualCardAnimation;

// =============================================
// PERSONALITY CARD ANIMATION
// =============================================
let personalityState = {
    card: null,
    isOpen: false,
    animating: false,
    hasAnimatedOnce: false,
    timeouts: []
};

function initPersonalityCardAnimation() {
    personalityState.card = document.querySelector('.science-card.personality-card');
}

function clearPersonalityTimeouts() {
    personalityState.timeouts.forEach(t => clearTimeout(t));
    personalityState.timeouts = [];
}

function triggerPersonalityCardAnimation(shouldOpen) {
    const { card, isOpen, animating, hasAnimatedOnce } = personalityState;
    
    if (!card) return;
    if (globalAnimationsPaused) return; // Don't animate if paused
    if (shouldOpen === isOpen && !animating) return;

    personalityState.animating = true;
    clearPersonalityTimeouts();

    // First time plays slower (5s), subsequent plays faster (3s)
    const isFirstTime = shouldOpen && !hasAnimatedOnce;
    const duration = isFirstTime ? 5000 : 3000;
    card.style.setProperty('--personality-duration', isFirstTime ? '5s' : '3s');

    if (shouldOpen) {
        if (isFirstTime) {
            personalityState.hasAnimatedOnce = true;
            card.classList.add('animated-once');
        }

        // Time multiplier: 1.0 for first run, 0.6 for subsequent
        const t = isFirstTime ? 1 : 0.6;

        // --- ANIMATION SEQUENCE ---
        
        // 1. Line 1 draws immediately -> Science Box appears
        card.classList.add('line-1-visible'); // Add synchronously to prevent flash
        personalityState.timeouts.push(setTimeout(() => card.classList.add('science-box-visible', 'science-box-glow'), 600 * t));
        personalityState.timeouts.push(setTimeout(() => card.classList.remove('science-box-glow'), 1200 * t));

        // 2. Line 2 draws -> Apps Box appears
        personalityState.timeouts.push(setTimeout(() => card.classList.add('line-2-visible'), 900 * t));
        personalityState.timeouts.push(setTimeout(() => card.classList.add('apps-box-visible', 'apps-box-glow'), 1500 * t));
        personalityState.timeouts.push(setTimeout(() => card.classList.remove('apps-box-glow'), 2100 * t));

        // 3. Line 3 draws -> Center Circle pops
        personalityState.timeouts.push(setTimeout(() => card.classList.add('line-3-visible'), 1800 * t));
        personalityState.timeouts.push(setTimeout(() => card.classList.add('center-visible'), 2400 * t));

        // 4. Outer arcs draw (mask animation) -> Harmonia Box glows
        personalityState.timeouts.push(setTimeout(() => card.classList.add('outer-circle-animating'), 2600 * t));
        
        // 5. Harmonia box appears with glow
        personalityState.timeouts.push(setTimeout(() => card.classList.add('harmonia-box-visible', 'harmonia-glow'), 3800 * t));

        // 6. Start icon movement (after harmonia appears, stays fully visible while moving)
        const moveStartTime = 4000 * t;
        personalityState.timeouts.push(setTimeout(() => {
            card.classList.add('icon-moving');
        }, moveStartTime));

        // 7. Animation complete
        personalityState.timeouts.push(setTimeout(() => {
            card.classList.add('animation-complete');
            setTimeout(() => card.classList.remove('harmonia-glow'), 500);
            personalityState.isOpen = true;
            personalityState.animating = false;
        }, moveStartTime + 1000));

    } else {
        // Reset/Close
        card.classList.remove(
            'animation-complete', 'icon-arrived', 'icon-moving',
            'harmonia-glow', 'outer-circle-animating',
            'harmonia-box-visible', 'center-visible', 'line-3-visible',
            'apps-box-visible', 'apps-box-glow', 'line-2-visible',
            'science-box-visible', 'science-box-glow', 'line-1-visible'
        );
        personalityState.isOpen = false;
        personalityState.animating = false;
    }
}

function resetPersonalityCardAnimation() {
    const { card } = personalityState;
    if (!card) return;

    clearPersonalityTimeouts();
    
    card.classList.remove(
        'animation-complete', 'icon-arrived', 'icon-moving',
        'harmonia-glow', 'outer-circle-animating',
        'harmonia-box-visible', 'center-visible', 'line-3-visible',
        'apps-box-visible', 'apps-box-glow', 'line-2-visible',
        'science-box-visible', 'science-box-glow', 'line-1-visible'
    );

    personalityState.isOpen = false;
    personalityState.animating = false;
}

window.triggerPersonalityCardAnimation = triggerPersonalityCardAnimation;
window.resetPersonalityCardAnimation = resetPersonalityCardAnimation;

// =============================================
// GENETIC CARD ANIMATION
// =============================================
let geneticState = {
    card: null,
    isOpen: false,
    animating: false,
    hasAnimatedOnce: false,
    timeouts: []
};

function initGeneticCardAnimation() {
    geneticState.card = document.querySelector('.science-card.genetic-card');
}

function clearGeneticTimeouts() {
    geneticState.timeouts.forEach(t => clearTimeout(t));
    geneticState.timeouts = [];
}

function triggerGeneticCardAnimation(shouldOpen) {
    const { card, isOpen, animating, hasAnimatedOnce } = geneticState;
    
    if (!card) return;
    if (globalAnimationsPaused) return; // Don't animate if paused
    if (shouldOpen === isOpen && !animating) return;

    geneticState.animating = true;
    clearGeneticTimeouts();

    // First time: 3s, subsequent: 1.5s
    const isFirstTime = shouldOpen && !hasAnimatedOnce;
    const duration = isFirstTime ? 3000 : 1500;
    card.style.setProperty('--genetic-duration', isFirstTime ? '3s' : '1.5s');

    if (shouldOpen) {
        if (isFirstTime) {
            geneticState.hasAnimatedOnce = true;
            card.classList.add('animated-once');
        }

        if (isFirstTime) {
            // === FIRST TIME ANIMATION (3s) ===
            
            // Phase 1: Electric crackle on rungs only (0-500ms)
            card.classList.add('crackling');
            
            // Phase 2: Crackle ends, warp effect (500ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.remove('crackling');
                card.classList.add('helix-warping');
            }, 500));

            // Boxes + subtitle start fading in (700ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('boxes-fading', 'subtitle-visible');
            }, 700));

            // Stop warping
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.remove('helix-warping');
            }, 900));

            // Phase 3: DNA moves + rolls + helix draws + particles travel along (1200-2300ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('dna-moving', 'helix-forming');
            }, 1200));

            // Phase 4: Energy wave + final glow (2300-2700ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('energy-wave-active', 'final-glow');
            }, 2300));

            // Phase 5: Harmonia + title appear (2700ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('harmonia-visible', 'harmonia-glow');
            }, 2700));

            // Complete (3000ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.remove('final-glow', 'energy-wave-active', 'harmonia-glow');
                card.classList.add('animation-complete');
                geneticState.isOpen = true;
                geneticState.animating = false;
            }, 3000));

        } else {
            // === SUBSEQUENT ANIMATION (1.5s) - Simplified ===
            
            // Skip crackle, start with warp
            card.classList.add('helix-warping');
            
            // Boxes + subtitle fade in (200ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('boxes-fading', 'subtitle-visible');
            }, 200));

            // Stop warping
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.remove('helix-warping');
            }, 300));

            // DNA moves + rolls + helix draws + particles travel (400-1000ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('dna-moving', 'helix-forming');
            }, 400));

            // Energy wave + glow (1100ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('energy-wave-active', 'final-glow');
            }, 1100));

            // Harmonia + title (1300ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.add('harmonia-visible', 'harmonia-glow');
            }, 1300));

            // Complete (1500ms)
            geneticState.timeouts.push(setTimeout(() => {
                card.classList.remove('final-glow', 'energy-wave-active', 'harmonia-glow');
                card.classList.add('animation-complete');
                geneticState.isOpen = true;
                geneticState.animating = false;
            }, 1500));
        }

    } else {
        // Reset/Close
        card.classList.remove(
            'animation-complete', 'harmonia-visible', 'harmonia-glow',
            'final-glow', 'energy-wave-active', 'dna-moving',
            'boxes-fading', 'subtitle-visible', 'particles-active',
            'helix-warping', 'helix-forming', 'crackling'
        );
        geneticState.isOpen = false;
        geneticState.animating = false;
    }
}

function resetGeneticCardAnimation() {
    const { card } = geneticState;
    if (!card) return;

    clearGeneticTimeouts();
    
    card.classList.remove(
        'animation-complete', 'harmonia-visible', 'harmonia-glow',
        'final-glow', 'energy-wave-active', 'dna-moving',
        'boxes-fading', 'subtitle-visible', 'particles-active',
        'helix-warping', 'helix-forming', 'crackling'
    );

    geneticState.isOpen = false;
    geneticState.animating = false;
}

window.triggerGeneticCardAnimation = triggerGeneticCardAnimation;
window.resetGeneticCardAnimation = resetGeneticCardAnimation;

// =============================================
// SYNTHESIS CARD ANIMATION
// =============================================
let synthesisState = {
    card: null,
    isOpen: false,
    animating: false,
    hasAnimatedOnce: false,
    timeouts: []
};

function initSynthesisCardAnimation() {
    synthesisState.card = document.querySelector('.science-card.synthesis-card');
}

function clearSynthesisTimeouts() {
    synthesisState.timeouts.forEach(t => clearTimeout(t));
    synthesisState.timeouts = [];
}

function triggerSynthesisCardAnimation(shouldOpen) {
    const { card, isOpen, animating, hasAnimatedOnce } = synthesisState;
    
    if (!card) return;
    if (globalAnimationsPaused) return; // Don't animate if paused
    if (shouldOpen === isOpen && !animating) return;

    synthesisState.animating = true;
    clearSynthesisTimeouts();

    // First time: 4s, subsequent: 2.5s
    const isFirstTime = shouldOpen && !hasAnimatedOnce;
    const t = isFirstTime ? 1 : 0.625; // Time multiplier

    if (shouldOpen) {
        if (isFirstTime) {
            synthesisState.hasAnimatedOnce = true;
            card.classList.add('animated-once');
        }

        // Phase 1: Icons rush to center (0-600ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('icons-rushing');
        }, 0));

        // Phase 2: Impact flash + sparks (600ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('impact', 'sparks-active');
        }, 600 * t));

        // Phase 3: Fog builds (800ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('fog-building');
        }, 800 * t));

        // Phase 4: Harmonia logo fades in (1500ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('logo-visible');
        }, 1500 * t));

        // Phase 5: Logo spins + traces boxes + title appears (2200ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.remove('fog-building');
            card.classList.add('fog-fading', 'logo-spinning', 'boxes-tracing', 'title-visible');
        }, 2200 * t));

        // Phase 5b: Logo arrives in header position (3600ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.remove('logo-spinning', 'logo-visible');
            card.classList.add('logo-in-header');
        }, 3600 * t));

        // Phase 6: Text cascade - Science (3200ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.remove('boxes-tracing');
            card.classList.add('text-science');
        }, 3200 * t));

        // Phase 6b: Text cascade - Apps (3400ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('text-apps');
        }, 3400 * t));

        // Phase 6c: Text cascade - Harmonia (3600ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.add('text-harmonia');
        }, 3600 * t));

        // Phase 7: Complete (4000ms)
        synthesisState.timeouts.push(setTimeout(() => {
            card.classList.remove('fog-fading', 'impact', 'sparks-active');
            card.classList.add('animation-complete');
            synthesisState.isOpen = true;
            synthesisState.animating = false;

            // Trigger other cards to show completed state
            showAllCardsCompleted();
        }, 4000 * t));

    } else {
        // Reset/Close
        card.classList.remove(
            'animation-complete', 'text-harmonia', 'text-apps', 'text-science',
            'boxes-tracing', 'title-visible',
            'logo-spinning', 'logo-visible', 'logo-in-header', 'fog-fading', 'fog-building',
            'sparks-active', 'impact', 'icons-rushing'
        );
        synthesisState.isOpen = false;
        synthesisState.animating = false;
    }
}

function resetSynthesisCardAnimation() {
    const { card } = synthesisState;
    if (!card) return;

    clearSynthesisTimeouts();
    
    card.classList.remove(
        'animation-complete', 'text-harmonia', 'text-apps', 'text-science',
        'boxes-tracing', 'title-visible',
        'logo-spinning', 'logo-visible', 'logo-in-header', 'fog-fading', 'fog-building',
        'sparks-active', 'impact', 'icons-rushing'
    );

    synthesisState.isOpen = false;
    synthesisState.animating = false;
}

// Show all cards in completed state
function showAllCardsCompleted() {
    // Visual card - set eye to open state
    const visualCard = document.querySelector('.science-card.visual-card');
    if (visualCard && !visualCard.classList.contains('eye-open')) {
        visualCard.classList.add('eye-open');
        // Set the SVG paths to open state
        const upperLid = visualCard.querySelector('.upper-lid');
        const lowerLid = visualCard.querySelector('.lower-lid');
        if (upperLid) upperLid.setAttribute('d', 'M30 40 Q50 20 70 40');
        if (lowerLid) lowerLid.setAttribute('d', 'M35 70 Q50 85 65 70');
    }

    // Personality card
    const personalityCard = document.querySelector('.science-card.personality-card');
    if (personalityCard) {
        personalityCard.classList.add('animation-complete', 'icon-moving', 'center-visible', 'outer-circle-animating', 'line-1-visible', 'line-2-visible', 'line-3-visible', 'science-box-visible', 'apps-box-visible', 'harmonia-box-visible');
    }

    // Genetic card
    const geneticCard = document.querySelector('.science-card.genetic-card');
    if (geneticCard) {
        geneticCard.classList.add('animation-complete', 'dna-moving', 'helix-forming', 'boxes-fading', 'subtitle-visible', 'harmonia-visible');
    }

    // Synthesis card
    const synthesisCard = document.querySelector('.science-card.synthesis-card');
    if (synthesisCard) {
        synthesisCard.classList.add('animation-complete', 'logo-in-header', 'title-visible', 'text-science', 'text-apps', 'text-harmonia');
    }
}

// Hide all cards completed state (restore to silhouette)
function hideAllCardsCompleted() {
    // Visual card - reset eye to closed state
    const visualCard = document.querySelector('.science-card.visual-card');
    if (visualCard) {
        visualCard.classList.remove('eye-open');
        // Reset the SVG paths to closed state
        const upperLid = visualCard.querySelector('.upper-lid');
        const lowerLid = visualCard.querySelector('.lower-lid');
        if (upperLid) upperLid.setAttribute('d', 'M30 50 Q50 35 70 50');
        if (lowerLid) lowerLid.setAttribute('d', 'M35 50 Q50 65 65 50');
    }

    // Personality card
    const personalityCard = document.querySelector('.science-card.personality-card');
    if (personalityCard) {
        personalityCard.classList.remove('animation-complete', 'icon-moving', 'center-visible', 'outer-circle-animating', 'line-1-visible', 'line-2-visible', 'line-3-visible', 'science-box-visible', 'apps-box-visible', 'harmonia-box-visible');
    }

    // Genetic card
    const geneticCard = document.querySelector('.science-card.genetic-card');
    if (geneticCard) {
        geneticCard.classList.remove('animation-complete', 'dna-moving', 'helix-forming', 'boxes-fading', 'subtitle-visible', 'harmonia-visible');
    }

    // Synthesis card - KEEP visible since pause/resume is on this card
    // Don't remove any classes - user expects to see the content
}

// Toggle pause/resume all animations
function toggleAllAnimations() {
    const btnText = document.querySelector('.synthesis-pause-hint .pause-btn-text');
    
    globalAnimationsPaused = !globalAnimationsPaused;
    
    if (globalAnimationsPaused) {
        // Paused - show all cards completed
        document.body.classList.add('animations-paused');
        if (btnText) btnText.textContent = 'Resume';
        showAllCardsCompleted();
    } else {
        // Resumed - restore silhouette state
        document.body.classList.remove('animations-paused');
        if (btnText) btnText.textContent = 'Pause';
        hideAllCardsCompleted();
    }
}

window.triggerSynthesisCardAnimation = triggerSynthesisCardAnimation;
window.resetSynthesisCardAnimation = resetSynthesisCardAnimation;
window.toggleAllAnimations = toggleAllAnimations;

// Spin logo on click
function spinLogo(element) {
    element.classList.remove('click-spin');
    // Trigger reflow to restart animation
    void element.offsetWidth;
    element.classList.add('click-spin');
    setTimeout(() => {
        element.classList.remove('click-spin');
    }, 600);
}
window.spinLogo = spinLogo;
    </script>
