document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll('.content-section');
    const header = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const navItems = document.querySelectorAll('#main-nav a');

    // 導覽列淡入淡出的觀察器
    const headerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 在 LOGO 區塊可見時淡出導覽列
                header.style.opacity = 0;
            } else {
                // 離開 LOGO 區塊時淡入導覽列
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

    // 版本 27 創意效果：專門處理手機直式畫面的動態模糊
    function handleMobilePortraitEffects() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;

        if (isMobilePortrait) {
            const blurObserverOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };
            
            const blurObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 區塊在畫面中心時，移除模糊
                        entry.target.classList.remove('blurred');
                    } else {
                        // 區塊在畫面邊緣時，加上模糊
                        entry.target.classList.add('blurred');
                    }
                });
            }, blurObserverOptions);

            sections.forEach(section => {
                blurObserver.observe(section);
            });
        }
    }
    
    // 呼叫新函式
    handleMobilePortraitEffects();
});