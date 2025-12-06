/* Version: 2025-1206-1500 */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 判斷是否為手機直式
    const isMobilePortrait = () => window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches;
    
    // ----------------------------------------------------------------------
    // I. 內容動畫觀察器 (Content Animation Observer)
    // ----------------------------------------------------------------------

    // 手機直式 (Mobile Portrait) 門檻值調整
    const mobileObserverOptions = {
        root: null,
        threshold: 0.1, // 降低門檻，讓動畫更容易觸發
        rootMargin: '0px 0px 0px 0px'
    };

    // 橫向/桌面 (Landscape/Desktop) 門檻值
    const desktopObserverOptions = {
        threshold: (window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500) ? 0.1 : 0.25,
        rootMargin: '0px 0px -10% 0px'
    };

    let selectedObserver = new IntersectionObserver(() => {}, {}); // 預設空觀察器

    const createContentObserver = (options) => new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const contentContainer = entry.target.querySelector('.content-container');
            if (!contentContainer) return;
            
            if (entry.isIntersecting) {
                contentContainer.classList.add('visible');
                contentContainer.classList.remove('fade-out');
            } else if (entry.boundingClientRect.top > entry.rootBounds.height || entry.boundingClientRect.bottom < 0) {
                // 只有當元素完全移出視窗時才fade-out
                contentContainer.classList.remove('visible');
                contentContainer.classList.add('fade-out');
            }
        });
    }, options);

    const mobileContentObserver = createContentObserver(mobileObserverOptions);
    const desktopContentObserver = createContentObserver(desktopObserverOptions);

    // ----------------------------------------------------------------------
    // II. 視差效果邏輯 (Parallax Logic)
    // ----------------------------------------------------------------------

    // 電腦版/橫式手機 (JS 驅動 background-size)
    let parallaxTicking = false;
    function updateDesktopParallax() {
        if (isMobilePortrait()) return; // 手機直式使用 CSS 變數

        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const isLandscapeMobile = window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
                // Base scale increased to 130 for landscape mobile
                const baseScale = isLandscapeMobile ? 130 : 105;
                
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

    // 手機直式 (CSS 驅動 transform + JS 監聽滾動)
    let mobileTicking = false;
    function updateMobileParallax() {
        if (!isMobilePortrait()) return;
        
        if (!mobileTicking) {
            requestAnimationFrame(() => {
                const windowHeight = window.innerHeight;
                contentSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distance = Math.abs(sectionCenter - windowCenter);
                        // progress: 0 (在中間) to 1 (在邊緣)
                        const progress = Math.min(distance / (windowHeight / 2), 1);
                        // Scale: 1.05 (在中間) to 1.25 (在邊緣)
                        let scale = 1.05 + (progress * 0.2); 
                        section.style.setProperty('--bg-scale', scale);
                    }
                });
                
                if (contactFooterWrapper) {
                    const rect = contactFooterWrapper.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const sectionCenter = rect.top + rect.height / 2;
                        const windowCenter = windowHeight / 2;
                        const distance = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distance / (windowHeight / 2), 1);
                        let scale = 1.05 + (progress * 0.2);
                        contactFooterWrapper.style.setProperty('--bg-scale', scale);
                    }
                }
                mobileTicking = false;
            });
            mobileTicking = true;
        }
    }

    // 滾動事件處理
    function onScroll() {
        updateDesktopParallax();
        updateMobileParallax();
    }
    
    // ----------------------------------------------------------------------
    // III. 初始化與事件監聽 (Initialization and Listeners)
    // ----------------------------------------------------------------------

    // 選擇正確的觀察器並開始觀察
    const initObservers = () => {
        // 清除所有舊的觀察
        if (selectedObserver) {
            contentSections.forEach(section => selectedObserver.unobserve(section));
        }

        if (isMobilePortrait()) {
            selectedObserver = mobileContentObserver;
            window.removeEventListener('scroll', updateDesktopParallax, { passive: true });
            window.addEventListener('scroll', onScroll, { passive: true });
        } else {
            selectedObserver = desktopContentObserver;
            window.removeEventListener('scroll', updateMobileParallax, { passive: true });
            window.addEventListener('scroll', onScroll, { passive: true });
        }

        contentSections.forEach(section => {
            selectedObserver.observe(section);
            // 初始化背景縮放效果
            if (!isMobilePortrait() && section.id !== 'logo-section') {
                section.style.backgroundSize = '105% auto'; 
            } else if (isMobilePortrait() && section.id !== 'logo-section') {
                 section.style.setProperty('--bg-scale', '1.05');
            }
        });
        
        // 初始化 logo 區塊
        setTimeout(() => {
            logoSection.classList.add('loaded');
            if (!isMobilePortrait()) {
                logoSection.style.backgroundSize = '100% auto';
            } else {
                logoSection.style.setProperty('--bg-scale', '1.0');
            }
        }, 300); // 延遲載入效果
    };

    initObservers();
    
    // 漢堡選單處理
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            // 處理語言切換連結
            if (this.classList.contains('lang-switch') || this.classList.contains('lang-switch-btn')) {
                // 直接進行頁面跳轉 (已修正為相對路徑)
                window.location.href = this.getAttribute('href');
                return;
            }

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

    // 視窗大小改變時重新初始化觀察器 (Debounced Resize)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initObservers();
        }, 200);
    });

    // 確保頁面載入時滾動到頂部 (避免被瀏覽器記憶位置)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
});