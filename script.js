// 2025-09-27-1830
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

    // 用於背景縮放與內容動畫的觀察器
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // --- 背景縮放邏輯 ---
                let scale = 1.0;
                const sectionCenterY = rect.top + rect.height / 2;
                const progress = Math.abs(sectionCenterY - windowHeight / 2) / (windowHeight / 2);
                scale = 1.0 + Math.min(progress, 1) * 0.4;
                
                if (section.id === 'logo-section') {
                    if (section.classList.contains('loaded')) {
                        section.style.backgroundSize = `${scale * 100}% auto`;
                    }
                } else {
                    section.style.backgroundSize = `${scale * 100}% auto`;
                }
                
                if (window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.orientation === 0)) {
                    if (section.id === 'logo-section' && section.classList.contains('loaded')) {
                        section.style.setProperty('--bg-scale', scale);
                    } else if (section.id !== 'logo-section') {
                        section.style.setProperty('--bg-scale', scale);
                    }
                }

                // --- 新的內容淡入淡出與滑入滑出動畫邏輯 ---
                const animatedElements = entry.target.querySelectorAll('.animate-left, .animate-right');
                if (animatedElements.length > 0) {
                    const sectionCenter = rect.top + rect.height / 2;
                    const screenCenter = windowHeight / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - screenCenter);
                    
                    // 當區塊中心在螢幕中心 +/- 50% 高度以外時，開始淡出
                    const fadeZone = windowHeight / 2; 
                    const animationProgress = Math.min(distanceFromCenter / fadeZone, 1);

                    // 使用平方增強緩動效果
                    const opacity = 1 - Math.pow(animationProgress, 2); 

                    const maxTranslate = 60; // pixels
                    const translate = animationProgress * maxTranslate;

                    animatedElements.forEach(el => {
                        el.style.opacity = opacity < 0.05 ? '0' : opacity.toFixed(2); // 避免極小值
                        const isLeft = el.classList.contains('animate-left');
                        const direction = isLeft ? -1 : 1;
                        el.style.transform = `translateX(${direction * translate}px)`;
                    });
                }
            });
        },
        {
            root: null,
            // 使用密集的閾值陣列來確保動畫在滾動時持續觸發
            threshold: Array.from({ length: 101 }, (_, i) => i / 100),
            rootMargin: '0px'
        }
    );

    // 建立一個 Intersection Observer 來處理導覽列的淡入淡出
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
        {
            root: null,
            threshold: 0.1,
        }
    );

    // 開始觀察每個內容區塊
    contentSections.forEach(section => {
        animationObserver.observe(section);
    });

    // 觀察聯絡我區域
    if (contactFooterWrapper) {
        animationObserver.observe(contactFooterWrapper);
    }

    // 開始觀察 logo 區塊以控制導覽列的顯示
    if (logoSection) {
        headerObserver.observe(logoSection);
    }
    
    // 平滑滾動功能（針對導覽列連結）
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 手機版導覽選單平滑滾動功能
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (!href.startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                if (mobileNavOverlay) {
                    mobileNavOverlay.style.display = 'none';
                }
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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

    // === Logo 背景縮放效果與毛玻璃漸隱效果 ===
    if (logoSection) {
        logoSection.classList.add('initial-blur'); 

        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
        }, 500);
    }
});