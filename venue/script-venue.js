/* Version: 2026-0115-1430 */
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
    // 背景視差動效 - 參考 catering 樣式
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
    // 影片自動播放修正 - 所有裝置
    // =========================================
    const videoElement = document.querySelector('.video-container video');
    if (videoElement) {
        videoElement.muted = true;
        videoElement.playsInline = true;
        videoElement.setAttribute('playsinline', '');
        videoElement.setAttribute('webkit-playsinline', '');
        videoElement.setAttribute('x5-playsinline', '');
        
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                document.addEventListener('touchstart', function playOnTouch() {
                    videoElement.play();
                    document.removeEventListener('touchstart', playOnTouch);
                }, { once: true });
            });
        }
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    videoElement.play();
                } else {
                    videoElement.pause();
                }
            });
        }, { threshold: 0.5 });
        
        videoObserver.observe(videoElement);
    }

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
    // "Create" 標題文字淡入動畫(在 scroll 視覺內)
    // =========================================
    gsap.from('.content .center .title-inside .hero-title-create', {
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
    // "your moment" 淡入動畫
    // =========================================
    gsap.from('.your-moment-section .moment-title', {
        scrollTrigger: {
            trigger: '.your-moment-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 40
    });

    // =========================================
    // Description Section 淡入動畫
    // =========================================
    gsap.from('.description-section .description-text', {
        scrollTrigger: {
            trigger: '.description-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 40
    });

    // =========================================
    // Layout Section 由上到下滑入動畫
    // =========================================
    gsap.from('.layout-section .section-title', {
        scrollTrigger: {
            trigger: '.layout-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: -50
    });

    gsap.from('.video-container', {
        scrollTrigger: {
            trigger: '.video-container',
            start: 'top 85%',
            end: 'top 55%',
            scrub: 1
        },
        opacity: 0,
        y: -40
    });

    // =========================================
    // Seating Section 滑入動畫 (右到左)
    // =========================================
    gsap.from('.seating-section .seating-images', {
        scrollTrigger: {
            trigger: '.seating-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        x: 100
    });

    gsap.from('.seating-section .seating-text-wrapper', {
        scrollTrigger: {
            trigger: '.seating-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        x: 100
    });

    // =========================================
    // Meeting Section 滑入動畫 (左到右)
    // =========================================
    gsap.from('.meeting-section .meeting-text-wrapper', {
        scrollTrigger: {
            trigger: '.meeting-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        x: -100
    });

    gsap.from('.meeting-section .meeting-images', {
        scrollTrigger: {
            trigger: '.meeting-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        x: -100
    });

    // =========================================
    // Equipment Section 淡入動畫
    // =========================================
    gsap.from('.equipment-grid .equipment-item', {
        scrollTrigger: {
            trigger: '.equipment-section',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1
        },
        opacity: 0,
        y: 50,
        stagger: 0.1
    });

    // =========================================
    // Gallery Section - 已刪除視差效果
    // 相片牆不再有滾動動畫,直接顯示
    // =========================================
    // (已移除 gsap.from('.gallery-section') 動畫)

    // =========================================
    // 照片燈箱功能 (相片牆)
    // =========================================
    const lightbox = document.getElementById('photo-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryButtons = document.querySelectorAll('.gallery-item');
    
    let currentImageIndex = 0;
    const totalImages = 12;
    
    // 自動偵測當前頁面是中文版還是英文版
    const currentPath = window.location.pathname;
    const isEnglishVersion = currentPath.includes('/en/');
    
    // 根據版本設定正確的圖片路徑
    const imageBasePath = isEnglishVersion 
        ? '../../venue/image04/venue'  // 英文版路徑
        : '../venue/image04/venue';    // 中文版路徑

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
        const imageNum = String(currentImageIndex + 1).padStart(2, '0');
        lightboxImage.src = `${imageBasePath}${imageNum}.webp`;
        const lang = document.documentElement.lang;
        lightboxImage.alt = lang === 'zh-Hant' 
            ? `場地租借作品 ${currentImageIndex + 1}` 
            : `Venue rental work ${currentImageIndex + 1}`;
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
    // 設備照片燈箱功能
    // =========================================
    const equipmentButtons = document.querySelectorAll('.equipment-item');
    const totalEquipmentImages = 6;
    
    const equipmentImagePaths = [
        'venue-equipment-sofa.webp',
        'venue-equipment-mic.webp',
        'venue-equipment-projector screen.webp',
        'venue-equipment-projector.webp',
        'venue-equipment-speaker.webp',
        'venue-equipment-karaoke.webp'
    ];
    
    const equipmentBasePath = isEnglishVersion 
        ? '../../venue/image04/'
        : '../venue/image04/';

    function openEquipmentLightbox(index) {
        currentImageIndex = index;
        updateEquipmentLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => lightboxClose.focus(), 100);
    }

    function updateEquipmentLightboxImage() {
        lightboxImage.src = `${equipmentBasePath}${equipmentImagePaths[currentImageIndex]}`;
        const lang = document.documentElement.lang;
        const equipmentNames = lang === 'zh-Hant' ? [
            '賓客休憩區真皮沙發',
            '便攜式麥克風/音響',
            '100吋投影布幕',
            '投影機',
            '四座懸吊式BOSS喇叭',
            '卡啦OK設備'
        ] : [
            'Genuine leather sofas in guest lounge',
            'Portable microphone and sound system',
            '100-inch projection screen',
            'Projector',
            'Four ceiling-mounted BOSS speakers',
            'Karaoke equipment'
        ];
        lightboxImage.alt = equipmentNames[currentImageIndex];
    }

    function showPrevEquipment() {
        currentImageIndex = (currentImageIndex - 1 + totalEquipmentImages) % totalEquipmentImages;
        updateEquipmentLightboxImage();
    }

    function showNextEquipment() {
        currentImageIndex = (currentImageIndex + 1) % totalEquipmentImages;
        updateEquipmentLightboxImage();
    }

    equipmentButtons.forEach((item, index) => {
        item.addEventListener('click', () => openEquipmentLightbox(index));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEquipmentLightbox(index);
            }
        });
    });

    // 修改燈箱導航按鈕以支持設備圖片
    if (lightboxPrev) {
        lightboxPrev.onclick = () => {
            if (currentImageIndex < totalEquipmentImages) {
                showPrevEquipment();
            } else {
                showPrevImage();
            }
        };
    }

    if (lightboxNext) {
        lightboxNext.onclick = () => {
            if (currentImageIndex < totalEquipmentImages) {
                showNextEquipment();
            } else {
                showNextImage();
            }
        };
    }

    // =========================================
    // 無障礙:確保主要內容區域正確標記
    // =========================================
    const mainContent = document.getElementById('main-content');
    if (mainContent && !mainContent.hasAttribute('role')) {
        mainContent.setAttribute('role', 'main');
    }
});