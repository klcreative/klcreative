/* Version: 2025-1225-2100-OPTIMIZED */
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 初始化 GSAP 與 Lenis 平滑滾動
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    
    // 檢測是否為 Mac 設備
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    // 針對 Mac 設備大幅優化 Lenis 配置
    const lenis = new Lenis({
        duration: isMac ? 0.6 : 1.0,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        wheelMultiplier: isMac ? 2 : 1,
        infinite: false,
        normalizeWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // =========================================
    // 漢堡選單功能 - 優化無障礙支持
    // =========================================
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');
    const menuStatus = document.getElementById('menu-status');

    // 更新選單狀態通知(螢幕閱讀器)
    function announceMenuState(isOpen) {
        if (menuStatus) {
            const lang = document.documentElement.lang;
            const message = isOpen 
                ? (lang === 'zh-Hant' ? '選單已開啟' : 'Menu opened')
                : (lang === 'zh-Hant' ? '選單已關閉' : 'Menu closed');
            menuStatus.textContent = message;
            // 清除訊息避免重複朗讀
            setTimeout(() => { menuStatus.textContent = ''; }, 1000);
        }
    }

    // 開關選單
    if (hamburgerNavToggle && hamburgerNavOverlay) {
        hamburgerNavToggle.addEventListener('click', function() {
            const isOpen = hamburgerNavOverlay.style.display === 'flex';
            hamburgerNavOverlay.style.display = isOpen ? 'none' : 'flex';
            hamburgerNavToggle.setAttribute('aria-expanded', !isOpen);
            
            // 更新按鈕 aria-label
            const lang = document.documentElement.lang;
            const newLabel = isOpen 
                ? (lang === 'zh-Hant' ? '開啟導覽選單' : 'Open navigation menu')
                : (lang === 'zh-Hant' ? '關閉導覽選單' : 'Close navigation menu');
            hamburgerNavToggle.setAttribute('aria-label', newLabel);
            
            if (isOpen) {
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.blur();
                announceMenuState(false);
            } else {
                hamburgerNavToggle.classList.add('active');
                announceMenuState(true);
                // 將焦點移到第一個選單項目
                const firstLink = hamburgerNavMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });

        // 點擊覆蓋層背景關閉選單
        hamburgerNavOverlay.addEventListener('click', function(e) {
            if (e.target === hamburgerNavOverlay) {
                hamburgerNavOverlay.style.display = 'none';
                hamburgerNavToggle.classList.remove('active');
                hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                const lang = document.documentElement.lang;
                hamburgerNavToggle.setAttribute('aria-label', 
                    lang === 'zh-Hant' ? '開啟導覽選單' : 'Open navigation menu'
                );
                hamburgerNavToggle.focus();
                announceMenuState(false);
            }
        });
    }

    // ESC 鍵關閉選單
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && hamburgerNavOverlay && hamburgerNavOverlay.style.display === 'flex') {
            hamburgerNavOverlay.style.display = 'none';
            hamburgerNavToggle.classList.remove('active');
            hamburgerNavToggle.setAttribute('aria-expanded', 'false');
            const lang = document.documentElement.lang;
            hamburgerNavToggle.setAttribute('aria-label', 
                lang === 'zh-Hant' ? '開啟導覽選單' : 'Open navigation menu'
            );
            hamburgerNavToggle.focus();
            announceMenuState(false);
        }
    });

    // 選單連結點擊處理
    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // 只對錨點連結進行特殊處理
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    if (hamburgerNavOverlay) {
                        hamburgerNavOverlay.style.display = 'none';
                        hamburgerNavToggle.classList.remove('active');
                        hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                        const lang = document.documentElement.lang;
                        hamburgerNavToggle.setAttribute('aria-label', 
                            lang === 'zh-Hant' ? '開啟導覽選單' : 'Open navigation menu'
                        );
                        announceMenuState(false);
                    }
                    // 使用 Lenis 的平滑滾動而非瀏覽器原生
                    lenis.scrollTo(targetElement, { offset: 0, duration: 1 });
                }
            } else {
                // 其他連結(新分頁)關閉選單
                if (hamburgerNavOverlay) {
                    hamburgerNavOverlay.style.display = 'none';
                    hamburgerNavToggle.classList.remove('active');
                    hamburgerNavToggle.setAttribute('aria-expanded', 'false');
                    const lang = document.documentElement.lang;
                    hamburgerNavToggle.setAttribute('aria-label', 
                        lang === 'zh-Hant' ? '開啟導覽選單' : 'Open navigation menu'
                    );
                }
            }
        });
    });

    // 鍵盤導航支持 - Tab 鍵循環
    if (hamburgerNavMenu) {
        const focusableElements = hamburgerNavMenu.querySelectorAll('a');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        hamburgerNavMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // =========================================
    // 背景視差動態效果 - 使用節流優化性能
    // =========================================
    const parallaxBg = document.querySelector('.parallax-background');
    let lastScrollY = 0;
    let ticking = false;

    function updateBackgroundParallax() {
        const scrollY = window.pageYOffset;
        
        // 如果滾動變化很小，跳過更新
        if (Math.abs(scrollY - lastScrollY) < 2) {
            ticking = false;
            return;
        }
        
        lastScrollY = scrollY;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollProgress = scrollY / (documentHeight - windowHeight);
        
        // 根據裝置類型調整基礎縮放
        let baseScale = 1.2;
        if (window.innerWidth <= 834 && window.matchMedia("(orientation: portrait)").matches) {
            baseScale = 1.3;
        } else if (window.matchMedia("(orientation: landscape)").matches && window.innerHeight <= 500) {
            baseScale = 1.4;
        } else if (window.innerWidth >= 768 && window.innerWidth <= 1024) {
            baseScale = 1.25;
        }
        
        const scale = baseScale + (scrollProgress * 0.3);
        const translateY = (scrollProgress - 0.5) * 20;
        
        parallaxBg.style.transform = `scale(${scale}) translateY(${translateY}%)`;
        
        ticking = false;
    }

    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateBackgroundParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate, { passive: true });
    updateBackgroundParallax();

    // =========================================
    // Hero Section 圖片遮罩滾動效果
    // =========================================
    const maskImages = gsap.utils.toArray('.images .mask-img');

    ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
            const progress = self.progress;
            const totalImages = maskImages.length;
            const segmentSize = 1 / totalImages;

            maskImages.forEach((img, index) => {
                const imageStart = index * segmentSize;
                const imageEnd = (index + 1) * segmentSize;
                let imageProgress = 0;

                if (progress >= imageStart && progress <= imageEnd) {
                    imageProgress = (progress - imageStart) / segmentSize;
                } else if (progress > imageEnd) {
                    imageProgress = 1;
                }

                const leftgradie = 50 - (imageProgress * 50);
                const rightgradie = 50 + (imageProgress * 50);
                const deg = 90 + (imageProgress * 40);

                gsap.set(img, {
                    maskImage: `linear-gradient(${deg}deg, black ${leftgradie}%, transparent ${leftgradie}%, transparent ${rightgradie}%, black ${rightgradie}%)`
                });
            });
        }
    });

    // =========================================
    // 標題文字淡入動畫
    // =========================================
    gsap.from('.content .center .title-bottom .hero-title', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top center',
            end: 'center center',
            scrub: 1
        },
        opacity: 0,
        y: 50,
        scale: 0.9
    });

    // =========================================
    // Last Section 內容淡入動畫
    // =========================================
    gsap.from('.last-section-content .title-create', {
        scrollTrigger: {
            trigger: '.last-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 60,
        scale: 0.95
    });

    gsap.from('.last-section-content .description-text', {
        scrollTrigger: {
            trigger: '.last-section',
            start: 'top 75%',
            end: 'top 45%',
            scrub: 1
        },
        opacity: 0,
        y: 40
    });

    // =========================================
    // 相片牆燈箱功能
    // =========================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    const images = [
        'image02/about08.jpg',
        'image02/about09.jpg',
        'image02/about10.jpg',
        'image02/about11.jpg'
    ];
    
    let currentImageIndex = 0;
    
    // 顯示燈箱
    function showLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.alt = `KL Creative 作品展示 ${currentImageIndex + 1}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
        
        // 將焦點移到關閉按鈕
        setTimeout(() => lightboxClose.focus(), 100);
    }
    
    // 關閉燈箱
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // 恢復滾動
        
        // 將焦點返回到觸發的縮圖
        const triggerButton = document.querySelector(`.gallery-item[data-index="${currentImageIndex}"]`);
        if (triggerButton) {
            triggerButton.focus();
        }
    }
    
    // 顯示上一張
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.alt = `KL Creative 作品展示 ${currentImageIndex + 1}`;
    }
    
    // 顯示下一張
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.alt = `KL Creative 作品展示 ${currentImageIndex + 1}`;
    }
    
    // 綁定縮圖點擊事件
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            showLightbox(index);
        });
    });
    
    // 關閉按鈕
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    // 上一張按鈕
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }
    
    // 下一張按鈕
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }
    
    // 點擊背景關閉
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // 鍵盤控制
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // =========================================
    // 無障礙:確保主要內容區域正確標記
    // =========================================
    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
    }
});