/* Version: 2025-0929-1030 */
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
                            // 手機直式logo縮放邏輯：從1.8放大/縮小
                            let mobileScale = 1.8;
                            if (sectionTop > windowHeight * 0.3) {
                                mobileScale = 1.8;
                            } else if (sectionBottom < windowHeight * 0.7) {
                                mobileScale = 1.8;
                            } else {
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
            rootMargin: '