// =========================================
    // 新視差區域動畫效果
    // =========================================
    const parallaxSections = document.querySelectorAll('.parallax-section');

    parallaxSections.forEach((section, sectionIndex) => {
        const img1 = section.querySelector('.parallax-img-1');
        const img2 = section.querySelector('.parallax-img-2');
        const img3 = section.querySelector('.parallax-img-3');
        const img4 = section.querySelector('.parallax-img-4');
        const textBlock1 = section.querySelector('.text-block-1');
        const textBlock2 = section.querySelector('.text-block-2');

        // 第一組圖片(新鮮+技藝) - 只保留視差效果
        if (img1 && img2) {
            // 圖片1視差效果 - 移動快(-50px)
            gsap.to(img1, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                },
                y: -50,
                ease: 'none'
            });

            // 圖片2視差效果 - 移動慢(-20px)
            gsap.to(img2, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                },
                y: -20,
                ease: 'none'
            });
        }

        // 【需求3修改】第二組圖片(彈性+信賴) - 添加視差效果,基礎位置上移30px
        if (img3 && img4) {
            // 圖片3視差效果 - 從-30px開始,最多向上移動5%
            gsap.to(img3, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2
                },
                y: 'calc(-5% - 30px)', // 基礎上移30px + 視差-5%
                ease: 'none'
            });

            // 圖片4視差效果 - 從-30px開始,最多向上移動5%
            gsap.to(img4, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5
                },
                y: 'calc(-5% - 30px)', // 基礎上移30px + 視差-5%
                ease: 'none'
            });
        }

        // 文字區塊動畫 - 提早開始,與圖片同步
        if (textBlock1) {
            gsap.to(textBlock1, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 40%',
                    scrub: 1
                },
                y: 0,
                opacity: 1,
                ease: 'back.out(1.4)'
            });
        }

        if (textBlock2) {
            gsap.to(textBlock2, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 40%',
                    scrub: 1
                },
                y: 0,
                opacity: 1,
                ease: 'back.out(1.4)'
            });
        }
    });