// 2025-09-27-2300
document.addEventListener('DOMContentLoaded', () => {
    // 選擇所有動畫元素（單一元素觀察，讓動畫在「接近可視區」時一口氣淡入／滑入）
    const animatedEls = document.querySelectorAll('.animate-left, .animate-right');
    const mainHeader = document.getElementById('main-header');
    const logoSection = document.getElementById('logo-section');
    const contactFooterWrapper = document.getElementById('contact-footer-wrapper');

    // 手機版導覽選單相關元素
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    // ---------- 平滑、觸發型動畫：觀察每個需要滑入/淡入的元素 ----------
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add('in-view');
            } else {
                el.classList.remove('in-view');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -15% 0px', // 當元素接近視窗底部 15% 時觸發
        threshold: 0.15
    });

    animatedEls.forEach(el => {
        animObserver.observe(el);
    });

    // ---------- 導覽列 show/hide 觀察（保留原有功能） ----------
    const headerObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (mainHeader) {
                        mainHeader.style.opacity = '0';
                        mainHeader.style.pointerEvents = 'none';
                    }
                } else {
                    if (mainHeader) {
                        mainHeader.style.opacity = '1';
                        mainHeader.style.pointerEvents = 'auto';
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.1,
        }
    );

    if (logoSection) {
        headerObserver.observe(logoSection);
    }

    // ---------- 導覽列內文字（只在桌機修改 nav 文案）----------
    const navEventLink = document.querySelector('#main-nav a[href="#event-catering"]');
    const navCorporateLink = document.querySelector('#main-nav a[href="#corporate-catering"]');

    if (navEventLink) navEventLink.dataset.orig = navEventLink.textContent.trim();
    if (navCorporateLink) navCorporateLink.dataset.orig = navCorporateLink.textContent.trim();

    function applyDesktopNavText() {
        if (window.innerWidth >= 1025) {
            if (navEventLink) navEventLink.textContent = '活動餐飲'; // 桌機替換
            if (navCorporateLink) navCorporateLink.textContent = '企業餐飲'; // 桌機替換
        } else {
            if (navEventLink && navEventLink.dataset.orig) navEventLink.textContent = navEventLink.dataset.orig;
            if (navCorporateLink && navCorporateLink.dataset.orig) navCorporateLink.textContent = navCorporateLink.dataset.orig;
        }
    }

    // 初次套用與 resize 時更新（保持 mobile 不受影響）
    applyDesktopNavText();
    window.addEventListener('resize', () => {
        applyDesktopNavText();
    });

    // ---------- 行為：導覽連結平滑滾動（桌機） ----------
    const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ---------- 手機 overlay 內的連結（包含直式與橫式 menu）平滑滾動 ----------
    function attachMobileMenuLinks() {
        const mobileNavLinks = document.querySelectorAll('#mobile-nav-menu a, #mobile-nav-menu-landscape a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href') || '';
                if (!href.startsWith('#')) return;
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    if (mobileNavOverlay) {
                        mobileNavOverlay.style.display = 'none';
                    }
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    attachMobileMenuLinks();

    // ---------- 手機版導覽按鈕點擊事件 ----------
    if (mobileNavToggle && mobileNavOverlay) {
        mobileNavToggle.addEventListener('click', function() {
            if (mobileNavOverlay.style.display === 'flex') {
                mobileNavOverlay.style.display = 'none';
            } else {
                mobileNavOverlay.style.display = 'flex';
                // 顯示對應的 menu：CSS 會處理哪一個 menu 顯示（portrait vs landscape）
            }
        });
    }

    // 點擊遮罩關閉導覽選單
    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', function(e) {
            if (e.target === mobileNavOverlay) {
                mobileNavOverlay.style.display = 'none';
            }
        });
    }

    // ---------- Logo 的模糊與縮放節奏（手機 portrait 要延長） ----------
    if (logoSection) {
        // 先加初始毛玻璃狀態
        logoSection.classList.add('initial-blur');

        // 根據裝置決定延遲時間（手機直式延長）
        let initialDelay = 500;
        if (window.innerWidth <= 768) {
            initialDelay = 1200; // 手機直式延長，配合 CSS 的更長 transition
        }

        setTimeout(() => {
            logoSection.classList.remove('initial-blur');
            logoSection.classList.add('fade-out-overlay');
            logoSection.classList.add('loaded');
        }, initialDelay);
    }

    // ---------- optional: 觀察 contactFooterWrapper 背景縮放（保留輕量） ----------
    if (contactFooterWrapper) {
        // 當 contact 進入視窗時可做 class 切換（若有需要再擴充）
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { root: null, threshold: 0.1 });
        contactObserver.observe(contactFooterWrapper);
    }
});
