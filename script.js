// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊 (包含logo區塊)
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');

    // 建立兩個不同的 Intersection Observer 來處理滑入和滑出效果
    // 滑入效果 Observer - 觸發時間延遲
    const slideInObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                
                if (entry.isIntersecting && contentContainer) {
                    contentContainer.classList.add('visible');
                }
            });
        },
        {
            root: null,
            threshold: 0.5, // 提高觸發閾值，讓滑入效果更晚觸發
            rootMargin: '-100px 0px' // 增加邊界調整，讓滑入效果更晚觸發
        }
    );

    // 滑出效果 Observer - 觸發時間提前
    const slideOutObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                
                if (!entry.isIntersecting && contentContainer) {
                    contentContainer.classList.remove('visible');
                }
            });
        },
        {
            root: null,
            threshold: 0.05, // 降低觸發閾值，讓滑出效果更早觸發
            rootMargin: '50px 0px' // 擴大觸發範圍，讓滑出效果更早觸發
        }
    );

    // 背景放大效果 Observer
    const backgroundObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('unblurred');
                } else {
                    entry.target.classList.add('unblurred');
                }
            });
        },
        {
            root: null,
            threshold: 0.3,
            rootMargin: '-50px 0px'
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
        slideInObserver.observe(section);
        slideOutObserver.observe(section);
        backgroundObserver.observe(section);
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