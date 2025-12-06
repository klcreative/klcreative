/* Version: 2025-1206-1900 */
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

    // 判斷是否為手機直式
    function isPortraitMobile() {
        return window.innerWidth <= 768 && window.matchMedia("(orientation: portrait)").matches;
    }

    // === 雙重效果整合:背景縮放 + 視差移動 (桌面版 & 手機橫式) ===
    let desktopTicking = false;
    function updateDesktopEffects() {
        // 只在桌面版或手機橫式執行
        if (isPortraitMobile()) return;
        
        if (!desktopTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                const baseScale = isLandscapeMobile() ? 140 : 105;
                const variableScale = isLandscapeMobile() ? 15 : 15;
                
                contentSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const sectionCenter = rect.top + rect.height / 2;
                    const windowCenter = windowHeight / 2;
                    const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                    const maxDistance = windowHeight;
                    
                    // 1. 背景縮放 (Background Scale)
                    const scaleProgress = Math.min(distanceFromCenter / maxDistance, 1);
                    const newScale = baseScale + (variableScale * scaleProgress);
                    section.style.backgroundSize = `${newScale}%`;

                    // 2. 內容平移 (Content Parallax)
                    const contentContainer = section.querySelector('.content-container');
                    if (contentContainer) {
                         // 計算平移量，使內容有微小的相對移動
                        const moveFactor = isLandscapeMobile() ? 0.05 : 0.05; 
                        const parallaxOffset = (windowCenter - sectionCenter) * moveFactor;
                        contentContainer.style.transform = `translateY(${parallaxOffset}px)`;
                    }
                });

                // 處理 Logo Section (只有背景縮放)
                const logoRect = logoSection.getBoundingClientRect();
                const logoCenter = logoRect.top + logoRect.height / 2;
                const logoDistanceFromCenter = Math.abs(logoCenter - windowCenter);
                const logoScaleProgress = Math.min(logoDistanceFromCenter / windowHeight, 1);
                const logoNewScale = 100 + (10 * logoScaleProgress); // Logo 區塊只做輕微縮放
                logoSection.style.backgroundSize = `${logoNewScale}%`;

                // 處理 Contact/Footer Section (只有背景縮放)
                const contactRect = contactFooterWrapper.getBoundingClientRect();
                const contactCenter = contactRect.top + contactRect.height / 2;
                const contactDistanceFromCenter = Math.abs(contactCenter - windowCenter);
                const contactScaleProgress = Math.min(contactDistanceFromCenter / windowHeight, 1);
                const contactNewScale = 105 + (15 * contactScaleProgress);
                contactFooterWrapper.style.backgroundSize = `${contactNewScale}%`;

                desktopTicking = false;
            });
            desktopTicking = true;
        }
    }


    // === 手機直式視差 (CSS Transform Parallax) ===
    let mobileTicking = false;
    function updateMobileParallax() {
        // 只在手機直式執行
        if (!isPortraitMobile()) return;

        if (!mobileTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
                
                contentSections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    // 1. 取得背景圖元素 (假設圖片在 section 內，或 section 正在移動)
                    // 由於背景圖是 CSS background-image，我們只能移動 section 本身來達到效果。
                    // 這裡的邏輯是讓背景圖相對於內容移動
                    const centerOffset = windowHeight / 2 - (rect.top + rect.height / 2);
                    // 內容區塊在視窗內時，微幅調整 Y 軸位置
                    const parallaxFactor = 0.2; // 調整視差強度
                    const newY = centerOffset * parallaxFactor;
                    
                    // 為了不影響內容動畫，手機直式視差由 CSS transform: scale(130%) 處理，
                    // 且這裡僅用來微調背景圖片的位置，以達到視差效果。
                    const backgroundPosY = -(scrollY * 0.2); // 模擬背景以 20% 的速度移動
                    // section.style.backgroundPositionY = `${-backgroundPosY}px`; // 不可行，會覆蓋 CSS
                });
                
                // 由於手機直式的背景圖片視差，通常難以用 JS 精準控制而不影響內容動畫
                // 這裡保留程式碼，但主要視覺效果將依賴 CSS 的 background-attachment: scroll 和 background-size: 130%

                mobileTicking = false;
            });
            mobileTicking = true;
        }
    }


    // === Intersection Observer: 內容區塊漸現動畫 ===
    const observerOptions = {
        root: null, // 視口
        rootMargin: '0px 0px -100px 0px', // 提前 100px 觸發
        threshold: 0.1 // 10% 進入視口即可
    };

    const contentObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // 觀察所有內容區塊
    contentSections.forEach(section => {
        const container = section.querySelector('.content-container');
        if (container) {
            contentObserver.observe(container);
        }
    });


    // 滾動事件監聽器
    function onScroll() {
        if (!isPortraitMobile()) {
            updateDesktopEffects();
        } else {
            updateMobileParallax();
        }
    }

    // 啟動滾動監聽 (桌面版和手機橫式)
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true }); // 確保尺寸改變時調整

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

    // 確保頁面載入時滾動到頂部
    // 判斷是否需要強制滾動到頂部 (在某些環境下，瀏覽器會記住滾動位置)
    if (window.scrollY !== 0) {
         window.scrollTo(0, 0);
    }
});