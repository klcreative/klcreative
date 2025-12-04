/* Version: 2025-1204-1230 */
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
                    // 手機橫式 base scale 增加到 130，確保不露底色 
                    // 桌面版 base scale 增加到 110 (原 105)
                    const isLandscapeMobile = window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
                    const baseScale = isLandscapeMobile ? 130 : 110; 
                    const variableScale = 15;
                    
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
                // Base scale increased to 110 for desktop (原 105)
                const baseScale = isLandscapeMobile ? 130 : 110;
                
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
                
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }
    
    // 橫向裝置也使用此 parallax 邏輯
    window.addEventListener('scroll', updateDesktopParallax, { passive: true });

    // 內容動畫觀察器 (Content Animation Observer)
    const observerOptions = {
        root: null,
        // 手機橫向門檻值降低
        threshold: (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) ? 0.1 : 0.25,
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

    contentSections.forEach(section => {
        if (section.id !== 'logo-section') {
            contentObserver.observe(section);
            backgroundScaleObserver.observe(section);
        }
    });
    
    backgroundScaleObserver.observe(contactFooterWrapper);

    // Logo 載入動畫
    const logoImg = logoSection.querySelector('img');
    if (logoImg) {
        logoImg.onload = () => {
            setTimeout(() => {
                logoSection.classList.add('loaded');
                setTimeout(() => {
                    logoSection.classList.add('unblurred');
                }, 1000);
            }, 100);
        };
        // 處理圖片已經在快取中的情況
        if (logoImg.complete) {
            logoImg.onload();
        }
    }
    
    // === 手機直式視差效果 (CSS Transform) ===
    let mobileTicking = false;
    
    function updateMobileParallax() {
        if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) return;

        if (!mobileTicking) {
            requestAnimationFrame(() => {
                contentSections.forEach(section => {
                    if (section.id === 'logo-section') return;
                    
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionTop = rect.top;
                        const sectionHeight = rect.height;
                        const windowCenter = windowHeight / 2;
                        const sectionCenter = sectionTop + sectionHeight / 2;
                        const distance = Math.abs(sectionCenter - windowCenter);
                        // 滾動進度 (0 到 1)
                        const progress = Math.min(distance / (windowHeight / 2), 1); 
                        
                        // Scale base 從 1.05 增加到 1.1
                        let scale = 1.1 + (progress * 0.2); 
                        
                        section.style.setProperty('--bg-scale', scale);
                    }
                });
                
                const rect = contactFooterWrapper.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.bottom > 0 && rect.top < windowHeight) {
                    const sectionTop = rect.top;
                    const sectionHeight = rect.height;
                    const windowCenter = windowHeight / 2;
                    const sectionCenter = sectionTop + sectionHeight / 2;
                    const distance = Math.abs(sectionCenter - windowCenter);
                    const progress = Math.min(distance / (windowHeight / 2), 1); 
                    
                    // Scale base 從 1.05 增加到 1.1
                    let scale = 1.1 + (progress * 0.2); 
                    contactFooterWrapper.style.setProperty('--bg-scale', scale);
                }
                
                mobileTicking = false;
            });
            mobileTicking = true;
        }
    }

    function onScroll() {
        if (!mobileTicking) {
            requestAnimationFrame(updateMobileParallax);
            mobileTicking = true;
        }
    }

    if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // === 導覽選單功能 ===
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
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