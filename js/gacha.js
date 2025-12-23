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
        "images/weapon_claymore.png",
        "images/book.png"
    ]
};

// 2. 核心DOM（保持不变）
const cardBox = document.querySelector(".card-box");
const singleBtn = document.getElementById("singleBtn");
const tenBtn = document.getElementById("tenBtn");
const currentWishItem = document.querySelector('.card-level')

// 3. 抽卡概率（保持不变）
function getCardRarity() {
    const random = Math.random();
    if (random < 0.006) return "ssr";
    if (random < 0.16) return "sr";
    return "r";
}

function createCard() {
    const rarity = getCardRarity();
    const cardImg = cardList[rarity][Math.floor(Math.random() * cardList[rarity].length)];

    const card = document.createElement("div");
    card.className = `card ${rarity}`;
    card.innerHTML = `
        <div class="card-back"></div>
        <div class="card-front" style="background-image: url(${cardImg})"></div>`;

    // 添加卡片点击翻转效果
    card.addEventListener('click', () => {
        const subElement = card.firstElementChild
        if (!subElement.classList.contains('animate-roll')) {
            soundManager.playSound("cardFlip");
            subElement.classList.add("animate-roll");
            subElement.onanimationend = () => {
                card.classList.add('active')
            }
        }
    });

    return card;  // 补充返回卡片元素
}  // 补充闭合
// 6. 抽卡函数（修改部分）
function gacha(count = 1) {
    currentWishItem.style.display = "none";
    cardBox.innerHTML = "";
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const newCard = createCard();
            cardBox.appendChild(newCard);
            soundManager.playSound("card"); // 卡牌出现时播放音效
        }, i * 150);
    }
}

// 7. 绑定按钮
singleBtn.addEventListener("click", () => {
    soundManager.playSound("wishClick"); // 按钮点击音效
    gacha(1);
});
tenBtn.addEventListener("click", () => {
    soundManager.playSound("wishClick"); // 按钮点击音效
    gacha(10);
});

function closeWeb() {
    location.href = ''
    window.close()
}
closeBtn.addEventListener("click", () => {
    soundManager.playSound("wishClose");
    closeWeb()
})

// 音效管理器
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
let soundManager = new SoundManager();
soundManager.loadSound("card", "./audio/card.wav");
soundManager.loadSound("cardFlip", "./audio/Card_Open.wav");
soundManager.loadSound("wishClick", "./audio/Wish_click.wav");
soundManager.loadSound("wishClose","./audio/Wish_Close.wav");
// 添加按钮点击音效
