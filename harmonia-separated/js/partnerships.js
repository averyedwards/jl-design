    card.classList.add('active');
    const dd = document.getElementById('contact-type');
    if (dd) dd.value = type;
    const msg = document.getElementById('contact-message');
    if (msg) msg.focus();
}

// =============================================
// PARTNERSHIPS PAGE - DYNAMIC TIER SYSTEM
// =============================================

// Abstract SVG Icons for Partnerships
const partnershipsAbstractIcons = {
    layers: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <circle cx="50" cy="50" r="45" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
        <circle cx="50" cy="50" r="30" stroke="var(--gold)" stroke-width="1.5" fill="none" opacity="0.5"/>
        <circle cx="50" cy="50" r="15" stroke="var(--maroon)" stroke-width="2" fill="none"/>
        <line x1="50" y1="5" x2="50" y2="20" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <line x1="50" y1="80" x2="50" y2="95" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <line x1="5" y1="50" x2="20" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <line x1="80" y1="50" x2="95" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
    </svg>`,
    shield: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <path d="M50 10 L85 25 L85 50 Q85 75 50 90 Q15 75 15 50 L15 25 Z" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <path d="M50 25 L70 35 L70 50 Q70 65 50 75 Q30 65 30 50 L30 35 Z" stroke="var(--maroon)" stroke-width="1" fill="none" opacity="0.6"/>
        <circle cx="50" cy="50" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
    </svg>`,
    platform: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <circle cx="50" cy="20" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="70" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <circle cx="80" cy="70" r="8" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <line x1="50" y1="28" x2="25" y2="63" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
        <line x1="50" y1="28" x2="75" y2="63" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
        <line x1="28" y1="70" x2="72" y2="70" stroke="var(--maroon)" stroke-width="1" opacity="0.6"/>
        <circle cx="50" cy="50" r="25" stroke="var(--gold)" stroke-width="0.5" fill="none" stroke-dasharray="4 4"/>
    </svg>`,
    validation: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <circle cx="50" cy="50" r="40" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
        <circle cx="50" cy="50" r="30" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <path d="M30 50 L45 65 L70 35" stroke="var(--maroon)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    metrics: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <rect x="15" y="60" width="15" height="30" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="42" y="40" width="15" height="50" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="69" y="20" width="15" height="70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <line x1="10" y1="90" x2="90" y2="90" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <path d="M20 55 L50 35 L77 15" stroke="var(--gold)" stroke-width="1" fill="none" stroke-dasharray="3 3"/>
    </svg>`,
    support: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <path d="M20 50 Q20 20 50 20 Q80 20 80 50" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="15" y="50" width="15" height="25" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="70" y="50" width="15" height="25" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <path d="M30 75 L30 80 Q30 85 40 85 L55 85" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <circle cx="60" cy="85" r="5" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
    </svg>`,
    deploy: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <path d="M50 15 Q70 30 70 50 L50 70 L30 50 Q30 30 50 15" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <circle cx="50" cy="40" r="8" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <path d="M30 55 L20 70 L35 65" stroke="var(--gold)" stroke-width="1" fill="none"/>
        <path d="M70 55 L80 70 L65 65" stroke="var(--gold)" stroke-width="1" fill="none"/>
        <path d="M45 70 L50 85 L55 70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
    </svg>`,
    realtime: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <circle cx="50" cy="50" r="40" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.3"/>
        <circle cx="50" cy="50" r="25" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <circle cx="50" cy="50" r="10" stroke="var(--maroon)" stroke-width="2" fill="none"/>
        <line x1="50" y1="10" x2="50" y2="25" stroke="var(--gold)" stroke-width="1.5"/>
        <line x1="50" y1="75" x2="50" y2="90" stroke="var(--gold)" stroke-width="1.5"/>
        <line x1="10" y1="50" x2="25" y2="50" stroke="var(--gold)" stroke-width="1.5"/>
        <line x1="75" y1="50" x2="90" y2="50" stroke="var(--gold)" stroke-width="1.5"/>
    </svg>`,
    uptime: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <rect x="20" y="15" width="60" height="20" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="20" y="40" width="60" height="20" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <rect x="20" y="65" width="60" height="20" rx="3" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <circle cx="30" cy="25" r="3" fill="var(--gold)"/>
        <circle cx="30" cy="50" r="3" fill="var(--gold)"/>
        <circle cx="30" cy="75" r="3" fill="var(--maroon)"/>
    </svg>`,
    custom: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <line x1="20" y1="25" x2="80" y2="25" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <line x1="20" y1="50" x2="80" y2="50" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <line x1="20" y1="75" x2="80" y2="75" stroke="var(--gold)" stroke-width="1" opacity="0.5"/>
        <circle cx="35" cy="25" r="8" stroke="var(--gold)" stroke-width="1.5" fill="var(--cream)"/>
        <circle cx="60" cy="50" r="8" stroke="var(--maroon)" stroke-width="1.5" fill="var(--cream)"/>
        <circle cx="45" cy="75" r="8" stroke="var(--gold)" stroke-width="1.5" fill="var(--cream)"/>
    </svg>`,
    audits: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <rect x="15" y="20" width="70" height="65" rx="3" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <line x1="15" y1="35" x2="85" y2="35" stroke="var(--gold)" stroke-width="1"/>
        <line x1="35" y1="20" x2="35" y2="28" stroke="var(--maroon)" stroke-width="2"/>
        <line x1="65" y1="20" x2="65" y2="28" stroke="var(--maroon)" stroke-width="2"/>
        <path d="M25 55 L32 62 L45 48" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
        <path d="M55 55 L62 62 L75 48" stroke="var(--gold)" stroke-width="1.5" fill="none"/>
    </svg>`,
    team: `<svg viewBox="0 0 100 100" class="abstract-icon">
        <circle cx="50" cy="25" r="12" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <path d="M30 70 Q30 50 50 50 Q70 50 70 70" stroke="var(--maroon)" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="40" r="8" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
        <path d="M5 75 Q5 60 20 60 Q35 60 35 75" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
        <circle cx="80" cy="40" r="8" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
        <path d="M65 75 Q65 60 80 60 Q95 60 95 75" stroke="var(--gold)" stroke-width="1" fill="none" opacity="0.7"/>
    </svg>`
};

// Tier Data for Partnerships
const partnershipsTierData = {
    default: {
        title: "The Matching Layer You're Missing",
        intro: "Industry retention rates have stalled at <a href='https://www.businessofapps.com/data/dating-app-benchmarks/' target='_blank' class='stat-link'>3.3%</a>. Over <a href='https://www.businessofapps.com/data/dating-app-market/' target='_blank' class='stat-link'>half the market's revenue</a> sits with one conglomerate. Harmonia exists for independent platforms ready to compete differently. Shared engine. Individual identity. A dating market where quality determines who wins.",
        boxes: [
            { key: 'layers', title: '3-Layer Matching', desc: 'Bio, Psychological, and Neural compatibility.', icon: 'layers',
              modal: { desc: 'Our proprietary algorithm analyzes compatibility across three distinct dimensions, creating a holistic view of potential connections.', bullets: ['Visual attraction analysis using advanced neural networks', 'Personality compatibility through psychometric assessment', 'HLA genetic markers for biological chemistry signals'] } },
            { key: 'privacy', title: 'Privacy-First Architecture', desc: 'GDPR/CCPA compliant by design.', icon: 'shield',
              modal: { desc: 'We process genetic data client-side, extract only HLA markers, then permanently delete raw files.', bullets: ['Zero raw genetic data stored on our servers', 'Full GDPR and CCPA compliance built-in', 'SOC 2 Type II certification in progress'] } },
            { key: 'platform', title: 'Platform Agnostic', desc: 'Works with any tech stack (iOS, Android, Web).', icon: 'platform',
              modal: { desc: 'RESTful API design means Harmonia integrates seamlessly with your existing infrastructure.', bullets: ['SDKs available for Swift, Kotlin, and JavaScript', 'Webhook support for real-time score updates', 'Comprehensive documentation and sandbox environment'] } }
        ],
        placeholder: 'Tell us about your platform...',
        cta: 'Request Access'
    },
    pilot: {
        title: "Prove ROI First",
        intro: "Bumble spends <a href='https://www.aircfo.com/resources/bumble-s-1-teardown' target='_blank' class='stat-link'>$56</a> to acquire a single user. Everyone else doesn't have that runway. Harmonia runs a 30-day pilot. Real cohort. Measured lift. ROI before contract.",
        boxes: [
            { key: 'validation', title: 'Zero-Risk Validation', desc: 'Test retention lift on a specific cohort.', icon: 'validation',
              modal: { desc: 'Run a controlled experiment with a segment of your user base with statistical rigor.', bullets: ['A/B testing framework included', 'Statistically significant sample sizing guidance', 'No long-term commitment required'] } },
            { key: 'metrics', title: 'Success Metrics Dashboard', desc: 'Real-time view of match quality improvements.', icon: 'metrics',
              modal: { desc: 'Track the metrics that matter: retention lift, session length, match-to-message conversion.', bullets: ['Day 1, 7, and 30 retention comparisons', 'Match success rate tracking', 'Exportable reports for stakeholder presentations'] } },
            { key: 'support', title: 'Dedicated Support', desc: 'Integration guidance during your 30-day trial.', icon: 'support',
              modal: { desc: 'Our partnership team is with you from kickoff to final analysis.', bullets: ['Named integration specialist assigned', 'Weekly check-in calls during pilot', 'Post-pilot strategy session included'] } }
        ],
        placeholder: "I'm interested in the 30-day pilot to test retention lift...",
        cta: 'Start 30-Day Pilot'
    },
    api: {
        title: "Live in Weeks, Not Months",
        intro: "Only <a href='https://measuringu.com/online-dating-benchmark-2024/' target='_blank' class='stat-link'>11%</a> of dating app users think their algorithm actually matches them well. Harmonia exists to fix that. Deploy our compatibility engine in weeks. Battle-tested. Fully documented. 99.9% uptime.",
        boxes: [
            { key: 'deploy', title: 'Quick Deployment', desc: 'Live in weeks with comprehensive docs.', icon: 'deploy',
              modal: { desc: 'Our integration team has refined the onboarding process to get you from contract to production in 2-4 weeks.', bullets: ['Step-by-step integration guides', 'Sandbox environment for development', 'Migration support from existing systems'] } },
            { key: 'realtime', title: 'Real-Time Scoring', desc: 'Instant compatibility results during swiping.', icon: 'realtime',
              modal: { desc: 'Our algorithm calculates compatibility scores in milliseconds, enabling seamless integration into your swipe experience.', bullets: ['Sub-100ms response times globally', 'Batch scoring for feed optimization', 'Webhook support for async workflows'] } },
            { key: 'uptime', title: '99.9% Uptime SLA', desc: 'Enterprise reliability you don\'t have to build.', icon: 'uptime',
              modal: { desc: 'We run on Google Cloud infrastructure with multi-region redundancy.', bullets: ['Service Level Agreement with credits', '24/7 monitoring and incident response', 'Transparent status page and incident history'] } }
        ],
        placeholder: "We're ready to integrate the Harmonia API...",
        cta: 'Request Integration Docs'
    },
    core: {
        title: "Your Retention Engine, Built Together",
        intro: "Users are <a href='https://befriend.cc/2025/12/29/great-deceleration-dating-apps-losing-trust/' target='_blank' class='stat-link'>42%</a> more likely to find meaningful connections on platforms built for their community. Harmonia co-develops custom weights tailored to your user base. Your match engine evolves as fast as your market.",
        boxes: [
            { key: 'custom', title: 'Custom Algorithm Tuning', desc: 'Bespoke weighting models trained on your engagement data.', icon: 'custom',
              modal: { desc: 'We analyze your user behavior patterns and optimize the three-layer weights specifically for your audience.', bullets: ['Deep-dive analysis of your user engagement data', 'Custom weight optimization for your niche', 'Continuous model retraining as your user base evolves'] } },
            { key: 'audits', title: 'Strategic Quarterly Audits', desc: 'Data-driven reviews to optimize match success rates.', icon: 'audits',
              modal: { desc: 'Every quarter, our data science team reviews your performance metrics and recommends optimizations.', bullets: ['Comprehensive performance review presentation', 'Actionable optimization recommendations', 'Roadmap alignment for upcoming features'] } },
            { key: 'team', title: 'Dedicated Implementation Team', desc: 'Direct Slack access to our engineers.', icon: 'team',
              modal: { desc: 'Core Engine partners get a private Slack channel with direct access to our engineering team.', bullets: ['Private Slack channel with Harmonia engineers', 'Named account manager and technical lead', 'Priority incident response and feature requests'] } }
        ],
        placeholder: "We are looking for a custom integration to solve specific churn issues...",
        cta: 'Inquire About Partnership'
    }
};

let partnershipsCurrentTier = 'default';

function initPartnerships() {
    renderPartnershipsBoxes(partnershipsTierData.default.boxes);
    
    const interestDropdown = document.getElementById('partnershipInterest');
    if (interestDropdown) {
        interestDropdown.addEventListener('change', function() {
            const value = this.value;
            if (value === 'default') {
                this.classList.remove('tier-selected');
                updatePartnershipsContent('default');
            } else {
                this.classList.add('tier-selected');
                updatePartnershipsContent(value);
            }
        });
    }

    // Tier tab click handlers (mobile/tablet)
    const tierTabs = document.querySelectorAll('.partnerships-tier-tabs .tier-tab');
    tierTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tier = this.dataset.tier;
            
            // Update active tab
            tierTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            updatePartnershipsContent(tier);
            
            // Sync dropdown value (for form submission)
            if (interestDropdown) {
                interestDropdown.value = tier;
                if (tier === 'default') {
                    interestDropdown.classList.remove('tier-selected');
                } else {
                    interestDropdown.classList.add('tier-selected');
                }
            }
        });
    });

    const form = document.getElementById('partnershipsIntegrationForm');
    if (form) {
        form.addEventListener('submit', handlePartnershipsSubmit);
    }

    const modalOverlay = document.getElementById('partnershipsModalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === this) closePartnershipsModal();
        });
    }
}

function updatePartnershipsContent(tier) {
    const wrapper = document.getElementById('partnershipsContentWrapper');
    const data = partnershipsTierData[tier];
    if (!wrapper || !data) return;
    
    partnershipsCurrentTier = tier;
    wrapper.classList.add('fading');

    // Sync tier tabs (for mobile/tablet)
    const tierTabs = document.querySelectorAll('.partnerships-tier-tabs .tier-tab');
    tierTabs.forEach(tab => {
        if (tab.dataset.tier === tier) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    setTimeout(() => {
        document.getElementById('partnershipsDynamicTitle').textContent = data.title;
        document.getElementById('partnershipsDynamicIntro').innerHTML = data.intro;
        renderPartnershipsBoxes(data.boxes);
        document.getElementById('partnershipInquiry').placeholder = data.placeholder;
        const btnText = document.querySelector('#partnershipsSubmitBtn .btn-text');
        if (btnText) btnText.textContent = data.cta;
        wrapper.classList.remove('fading');
    }, 300);
}

function renderPartnershipsBoxes(boxes) {
    const container = document.getElementById('partnershipsFeatureBoxes');
    if (!container) return;
    container.innerHTML = boxes.map(box => `
        <div class="feature-box" onclick="openPartnershipsModal('${box.key}')">
            <div class="card-visual">${partnershipsAbstractIcons[box.icon]}</div>
            <div class="box-content">
                <h4 class="box-title">${box.title}</h4>
                <p class="box-desc">${box.desc}</p>
                <span class="tap-hint">Tap for details</span>
                <div class="box-bullets">
                    <ul>
                        ${box.modal.bullets.map(b => `<li>${b}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
}

function openPartnershipsModal(key) {
    const data = partnershipsTierData[partnershipsCurrentTier];
    const box = data.boxes.find(b => b.key === key);
    if (!box) return;

    document.getElementById('partnershipsModalIcon').innerHTML = partnershipsAbstractIcons[box.icon];
    document.getElementById('partnershipsModalTitle').textContent = box.title;
    document.getElementById('partnershipsModalDesc').textContent = box.modal.desc;
    document.getElementById('partnershipsModalList').innerHTML = box.modal.bullets.map(b => `<li>${b}</li>`).join('');

    document.getElementById('partnershipsModalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePartnershipsModal() {
    document.getElementById('partnershipsModalOverlay').classList.remove('active');
    document.body.style.overflow = '';
}

function handlePartnershipsSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('partnershipsSubmitBtn');
    const btnText = btn ? btn.querySelector('.btn-text') : null;
    const arrow = btn ? btn.querySelector('.arrow') : null;
    const message = document.getElementById('partnershipsFormMessage');

    if (btn) btn.classList.add('processing');
    if (btnText) btnText.textContent = 'Processing...';
    if (arrow) arrow.style.display = 'none';

    setTimeout(() => {
        document.getElementById('partnershipsIntegrationForm').reset();
        document.getElementById('partnershipInterest').value = 'default';
        document.getElementById('partnershipInterest').classList.remove('tier-selected');
        
        if (message) {
            message.innerHTML = '<span style="color:var(--gold)">Request received. We will be in touch shortly.</span>';
            message.style.display = 'block';
        }

        if (btn) btn.classList.remove('processing');
        if (btnText) btnText.textContent = 'Request Access';
        if (arrow) arrow.style.display = '';

        updatePartnershipsContent('default');

        setTimeout(() => {
            if (message) message.style.display = 'none';
        }, 4000);
    }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    initHarmoniaLogos(); // Apply logo to all data-harmonia-logo elements
    initFromHash();
    animateRadar();
    initVisualCardAnimation(); // Must init before slider
    initPersonalityCardAnimation(); // Init personality animation
    initGeneticCardAnimation(); // Init genetic animation
    initSynthesisCardAnimation(); // Init synthesis animation
    initWhySlider();
    initTeamSlider();
    initForms();
    initPartnerships();
});

