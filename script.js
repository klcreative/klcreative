document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const mainHeader = document.getElementById('main-header');

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

    // Scroll event listener for the header fade effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        // 控制導覽列淡入淡出
        if (scrollPosition > 100) {
            mainHeader.style.opacity = 1;
        } else {
            mainHeader.style.opacity = 0;
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