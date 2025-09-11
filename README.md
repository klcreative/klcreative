<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KL Creative</title>
<!-- Google Fonts 微軟正黑體備援 -->
<style>
  body, html {
    margin: 0;
    padding: 0;
    font-family: "Microsoft JhengHei", "微軟正黑體", sans-serif;
    background: linear-gradient(to right, #7217a3, #e00299);
    color: #fff;
    scroll-behavior: smooth;
  }

  header {
    text-align: center;
    padding: 50px 0;
  }

  header img {
    max-width: 200px;
    height: auto;
  }

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 50px 20px;
    box-sizing: border-box;
    cursor: pointer;
  }

  section h2 {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0;
    transform: translateX(-50px);
    transition: all 1s ease;
  }

  section .content {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 30px;
    opacity: 0;
    transform: translateX(50px);
    transition: all 1s ease;
  }

  section .content img {
    max-width: 300px;
    height: auto;
    border-radius: 10px;
  }

  section .content p {
    max-width: 600px;
    line-height: 1.6;
  }

  section.visible h2 {
    opacity: 1;
    transform: translateX(0);
  }

  section.visible .content {
    opacity: 1;
    transform: translateX(0);
  }

  /* 手機響應式 */
  @media (max-width: 768px) {
    section .content {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
</head>
<body>

<header>
  <img src="your-logo.png" alt="KL Creative LOGO">
</header>

<section id="about" onclick="location.href='#'">
  <h2>關於KL Creative</h2>
  <div class="content">
    <p>這裡放關於KL Creative的描述文字。</p>
    <img src="about.jpg" alt="關於KL Creative圖片">
  </div>
</section>

<section id="catering" onclick="location.href='#'">
  <h2>各式餐飲外燴</h2>
  <div class="content">
    <p>這裡放各式餐飲外燴的描述文字。</p>
    <img src="catering.jpg" alt="餐飲外燴圖片">
  </div>
</section>

<section id="events" onclick="location.href='#'">
  <h2>各式活動餐飲整合</h2>
  <div class="content">
    <p>這裡放各式活動餐飲整合的描述文字。</p>
    <img src="events.jpg" alt="活動餐飲整合圖片">
  </div>
</section>

<section id="gifts" onclick="location.href='#'">
  <h2>客製化禮品</h2>
  <div class="content">
    <p>這裡放客製化禮品的描述文字。</p>
    <img src="gifts.jpg" alt="客製化禮品圖片">
  </div>
</section>

<section id="corporate" onclick="location.href='#'">
  <h2>企業機構餐飲規劃</h2>
  <div class="content">
    <p>這裡放企業機構餐飲規劃的描述文字。</p>
    <img src="corporate.jpg" alt="企業機構餐飲規劃圖片">
  </div>
</section>

<section id="privatechef" onclick="location.href='#'">
  <h2>私廚饗宴</h2>
  <div class="content">
    <p>這裡放私廚饗宴的描述文字。</p>
    <img src="privatechef.jpg" alt="私廚饗宴圖片">
  </div>
</section>

<section id="contact" onclick="location.href='#'">
  <h2>聯繫我</h2>
  <div class="content">
    <p>這裡放聯繫我的描述文字。</p>
    <img src="contact.jpg" alt="聯繫我圖片">
  </div>
</section>

<script>
  const sections = document.querySelectorAll('section');

  function checkVisibility() {
    const triggerBottom = window.innerHeight / 5 * 4;
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if(sectionTop < triggerBottom) {
        section.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkVisibility);
  window.addEventListener('load', checkVisibility);
</script>

</body>
</html>
