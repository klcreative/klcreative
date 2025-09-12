document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 如果元素進入視窗，加上 visible 類別
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
            } else {
                // 如果元素離開視窗，加上 hidden 類別
                entry.target.classList.add('hidden');
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        // 在觀察前先將所有元素設為 hidden，確保第一次進入時有動畫
        section.classList.add('hidden');
        observer.observe(section);
    });

    // 處理點選區塊進入新頁面的功能
    sections.forEach(section => {
        section.addEventListener('click', () => {
            const sectionId = section.id;
            console.log(`您點擊了 ${sectionId} 區塊。`);
            alert(`您點擊了 ${sectionId} 區塊。將會導向新頁面！`);
        });
    });
});