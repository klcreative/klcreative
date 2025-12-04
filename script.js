/* Version: 2025-1204-1545 */
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

    // === 雙重效果整合：背景縮放 + 視差移動 (桌面版 & 手機橫式) ===
    let desktopTicking = false;
    function updateDesktopEffects() {
        // 只在桌面版或手機橫式執行
        if (isPortraitMobile()) return;
        
        if (!desktopTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const baseScale = isLandscapeMobile() ? 140 : 105;
                const variableScale = isLandscapeMobile() ? 15 : 15;
                
                contentSections.forEach(section => {
                    const parallaxBg = section.querySelector('.parallax-bg');
                    if (!parallaxBg) return;
                    
                    // 跳過 logo-section 如果還沒載入
                    if (section.id === 'logo-section' && !section.classList.contains('loaded')) return;
                    
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        // 計算背景縮放
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                        const scaleProgress = Math.min(distanceFromCenter / windowHeight, 1);
                        let scale = baseScale + (scaleProgress * variableScale);
                        
                        // 計算視差移動
                        const sectionTop = rect.top + scrollY;
                        const sectionHeight = rect.height;
                        const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                        const parallaxOffset = (scrollProgress - 0.5) * 30;
                        
                        // 同時應用兩種效果
                        parallaxBg.style.backgroundSize = `${scale}% auto`;
                        parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
                    }
                });
                
                // 處理 contact-footer-wrapper
                if (contactFooterWrapper) {
                    const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
                    if (parallaxBg) {
                        const rect = contactFooterWrapper.getBoundingClientRect();
                        const windowHeight = window.innerHeight;
                        
                        if (rect.bottom > 0 && rect.top < windowHeight) {
                            // 背景縮放
                            const sectionCenter = rect.top + rect.height / 2;
                            const windowCenter = windowHeight / 2;
                            const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                            const scaleProgress = Math.min(distanceFromCenter / windowHeight, 1);
                            let scale = baseScale + (scaleProgress * variableScale);
                            
                            // 視差移動
                            const sectionTop = rect.top + scrollY;
                            const sectionHeight = rect.height;
                            const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                            const parallaxOffset = (scrollProgress - 0.5) * 30;
                            
                            parallaxBg.style.backgroundSize = `${scale}% auto`;
                            parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
                        }
                    }
                }
                
                desktopTicking = false;
            });
            desktopTicking = true;
        }
    }

    // === 手機直式視差效果 (保留原本設定) ===
    let mobileTicking = false;
    function updateMobileParallax() {
        if (!isPortraitMobile()) return;

        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        const scrollY = window.pageYOffset;

        // Logo section 特殊處理
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

        // 其他 sections
        contentSections.forEach(section => {
            if (section.id === 'logo-section') return;
            
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                // 背景縮放
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                let scale = 1.05 + (progress * 0.2);
                section.style.setProperty('--bg-scale', scale);
                
                // 視差移動
                const sectionTop = rect.top + scrollY;
                const sectionHeight = rect.height;
                const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                const parallaxOffset = (scrollProgress - 0.5) * 30;
                parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
            }
        });

        // contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < windowHeight) {
                    const sectionCenter = rect.top + rect.height / 2;
                    const distance = Math.abs(sectionCenter - windowCenter);
                    const progress = Math.min(distance / (windowHeight / 2), 1);
                    let scale = 1.05 + (progress * 0.2);
                    contactFooterWrapper.style.setProperty('--bg-scale', scale);
                    
                    const sectionTop = rect.top + scrollY;
                    const sectionHeight = rect.height;
                    const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                    const parallaxOffset = (scrollProgress - 0.5) * 30;
                    parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
                }
            }
        }
        
        mobileTicking = false;
    }

    // === 啟用滾動監聽 ===
    if (isPortraitMobile()) {
        // 手機直式
        window.addEventListener('scroll', () => {
            if (!mobileTicking) {
                requestAnimationFrame(updateMobileParallax);
                mobileTicking = true;
            }
        }, { passive: true });
    } else {
        // 桌面版 & 手機橫式
        window.addEventListener('scroll', updateDesktopEffects, { passive: true });
    }

    // 初始執行
    if (isPortraitMobile()) {
        updateMobileParallax();
    } else {
        updateDesktopEffects();
    }

    // === 內容動畫觀察器 ===
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
    });
    
    // 單獨觀察 Contact Section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contentObserver.observe(contactSection);
    }

    // === Logo 初始動畫 ===
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

    // === 漢堡選單與平滑滾動 ===
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