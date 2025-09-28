// 2025-09-29-0300
// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    // 手機版導覽選單相關元素
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('#mobile-nav-menu a');

    // 新的背景縮放觀察器
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                let scale = 1.0;
                if (rect.top > windowHeight * 0.3) {
                    scale = 1.4;
                } else if (rect.bottom < windowHeight * 0.7) {
                    scale = 1.4;
                } else {
                    const centerProgress = Math.abs(rect.top + rect.height/2 - windowHeight/2) / (windowHeight/2);
                    scale = 1.0 + (centerProgress * 0.4);
                }
                
                if (section.id === 'logo-section') {
                    if (section.classList.contains('loaded')) {
                        section.style.backgroundSize = `${scale * 100}% auto`;
                    }
                } else {
                    section.style.backgroundSize = `${scale * 100}% auto`;
                }
                
                // 手機版偽元素縮放
                if (window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.orientation === 0)) {
                    section.style.setProperty('--bg-scale', scale);
                }
            });
        },
        { root: null, threshold: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], rootMargin: '0px' }
    );

    // 內容動畫觀察器
    const contentObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                if (entry.isIntersecting) {
                    if (contentContainer) contentContainer.classList.add('visible');
                } else {
                    if (contentContainer) contentContainer.classList.remove('visible');
                }
            });
        },
        { root: null, threshold: 0.1, rootMargin: '20% 0px -70% 0px' }
    );

    // 導覽列淡入淡出觀察器
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (mainHeader) {
                        mainHeader.style.opacity = '0';
                        mainHeader.style.pointerEvents = 'none';
                    }
                } else {
                    if (mainHeader) {
                        mainHeader.style.opacity = '1';
                        mainHeader.style.pointerEvents = 'auto';
                    }
                }
            });
        },
        { root: null, threshold: 0.1 }
    );

    // 開始觀察
    contentSections.forEach(section => {
        backgroundScaleObserver.observe(section);
        contentObserver.observe(section);
    });
    if (contactFooterWrapper) {
        backgroundScaleObserver.observe(contactFooterWrapper);
        contentObserver.observe(contactFooterWrapper);
    }
    if (logoSection) {
        headerObserver.observe(logoSection);
    }
    // 平滑滾動功能（針對桌機導覽列連結）
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 手機版導覽選單平滑滾動
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href.startsWith('#')) return;
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                if (mobileNavOverlay) mobileNavOverlay.style.display = 'none';
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 手機版導覽按鈕點擊事件
    if (mobileNavToggle && mobileNavOverlay) {
        mobileNavToggle.addEventListener('click', function() {
            if (mobileNavOverlay.style.display === 'flex') {
                mobileNavOverlay.style.display = 'none';
            } else {
                mobileNavOverlay.style.display = 'flex';
            }
        });
    }

    // 點擊遮罩關閉導覽選單
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.style.display = 'none';
            }
        });
    }

    // Logo 背景縮放效果與毛玻璃漸隱效果
    if (logoSection) {
        logoSection.classList.add('initial-blur');
        setTimeout(() => {
            logoSection.classList.remove('initial-blur');
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
        }, 500);
    }

    // 滾動時更新背景縮放
    let ticking = false;
    function updateBackgroundScale() {
        if (!ticking) {
            requestAnimationFrame(() => {
                contentSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const centerY = rect.top + rect.height / 2;
                        const windowCenterY = windowHeight / 2;
                        const distanceFromCenter = Math.abs(centerY - windowCenterY);
                        const maxDistance = windowHeight / 2;
                        const progress = Math.min(distanceFromCenter / maxDistance, 1);
                        let scale = 1.0 + (progress * 0.4);
                        if (section.id === 'logo-section' && !section.classList.contains('loaded')) return;
                        section.style.backgroundSize = `${scale * 100}% auto`;
                    }
                });
                if (contactFooterWrapper) {
                    const rect = contactFooterWrapper.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.bottom > 0 && rect.top < windowHeight) {
                        const centerY = rect.top + rect.height / 2;
                        const windowCenterY = windowHeight / 2;
                        const distanceFromCenter = Math.abs(centerY - windowCenterY);
                        const maxDistance = windowHeight / 2;
                        const progress = Math.min(distanceFromCenter / maxDistance, 1);
                        let scale = 1.0 + (progress * 0.4);
                        contactFooterWrapper.style.backgroundSize = `${scale * 100}% auto`;
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    window.addEventListener('scroll', updateBackgroundScale);

    // === 新增：手機直式橫式導覽列平滑滾動 ===
    const bottomNavLinks = document.querySelectorAll('#mobile-bottom-nav a[href^="#"]');
    bottomNavLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
