/* Version: 2026-0121-PARALLAX-V2 - Enhanced Dynamic Parallax with GA4 */
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

    // === 增強型視差效果：垂直移動 + 縮放，根據滾動位置動態變化 ===
    function updateDynamicParallax() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // 處理所有 content sections
        contentSections.forEach((section, index) => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            const sectionMiddle = sectionTop + sectionHeight / 2;
            
            // 計算區塊相對於視窗中心的位置 (-1 到 1)
            const viewportMiddle = scrollY + windowHeight / 2;
            const distanceFromCenter = (sectionMiddle - viewportMiddle) / windowHeight;
            
            // 每個區塊有不同的視差速度係數（根據索引創造層次感）
            const speedFactor = 0.15 + (index * 0.05); // 0.15, 0.20, 0.25, 0.30...
            
            // 計算垂直位移（限制範圍避免露底）
            const maxTranslateY = 15; // 最大移動百分比
            let translateY = distanceFromCenter * speedFactor * 100;
            translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
            
            // 計算縮放（根據距離動態變化）
            const absDistance = Math.abs(distanceFromCenter);
            let scale;
            if (absDistance < 0.3) {
                // 在視窗中心附近：正常大小
                scale = 1.0;
            } else if (absDistance < 0.8) {
                // 中距離：輕微縮放
                scale = 1.0 + (absDistance - 0.3) * 0.24; // 1.0 到 1.12
            } else {
                // 遠距離：更大縮放
                scale = 1.12 + (absDistance - 0.8) * 0.65; // 1.12 到 1.25
                scale = Math.min(scale, 1.3); // 限制最大縮放
            }
            
            // 應用變換（使用 translate3d 優化效能）
            parallaxBg.style.transform = `translate3d(0, ${translateY}%, 0) scale(${scale})`;
        });
        
        // 處理 contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                const sectionTop = rect.top + scrollY;
                const sectionHeight = rect.height;
                const sectionMiddle = sectionTop + sectionHeight / 2;
                
                const viewportMiddle = scrollY + windowHeight / 2;
                const distanceFromCenter = (sectionMiddle - viewportMiddle) / windowHeight;
                
                // contact 區域使用最慢的速度
                const speedFactor = 0.12;
                
                const maxTranslateY = 15;
                let translateY = distanceFromCenter * speedFactor * 100;
                translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, translateY));
                
                const absDistance = Math.abs(distanceFromCenter);
                let scale;
                if (absDistance < 0.3) {
                    scale = 1.0;
                } else if (absDistance < 0.8) {
                    scale = 1.0 + (absDistance - 0.3) * 0.24;
                } else {
                    scale = 1.12 + (absDistance - 0.8) * 0.65;
                    scale = Math.min(scale, 1.3);
                }
                
                parallaxBg.style.transform = `translate3d(0, ${translateY}%, 0) scale(${scale})`;
            }
        }
    }

    // === 使用 requestAnimationFrame 優化滾動效能 ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateDynamicParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 視窗大小改變時重新計算
    window.addEventListener('resize', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateDynamicParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // 初始執行
    updateDynamicParallax();

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

    // === Logo initial animation ===
    if (logoSection) {
        const parallaxBg = logoSection.querySelector('.parallax-bg');
        
        // Initial state: blurred + zoomed
        logoSection.classList.add('initial-blur');
        if (parallaxBg) {
            parallaxBg.style.transform = 'translate3d(0, 0, 0) scale(1.8)';
        }
        
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
            
            // 立即執行視差效果計算
            setTimeout(() => {
                updateDynamicParallax();
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
                trackEvent('menu_close', {
                    menu_type: 'hamburger_navigation'
                });
            } else {
                hamburgerNavToggle.classList.add('active');
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
            
            trackEvent('social_click',