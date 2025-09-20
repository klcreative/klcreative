document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const navItems = document.querySelectorAll('#main-nav a');
    const parallaxWrappers = document.querySelectorAll('.parallax-wrapper');

    // ====== 導覽列淡入淡出 ======
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

    // ====== 區塊淡入淡出 ======
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

    // ====== 平滑滾動 ======
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ====== 視差效果 ======
    function handleParallax() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        parallaxWrappers.forEach(wrapper => {
            const bg = wrapper.querySelector('.parallax-bg');
            const content = wrapper.querySelector('.parallax-content');

            if (window.innerWidth <= 768 && window.matchMedia("(orientation: portrait)").matches) {
                // 手機直式，背景和內容跟著手勢
                const offset = -scrollTop * 0.3;
                bg.style.transform = `translateY(${offset}px)`;
                content.style.transform = `translateY(${offset}px)`;
            } else {
                // 桌機或手機橫式
                const rect = wrapper.getBoundingClientRect();
                const speed = 0.5;
                const offset = rect.top * speed;
                bg.style.transform = `translateY(${offset}px)`;
            }
        });
    }

    window.addEventListener('scroll', handleParallax);
    window.addEventListener('resize', handleParallax);

    // 初始呼叫一次
    handleParallax();
});