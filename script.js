/* Version: 2025-1025-0200 */
// Intersection Observer API 與手機直式視差效果修正

document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 背景縮放觀察器 - 電腦版專用
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                const sectionTop = rect.top;
                const sectionHeight = rect.height;
                const sectionBottom = rect.bottom;
                
                let scale = 1.0;
                
                if (sectionTop > windowHeight * 0.3) {
                    scale = 1.4;
                } else if (sectionBottom < windowHeight * 0.7) {
                    scale = 1.4;
                } else {
                    const centerProgress = Math.abs(sectionTop + sectionHeight/2 - windowHeight/2) / (windowHeight/2);
                    scale = 1.0 + (centerProgress * 0.4);
                }
                
                if (section.id === 'logo-section') {
                    if (section.classList.contains('loaded')) {
                        section.style.backgroundSize = `${scale * 100}% auto`;
                    }
                } else {
                    section.style.backgroundSize = `${scale * 100}% auto`;
                }
            });
        },
        {
            root: null,
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            rootMargin: '0px'
        }
    );

    // 內容動畫觀察器 - 電腦版
    const contentObserver = new IntersectionObserver(
        (entries) => {
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
        },
        {
            root: null,
            threshold: 0.35,
            rootMargin: '15% 0px -50% 0px'
        }
    );

    // 手機直式內容動畫觀察器 - 修正版本
    const mobileContentObserver = new IntersectionObserver(
        (entries) => {
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
        },
        {
            root: null,
            threshold: 0.25,
            rootMargin: '20% 0px -55% 0px'
        }
    );

    // 手機橫式內容動畫觀察器
    const landscapeContentObserver = new IntersectionObserver(
        (entries) => {
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
        },
        {
            root: null,
            threshold: 0.3,
            rootMargin: '15% 0px -55% 0px'
        }
    );

    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    const isMobile = window.innerWidth <= 768;
    
    let selectedObserver = contentObserver;
    if (isMobile && !isLandscape) {
        selectedObserver = mobileContentObserver;
    } else if (isLandscape) {
        selectedObserver = landscapeContentObserver;
    }

    // 開始觀察所有內容區塊
    contentSections.forEach(section => {
        if (window.innerWidth > 768 || isLandscape) {
            backgroundScaleObserver.observe(section);
        }
        selectedObserver.observe(section);
    });

    if (contactFooterWrapper) {
        if (window.innerWidth > 768 || isLandscape) {
            backgroundScaleObserver.observe(contactFooterWrapper);
        }
        selectedObserver.observe(contactFooterWrapper);
    }
    
    // 平滑滾動功能
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href.startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            // 移除所有 active 狀態
            hamburgerNavLinks.forEach(l => l.classList.remove('active'));
            // 添加 active 狀態到當前點擊的連結
            this.classList.add('active');
            
            if (targetElement) {
                if (hamburgerNavOverlay) {
                    hamburgerNavOverlay.style.display = 'none';
                    hamburgerNavToggle.classList.remove('active');
                    hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 漢堡導覽按鈕事件
    if (hamburgerNavToggle && hamburgerNavOverlay) {
        hamburgerNavToggle.addEventListener('click', function() {
            const isOpen = hamburgerNavOverlay.style.display === 'flex';
            hamburgerNavOverlay.style.display = isOpen ? 'none' : 'flex';
            hamburgerNavToggle.setAttribute('aria-expanded', !isOpen);
            
            // 切換 active 類別來觸發 X 動畫
            if (isOpen) {
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.blur();
            } else {
                hamburgerNavToggle.classList.add('active');
                const firstLink = hamburgerNavMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });
    }

    // 點擊遮罩關閉導覽選單
    if (hamburgerNavOverlay) {
        hamburgerNavOverlay.addEventListener('click', function(e) {
            if (e.target === hamburgerNavOverlay) {
                hamburgerNavOverlay.style.display = 'none';
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                hamburgerNavToggle.blur();
            }
        });
    }

    // === 鍵盤導航支援 - 無障礙功能 ===
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            if (hamburgerNavOverlay && hamburgerNavOverlay.style.display === 'flex') {
                hamburgerNavOverlay.style.display = 'none';
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                hamburgerNavToggle.focus();
                setTimeout(() => hamburgerNavToggle.blur(), 100);
            }
        }
    });

    // Tab 鍵焦點陷阱 - 保持焦點在打開的選單內
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (hamburgerNavOverlay && hamburgerNavOverlay.style.display === 'flex') {
                const focusableElements = hamburgerNavMenu.querySelectorAll('a');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        }
    });

    // === Logo 背景縮放效果與毛玻璃漸隱效果 ===
    if (logoSection) {
        logoSection.classList.add('initial-blur'); 

        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
        }, 500);
    }

    // 手機直式視差效果修正 - 使用 requestAnimationFrame 優化
    let ticking = false;
    let lastScrollY = 0;

    function updateMobileParallax() {
        const isMobileView = window.innerWidth <= 768;
        const isLandscapeView = window.matchMedia("(orientation: landscape)").matches;
        
        if (!isMobileView || isLandscapeView) {
            return;
        }

        contentSections.forEach(section => {
            if (section.id === 'logo-section') {
                return;
            }

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const windowCenter = windowHeight / 2;
                const distance = sectionCenter - windowCenter;
                const maxDistance = windowHeight / 2;
                const progress = Math.min(Math.abs(distance) / maxDistance, 1);
                
                let scale = 1.05 + (progress * 0.45);
                
                section.style.setProperty('--bg-scale', scale);
                section.style.backgroundSize = `${scale * 100}% auto`;
            }
        });

        // 聯絡我們區塊視差
        if (contactFooterWrapper) {
            const rect = contactFooterWrapper.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const windowCenter = windowHeight / 2;
                const distance = sectionCenter - windowCenter;
                const maxDistance = windowHeight / 2;
                const progress = Math.min(Math.abs(distance) / maxDistance, 1);
                
                let scale = 1.05 + (progress * 0.45);
                contactFooterWrapper.style.setProperty('--bg-scale', scale);
                contactFooterWrapper.style.backgroundSize = `${scale * 100}% auto`;
            }
        }

        // Logo 視差特殊處理
        if (logoSection && logoSection.classList.contains('loaded')) {
            const rect = logoSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (rect.bottom > 0 && rect.top < windowHeight) {
                const sectionCenter = rect.top + rect.height / 2;
                const windowCenter = windowHeight / 2;
                const distance = sectionCenter - windowCenter;
                const maxDistance = windowHeight / 2;
                const progress = Math.min(Math.abs(distance) / maxDistance, 1);
                
                let mobileScale = 1.05 + (progress * 0.45);
                logoSection.style.setProperty('--bg-scale', mobileScale);
                logoSection.style.backgroundSize = `${mobileScale * 100}% auto`;
            }
        }

        ticking = false;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            requestAnimationFrame(updateMobileParallax);
            ticking = true;
        }
    }

    if (window.innerWidth <= 768 && !window.matchMedia("(orientation: landscape)").matches) {
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // === 無障礙功能:跳過連結處理 ===
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // 視窗大小改變時重新計算觀察器
    window.addEventListener('resize', () => {
        const newIsLandscape = window.matchMedia("(orientation: landscape)").matches;
        const newIsMobile = window.innerWidth <= 768;
        
        let newSelectedObserver = contentObserver;
        if (newIsMobile && !newIsLandscape) {
            newSelectedObserver = mobileContentObserver;
        } else if (newIsLandscape) {
            newSelectedObserver = landscapeContentObserver;
        }

        if (newSelectedObserver !== selectedObserver) {
            selectedObserver = newSelectedObserver;
        }
    });

    // 確保頁面載入時滾動到頂部
    if (window.matchMedia("(orientation: landscape)").matches) {
        window.scrollTo(0, 0);
    }
});