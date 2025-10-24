/* Version: GPT1.0 - 2025-10-24 */
/* 功能：
   - 漢堡選單開/關（含鍵盤焦點圈）
   - IntersectionObserver 管理區塊顯示動畫（效能導向）
   - 回到頂端按鈕
   - 平滑導航（支援桌機與手機）
*/

/* 等待 DOM */
document.addEventListener('DOMContentLoaded', () => {
  // 元件
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  const mainNavLinks = document.querySelectorAll('#main-nav a[href^="#"]');
  const backToTop = document.getElementById('back-to-top');

  // 可聚焦元素（用於焦點陷阱）
  function getFocusable(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled'));
  }

  // 開啟手機選單
  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileNav.setAttribute('data-open', 'true');
    mobileToggle.setAttribute('aria-expanded', 'true');
    // 設定焦點到第一個連結
    const focusables = getFocusable(mobileNav);
    if (focusables.length) focusables[0].focus();
    // 禁止背景捲動
    document.documentElement.style.overflow = 'hidden';
  }

  // 關閉手機選單
  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.removeAttribute('data-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.focus();
    document.documentElement.style.overflow = '';
  }

  // 漢堡按鈕事件
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileNav && mobileNav.getAttribute('aria-hidden') === 'false';
      if (isOpen) closeMobileNav();
      else openMobileNav();
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  // 點擊遮罩或 ESC 關閉
  if (mobileNav) {
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileNav && mobileNav.getAttribute('aria-hidden') === 'false') closeMobileNav();
    }

    // Tab 鍵焦點陷阱（僅當 mobileNav 打開）
    if (e.key === 'Tab') {
      if (mobileNav && mobileNav.getAttribute('aria-hidden') === 'false') {
        const focusables = getFocusable(mobileNav);
        if (!focusables.length) return;
        const first = focusables[0], last = focusables[focusables.length -1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    }
  });

  // 平滑滾動 - 主導覽
  function smoothScrollTo(targetId) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  mainNavLinks.forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      smoothScrollTo(targetId);
    });
  });

  // 手機選單內連結點擊 - 平滑滾動且關閉選單
  mobileNavLinks.forEach(a => {
    a.addEventListener('click', function(e) {
      const href = this.getAttribute('href') || '';
      if (!href.startsWith('#')) return; // 外部連結不處理
      e.preventDefault();
      closeMobileNav();
      const targetId = href.substring(1);
      setTimeout(() => smoothScrollTo(targetId), 260);
    });
  });

  // 回到頂端顯示邏輯
  function handleScrollForTopBtn() {
    if (window.scrollY > window.innerHeight / 2) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  }

  window.addEventListener('scroll', handleScrollForTopBtn, { passive: true });
  handleScrollForTopBtn();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.getElementById('logo-section')?.focus();
    });
  }

  // IntersectionObserver：讓區塊在進入視窗時加上 .visible（僅切 class，效能佳）
  const sections = document.querySelectorAll('.content-section');
  const observerOptions = { root: null, threshold: 0.18 };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, observerOptions);

  sections.forEach(s => io.observe(s));

  // 螢幕尺寸/方向切換：確保 mobile nav 狀態一致
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && mobileNav && mobileNav.getAttribute('aria-hidden') === 'false') {
      // 若寬度變大，關閉 mobile nav
      closeMobileNav();
    }
  });

  // 初始：把 aria-hidden 設成 true
  if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');

  // 簡單的圖片 fallback：若有高解析影像準備，可在此做處理（留為擴充點）
  // 安全：不直接動 style 屬性，僅透過 class 操作

});