document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const navItems = document.querySelectorAll('#main-nav a');
    
    // 版本 54: 在 JS 中動態設定背景圖片，讓 CSS 偽元素能正確顯示
    if (window.matchMedia("(max-width: 1024px) and (orientation: portrait)").matches) {
        sections.forEach(section => {
            const bgImage = section.style.backgroundImage;
            if (bgImage) {
                section.style.setProperty('--bg-image', bgImage);
                section.style.backgroundImage = 'none';
            }
        });
    }

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
            const textAndImage = entry.target.querySelector('.text-and-image');
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                if (textAndImage) {
                    textAndImage.classList.add('visible');
                }
            } else {
                entry.target.classList.add('hidden');
                entry.target.classList.remove('visible');
                if (textAndImage) {
                    textAndImage.classList.remove('visible');
                }
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

    // 版本 43: 處理所有畫面的景深與圖片縮放效果
    const blurObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const blurObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 區塊在畫面中心時，移除模糊並縮回原始大小
                entry.target.classList.add('unblurred');
            } else {
                // 區塊在畫面邊緣時，加上模糊並放大
                entry.target.classList.remove('unblurred');
            }
        });
    }, blurObserverOptions);

    sections.forEach(section => {
        blurObserver.observe(section);
    });
});