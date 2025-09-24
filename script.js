// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');

    // 建立一個用於內容（文字與圖片）滑入/滑出效果的觀察器
    const contentObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                if (contentContainer) {
                    if (entry.isIntersecting) {
                        contentContainer.classList.add('visible');
                    } else {
                        contentContainer.classList.remove('visible');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.1,
            rootMargin: '0px 0px -50% 0px' // 讓動畫在捲動到較早位置時才觸發
        }
    );

    // 建立一個用於背景圖片縮放效果的觀察器
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
            threshold: 0,
            rootMargin: '0px'
        }
    );

    // 建立一個 Intersection Observer 來處理導覽列的淡入淡出
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mainHeader.style.opacity = '0';
                    mainHeader.style.pointerEvents = 'none';
                } else {
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

    // 開始觀察每個內容區塊的動畫與背景效果
    contentSections.forEach(section => {
        contentObserver.observe(section);
        backgroundObserver.observe(section);
    });

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
});