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

    // 建立一個統一的 Intersection Observer 來處理所有區塊的動畫與背景效果
    const mainObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                
                // 進入可視區域的邏輯
                if (entry.isIntersecting) {
                    // 內容動畫：進入時添加visible
                    if (contentContainer) {
                        contentContainer.classList.add('visible');
                    }
                    // 背景效果：進入時移除unblurred（縮小背景）
                    entry.target.classList.remove('unblurred');

                } 
                // 離開可視區域的邏輯
                else {
                    // 內容動畫：離開時移除visible
                    if (contentContainer) {
                        contentContainer.classList.remove('visible');
                    }
                    // 背景效果：離開時添加unblurred（放大背景）
                    entry.target.classList.add('unblurred');
                }
            });
        },
        {
            root: null,
            threshold: 0.1, 
            rootMargin: '20% 0px -70% 0px'
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

    // 開始觀察每個內容區塊的動畫
    contentSections.forEach(section => {
        mainObserver.observe(section);
    });

    // 開始觀察 logo 區塊以控制導覽列的顯示
    if (logoSection) {
        headerObserver.observe(logoSection);
    }
    
    // 觀察聯絡我區域的背景容器
    if (contactFooterWrapper) {
        mainObserver.observe(contactFooterWrapper);
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
        // 點開網頁時的單次模糊漸變效果
        logoSection.classList.add('initial-blur'); 

        // 延遲後移除模糊，觸發過渡到清晰，並啟動縮放效果
        setTimeout(() => {
            logoSection.classList.remove('initial-blur'); 
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded'); // 啟動從180%到100%的縮放
        }, 500);
    }
});