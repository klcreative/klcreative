document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const navItems = document.querySelectorAll('#main-nav a');

    // 觀察所有內容區塊，執行淡入/淡出和滑入/滑出動畫
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
            } else {
                entry.target.classList.add('hidden');
                entry.target.classList.remove('visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });

    sections.forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // 觀察導覽列和 LOGO 區塊的顯示/隱藏
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 如果 LOGO 區塊可見，隱藏導覽列
                header.style.opacity = 0;
            } else {
                // 如果 LOGO 區塊離開，顯示導覽列
                header.style.opacity = 1;
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 稍微捲動就觸發
    });

    headerObserver.observe(logoSection);

    // 平滑捲動效果
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});