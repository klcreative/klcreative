document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const navItems = document.querySelectorAll('#main-nav a');

    // 導覽列淡入淡出的觀察器
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                header.style.opacity = 0;
            } else {
                header.style.opacity = 1;
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    headerObserver.observe(logoSection);

    // 內容區塊淡入淡出的觀察器
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

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
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // 平滑捲動
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // === 手機視差模擬 ===
    function enableMobileParallax() {
        if (window.innerWidth <= 768) {
            window.addEventListener("scroll", function() {
                const scrollTop = window.pageYOffset;
                sections.forEach(section => {
                    let speed = 0.4; // 調整背景移動速度
                    section.style.backgroundPosition = `center ${-(scrollTop * speed)}px`;
                });
            });
        } else {
            // 桌機恢復預設
            sections.forEach(section => {
                section.style.backgroundPosition = "center center";
            });
        }
    }

    enableMobileParallax();

    // 視窗大小改變時重新套用
    window.addEventListener("resize", enableMobileParallax);
});