/* Version: 2026-0115-1300 */
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

    // === 統一視差效果：縮放 + 移動(適用所有裝置)===
    let ticking = false;
    function updateParallaxEffects() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const windowHeight = window.innerHeight;
                const windowCenter = windowHeight / 2;

                // 處理所有 sections (包含 logo section)
                contentSections.forEach(section => {
                    const parallaxBg = section.querySelector('.parallax-bg');
                    if (!parallaxBg) return;
                    
                    const rect = section.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        // 背景縮放計算
                        const sectionCenter = rect.top + rect.height / 2;
                        const distance = Math.abs(sectionCenter - windowCenter);
                        const progress = Math.min(distance / (windowHeight / 2), 1);
                        const scale = 1.0 + (progress * 0.25); // 縮放範圍 1.0 ~ 1.25
                        
                        // 視差移動計算
                        const sectionTop = rect.top + scrollY;
                        const sectionHeight = rect.height;
                        const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                        const parallaxOffset = (scrollProgress - 0.5) * 30;
                        
                        // 同時應用縮放和視差移動
                        parallaxBg.style.transform = `scale(${scale}) translateY(${parallaxOffset}%)`;
                    }
                });

                // 處理 contact-footer-wrapper
                if (contactFooterWrapper) {
                    const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
                    if (parallaxBg) {
                        const rect = contactFooterWrapper.getBoundingClientRect();
                        if (rect.bottom > 0 && rect.top < windowHeight) {
                            // 背景縮放計算
                            const sectionCenter = rect.top + rect.height / 2;
                            const distance = Math.abs(sectionCenter - windowCenter);
                            const progress = Math.min(distance / (windowHeight / 2), 1);
                            const scale = 1.0 + (progress * 0.25);
                            
                            // 視差移動計算
                            const sectionTop = rect.top + scrollY;
                            const sectionHeight = rect.height;
                            const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                            const parallaxOffset = (scrollProgress - 0.5) * 30;
                            
                            parallaxBg.style.transform = `scale(${scale}) translateY(${parallaxOffset}%)`;
                        }
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }

    // === 啟用滾動監聽 ===
    window.addEventListener('scroll', updateParallaxEffects, { passive: true });

    // 初始執行
    updateParallaxEffects();

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
        const parallaxBg = logoSection.querySelector('.parallax-bg');
        
        // 初始狀態：模糊 + 放大
        logoSection.classList.add('initial-blur');
        if (parallaxBg) {
            parallaxBg.style.transform = 'scale(1.8) translateY(0)';
        }
        
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
            
            // 恢復正常縮放,讓視差效果接管
            if (parallaxBg) {
                parallaxBg.style.transform = 'scale(1.0) translateY(0)';
            }
            
            // 立即執行一次視差更新以確保平滑過渡
            setTimeout(() => {
                updateParallaxEffects();
            }, 100);
        }, 500);
    }

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