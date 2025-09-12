document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const headerLogo = document.querySelector('.header-logo');

    // IntersectionObserver for content sections
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

    // Scroll event listener for the header logo fade effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        // 控制淡出效果
        if (scrollPosition > 100) {
            headerLogo.style.opacity = 0;
        } else {
            headerLogo.style.opacity = 1;
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('#main-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Handling section clicks for new pages
    sections.forEach(section => {
        section.addEventListener('click', () => {
            const sectionId = section.id;
            console.log(`您點擊了 ${sectionId} 區塊。`);
            alert(`您點擊了 ${sectionId} 區塊。將會導向新頁面！`);
        });
    });
});