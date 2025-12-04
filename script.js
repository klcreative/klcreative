/* Version: 2025-1204-1515 */
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');

    // 統一視差效果 - 所有設備使用相同邏輯
    let parallaxTicking = false;
    function updateParallax() {
        if (!parallaxTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                // 處理所有區塊的視差背景
                contentSections.forEach(section => {
                    const parallaxBg = section.querySelector('.parallax-bg');
                    if (!parallaxBg) return;
                    
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top + scrollY;
                    const sectionHeight = rect.height;
                    const windowHeight = window.innerHeight;
                    
                    // 計算區塊在視窗中的位置
                    const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                    
                    // 視差移動範圍：-15% 到 +15%
                    const parallaxOffset = (scrollProgress - 0.5) * 30;
                    
                    // 應用視差效果
                    parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
                });
                
                // 處理 contact-footer-wrapper 的視差背景
                if (contactFooterWrapper) {
                    const parallaxBg = contactFooterWrapper.querySelector('.parallax-bg');
                    if (parallaxBg) {
                        const rect = contactFooterWrapper.getBoundingClientRect();
                        const sectionTop = rect.top + scrollY;
                        const sectionHeight = rect.height;
                        const windowHeight = window.innerHeight;
                        
                        const scrollProgress = (scrollY - sectionTop + windowHeight) / (windowHeight + sectionHeight);
                        const parallaxOffset = (scrollProgress - 0.5) * 30;
                        
                        parallaxBg.style.transform = `translateY(${parallaxOffset}%)`;
                    }
                }
                
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }

    // 啟用滾動監聽 - 所有設備
    window.addEventListener('scroll', updateParallax, { passive: true });
    
    // 初始執行一次
    updateParallax();

    // 內容動畫觀察器
    const observerOptions = {
        root: null,
        threshold: 0.25,
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

    // Logo 初始動畫
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        
        setTimeout(() => {
            logoSection.classList.remove('initial-blur');
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
        }, 500);
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