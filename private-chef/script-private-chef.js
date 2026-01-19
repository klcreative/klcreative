/* Version: 2026-0120-0300 */
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 初始化 GSAP 與 Lenis 平滑滾動
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
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
    // 漢堡選單功能
    // =========================================
    const hamburgerNavToggle = document.getElementById('hamburger-nav-toggle');
    const hamburgerNavOverlay = document.getElementById('hamburger-nav-overlay');
    const hamburgerNavMenu = document.getElementById('hamburger-nav-menu');
    const hamburgerNavLinks = document.querySelectorAll('#hamburger-nav-menu a');
    const menuStatus = document.getElementById('menu-status');

    function announceMenuState(isOpen) {
        if (menuStatus) {
            const lang = document.documentElement.lang;
            const message = isOpen 
                ? (lang === 'zh-Hant' ? '選單已開啟' : 'Menu opened')
                : (lang === 'zh-Hant' ? '選單已關閉' : 'Menu closed');
            menuStatus.textContent = message;
            setTimeout(() => { menuStatus.textContent = ''; }, 1000);
        }
    }

    if (hamburgerNavToggle && hamburgerNavOverlay) {
        hamburgerNavToggle.addEventListener('click', function() {
            const isOpen = hamburgerNavOverlay.style.display === 'flex';
            hamburgerNavOverlay.style.display = isOpen ? 'none' : 'flex';
            hamburgerNavToggle.setAttribute('aria-expanded', !isOpen);
            
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
                const firstLink = hamburgerNavMenu.querySelector('a');
                if (firstLink) {
                    setTimeout(() => firstLink.focus(), 100);
                }
            }
        });

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

    hamburgerNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
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
                    lenis.scrollTo(targetElement, { offset: 0, duration: 1 });
                }
            } else {
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

    if (hamburgerNavMenu) {
        const focusableElements = hamburgerNavMenu.querySelectorAll('a');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        hamburgerNavMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // =========================================
    // 背景視差動態效果
    // =========================================
    const parallaxBg = document.querySelector('.parallax-background');
    let lastScrollY = 0;
    let ticking = false;

    function updateBackgroundParallax() {
        const scrollY = window.pageYOffset;
        
        if (Math.abs(scrollY - lastScrollY) < 2) {
            ticking = false;
            return;
        }
        
        lastScrollY = scrollY;
        
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollProgress = scrollY / (documentHeight - windowHeight);
        
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

    gsap.from('.last-section-content .pricing-text', {
        scrollTrigger: {
            trigger: '.last-section-content .pricing-text',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 30
    });

    gsap.from('.gallery-container', {
        scrollTrigger: {
            trigger: '.gallery-container',
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
        },
        opacity: 0,
        y: 50
    });

    // =========================================
    // 照片牆預載入優化
    // =========================================
    const galleryItems = document.querySelectorAll('.gallery-item img');
    let loadedCount = 0;
    const totalGalleryImages = galleryItems.length;

    // 預載入前4張圖片
    galleryItems.forEach((img, index) => {
        if (index < 4) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
            preloadImg.onload = () => {
                loadedCount++;
                if (loadedCount === 4) {
                    console.log('First 4 gallery images preloaded');
                }
            };
        }
    });

    // =========================================
    // 相片燈箱功能
    // =========================================
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryButtons = document.querySelectorAll('.gallery-item');
    
    let currentImageIndex = 0;
    const totalImages = 16;
    
    // 自動偵測當前頁面是中文版還是英文版
    const currentPath = window.location.pathname;
    const isEnglishVersion = currentPath.includes('/en/');
    
    // 根據版本設定正確的圖片路徑
    const imageBasePath = isEnglishVersion 
        ? '../../private-chef/image08/'
        : 'image08/';

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => lightboxClose.focus(), 100);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        const triggerButton = galleryButtons[currentImageIndex];
        if (triggerButton) {
            triggerButton.focus();
        }
    }

    function updateLightboxImage() {
        const imageNum = currentImageIndex + 1;
        lightboxImage.src = `${imageBasePath}${imageNum}.webp`;
        const lang = document.documentElement.lang;
        lightboxImage.alt = lang === 'zh-Hant' 
            ? `私廚饗宴作品 ${currentImageIndex + 1}` 
            : `Private chef work ${currentImageIndex + 1}`;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateLightboxImage();
    }

    galleryButtons.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
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