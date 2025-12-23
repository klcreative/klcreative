/* Version: 2025-1223-2000-Fixed-V2 */
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 初始化 GSAP 與 Lenis 平滑滾動
    // =========================================
    gsap.registerPlugin(ScrollTrigger);
    
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // =========================================
    // 背景視差動態效果 - 確保持續顯示
    // =========================================
    const parallaxBg = document.querySelector('.parallax-background');
    let bgTicking = false;

    function updateBackgroundParallax() {
        if (!bgTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.pageYOffset;
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
                
                bgTicking = false;
            });
            bgTicking = true;
        }
    }

    window.addEventListener('scroll', updateBackgroundParallax, { passive: true });
    window.addEventListener('resize', updateBackgroundParallax, { passive: true });
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
    gsap.from('.content .center .title-bottom h1', {
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
});