document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 當元素 20% 出現在視窗時觸發
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 如果元素進入視窗，加上 .visible class
                entry.target.classList.add('visible');
                // 停止觀察該元素，避免重複觸發
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // 處理點選區塊進入新頁面的功能
    // 這裡只是預留點擊事件，您可以根據需求修改
    sections.forEach(section => {
        section.addEventListener('click', () => {
            const sectionId = section.id;
            console.log(`您點擊了 ${sectionId} 區塊。`);
            alert(`您點擊了 ${sectionId} 區塊。將會導向新頁面！`);
        });
    });
});