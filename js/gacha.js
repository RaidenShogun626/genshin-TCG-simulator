// 1. 基础配置（保持不变）
const cardList = {
    'ssr': [
        "images/char_zhongli.png",
        "images/char_raiden.png",
        "images/char_nahida.png"
    ],
    'sr': [
        "images/char_xiangling.png",
        "images/char_xingqiu.png",
        "images/char_bennett.png"
    ],
    'r': [
        "images/weapon_bow.png",
        "images/weapon_claymore.png"
    ]
};

// 2. 核心DOM（保持不变）
const cardBox = document.querySelector(".card-box");
const singleBtn = document.getElementById("singleBtn");
const tenBtn = document.getElementById("tenBtn");

// 3. 抽卡概率（保持不变）
function getCardRarity() {
    const random = Math.random();
    if (random < 0.006) return "ssr";
    if (random < 0.16) return "sr";
    return "r";
}

// 4. 生成单张卡片（修改部分）
function createCard() {
    const rarity = getCardRarity();
    const cardImg = cardList[rarity][Math.floor(Math.random() * cardList[rarity].length)];

    const card = document.createElement("div");
    card.className = `card ${rarity}`;
    card.innerHTML = `
        <div class="card-back"></div>
        <div class="card-front" style="background-image: url(${cardImg})"></div>
    `;

    // 点击翻牌 - 添加音效
    card.addEventListener("click", () => {
        card.classList.add("active");
        soundManager.playSound("cardFlip"); // 播放翻牌音效
    });
    return card;
}

// 6. 抽卡函数（修改部分）
function gacha(count = 1) {
    cardBox.innerHTML = "";
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const newCard = createCard();
            cardBox.appendChild(newCard);
            createStars();
            soundManager.playSound("cardAppear"); // 卡牌出现时播放音效
        }, i * 150);
    }
}

// 7. 绑定按钮（修改部分）
singleBtn.addEventListener("click", () => {
    soundManager.playSound("singleBtn"); // 按钮点击音效
    gacha(1);
});
tenBtn.addEventListener("click", () => {
    soundManager.playSound("tenBtn"); // 按钮点击音效
    gacha(10);
});

// 视频相关代码（保持不变，确保有对应的视频文件）
const playBtn = document.getElementById('playBtn');
const videoContainer = document.getElementById('videoContainer');
const gachaVideo = document.getElementById('gachaVideo');
const skipBtn = document.getElementById('skipBtn');

function playGachaVideo() {
    playBtn.style.display = 'none';
    videoContainer.style.display = 'flex';
    skipBtn.style.display = 'block';
    gachaVideo.currentTime = 0;
    gachaVideo.play().catch(err => {
        console.error('视频播放失败:', err);
        alert('请先点击页面任意位置后再尝试播放');
        resetVideoState();
    });
}

function resetVideoState() {
    gachaVideo.pause();
    videoContainer.style.display = 'none';
    skipBtn.style.display = 'none';
    playBtn.style.display = 'block';
}

playBtn.addEventListener('click', playGachaVideo);
skipBtn.addEventListener('click', resetVideoState);
gachaVideo.addEventListener('ended', resetVideoState);

document.addEventListener('contextmenu', (e) => {
    if (e.target === gachaVideo) {
        e.preventDefault();
    }
});

// 音效管理器（修改部分）
class SoundManager {
    constructor() {
        this.sounds = {};
    }

    loadSound(name, url) {
        const audio = new Audio(url);
        audio.preload = "auto";
        this.sounds[name] = audio;
    }

    playSound(name) {
        if (!this.sounds[name]) {
            console.warn(`音效 ${name} 未加载`);
            return;
        }
        try {
            this.sounds[name].currentTime = 0;
            this.sounds[name].play();
        } catch (err) {
            console.error("播放失败:", err);
        }
    }
}

// 初始化音效管理器（修改部分）
const soundManager = new SoundManager();
soundManager.loadSound("cardAppear", "./audio/card.wav");
soundManager.loadSound("cardFlip", "./audio/Card_Open.wav");
soundManager.loadSound("wishClick", "./audio/Wish_Return.wav"); // 添加按钮点击音效

// 移除原错误的音效触发代码
// （删除以下原代码）
// const card = document.getElementById("card-front");
// window.addEventListener("load", () => {
//     soundManager.playSound("card-front");
// });
// card.addEventListener("click", () => {
//     soundManager.playSound("cardFlip");
//     card.classList.toggle("flipped");
// });

// 添加星星生成函数（原代码缺失）
function createStars() {
    const star = document.createElement("div");
    star.className = "star";
    star.textContent = "★";
    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = (Math.random() * 3 + 2) + "s";
    star.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(star);

    // 星星消失后移除元素
    setTimeout(() => {
        star.remove();
    }, 5000);
}