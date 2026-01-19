/* Version: 2026-0119-1900 */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // Check if mobile landscape mode
    function isLandscapeMobile() {
        return window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
    }

    // Check if portrait device (mobile & tablet) - breakpoint corrected to 834px
    function isPortraitDevice() {
        return window.innerWidth <= 834 && window.matchMedia("(orientation: portrait)").matches;
    }

    // === Staged parallax effect (non-scrolling) ===
    const sectionStates = new Map();
    
    function updateStagedParallax() {
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        
        // Process all sections (including logo section)
        contentSections.forEach(section => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - windowCenter);
            
            // Determine current stage
            let stage;
            if (distance < windowHeight * 0.2) {
                stage = 'center'; // Near viewport center
            } else if (distance < windowHeight * 0.5) {
                stage = 'near'; // Approaching viewport center
            } else {
                stage = 'far'; // Far from viewport center
            }
            
            // Only update scale when stage changes
            const currentStage = sectionStates.get(section);
            if (currentStage !== stage) {
                sectionStates.set(section, stage);
                
                let scale;
                switch(stage) {
                    case 'center':
                        scale = 1.0;
                        break;
                    case 'near':
                        scale = 1.12;
                        break;
                    case 'far':
                        scale = 1.25;
                        break;
                }
                
                parallaxBg.style.transform = `scale(${scale})`;
            }
        });
        
        // Process contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                
                let stage;
                if (distance < windowHeight * 0.2) {
                    stage = 'center';
                } else if (distance < windowHeight * 0.5) {
                    stage = 'near';
                } else {
                    stage = 'far';
                }
                
                const currentStage = sectionStates.get(contactFooterWrapper);
                if (currentStage !== stage) {
                    sectionStates.set(contactFooterWrapper, stage);
                    
                    let scale;
                    switch(stage) {
                        case 'center':
                            scale = 1.0;
                            break;
                        case 'near':
                            scale = 1.12;
                            break;
                        case 'far':
                            scale = 1.25;
                            break;
                    }
                    
                    parallaxBg.style.transform = `scale(${scale})`;
                }
            }
        }
    }

    // === Enable scroll monitoring ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateStagedParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial execution
    updateStagedParallax();

    // === Content animation observer ===
    const observerOptions = {
        root: null,
        threshold: isLandscapeMobile() ? 0.1 : 0.25,
        rootMargin: '0px 0px -10% 0px'
    };

    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const contentContainer = entry.target.querySelector('.content-container');
            if (entry.isIntersecting) {
                if (contentContainer) {
                    contentContainer.classList.add('visible');
                    contentContainer.classList.remove('fade-out');
                }
            } else {
                if (contentContainer) {
                    contentContainer.classList.remove('visible');
                    contentContainer.classList.add('fade-out');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    contentSections.forEach(section => {
        contentObserver.observe(section);
    });
    
    // Separately observe Contact Section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contentObserver.observe(contactSection);
    }

    // === Logo initial animation ===
    if (logoSection) {
        const parallaxBg = logoSection.querySelector('.parallax-bg');
        
        // Initial state: blurred + zoomed
        logoSection.classList.add('initial-blur');
        if (parallaxBg) {
            parallaxBg.style.transform = 'scale(1.8)';
        }
        
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
            
            // Restore normal scale, let staged parallax take over
            if (parallaxBg) {
                parallaxBg.style.transform = 'scale(1.0)';
            }
            
            // Immediately execute staged parallax update
            setTimeout(() => {
                updateStagedParallax();
            }, 100);
        }, 500);
    }

    // === Hamburger menu ===
    if (hamburgerNavToggle && hamburgerNavOverlay) {
        hamburgerNavToggle.addEventListener('click', function() {
            const isOpen = hamburgerNavOverlay.style.display === 'flex';
            hamburgerNavOverlay.style.display = isOpen ? 'none' : 'flex';
            hamburgerNavToggle.setAttribute('aria-expanded', !isOpen);
            if (isOpen) {
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.blur();
            } else {
                hamburgerNavToggle.classList.add('active');
            }
        });
        hamburgerNavOverlay.addEventListener('click', function(e) {
            if (e.target === hamburgerNavOverlay) {
                hamburgerNavOverlay.style.display = 'none';
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // === Hamburger menu link click handling ===
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Special handling only for anchor links (#contact)
            if (href === '#contact') {
                e.preventDefault();
                const targetElement = document.getElementById('contact');
                if (targetElement) {
                    if (hamburgerNavOverlay) {
                        hamburgerNavOverlay.style.display = 'none';
                        hamburgerNavToggle.classList.remove('active');
                        hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                    }
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // Other links (new pages) let browser handle normally
        });
    });
});