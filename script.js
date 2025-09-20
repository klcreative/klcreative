document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');

    function applyParallaxOnMobilePortrait() {
        const isMobilePortrait = window.matchMedia("(max-width: 768px) and (orientation: portrait)").matches;

        if (isMobilePortrait) {
            window.addEventListener('scroll', function() {
                sections.forEach(section => {
                    // 根據區塊位置計算背景偏移量，製造視差效果
                    const rect = section.getBoundingClientRect();
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    const offset = rect.top + scrollY;
                    const yPos = -(offset * 0.2); // 0.2 為視差速度，可微調
                    
                    // 確保圖片位置正確且不露出底色
                    section.style.backgroundPosition = `center ${yPos}px`;
                });
            });
        }
    }

    // 執行一次，確保初始狀態正確
    applyParallaxOnMobilePortrait();

    // 監聽螢幕方向變化，當從橫式切換到直式時重新套用效果
    window.addEventListener('orientationchange', applyParallaxOnMobilePortrait);
    window.addEventListener('resize', applyParallaxOnMobilePortrait);
});