/* Version: 2026-0119-1700 */
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

    // 判斷是否為直式裝置(手機與平板)- 修正斷點為 834px
    function isPortraitDevice() {
        return window.innerWidth <= 834 && window.matchMedia("(orientation: portrait)").matches;
    }

    // === 階段性縮放效果(不跟隨滾動)=== 
    const sectionStates = new Map();
    
    function updateStagedParallax() {
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        
        // 處理所有 sections (包含 logo section)
        contentSections.forEach(section => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - windowCenter);
            
            // 判斷當前階段
            let stage;
            if (distance < windowHeight * 0.2) {
                stage = 'center'; // 在視窗中心附近
            } else if (distance < windowHeight * 0.5) {
                stage = 'near'; // 接近視窗中心
            } else {
                stage = 'far'; // 遠離視窗中心
            }
            
            // 只在階段改變時更新縮放
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
                
                parallaxBg.style.transform = `scale(${scale})`;
            }
        });
        
        // 處理 contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                
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
                    
                    parallaxBg.style.transform = `scale(${scale})`;
                }
            }
        }
    }

    // === 啟用滾動監聽 ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateStagedParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // === 內容動畫觀察器 ===
    const observerOptions = {
        root: null,
        threshold: isLandscapeMobile() ? 0.1 : 0.2,
        rootMargin: '0px'
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
        // 跳過 logo section，它有自己的動畫
        if (section.id !== 'logo-section') {
            contentObserver.observe(section);
        }
    });
    
    // 單獨觀察 Contact Section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contentObserver.observe(contactSection);
    }

    // === Logo 初始動畫 ===
    if (logoSection) {
        const parallaxBg = logoSection.querySelector('.parallax-bg');
        const logoContainer = logoSection.querySelector('.logo-animation-container');
        
        // 初始狀態：模糊 + 放大
        logoSection.classList.add('initial-blur');
        if (parallaxBg) {
            parallaxBg.style.transform = 'scale(1.8)';
        }
        if (logoContainer) {
            logoContainer.style.opacity = '0';
        }
        
        // 延遲後開始動畫
        setTimeout(() => {
            // Logo 淡入
            if (logoContainer) {
                logoContainer.style.transition = 'opacity 1.5s ease-out';
                logoContainer.style.opacity = '1';
            }
            
            // 移除模糊，開始清晰過渡
            setTimeout(() => {
                logoSection.classList.remove('initial-blur'); 
                logoSection.classList.add('fade-out-overlay');
                logoSection.classList.add('loaded');
                
                // 恢復正常縮放，讓階段性縮放效果接管
                if (parallaxBg) {
                    parallaxBg.style.transition = 'transform 2s ease-out, filter 2s ease-out';
                    parallaxBg.style.transform = 'scale(1.0)';
                }
                
                // 立即執行一次階段性縮放更新
                setTimeout(() => {
                    updateStagedParallax();
                }, 100);
            }, 300);/* Version: 2026-0119-OPTIMIZED */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');
    const pageLoader = document.getElementById('page-loader');

    // 判斷是否為手機橫向
    function isLandscapeMobile() {
        return window.matchMedia("(orientation: landscape)").matches && window.innerHeight < 500;
    }

    // 判斷是否為直向裝置(手機與平板)- 修正斷點為 834px
    function isPortraitDevice() {
        return window.innerWidth <= 834 && window.matchMedia("(orientation: portrait)").matches;
    }

    // 檢查用戶是否偏好減少動態效果
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // === 載入指示器處理 ===
    window.addEventListener('load', () => {
        if (pageLoader) {
            if (prefersReducedMotion) {
                // 如果用戶偏好減少動態,直接隱藏
                pageLoader.style.display = 'none';
            } else {
                // 正常淡出動畫
                pageLoader.classList.add('hidden');
                // 動畫結束後移除元素
                setTimeout(() => {
                    pageLoader.style.display = 'none';
                }, 500);
            }
        }
    });

    // === 階段性縮放效果(不跟隨滾動)=== 
    const sectionStates = new Map();
    
    function updateStagedParallax() {
        // 如果用戶偏好減少動態,跳過視差效果
        if (prefersReducedMotion) return;
        
        const windowHeight = window.innerHeight;
        const windowCenter = windowHeight / 2;
        
        // 處理所有 sections (包含 logo section)
        contentSections.forEach(section => {
            const parallaxBg = section.querySelector('.parallax-bg');
            if (!parallaxBg) return;
            
            const rect = section.getBoundingClientRect();
            const sectionCenter = rect.top + rect.height / 2;
            const distance = Math.abs(sectionCenter - windowCenter);
            
            // 判斷當前階段
            let stage;
            if (distance < windowHeight * 0.2) {
                stage = 'center'; // 在視窗中心附近
            } else if (distance < windowHeight * 0.5) {
                stage = 'near'; // 接近視窗中心
            } else {
                stage = 'far'; // 遠離視窗中心
            }
            
            // 只在階段改變時更新縮放
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
                
                parallaxBg.style.transform = `scale(${scale})`;
            }
        });
        
        // 處理 contact-footer-wrapper
        if (contactFooterWrapper) {
            const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
            if (parallaxBg) {
                const rect = contactFooterWrapper.getBoundingClientRect();
                const sectionCenter = rect.top + rect.height / 2;
                const distance = Math.abs(sectionCenter - windowCenter);
                
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
                    
                    parallaxBg.style.transform = `scale(${scale})`;
                }
            }
        }
    }

    // === 啟用滾動監聽 ===
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateStagedParallax();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // === 內容動畫觀察器 ===
    // 檢查瀏覽器是否支援 Intersection Observer
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const observerOptions = {
            root: null,
            threshold: isLandscapeMobile() ? 0.1 : 0.2,
            rootMargin: '0px'
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
            // 跳過 logo section,它有自己的動畫
            if (section.id !== 'logo-section') {
                contentObserver.observe(section);
            }
        });
        
        // 單獨觀察 Contact Section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contentObserver.observe(contactSection);
        }
    } else {
        // 降級方案:不支援 Intersection Observer 或用戶偏好減少動態時,直接顯示所有內容
        contentSections.forEach(section => {
            const contentContainer = section.querySelector('.content-container');
            if (contentContainer) {
                contentContainer.classList.add('visible');
            }
        });
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contentContainer = contactSection.querySelector('.content-container');
            if (contentContainer) {
                contentContainer.classList.add('visible');
            }
        }
    }

    // === Logo 初始動畫 ===
    if (logoSection && !prefersReducedMotion) {
        const parallaxBg = logoSection.querySelector('.parallax-bg');
        const logoContainer = logoSection.querySelector('.logo-animation-container');
        
        // 初始狀態:模糊 + 放大
        logoSection.classList.add('initial-blur');
        if (parallaxBg) {
            parallaxBg.style.transform = 'scale(1.8)';
        }
        if (logoContainer) {
            logoContainer.style.opacity = '0';
        }
        
        // 延遲後開始動畫
        setTimeout(() => {
            // Logo 淡入
            if (logoContainer) {
                logoContainer.style.transition = 'opacity 1.5s ease-out';
                logoContainer.style.opacity = '1';
            }
            
            // 移除模糊,開始清晰過渡
            setTimeout(() => {
                logoSection.classList.remove('initial-blur'); 
                logoSection.classList.add('fade-out-overlay');
                logoSection.classList.add('loaded');
                
                // 恢復正常縮放,讓階段性縮放效果接管
                if (parallaxBg) {
                    parallaxBg.style.transition = 'transform 2s ease-out, filter 2s ease-out';
                    parallaxBg.style.transform = 'scale(1.0)';
                }
                
                // 立即執行一次階段性縮放更新
                setTimeout(() => {
                    updateStagedParallax();
                }, 100);
            }, 300);
        }, 100);
    } else if (logoSection && prefersReducedMotion) {
        // 如果用戶偏好減少動態,直接顯示 Logo
        const logoContainer = logoSection.querySelector('.logo-animation-container');
        if (logoContainer) {
            logoContainer.style.opacity = '1';
        }
        logoSection.classList.add('loaded');
    }

    // 初始執行一次
    setTimeout(() => {
        updateStagedParallax();
    }, 150);

    // === 漢堡選單 ===
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

    // === 漢堡選單連結點擊處理 ===
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 只對錨點連結(#contact)進行特殊處理
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
            // 其他連結(新分頁)讓瀏覽器正常處理
        });
    });
});
        }, 100);
    }

    // 初始執行一次
    setTimeout(() => {
        updateStagedParallax();
    }, 150);

    // === 漢堡選單 ===
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

    // === 漢堡選單連結點擊處理 ===
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 只對錨點連結(#contact)進行特殊處理
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
            // 其他連結(新分頁)讓瀏覽器正常處理
        });
    });
});