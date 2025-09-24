// Intersection Observer API 最終修正版本
// 偵測元素進入可視區域，以觸發動畫效果

document.addEventListener('DOMContentLoaded', () => {
    const mainHeader = document.getElementById('main-header');
    const contentSections = document.querySelectorAll('.content-section');
    const logoSection = document.getElementById('logo-section');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const target = entry.target;

                // 處理導覽列顯示/隱藏邏輯
                if (target === logoSection) {
                    if (entry.isIntersecting) {
                        mainHeader.style.opacity = '0';
                        mainHeader.style.pointerEvents = 'none';
                        target.classList.remove('hidden-logo');
                    } else {
                        mainHeader.style.opacity = '1';
                        mainHeader.style.pointerEvents = 'auto';
                        target.classList.add('hidden-logo');
                    }
                }

                // 處理所有內容區塊的動畫和背景效果
                const contentContainer = target.querySelector('.content-container');
                if (contentContainer) {
                    if (entry.isIntersecting) {
                        contentContainer.classList.add('visible');
                        target.classList.remove('unblurred');
                    } else {
                        contentContainer.classList.remove('visible');
                        target.classList.add('unblurred');
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    // 觀察所有相關元素
    contentSections.forEach(section => {
        observer.observe(section);
    });

    // 平滑滾動功能
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