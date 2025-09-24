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
                    entry.target.classList.add('unblurred');
                    if (contentContainer) {
                        contentContainer.classList.add('visible');
                    }
                } else {
                    entry.target.classList.remove('unblurred');
                    if (contentContainer) {
                        contentContainer.classList.remove('visible');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.05, 
        }
    );

    // 建立一個 Intersection Observer 來處理導覽列的淡入淡出
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    mainHeader.style.opacity = '0';
                } else {
                    mainHeader.style.opacity = '1';
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
    }
});