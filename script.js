// 2025-09-27-2300
document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav-menu a');

    // 更柔順的動畫觸發
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        },
        {
            root: null,
            threshold: 0.2, // 當元素可見 20% 時觸發
            rootMargin: '0px'
        }
    );

    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (mainHeader) {
                    mainHeader.style.opacity = entry.isIntersecting ? '0' : '1';
                    mainHeader.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
                }
            });
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    contentSections.forEach(section => {
        animationObserver.observe(section);
    });
    
    if (logoSection) {
        headerObserver.observe(logoSection);
    }
    
    // 平滑滾動
    const setupSmoothScroll = (selector) => {
        document.querySelectorAll(selector).forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        if (mobileNavOverlay && mobileNavOverlay.style.display === 'flex') {
                           mobileNavOverlay.style.display = 'none';
                        }
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });
    };

    setupSmoothScroll('#main-nav a');
    setupSmoothScroll('#mobile-nav-menu a');

    // 手機導覽選單
    if (mobileNavToggle && mobileNavOverlay) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavOverlay.style.display = (mobileNavOverlay.style.display === 'flex') ? 'none' : 'flex';
        });
        mobileNavOverlay.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.style.display = 'none';
            }
        });
    }

    // Logo 效果
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        // 延長模糊效果時間以匹配 CSS
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay', 'loaded');
        }, 800);
    }
});