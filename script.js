// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊 (包含logo區塊)
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');

    // 建立一個 Intersection Observer 來處理內容區塊的動畫
    const contentObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                
                if (entry.isIntersecting) {
                    // 進入螢幕時：移除 unblurred 類別，添加 visible 動畫
                    entry.target.classList.remove('unblurred');
                    if (contentContainer) {
                        contentContainer.classList.add('visible');
                    }
                } else {
                    // 離開螢幕時：添加 unblurred 類別（觸發背景放大），移除 visible 動畫
                    entry.target.classList.add('unblurred');
                    if (contentContainer) {
                        contentContainer.classList.remove('visible');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.3, // 調整觸發閾值，讓動畫更順暢
            rootMargin: '-50px 0px' // 添加邊界調整，讓動畫觸發時機更精確
        }
    );

    // 建立一個 Intersection Observer 來處理導覽列的淡入淡出
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Logo 區塊可見時隱藏導覽列
                    mainHeader.style.opacity = '0';
                    mainHeader.style.pointerEvents = 'none';
                } else {
                    // Logo 區塊不可見時顯示導覽列
                    mainHeader.style.opacity = '1';
                    mainHeader.style.pointerEvents = 'auto';
                }
            });
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    // 特別處理 logo 區塊的背景動畫
    const logoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Logo 進入焦點時：保持正常大小，移除放大效果
                    entry.target.classList.remove('unblurred');
                } else {
                    // Logo 離開焦點時：添加放大效果
                    entry.target.classList.add('unblurred');
                }
            });
        },
        {
            root: null,
            threshold: 0.5,
        }
    );

    // 開始觀察每個內容區塊的動畫
    contentSections.forEach(section => {
        contentObserver.observe(section);
    });

    // 開始觀察 logo 區塊以控制導覽列的顯示
    if (logoSection) {
        headerObserver.observe(logoSection);
        // 同時用專門的 observer 處理 logo 的背景動畫
        logoObserver.observe(logoSection);
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

    // 初始化：確保頁面載入時所有動畫狀態正確
    setTimeout(() => {
        contentSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (rect.top < window.innerHeight && rect.bottom > 0);
            
            if (!isVisible) {
                section.classList.add('unblurred');
                const contentContainer = section.querySelector('.content-container');
                if (contentContainer) {
                    contentContainer.classList.remove('visible');
                }
            }
        });
    }, 100);
});