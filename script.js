/* Version: 2025-1203-1830 */
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
                    // 增加 base scale 確保不露底色 (電腦版/大橫式從 105 增加到 120, 手機橫式維持 130)
                    const isLandscapeMobile = window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
                    const baseScale = isLandscapeMobile ? 130 : 120; 
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
                // Base scale increased to 120 for desktop/large screen landscape
                const baseScale = isLandscapeMobile ? 130 : 120;
                
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
        contentObserver.observe(section);
        // 電腦版和橫向裝置啟動背景縮放視差
        if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
            backgroundScaleObserver.observe(section);
        }
    });

    // 獨立觀察 Contact Section
    const contactSection = document.getElementById('contact');
    if (contactSection) contentObserver.observe(contactSection);

    // 獨立觀察 Contact Footer Wrapper (給背景用)
    if (contactFooterWrapper) {
        if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
            backgroundScaleObserver.observe(contactFooterWrapper);
        }
    }


    // Logo 動畫
    function handleLogoAnimation() {
        const logoAnimationContainer = document.querySelector('.logo-animation-container');
        const mainContent = document.getElementById('main-content');
        
        if (!logoAnimationContainer || !logoSection || !mainContent) return;

        // 確保 Logo 區塊有初始模糊效果
        logoSection.classList.add('initial-blur');

        // 在 2.5 秒後執行動畫
        setTimeout(() => {
            logoAnimationContainer.style.opacity = '0';
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded'); // 啟用 parallax
            
            // 在動畫結束後移除 Logo 元素，讓滑動更順暢
            setTimeout(() => {
                logoAnimationContainer.style.display = 'none';
            }, 2000); // 配合 opacity 轉換時間

        }, 1500); // 延遲 1.5 秒開始淡出
    }
    
    // handleLogoAnimation(); // Disabled by user in previous turns

    // 漢堡選單邏輯
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