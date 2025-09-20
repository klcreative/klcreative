document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');

    function applyParallaxOnMobilePortrait() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;

        if (isMobilePortrait) {
            window.addEventListener('scroll', function() {
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const offset = rect.top + scrollY;
                    const yPos = -(offset * 0.2); // 0.2為視差速度，可微調
                    
                    section.style.backgroundPosition = `center ${yPos}px`;
                });
            });
        }
    }

    applyParallaxOnMobilePortrait();

    window.addEventListener('orientationchange', applyParallaxOnMobilePortrait);
    window.addEventListener('resize', applyParallaxOnMobilePortrait);
});