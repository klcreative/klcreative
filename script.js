// Intersection Observer API
// 用於偵測元素何時進入或離開可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有內容區塊 (除了logo區塊)
    const contentSections = document.querySelectorAll('.content-section:not(#logo-section)');

    // 建立一個新的 Intersection Observer
    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                // 確保 contentContainer 存在
                const contentContainer = entry.target.querySelector('.content-container');
                if (!contentContainer) return;

                // 判斷區塊是否進入可視區域
                if (entry.isIntersecting) {
                    // 當區塊可見時，加上 'unblurred' 和 'visible' 類別
                    entry.target.classList.add('unblurred');
                    contentContainer.classList.add('visible');
                } else {
                    // 當區塊離開可視區域時，移除類別，回復到初始狀態
                    entry.target.classList.remove('unblurred');
                    contentContainer.classList.remove('visible');
                }
            });
        },
        {
            // 設定選項
            root: null, // 根元素為瀏覽器的可視區域
            threshold: 0.2, // 當區塊有 20% 出現在可視區域時觸發
        }
    );

    // 開始觀察每個內容區塊
    contentSections.forEach(section => {
        observer.observe(section);
    });
});