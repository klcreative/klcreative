/* Version: 2025-0930-0100 */
// Intersection Observer API - 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

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

    // 手機橫式導覽選單相關元素
    const mobileLandscapeNavToggle = document.getElementById('mobile-landscape-nav-toggle');
    const mobileLandscapeNavOverlay = document.getElementById('mobile-landscape-nav-overlay');
    const mobileLandscapeNavLinks = document.querySelectorAll('#mobile-landscape-nav-menu a');

    // 新的背景縮放觀察器 - 更精細的三等份控制 (電腦版修改：雙向觸發)
    const backgroundScaleObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                const rect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                // 計算區塊在視窗中的位置比例
                const sectionTop = rect.top;
                const sectionHeight = rect.height;
                const sectionBottom = rect.bottom;
                
                let scale = 1.0; // 預設縮放
                
                if (sectionTop > windowHeight * 0.3) {
                    // 區塊在下方，尚未進入焦點區域 - 放大狀態
                    scale = 1.4;
                } else if (sectionBottom < windowHeight * 0.7) {
                    // 區塊在上方，已離開焦點區域 - 放大狀態
                    scale = 1.4;
                } else {
                    // 區塊在焦點區域內 - 正常大小
                    const centerProgress = Math.abs(sectionTop + sectionHeight/2 - windowHeight/2) / (windowHeight/2);
                    scale = 1.0 + (centerProgress * 0.4); // 漸變縮放
                }
                
                // 特殊處理 Logo 區塊
                if (section.id === 'logo-section') {
                    if (section.classList.contains('loaded')) {
                        section.style.backgroundSize = `${scale * 100}% auto`;
                        
                        // 手機直式：logo區域背景圖片縮放效果隨可視區域變化 (放大180%)
                        if (window.innerWidth <= 768) {
                            // 手機直式logo縮放邏輯：從1.8放大/縮小，並確保離開和進入時都有效果
                            let mobileScale = 1.8;
                            if (sectionTop > windowHeight * 0.3) {
                                // 區塊在下方 - 放大狀態
                                mobileScale = 1.8;
                            } else if (sectionBottom < windowHeight * 0.7) {
                                // 區塊在上方 - 放大狀態
                                mobileScale = 1.8;
                            } else {
                                // 區塊在焦點區域 - 正常大小
                                const centerProgress = Math.abs(sectionTop + sectionHeight/2 - windowHeight/2) / (windowHeight/2);
                                mobileScale = 1.0 + (centerProgress * 0.8); // 1.0到1.8的範圍
                            }
                            section.style.setProperty('--bg-scale', mobileScale);
                        }
                    }
                } else {
                    section.style.backgroundSize = `${scale * 100}% auto`;
                }
                
                // 處理手機版的偽元素縮放
                if (window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.orientation === 0)) {
                    if (section.id === 'logo-section' && section.classList.contains('loaded')) {
                        // Logo的縮放已在上面處理
                    } else if (section.id !== 'logo-section') {
                        section.style.setProperty('--bg-scale', scale);
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

    // 電腦版內容動畫觀察器 - 提早滑入，往下沉動提早滑出
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
                    // 電腦版、手機橫式、手機直式：雙向觸發滑出與淡出效果
                    if (contentContainer) {
                        contentContainer.classList.remove('visible');
                        contentContainer.classList.add('fade-out');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.35, // 電腦版：提早觸發滑入
            rootMargin: '15% 0px -50% 0px' // 電腦版：往下沉動提早滑出
        }
    );

    // 手機直式內容動畫觀察器 - 提早滑入及淡入觸發效果
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
            threshold: 0.25, // 手機直式：提早觸發
            rootMargin: '20% 0px -55% 0px' // 手機直式：調整觸發範圍
        }
    );

    // 手機橫式內容動畫觀察器 - 提早滑入及淡入觸發時間
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
            threshold: 0.3, // 手機橫式：提早觸發
            rootMargin: '15% 0px -55% 0px' // 手機橫式：調整觸發範圍
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

    // 根據設備選擇適當的觀察器
    const isLandscape = window.innerWidth > 768 && window.innerWidth <= 932 && window.matchMedia("(orientation: landscape)").matches;
    const isMobile = window.innerWidth <= 768;
    
    let selectedObserver = contentObserver; // 預設電腦版
    if (isMobile) {
        selectedObserver = mobileContentObserver;
    } else if (isLandscape) {
        selectedObserver = landscapeContentObserver;
    }

    // 開始觀察每個內容區塊
    contentSections.forEach(section => {
        backgroundScaleObserver.observe(section);
        selectedObserver.observe(section);
    });

    // 觀察聯絡我區域
    if (contactFooterWrapper) {
        backgroundScaleObserver.observe(contactFooterWrapper);
        selectedObserver.observe(contactFooterWrapper);
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
            
            // 跳過非錨點連結（如ENG語言切換）
            if (!href.startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 先隱藏導覽選單
                if (mobileNavOverlay) {
                    mobileNavOverlay.style.display = 'none';
                }
                
                // 然後滾動到目標位置
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 手機橫式導覽選單平滑滾動功能
    mobileLandscapeNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 跳過非錨點連結（如ENG語言切換）
            if (!href.startsWith('#')) {
                return;
            }
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 先隱藏導覽選單
                if (mobileLandscapeNavOverlay) {
                    mobileLandscapeNavOverlay.style.display = 'none';
                }
                
                // 然後滾動到目標位置
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

    // 手機橫式導覽按鈕點擊事件
    if (mobileLandscapeNavToggle && mobileLandscapeNavOverlay) {
        mobileLandscapeNavToggle.addEventListener('click', function() {
            if (mobileLandscapeNavOverlay.style.display === 'flex') {
                mobileLandscapeNavOverlay.style.display = 'none';
            } else {
                mobileLandscapeNavOverlay.style.display = 'flex';
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

    // 點擊遮罩關閉手機橫式導覽選單
    if (mobileLandscapeNavOverlay) {
        mobileLandscapeNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileLandscapeNavOverlay) {
                mobileLandscapeNavOverlay.style.display = 'none';
            }
        });
    }

    // === Logo 背景縮放效果與毛玻璃漸隱效果 ===
    if (logoSection) {
        // 點開網頁時的單次模糊漸變效果
        logoSection.classList.add('initial-blur'); 

        // 延遲後移除模糊，觸發過渡到清晰，並啟動縮放效果
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded'); // 啟動從180%到100%的縮放
        }, 500);
    }

    // 滾動時更新背景縮放（額外的滾動監聽）
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
                        
                        if (section.id === 'logo-section' && !section.classList.contains('loaded')) {
                            // Logo 載入前不套用滾動縮放
                            return;
                        }
                        
                        section.style.backgroundSize = `${scale * 100}% auto`;
                        
                        // 手機直式和平板直式的偽元素縮放
                        if (window.innerWidth <= 768) {
                            // 手機直式logo特殊縮放邏輯
                            if (section.id === 'logo-section') {
                                let mobileScale = 1.0 + (progress * 0.8); // 1.0到1.8的範圍
                                section.style.setProperty('--bg-scale', mobileScale);
                            } else {
                                section.style.setProperty('--bg-scale', scale);
                            }
                        } else if (window.innerWidth <= 1024 && window.orientation === 0) {
                            section.style.setProperty('--bg-scale', scale);
                        }
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
                        
                        // 手機直式和平板直式的偽元素縮放
                        if (window.innerWidth <= 768 || (window.innerWidth <= 1024 && window.orientation === 0)) {
                            contactFooterWrapper.style.setProperty('--bg-scale', scale);
                        }
                    }
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', updateBackgroundScale);
});