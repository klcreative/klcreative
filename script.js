// 版本 48: 修正手機橫式模糊範圍、恢復視差效果、Logo 淡入淡出
document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const logoContainer = document.querySelector('.logo-animation-container');
    const navItems = document.querySelectorAll('#main-nav a');

    // 檢測瀏覽器類型
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMacOS = navigator.platform.indexOf('Mac') > -1;

    // Safari 特殊處理
    if (isSafari || isMacOS) {
        sections.forEach(section => {
            section.style.transform = 'translateZ(0)';
            section.style.willChange = 'transform, filter';
        });
    }

    // Logo 淡入效果（頁面載入時）
    window.addEventListener('load', function() {
        if (logoContainer) {
            logoContainer.style.opacity = '0';
            setTimeout(() => {
                logoContainer.style.opacity = '1';
            }, 300);
        }
    });

    // Logo 淡入淡出觀察器
    const logoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (logoContainer) {
                if (entry.isIntersecting) {
                    // Logo 區塊進入視窗 - 淡入
                    logoContainer.classList.remove('fade-out');
                    logoContainer.style.opacity = '1';
                } else {
                    // Logo 區塊離開視窗 - 淡出
                    logoContainer.classList.add('fade-out');
                    logoContainer.style.opacity = '0';
                }
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    });

    // 手機背景填滿處理
    function adjustMobileBackground() {
        if (window.innerWidth <= 768) {
            sections.forEach(section => {
                if (section.id === 'logo-section') return;
                
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // 確保背景完全填滿
                section.style.minHeight = viewportHeight + 'px';
                
                // 直式螢幕特殊處理
                if (window.innerHeight > window.innerWidth) {
                    section.style.backgroundSize = 'cover';
                    section.style.backgroundPosition = 'center center';
                }
            });
        }
    }

    // 導覽列淡入淡出效果
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.style.opacity = 0;
            } else {
                header.style.opacity = 1;
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    // 導覽列淡入淡出效果
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.style.opacity = 0;
            } else {
                header.style.opacity = 1;
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    if (logoSection) {
        headerObserver.observe(logoSection);
        logoObserver.observe(logoSection); // 為 Logo 區塊添加觀察器
    }

    // 內容區塊動畫觀察器
    const contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const textAndImage = entry.target.querySelector('.text-and-image');
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                if (textAndImage) {
                    textAndImage.classList.add('visible');
                }
            } else {
                entry.target.classList.add('hidden');
                entry.target.classList.remove('visible');
                if (textAndImage) {
                    textAndImage.classList.remove('visible');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.3
    });

    // 背景模糊效果觀察器 - 針對手機橫式調整觸發範圍
    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('unblurred');
            } else {
                entry.target.classList.remove('unblurred');
            }
        });
    }, {
        root: null,
        rootMargin: getBlurObserverMargin(), // 動態調整邊距
        threshold: 0.3 // 降低閾值讓手機橫式更容易觸發
    });

    // 根據螢幕方向和尺寸調整觀察器邊距
    function getBlurObserverMargin() {
        const isMobile = window.innerWidth <= 768;
        const isLandscape = window.innerWidth > window.innerHeight;
        
        if (isMobile && isLandscape) {
            // 手機橫式 - 大幅放寬觸發區域
            return '-20% 0px -20% 0px';
        } else if (isMobile) {
            // 手機直式 - 適中的觸發區域
            return '-30% 0px -30% 0px';
        } else {
            // 桌面版 - 標準觸發區域
            return '0px';
        }
    }

    // 為所有區塊添加觀察器
    sections.forEach(section => {
        // 跳過 logo section 的內容動畫
        if (section.id !== 'logo-section') {
            section.classList.add('hidden');
            contentObserver.observe(section);
        }
        
        // 為所有區塊添加模糊效果觀察器（除了 logo section）
        if (section.id !== 'logo-section') {
            blurObserver.observe(section);
        }
    });

    // 平滑捲動效果
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 處理視窗大小變化和背景調整
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // 重新調整手機背景
            adjustMobileBackground();
            
            // 重新創建模糊觀察器以適應新的螢幕尺寸
            const newBlurObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('unblurred');
                    } else {
                        entry.target.classList.remove('unblurred');
                    }
                });
            }, {
                root: null,
                rootMargin: getBlurObserverMargin(),
                threshold: 0.3
            });
            
            // 重新為所有區塊添加新的觀察器
            sections.forEach(section => {
                if (section.id !== 'logo-section') {
                    newBlurObserver.observe(section);
                }
            });
            
            // 手動檢查當前可見性
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const viewHeight = window.innerHeight;
                const isVisible = rect.top < viewHeight * 0.7 && rect.bottom > viewHeight * 0.3;
                
                if (isVisible) {
                    section.classList.add('unblurred');
                } else {
                    section.classList.remove('unblurred');
                }
            });
            
            // Safari 強制重繪
            if (isSafari || isMacOS) {
                sections.forEach(section => {
                    section.style.transform = section.style.transform;
                });
            }
        }, 250);
    });

    // 初始化檢查和背景調整
    window.addEventListener('load', function() {
        // 調整手機背景
        adjustMobileBackground();
        
        sections.forEach(section => {
            if (section.id === 'logo-section') return;
            
            const rect = section.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            const isVisible = rect.top < viewHeight * 0.7 && rect.bottom > viewHeight * 0.3;
            
            if (isVisible) {
                section.classList.add('visible');
                section.classList.remove('hidden');
            }
        });
        
        // Safari 初始化強制重繪
        if (isSafari || isMacOS) {
            setTimeout(() => {
                sections.forEach(section => {
                    section.style.transform = section.style.transform;
                });
            }, 100);
        }
    });

    // 方向改變處理（手機）
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustMobileBackground();
        }, 500);
    });
});