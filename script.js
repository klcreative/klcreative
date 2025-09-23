// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊 (除了logo區塊)
    const contentSections = document.querySelectorAll('.content-section:not(#logo-section)');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');

    // 建立一個 Intersection Observer 來處理內容區塊的動畫
    const contentObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                const contentContainer = entry.target.querySelector('.content-container');
                
                if (!contentContainer) return;

                if (entry.isIntersecting) {
                    entry.target.classList.add('unblurred');
                    contentContainer.classList.add('visible');
                } else {
                    entry.target.classList.remove('unblurred');
                    contentContainer.classList.remove('visible');
                }
            });
        },
        {
            root: null,
            threshold: 0.2,
        }
    );

    // 7. 建立一個 Intersection Observer 來處理導覽列的淡入淡出
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 進入 logo 區塊時，導覽列淡入
                    mainHeader.style.opacity = '1';
                } else {
                    // 離開 logo 區塊時，導覽列淡出
                    mainHeader.style.opacity = '0';
                }
            });
        },
        {
            root: null,
            threshold: 0.5, // 當 logo 區塊有 50% 出現在可視區域時觸發
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