/* Version: 2025-1203-1645 */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 背景縮放觀察器 - 電腦版 & 手機橫式 (JS 驅動 background-size)
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                
                // 排除手機直式 (因為手機直式用 CSS transform)
                if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const windowCenter = windowHeight / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                    const maxDistance = windowHeight;
                    const progress = Math.min(distanceFromCenter / maxDistance, 1);
                    
                    // 視差縮放邏輯: 
                    // 為了不露出底色，手機橫式 base scale 需較大
                    const isLandscapeMobile = window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
                    const baseScale = isLandscapeMobile ? 120 : 105; 
                    const variableScale = isLandscapeMobile ? 15 : 15;
                    
                    let scale = baseScale + (progress * variableScale);
                    
                    if (section.id === 'logo-section') {
                        if (section.classList.contains('loaded')) {
                            section.style.backgroundSize = `${scale}% auto`;
                        }
                    } else {
                        section.style.backgroundSize = `${scale}% auto`;
                    }
                    
                    if (progress > 0.5) {
                        section.classList.add('parallax-scale-up');
                        section.classList.remove('parallax-scale-down');
                    } else {
                        section.classList.add('parallax-scale-down');
                        section.classList.remove('parallax-scale-up');
                    }
                }
            });
        },
        { root: null, threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], rootMargin: '0px' }
    );

    // 持續監聽滾動 - 平滑更新 background-size
    let parallaxTicking = false;
    function updateDesktopParallax() {
        if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) return;
        
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const isLandscapeMobile = window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
                const baseScale = isLandscapeMobile ? 120 : 105;
                
                contentSections.forEach(section => {
                    if (section.id === 'logo-section' && !section.classList.contains('loaded')) return;
                    
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distanceFromCenter / windowHeight, 1);
                        
                        let scale = baseScale + (progress * 15);
                        section.style.backgroundSize = `${scale}% auto`;
                    }
                });
                
                if (contactFooterWrapper) {
                    const rect = contactFooterWrapper.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distanceFromCenter / windowHeight, 1);
                        let scale = baseScale + (progress * 15);
                        contactFooterWrapper.style.backgroundSize = `${scale}% auto`;
                    }
                }
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }
    window.addEventListener('scroll', updateDesktopParallax, { passive: true });

    // 內容動畫觀察器
    const observerOptions = {
        root: null,
        // 手機橫向門檻值降低，確保動畫容易觸發
        threshold: (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) ? 0.1 : 0.25,
        rootMargin: '0px 0px -10% 0px'
    };

    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 注意：這裡修正為抓取 content-container
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

    contentSections.forEach(section => {
        contentObserver.observe(section);
        if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
            backgroundScaleObserver.observe(section);
        }
    });
    // 獨立觀察 Contact Wrapper
    if (contactFooterWrapper) {
        // 因為 Contact 區塊在 wrapper 內，動畫需觀察 wrapper 或內部 section
        const contactSection = document.getElementById('contact');
        if (contactSection) contentObserver.observe(contactSection);
        
        if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
            backgroundScaleObserver.observe(contactFooterWrapper);
        }
    }

    // Logo 初始動畫
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
            logoSection.style.setProperty('--logo-bg-scale', '1.8');
        }
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
            if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
                setTimeout(() => {
                    logoSection.style.setProperty('--logo-bg-scale', '1.05');
                }, 100);
            }
        }, 500);
    }

    // 手機直式視差效果
    let mobileTicking = false;
    function updateMobileParallax() {
        const isMobileView = window.innerWidth <= 768;
        const isLandscapeView = window.matchMedia("(orientation: landscape)").matches;
        
        if (!isMobileView || isLandscapeView) return;

        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        if (logoSection && logoSection.classList.contains('loaded')) {
            const rect = logoSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                let scale = 1.05 + (progress * 0.2); 
                logoSection.style.setProperty('--logo-bg-scale', scale);
            }
        }

        contentSections.forEach(section => {
            if (section.id === 'logo-section') return;
            const rect = section.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                let scale = 1.05 + (progress * 0.2);
                section.style.setProperty('--bg-scale', scale);
            }
        });

        if (contactFooterWrapper) {
            const rect = contactFooterWrapper.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                let scale = 1.05 + (progress * 0.2);
                contactFooterWrapper.style.setProperty('--bg-scale', scale);
            }
        }
        mobileTicking = false;
    }

    if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
        window.addEventListener('scroll', () => {
            if (!mobileTicking) {
                requestAnimationFrame(updateMobileParallax);
                mobileTicking = true;
            }
        }, { passive: true });
    }

    // 導覽列與選單 (維持原樣)
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) return;
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            hamburgerNavLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            if (targetElement) {
                if (hamburgerNavOverlay) {
                    hamburgerNavOverlay.style.display = 'none';
                    hamburgerNavToggle.classList.remove('active');
                    hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                }
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

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
});