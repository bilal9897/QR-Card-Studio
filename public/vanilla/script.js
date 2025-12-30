/**
 * QR Card Studio - Pure JavaScript
 * Clean, beginner-friendly code for college submission
 * 
 * This file handles:
 * - Template selection and management
 * - QR code generation
 * - Live card preview updates
 * - HD PNG download
 * - Theme toggle (dark/light)
 * - Mobile navigation
 * - About modal
 */

// ============================================
// TEMPLATE DATA
// ============================================

const templates = {
    professional: [
        {
            id: 'google-review',
            name: 'Google Review',
            description: 'Google Maps style',
            businessName: 'Your Business Name',
            message: 'Loved your experience? Leave us a Google review! Your feedback helps others discover us.',
            ctaText: 'Review on Google',
            colors: {
                background: '#ffffff',
                text: '#202124',
                accent: '#1a73e8',
                qrColor: '#202124'
            }
        },
        {
            id: 'instagram',
            name: 'Instagram',
            description: 'Gradient social style',
            businessName: '@yourbusiness',
            message: 'Follow us for updates, behind-the-scenes, and exclusive offers! Tag us in your posts.',
            ctaText: 'Follow on Instagram',
            colors: {
                background: '#fafafa',
                text: '#262626',
                accent: '#e1306c',
                qrColor: '#262626'
            }
        },
        {
            id: 'facebook',
            name: 'Facebook',
            description: 'Facebook blue style',
            businessName: 'Your Business Page',
            message: 'Like our page and share your experience. Join our community for updates and offers!',
            ctaText: 'Like on Facebook',
            colors: {
                background: '#f0f2f5',
                text: '#1c1e21',
                accent: '#1877f2',
                qrColor: '#1c1e21'
            }
        },
        {
            id: 'emerald',
            name: 'Emerald',
            description: 'Fresh and refined',
            businessName: 'Emerald Gardens',
            message: "Your satisfaction is our greatest achievement. We'd love to hear from you.",
            ctaText: 'Rate Your Experience',
            colors: {
                background: '#f4f7f4',
                text: '#1e3a2f',
                accent: '#2d5a45',
                qrColor: '#1e3a2f'
            }
        },
        {
            id: 'modern-dark',
            name: 'Modern Dark',
            description: 'Bold and contemporary',
            businessName: 'Nexus Studios',
            message: 'Help us build better experiences. Your feedback drives innovation.',
            ctaText: 'Share Feedback',
            colors: {
                background: '#1c1c1e',
                text: '#f5f5f7',
                accent: '#6e6e73',
                qrColor: '#f5f5f7'
            }
        },
        {
            id: 'soft-editorial',
            name: 'Soft Editorial',
            description: 'Warm and inviting',
            businessName: 'The Paper House',
            message: 'We craft every experience with care. Tell us what you think.',
            ctaText: 'Write a Review',
            colors: {
                background: '#fdf8f5',
                text: '#4a3f3a',
                accent: '#c88b78',
                qrColor: '#4a3f3a'
            }
        }
    ],
    luxury: [
        {
            id: 'midnight-gold',
            name: 'Midnight Gold',
            description: 'Gold gradient luxury',
            businessName: 'The Gold Standard',
            message: "Excellence is not a destination, it's a journey. Help us perfect every detail.",
            ctaText: 'Share Your Experience',
            colors: {
                background: '#0f0f0f',
                gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1510 50%, #0f0f0f 100%)',
                text: '#f5f5f0',
                accent: '#c9a961',
                qrColor: '#c9a961'
            }
        },
        {
            id: 'obsidian-emerald',
            name: 'Obsidian Emerald',
            description: 'Emerald gradient glow',
            businessName: 'Velvet & Stone',
            message: 'Crafted for those who appreciate the finer things. Your opinion shapes our craft.',
            ctaText: 'Rate Us',
            colors: {
                background: '#0d1a14',
                gradient: 'linear-gradient(135deg, #0d1a14 0%, #0a2015 50%, #0d1a14 100%)',
                text: '#e8f0ec',
                accent: '#4ade80',
                qrColor: '#4ade80'
            }
        },
        {
            id: 'rose-gold-dark',
            name: 'Rose Gold Dark',
            description: 'Rose gold gradient',
            businessName: 'Rose & Velvet',
            message: 'Elegance in every detail. Share your refined experience.',
            ctaText: 'Rate Experience',
            colors: {
                background: '#121010',
                gradient: 'linear-gradient(135deg, #121010 0%, #1a1215 50%, #121010 100%)',
                text: '#f5ebe0',
                accent: '#e8b4b8',
                qrColor: '#e8b4b8'
            }
        },
        {
            id: 'cosmic-purple',
            name: 'Cosmic Purple',
            description: 'Deep space gradient',
            businessName: 'Cosmic Vibes',
            message: 'Explore the universe of great experiences. Share yours.',
            ctaText: 'Rate Experience',
            colors: {
                background: '#0a0812',
                gradient: 'linear-gradient(135deg, #0a0812 0%, #1a1030 30%, #0f0820 70%, #0a0812 100%)',
                text: '#f5f0ff',
                accent: '#c084fc',
                qrColor: '#c084fc'
            }
        },
        {
            id: 'aurora-borealis',
            name: 'Aurora Borealis',
            description: 'Multi-color aurora',
            businessName: 'Northern Lights',
            message: 'Experience the extraordinary. Share your journey with us.',
            ctaText: 'Share Experience',
            colors: {
                background: '#0a0a12',
                gradient: 'linear-gradient(135deg, #0a0a12 0%, #1a0a20 25%, #0a1520 50%, #0a2018 75%, #0a0a12 100%)',
                text: '#f0f8ff',
                accent: '#7dd3fc',
                qrColor: '#7dd3fc'
            }
        },
        {
            id: 'sunset-gradient',
            name: 'Sunset Gradient',
            description: 'Warm sunset blend',
            businessName: 'Golden Hour',
            message: 'Every moment matters. Tell us about yours.',
            ctaText: 'Rate Us',
            colors: {
                background: '#0f0808',
                gradient: 'linear-gradient(135deg, #1a0a08 0%, #1f1008 50%, #0f0808 100%)',
                text: '#fff5eb',
                accent: '#fb923c',
                qrColor: '#fb923c'
            }
        }
    ],
    elite: [
        {
            id: 'rgb-neon-purple',
            name: 'Neon Purple',
            description: 'Purple RGB border',
            businessName: 'Ultraviolet Lounge',
            message: 'Step into the future. Your experience matters to us.',
            ctaText: 'Rate Us',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #12081a 50%, #0a0a0a 100%)',
                text: '#f0f0f0',
                accent: '#a855f7',
                qrColor: '#a855f7',
                borderGradient: 'linear-gradient(90deg, #a855f7, #6366f1, #a855f7)'
            }
        },
        {
            id: 'rgb-cyber-red',
            name: 'Cyber Red',
            description: 'Red RGB border',
            businessName: 'Red District',
            message: 'Bold experiences deserve bold feedback. Tell us what you think.',
            ctaText: 'Share Feedback',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #150808 50%, #0a0a0a 100%)',
                text: '#fafafa',
                accent: '#ef4444',
                qrColor: '#ef4444',
                borderGradient: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)'
            }
        },
        {
            id: 'rgb-electric-blue',
            name: 'Electric Blue',
            description: 'Blue RGB border',
            businessName: 'Blue Horizon Tech',
            message: 'Innovation starts with your feedback. Help us build better.',
            ctaText: 'Leave Review',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #080a15 50%, #0a0a0a 100%)',
                text: '#e8f4fc',
                accent: '#3b82f6',
                qrColor: '#3b82f6',
                borderGradient: 'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)'
            }
        },
        {
            id: 'rgb-aqua-teal',
            name: 'Aqua Teal',
            description: 'Teal RGB border',
            businessName: 'Ocean Spa',
            message: 'Refresh your senses. Let us know how we did.',
            ctaText: 'Rate Us',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #081012 50%, #0a0a0a 100%)',
                text: '#e0f7fa',
                accent: '#14b8a6',
                qrColor: '#14b8a6',
                borderGradient: 'linear-gradient(90deg, #14b8a6, #22d3ee, #14b8a6)'
            }
        },
        {
            id: 'rgb-magenta-fusion',
            name: 'Magenta Fusion',
            description: 'Magenta RGB border',
            businessName: 'Fusion Studio',
            message: 'Creative energy flows here. Share your experience with us.',
            ctaText: 'Review Now',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #120810 50%, #0a0a0a 100%)',
                text: '#fdf0fd',
                accent: '#ec4899',
                qrColor: '#ec4899',
                borderGradient: 'linear-gradient(90deg, #ec4899, #f43f5e, #ec4899)'
            }
        },
        {
            id: 'rgb-rainbow',
            name: 'Rainbow Edge',
            description: 'Rainbow RGB border',
            businessName: 'Spectrum Labs',
            message: 'Where creativity meets excellence. Share your colorful experience.',
            ctaText: 'Rate Us',
            colors: {
                background: '#0a0a0a',
                gradient: 'linear-gradient(135deg, #0a0a0a 0%, #0f0a0f 50%, #0a0a0a 100%)',
                text: '#f5f5f5',
                accent: '#a78bfa',
                qrColor: '#a78bfa',
                borderGradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)'
            }
        }
    ]
};

// Size configurations
const sizeConfigs = {
    small: { scale: 0.9, printSize: '2.5" × 3.5"' },
    medium: { scale: 1, printSize: '3.2" × 4.8"' },
    large: { scale: 1.25, printSize: '4" × 6"' }
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    selectedTemplate: null,
    format: 'table-tent',
    size: 'medium',
    businessName: '',
    message: '',
    feedbackUrl: '',
    ctaText: '',
    logoUrl: null,
    qrCodeUrl: '',
    colors: {
        background: '#ffffff',
        text: '#1a1a1a',
        accent: '#1a1a1a',
        qrColor: '#1a1a1a'
    }
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    // Inputs
    businessName: document.getElementById('businessName'),
    message: document.getElementById('message'),
    feedbackUrl: document.getElementById('feedbackUrl'),
    ctaText: document.getElementById('ctaText'),
    feedbackUrlError: document.getElementById('feedbackUrlError'),
    
    // Logo
    logoInput: document.getElementById('logoInput'),
    logoUploadArea: document.getElementById('logoUploadArea'),
    logoPlaceholder: document.getElementById('logoPlaceholder'),
    logoPreview: document.getElementById('logoPreview'),
    logoImg: document.getElementById('logoImg'),
    logoRemove: document.getElementById('logoRemove'),
    
    // Card preview elements
    cardPreview: document.getElementById('cardPreview'),
    cardLogo: document.getElementById('cardLogo'),
    cardLogoImg: document.getElementById('cardLogoImg'),
    cardBusinessName: document.getElementById('cardBusinessName'),
    cardMessage: document.getElementById('cardMessage'),
    cardQr: document.getElementById('cardQr'),
    cardCta: document.getElementById('cardCta'),
    previewSpecs: document.getElementById('previewSpecs'),
    
    // Download
    downloadBtn: document.getElementById('downloadBtn'),
    downloadHint: document.getElementById('downloadHint'),
    
    // Template containers
    professionalTemplates: document.getElementById('professionalTemplates'),
    luxuryTemplates: document.getElementById('luxuryTemplates'),
    eliteTemplates: document.getElementById('eliteTemplates'),
    
    // Theme toggle
    themeToggle: document.getElementById('themeToggle'),
    
    // Mobile navigation
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNav: document.getElementById('mobileNav'),
    mobileNavClose: document.getElementById('mobileNavClose'),
    
    // About modal
    aboutBtn: document.getElementById('aboutBtn'),
    aboutBtnMobile: document.getElementById('aboutBtnMobile'),
    aboutBtnFooter: document.getElementById('aboutBtnFooter'),
    aboutModal: document.getElementById('aboutModal'),
    aboutModalClose: document.getElementById('aboutModalClose'),
    
    // Footer year
    currentYear: document.getElementById('currentYear')
};

// ============================================
// TEMPLATE RENDERING
// ============================================

function renderTemplates() {
    renderTemplateGroup(templates.professional, elements.professionalTemplates);
    renderTemplateGroup(templates.luxury, elements.luxuryTemplates);
    renderTemplateGroup(templates.elite, elements.eliteTemplates, true);
}

function renderTemplateGroup(templateList, container, isElite = false) {
    if (!container) return;
    
    container.innerHTML = templateList.map(template => `
        <button 
            class="template-card" 
            data-template-id="${template.id}"
            aria-pressed="false"
        >
            <div class="template-color-bar" style="background: ${template.colors.borderGradient || template.colors.gradient || template.colors.accent}; ${template.colors.borderGradient ? 'box-shadow: 0 0 6px ' + template.colors.accent + '40;' : ''}"></div>
            <p class="template-name">${template.name}</p>
            <p class="template-description">${template.description}</p>
        </button>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.dataset.templateId;
            selectTemplate(templateId);
        });
    });
}

function selectTemplate(templateId) {
    // Find the template
    const allTemplates = [...templates.professional, ...templates.luxury, ...templates.elite];
    const template = allTemplates.find(t => t.id === templateId);
    
    if (!template) return;
    
    // Update state
    state.selectedTemplate = templateId;
    state.businessName = template.businessName;
    state.message = template.message;
    state.ctaText = template.ctaText;
    state.colors = { ...template.colors };
    
    // Update form inputs
    elements.businessName.value = template.businessName;
    elements.message.value = template.message;
    elements.ctaText.value = template.ctaText;
    
    // Update UI
    updateSelectedTemplateUI();
    updateCardPreview();
    validateForm();
    
    // Regenerate QR if URL exists
    if (state.feedbackUrl) {
        generateQRCode(state.feedbackUrl);
    }
}

function updateSelectedTemplateUI() {
    // Remove active class from all templates
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('active');
        card.setAttribute('aria-pressed', 'false');
    });
    
    // Add active class to selected
    if (state.selectedTemplate) {
        const selected = document.querySelector(`[data-template-id="${state.selectedTemplate}"]`);
        if (selected) {
            selected.classList.add('active');
            selected.setAttribute('aria-pressed', 'true');
        }
    }
}

// ============================================
// FORMAT & SIZE SELECTION
// ============================================

function initFormatSelector() {
    document.querySelectorAll('.format-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            state.format = format;
            
            // Update UI
            document.querySelectorAll('.format-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            updateCardPreview();
        });
    });
}

function initSizeSelector() {
    document.querySelectorAll('.size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const size = btn.dataset.size;
            state.size = size;
            
            // Update UI
            document.querySelectorAll('.size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            updateCardPreview();
            updatePreviewSpecs();
        });
    });
}

function updatePreviewSpecs() {
    const config = sizeConfigs[state.size];
    elements.previewSpecs.textContent = `${config.printSize} at 300 DPI • Print-ready`;
}

// ============================================
// LOGO UPLOAD
// ============================================

function initLogoUpload() {
    elements.logoUploadArea.addEventListener('click', () => {
        elements.logoInput.click();
    });
    
    elements.logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.logoUrl = event.target.result;
                elements.logoImg.src = state.logoUrl;
                elements.logoPlaceholder.hidden = true;
                elements.logoPreview.hidden = false;
                updateCardPreview();
            };
            reader.readAsDataURL(file);
        }
    });
    
    elements.logoRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        state.logoUrl = null;
        elements.logoInput.value = '';
        elements.logoPlaceholder.hidden = false;
        elements.logoPreview.hidden = true;
        updateCardPreview();
    });
}

// ============================================
// INPUT HANDLERS
// ============================================

function initInputHandlers() {
    // Business name
    elements.businessName.addEventListener('input', (e) => {
        state.businessName = e.target.value;
        updateCardPreview();
        validateForm();
    });
    
    // Message
    elements.message.addEventListener('input', (e) => {
        state.message = e.target.value;
        updateCardPreview();
    });
    
    // Feedback URL
    let qrDebounceTimer;
    elements.feedbackUrl.addEventListener('input', (e) => {
        state.feedbackUrl = e.target.value;
        
        // Debounce QR generation
        clearTimeout(qrDebounceTimer);
        qrDebounceTimer = setTimeout(() => {
            if (isValidUrl(state.feedbackUrl)) {
                generateQRCode(state.feedbackUrl);
                elements.feedbackUrl.classList.remove('error');
                elements.feedbackUrlError.hidden = true;
            } else if (state.feedbackUrl.length > 0) {
                elements.feedbackUrl.classList.add('error');
                elements.feedbackUrlError.hidden = false;
                clearQRCode();
            } else {
                elements.feedbackUrl.classList.remove('error');
                elements.feedbackUrlError.hidden = true;
                clearQRCode();
            }
            validateForm();
        }, 500);
    });
    
    // CTA text
    elements.ctaText.addEventListener('input', (e) => {
        state.ctaText = e.target.value;
        updateCardPreview();
    });
}

// ============================================
// QR CODE GENERATION
// ============================================

async function generateQRCode(url) {
    try {
        const qrDataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 0,
            color: {
                dark: state.colors.qrColor,
                light: state.colors.background
            },
            errorCorrectionLevel: 'H'
        });
        
        state.qrCodeUrl = qrDataUrl;
        
        // Update card preview
        elements.cardQr.innerHTML = `<img src="${qrDataUrl}" alt="QR Code" style="width: 144px; height: 144px;">`;
        validateForm();
    } catch (error) {
        console.error('QR Code generation failed:', error);
        clearQRCode();
    }
}

function clearQRCode() {
    state.qrCodeUrl = '';
    elements.cardQr.innerHTML = '<span class="qr-placeholder">Enter a link to generate QR</span>';
}

// ============================================
// CARD PREVIEW
// ============================================

function updateCardPreview() {
    const card = elements.cardPreview;
    
    // Apply colors
    card.style.backgroundColor = state.colors.background;
    card.style.color = state.colors.text;
    
    // Update format class
    card.classList.remove('square');
    if (state.format === 'square') {
        card.classList.add('square');
    }
    
    // Update size class
    card.classList.remove('small', 'medium', 'large');
    card.classList.add(state.size);
    
    // Update logo
    if (state.logoUrl) {
        elements.cardLogoImg.src = state.logoUrl;
        elements.cardLogo.hidden = false;
    } else {
        elements.cardLogo.hidden = true;
    }
    
    // Update text
    elements.cardBusinessName.textContent = state.businessName || 'Your Business';
    elements.cardBusinessName.style.color = state.colors.text;
    
    elements.cardMessage.textContent = state.message || 'We value your feedback. Scan to share your experience.';
    elements.cardMessage.style.color = state.colors.text;
    elements.cardMessage.style.opacity = '0.7';
    
    elements.cardCta.textContent = (state.ctaText || 'Scan to Review').toUpperCase();
    elements.cardCta.style.color = state.colors.text;
    
    // Update QR wrapper border (semi-transparent)
    const textColor = state.colors.text;
    elements.cardQr.style.borderColor = textColor + '33'; // 20% opacity
}

// ============================================
// FORM VALIDATION
// ============================================

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
}

function validateForm() {
    const hasBusinessName = state.businessName.trim().length > 0;
    const hasValidUrl = isValidUrl(state.feedbackUrl);
    const hasQR = state.qrCodeUrl.length > 0;
    
    const isValid = hasBusinessName && hasValidUrl && hasQR;
    
    elements.downloadBtn.disabled = !isValid;
    elements.downloadHint.hidden = isValid;
    
    return isValid;
}

// ============================================
// DOWNLOAD FUNCTIONALITY
// ============================================

function initDownload() {
    elements.downloadBtn.addEventListener('click', async () => {
        if (!validateForm()) return;
        
        elements.downloadBtn.disabled = true;
        elements.downloadBtn.textContent = 'Generating...';
        
        try {
            // Use html-to-image library
            const dataUrl = await htmlToImage.toPng(elements.cardPreview, {
                pixelRatio: 3,
                quality: 1,
                backgroundColor: state.colors.background
            });
            
            // Create download link
            const safeName = state.businessName.replace(/[^a-zA-Z0-9]/g, '-') || 'qr-card';
            const link = document.createElement('a');
            link.download = `${safeName}-${state.format}-${state.size}-hd.png`;
            link.href = dataUrl;
            link.click();
            
            // Show success feedback
            elements.downloadBtn.textContent = 'Downloaded!';
            setTimeout(() => {
                elements.downloadBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download HD PNG
                `;
                elements.downloadBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Download failed:', error);
            elements.downloadBtn.textContent = 'Download failed. Try again.';
            setTimeout(() => {
                elements.downloadBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download HD PNG
                `;
                elements.downloadBtn.disabled = false;
            }, 2000);
        }
    });
}

// ============================================
// THEME TOGGLE
// ============================================

function initThemeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('qr-card-theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
    }
    
    elements.themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');
        localStorage.setItem('qr-card-theme', isLight ? 'light' : 'dark');
    });
}

// ============================================
// MOBILE NAVIGATION
// ============================================

function initMobileNav() {
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileNav.classList.add('open');
    });
    
    elements.mobileNavClose.addEventListener('click', () => {
        elements.mobileNav.classList.remove('open');
    });
    
    // Close on link click
    elements.mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileNav.classList.remove('open');
        });
    });
}

// ============================================
// ABOUT MODAL
// ============================================

function initAboutModal() {
    const openModal = () => {
        elements.aboutModal.hidden = false;
    };
    
    const closeModal = () => {
        elements.aboutModal.hidden = true;
    };
    
    elements.aboutBtn.addEventListener('click', openModal);
    elements.aboutBtnMobile.addEventListener('click', () => {
        elements.mobileNav.classList.remove('open');
        openModal();
    });
    elements.aboutBtnFooter.addEventListener('click', openModal);
    elements.aboutModalClose.addEventListener('click', closeModal);
    
    // Close on backdrop click
    elements.aboutModal.addEventListener('click', (e) => {
        if (e.target === elements.aboutModal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.aboutModal.hidden) {
            closeModal();
        }
    });
}

// ============================================
// OFFLINE BADGE
// ============================================

function initOfflineBadge() {
    // The app works 100% offline - the badge shows this
    // No additional logic needed as it's always displayed
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Set current year in footer
    elements.currentYear.textContent = new Date().getFullYear();
    
    // Render templates
    renderTemplates();
    
    // Initialize all components
    initFormatSelector();
    initSizeSelector();
    initLogoUpload();
    initInputHandlers();
    initDownload();
    initThemeToggle();
    initMobileNav();
    initAboutModal();
    initOfflineBadge();
    
    // Initial preview update
    updateCardPreview();
    updatePreviewSpecs();
    validateForm();
    
    console.log('QR Card Studio initialized successfully!');
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
