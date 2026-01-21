/* Version: 2026-0121-PARALLAX-FIX-V2 - with GA4 Event Tracking */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // ========== GA4 Event Tracking Helper Function ==========
    function trackEvent(eventName, eventParams = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventParams);
            console.log('GA4 Event:', eventName, eventParams);
        }
    }

    // Detect if in English subfolder
    const isEnglishVersion = window.location.pathname.includes('/en/');
    const imagePrefix = isEnglishVersion ? '../images01/' : 'images01/';

    // Set background images dynamically
    const bgMappings = [
        { selector: '#logo-section .parallax-bg', image: 'top.webp' },
        { selector: '#about .parallax-bg', image: 'B-1-ABOUT.webp' },
        { selector: '#catering .parallax-bg', image: 'C-1-F&B.webp' },
        { selector: '#venue .parallax-bg', image: 'D-1-PLACE.webp' },
        { selector: '#event-catering .parallax-bg', image: 'E-1-EVENT.webp' },
        { selector: '#custom-gifts .parallax-bg', image: 'F-1-GIFT.webp' },
        { selector: '#corporate-catering .parallax-bg', image: 'G-1-ENTERPRISE.webp' },
        { selector: '#private-chef .parallax-bg', image: 'H-1-KITCHEN.webp' },
        { selector: '#contact-footer-wrapper .parallax-bg', image: 'I-1-CONTACT.webp' }
    ];

    bgMappings.forEach(mapping => {
        const element = document.querySelector(mapping.selector);
        if (element) {
            element.style.backgroundImage = `url('${imagePrefix}${mapping.image}')`;
        }
    });

    // Check if mobile landscape mode
    function isLandscapeMobile() {
        return window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
    }

    // Check if portrait device (mobile & tablet)
    function isPortraitDevice() {
        return window.innerWidth <= 834 && window.matchMedia("(orientation: portrait)").matches;
    }

    // ========== 視差滾動 + 原本的 Scale 階段效果 (方案A：擴大視差) ==========
    const PARALLAX_SPEED = 0.45; // 提高背景滾動速度，讓視差更明顯
    const sectionStates = new Map();
    
    function updateParallaxAndScale() {
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        const scrollY = window.pageYOffset || window.scrollY;
        
        // 根據裝置類型設定不同的移動範圍限制（配合更大的背景容器）
        let maxOffsetY;
        if (isPortraitDevice()) {
            // 手機直向：中等限制
            maxOffsetY = windowHeight * 0.25;
        } else if (isLandscapeMobile()) {
            // 手機橫向：較寬鬆限制
            maxOffsetY = windowHeight * 0.3;
        } else {
            // 桌面/平板橫向：最大限制
            maxOffsetY = windowHeight * 0.35;
        }
        
        // Process all sections (including logo section)
        contentSections.forEach(section => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - windowCenter);
            
            // === 1. 視差滾動效果 (translateY) - 加入範圍限制 ===
            let offsetY = (scrollY - sectionTop) * (1 - PARALLAX_SPEED);
            // 限制移動範圍，避免露出底色
            offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
            
            // === 2. 原本的 Scale 階段效果 (完全恢復原始邏輯) ===
            let stage;
            if (distance < windowHeight * 0.2) {
                stage = 'center';
            } else if (distance < windowHeight * 0.5) {
                stage = 'near';
            } else {
                stage = 'far';
            }
            
            // 只在階段改變時更新 scale
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
                
                // === 3. 合併 transform (保留原本 transition 邏輯) ===
                parallaxBg.style.transform = `scale(${scale}) translateY(${offsetY}px)`;
            } else {
                // 階段未改變，只更新 translateY (保持當前 scale)
                const currentTransform = parallaxBg.style.transform;
                const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
                const currentScale = scaleMatch ? scaleMatch[1] : '1.0';
                
                parallaxBg.style.transform = `scale(${currentScale}) translateY(${offsetY}px)`;
            }
        });
        
        // Process contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                const sectionTop = rect.top + scrollY;
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                
                // === 1. 視差滾動 - 加入範圍限制 ===
                let offsetY = (scrollY - sectionTop) * (1 - PARALLAX_SPEED);
                offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
                
                // === 2. Scale 階段 ===
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
                    
                    parallaxBg.style.transform = `scale(${scale}) translateY(${offsetY}px)`;
                } else {
                    const currentTransform = parallaxBg.style.transform;
                    const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
                    const currentScale = scaleMatch ? scaleMatch[1] : '1.0';
                    
                    parallaxBg.style.transform = `scale(${currentScale}) translateY(${offsetY}px)`;
                }
            }
        }
    }

    // === Enable scroll monitoring ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallaxAndScale();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial execution
    updateParallaxAndScale();

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

    // ========== GA4: Track when user scrolls to Contact Section ==========
    let contactTracked = false;
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !contactTracked) {
                trackEvent('scroll_to_contact', {
                    section_name: 'Contact Us'
                });
                contactTracked = true;
            }
        });
    }, { threshold: 0.5 });

    if (contactSection) {
        contactObserver.observe(contactSection);
    }

    // === Logo initial animation (完全恢復原本邏輯) ===
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
            
            // Restore normal scale, let parallax take over
            if (parallaxBg) {
                parallaxBg.style.transform = 'scale(1.0)';
            }
            
            // Immediately execute parallax update
            setTimeout(() => {
                updateParallaxAndScale();
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
                // ========== GA4: Track menu close ==========
                trackEvent('menu_close', {
                    menu_type: 'hamburger_navigation'
                });
            } else {
                hamburgerNavToggle.classList.add('active');
                // ========== GA4: Track menu open ==========
                trackEvent('menu_open', {
                    menu_type: 'hamburger_navigation'
                });
            }
        });
        
        hamburgerNavOverlay.addEventListener('click', function(e) {
            if (e.target === hamburgerNavOverlay) {
                hamburgerNavOverlay.style.display = 'none';
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                // ========== GA4: Track menu close by overlay click ==========
                trackEvent('menu_close', {
                    menu_type: 'hamburger_navigation',
                    close_method: 'overlay_click'
                });
            }
        });
    }

    // === Hamburger menu link click handling ===
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const linkText = this.textContent.trim();
            
            // ========== GA4: Track navigation clicks ==========
            trackEvent('navigation_click', {
                link_text: linkText,
                link_url: href,
                link_type: 'hamburger_menu'
            });
            
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
        });
    });

    // ========== GA4: Track Social Media Clicks ==========
    const socialLinks = document.querySelectorAll('.social-icons a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            let platform = 'unknown';
            
            if (href.includes('instagram.com')) {
                platform = 'Instagram';
            } else if (href.includes('facebook.com')) {
                platform = 'Facebook';
            } else if (href.includes('line') || href.includes('reurl.cc')) {
                platform = 'Line';
            }
            
            trackEvent('social_click', {
                platform: platform,
                link_url: href
            });
        });
    });

    // ========== GA4: Track Email Clicks ==========
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const email = this.getAttribute('href').replace('mailto:', '');
            
            trackEvent('email_click', {
                email_address: email,
                link_location: 'footer'
            });
        });
    });

    // ========== GA4: Track Service Page Clicks ==========
    const serviceLinks = document.querySelectorAll('.section-link');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const sectionId = this.closest('.content-section')?.id || 'unknown';
            const heading = this.querySelector('h2')?.textContent.trim() || 'Unknown Service';
            
            trackEvent('service_click', {
                service_name: heading,
                service_url: href,
                section_id: sectionId
            });
        });
    });

    // ========== GA4: Track Language Switch ==========
    const langSwitchBtns = document.querySelectorAll('.lang-switch, .lang-switch-btn');
    langSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const targetLang = this.textContent.trim();
            const currentLang = isEnglishVersion ? 'English' : 'Chinese';
            
            trackEvent('language_switch', {
                from_language: currentLang,
                to_language: targetLang === 'ENG' ? 'English' : 'Chinese'
            });
        });
    });

    // ========== GA4: Track Page View (SPA-like behavior) ==========
    // This tracks the initial page load
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        language: isEnglishVersion ? 'en' : 'zh'
    });

    // ========== GA4: Track Scroll Depth ==========
    let scrollDepthTracked = {
        '25': false,
        '50': false,
        '75': false,
        '100': false
    };

    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= parseInt(depth) && !scrollDepthTracked[depth]) {
                trackEvent('scroll_depth', {
                    percent_scrolled: depth
                });
                scrollDepthTracked[depth] = true;
            }
        });
    }, { passive: true });
});