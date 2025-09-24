// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊
    const contentSections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');

    // 建立一個統一的 Intersection Observer 來處理所有區塊的動畫
    const mainObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const isLogoSection = entry.target.id === 'logo-section';
                const contentContainer = entry.target.querySelector('.content-container');
                
                // 進入可視區域的邏輯
                if (entry.isIntersecting) {
                    // 背景效果：如果不是Logo區塊，進入時移除unblurred
                    if (!isLogoSection) {
                        entry.target.classList.remove('unblurred');
                    }
                    // 內容動畫：進入時添加visible
                    if (contentContainer) {
                        contentContainer.classList.add('visible');
                    }
                } 
                // 離開可視區域的邏輯
                else {
                    // 背景效果：離開時添加unblurred
                    entry.target.classList.add('unblurred');
                    // 內容動畫：離開時移除visible
                    if (contentContainer) {
                        contentContainer.classList.remove('visible');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.1, // 調整為單一閾值，方便統一控制
            rootMargin: '0px 0px -100px 0px' // 讓動畫在捲動到較晚位置時才觸發
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

    // 開始觀察每個內容區塊的動畫
    contentSections.forEach(section => {
        mainObserver.observe(section);
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