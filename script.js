/* Version: 2025-1203-1600 */
// Intersection Observer API 與手機直式視差效果修正

document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 背景縮放觀察器 - 電腦版 (background-size 動畫)
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                
                // 僅在桌面版或支援 fixed background 的環境執行
                if (window.innerWidth > 768 || window.matchMedia("(orientation: landscape)").matches) {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const windowCenter = windowHeight / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                    const maxDistance = windowHeight;
                    const progress = Math.min(distanceFromCenter / maxDistance, 1);
                    
                    // 視差縮放邏輯: 105% -> 120%
                    let scale = 105 + (progress * 15);
                    
                    if (section.id === 'logo-section') {
                        if (section.classList.contains('loaded')) {
                            section.style.backgroundSize = `${scale}% auto`;
                        }
                    } else {
                        // 針對橫向手機，確保 cover
                        if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) {
                             section.style.backgroundSize = `cover`;
                        } else {
                             section.style.backgroundSize = `${scale}% auto`;
                        }
                    }
                }
            });
        },
        {
            root: null,
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: '0px'
        }
    );

    // 持續監聽滾動來更新電腦版視差效果 (更平滑)
    let parallaxTicking = false;
    function updateDesktopParallax() {
        if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
            return; // 手機直向不執行此邏輯
        }
        
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                contentSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distanceFromCenter / windowHeight, 1);
                        
                        let scale = 105 + (progress * 15);
                        
                        // 橫向手機強制 cover 避免露底色
                        if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) {
                             // Do nothing, let CSS handle cover
                        } else {
                             section.style.backgroundSize = `${scale}% auto`;
                        }
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
                        let scale = 105 + (progress * 15);
                        
                        if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) {
                             // contact wrapper is tricky in landscape, rely on cover
                        } else {
                             contactFooterWrapper.style.backgroundSize = `${scale}% auto`;
                        }
                    }
                }
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }
    
    window.addEventListener('scroll', updateDesktopParallax, { passive: true });

    // 內容動畫觀察器 - 通用設定
    const observerOptions = {
        root: null,
        // 手機橫向(高度小)時，threshold 要很低，確保稍微碰到就顯示
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

    // 開始觀察所有內容區塊
    contentSections.forEach(section => {
        contentObserver.observe(section);
    });
    if (contactFooterWrapper) {
        contentObserver.observe(contactFooterWrapper);
    }
    
    // 平滑滾動功能 (維持原樣)
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

    // 漢堡導覽按鈕事件 (維持原樣)
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

    // === Logo 初始動畫 ===
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        // 手機直向設定變數
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

    // === 手機直式視差效果修正 (使用 CSS 變數) ===
    let mobileTicking = false;
    function updateMobileParallax() {
        const isMobileView = window.innerWidth <= 768;
        const isLandscapeView = window.matchMedia("(orientation: landscape)").matches;
        
        // 僅在手機直向執行
        if (!isMobileView || isLandscapeView) return;

        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;

        // Logo 區塊
        if (logoSection && logoSection.classList.contains('loaded')) {
            const rect = logoSection.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                const progress = Math.min(distance / (windowHeight / 2), 1);
                // 視差範圍 1.05 -> 1.25
                let scale = 1.05 + (progress * 0.2); 
                logoSection.style.setProperty('--logo-bg-scale', scale);
            }
        }

        // 其他內容區塊
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

        // 聯絡我們區塊
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

    // 視窗大小改變時重新整理
    window.addEventListener('resize', () => {
        // 重新載入或重置部分邏輯
    });
});