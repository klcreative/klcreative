/* 版本 46: 全面修正響應式設計 */

/* 設定全域字體和盒模型 */
body {
    font-family: 'Microsoft JhengHei', sans-serif;
    margin: 0;
    padding: 0;
    color: white;
    background: #000;
    overflow-x: hidden;
}

/* 頂部導覽列的容器 */
#main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2000;
    padding: 20px 0;
    background-color: rgba(0, 0, 0, 0.8);
    transition: opacity 0.5s ease-out;
}

/* 導覽列樣式 */
#main-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

#main-nav a {
    text-decoration: none;
    color: white;
    font-size: 1rem;
    padding: 5px 10px;
    transition: color 0.3s ease;
    white-space: nowrap;
}

#main-nav a:hover {
    color: #ffd700;
}

/* 內容區塊樣式 - 統一設定 */
.content-section {
    min-height: 100vh; 
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    
    /* 背景圖片設定 - 確保完全覆蓋不露底色 */
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover; /* 改為 cover 確保完全覆蓋 */
    background-position: center;
    
    /* 景深效果設定 */
    filter: blur(5px);
    transform: scale(1.05); /* 輕微放大避免模糊邊緣露出 */
    transition: all 0.8s ease-out;
}

/* 當區塊進入螢幕中心時的效果 */
.content-section.unblurred {
    filter: blur(0);
    transform: scale(1);
}

/* LOGO 區塊特殊處理 - 永遠清晰 */
#logo-section {
    filter: none !important;
    transform: scale(1) !important;
    background-attachment: fixed;
}

/* LOGO 動畫容器 */
.logo-animation-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    opacity: 1;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}

.logo-animation-container img {
    max-width: 600px;
    width: 80%;
    height: auto;
}

/* 內容容器樣式 */
.content-container {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 100;
    padding: 40px;
}

.text-and-image {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
    padding: 40px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 15px;
    max-width: 1200px;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
}

.reverse-layout {
    flex-direction: row-reverse;
}

/* 文字內容樣式 */
.text-content {
    flex: 2;
    min-width: 300px;
}

.text-content h2 {
    font-size: 3rem;
    margin-bottom: 20px;
    border-left: 5px solid #fff;
    padding-left: 15px;
    line-height: 1.2;
}

.description-text {
    font-size: 1.3rem;
    line-height: 1.8;
    margin: 0;
}

/* 圖片樣式 */
.image-container {
    flex: 1.5;
    min-width: 250px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.image-container img {
    width: 100%;
    height: auto;
    display: block;
}

/* 動畫效果 */
.left-slide-in,
.right-slide-in {
    opacity: 0;
    transition: all 1s ease-out;
}

.left-slide-in {
    transform: translateX(-30px);
}

.right-slide-in {
    transform: translateX(30px);
}

.visible .left-slide-in,
.visible .right-slide-in {
    opacity: 1;
    transform: translateX(0);
}

.hidden .left-slide-in {
    opacity: 0;
    transform: translateX(-30px);
}

.hidden .right-slide-in {
    opacity: 0;
    transform: translateX(30px);
}

/* 平板尺寸優化 (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 769px) {
    .content-container {
        padding: 30px;
    }
    
    .text-and-image {
        gap: 30px;
        padding: 30px;
    }
    
    .text-content h2 {
        font-size: 2.5rem;
    }
    
    .description-text {
        font-size: 1.2rem;
    }
    
    .logo-animation-container img {
        max-width: 400px;
    }
}

/* 手機和小平板尺寸 (最大768px) */
@media (max-width: 768px) {
    /* 導覽列在小螢幕上調整 */
    #main-nav ul {
        gap: 10px;
        padding: 0 10px;
    }
    
    #main-nav a {
        font-size: 0.9rem;
        padding: 5px 8px;
    }
    
    /* 背景圖片在行動裝置上改為 scroll */
    .content-section {
        background-attachment: scroll;
        background-size: cover;
        min-height: 100vh;
    }
    
    #logo-section {
        background-attachment: scroll;
    }
    
    .content-container {
        padding: 20px;
    }
    
    .text-and-image {
        flex-direction: column;
        gap: 25px;
        padding: 25px;
        margin: 20px 0;
    }
    
    .reverse-layout {
        flex-direction: column;
    }
    
    .text-content,
    .image-container {
        flex: 1;
        width: 100%;
        min-width: auto;
    }
    
    .text-content h2 {
        font-size: 2rem;
        text-align: center;
    }
    
    .description-text {
        font-size: 1.1rem;
        text-align: center;
    }
    
    .logo-animation-container img {
        max-width: 300px;
        width: 70%;
    }
    
    /* 調整動畫效果 */
    .left-slide-in,
    .right-slide-in {
        transform: translateY(20px);
    }
    
    .visible .left-slide-in,
    .visible .right-slide-in {
        transform: translateY(0);
    }
    
    .hidden .left-slide-in,
    .hidden .right-slide-in {
        transform: translateY(20px);
    }
}

/* 極小螢幕優化 (最大480px) */
@media (max-width: 480px) {
    #main-nav ul {
        gap: 5px;
    }
    
    #main-nav a {
        font-size: 0.8rem;
        padding: 3px 6px;
    }
    
    .text-and-image {
        padding: 20px;
    }
    
    .text-content h2 {
        font-size: 1.8rem;
    }
    
    .description-text {
        font-size: 1rem;
    }
    
    .logo-animation-container img {
        max-width: 250px;
        width: 60%;
    }
}

/* 超大螢幕優化 (大於1600px) */
@media (min-width: 1600px) {
    .content-container {
        max-width: 1600px;
    }

    .text-and-image {
        max-width: 1400px;
        gap: 60px;
        padding: 60px;
    }

    .text-content h2 {
        font-size: 4rem;
    }

    .description-text {
        font-size: 1.5rem;
    }
    
    .logo-animation-container img {
        max-width: 800px;
    }
}