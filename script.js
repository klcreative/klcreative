/* Version: 2025-1204-1500 */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 判斷是否為手機橫式
    function isLandscapeMobile() {
        return window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
    }

    // 判斷是否為手機直式
    function isPortraitMobile() {
        return window.innerWidth <= 768 && window.matchMedia("(orientation: portrait)").matches;
    }

    // 背景縮放觀察器 - 電腦版 & 手機橫式
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                
                // 只在桌面版或手機橫式執行
                if (!isPortraitMobile()) {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const windowCenter = windowHeight / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                    const maxDistance = windowHeight;
                    const progress = Math.min(distanceFromCenter / maxDistance, 1);
                    
                    // 手機橫式 base scale 設為 140
                    const baseScale = isLandscapeMobile() ? 140 : 105; 
                    const variableScale = isLandscapeMobile() ? 15 : 15; // 手機橫式也用 15
                    
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

    // 持續監聽滾動 - 平滑更新 background-size (桌面版 & 手機橫式)
    let parallaxTicking = false;
    function updateDesktopParallax() {
        // 排除手機直式
        if (isPortraitMobile()) return;
        
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const baseScale = isLandscapeMobile() ? 140 : 105;
                const variableScale = isLandscapeMobile() ? 15 : 15;
                
                contentSections.forEach(section => {
                    if (section.id === 'logo-section' && !section.classList.contains('loaded')) return;
                    
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distanceFromCenter / windowHeight, 1);
                        
                        let scale = baseScale + (progress * variableScale);
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
                        let scale = baseScale + (progress * variableScale);
                        contactFooterWrapper.style.backgroundSize = `${scale}% auto`;
                    }
                }
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }
    
    // 啟用滾動監聽 (桌面版 & 手機橫式)
    window.addEventListener('scroll', updateDesktopParallax, { passive: true });

    // 內容動畫觀察器
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

    // 觀察所有區塊
    contentSections.forEach(section => {
        contentObserver.observe(section);
        // 桌面版 & 手機橫式啟用背景縮放觀察器
        if (!isPortraitMobile()) {
            backgroundScaleObserver.observe(section);
        }
    });
    
    // 稍立觀察 Contact Section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contentObserver.observe(contactSection);
    }
    
    if (contactFooterWrapper) {
        // 桌面版 & 手機橫式啟用背景縮放觀察器
        if (!isPortraitMobile()) {
            backgroundScaleObserver.observe(contactFooterWrapper);
        }
    }

    // Logo 初始動畫
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        if (isPortraitMobile()) {
            logoSection.style.setProperty('--logo-bg-scale', '1.8');
        }
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
            if (isPortraitMobile()) {
                setTimeout(() => {
                    logoSection.style.setProperty('--logo-bg-scale', '1.05');
                }, 100);
            }
        }, 500);
    }

    // === 加強手機直式視差效果 ===
    let mobileTicking = false;
    function updateMobileParallax() {
        if (!isPortraitMobile()) return;

        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        if (logoSection && logoSection.classList.contains('loaded')) {
            const rect = logoSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                // 加強視差：從 1.05 變化到 1.35（增加 0.3）
                let scale = 1.05 + (progress * 0.3); 
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
                // 加強視差：從 1.05 變化到 1.35（增加 0.3）
                let scale = 1.05 + (progress * 0.3);
                section.style.setProperty('--bg-scale', scale);
            }
        });

        if (contactFooterWrapper) {
            const rect = contactFooterWrapper.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                // 加強視差：從 1.05 變化到 1.35（增加 0.3）
                let scale = 1.05 + (progress * 0.3);
                contactFooterWrapper.style.setProperty('--bg-scale', scale);
            }
        }
        mobileTicking = false;
    }

    // 啟用手機直式視差
    if (isPortraitMobile()) {
        window.addEventListener('scroll', () => {
            if (!mobileTicking) {
                requestAnimationFrame(updateMobileParallax);
                mobileTicking = true;
            }
        }, { passive: true });
    }

    // 漢堡選單與平滑滾動
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