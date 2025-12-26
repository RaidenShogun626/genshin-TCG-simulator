// 1. 基础配置（保持不变）
const cardList = {
    'ssr': [
        "images/Venti.png",
        "images/char_zhongli.png",
        "images/char_raiden.png",
        "images/char_nahida.png",
        "images/Klee.png",
        "images/Jean.png",
        "images/Diluc.png",
        "images/Eula.png",
        "images/Mona.png",
        "images/Tartaglia.png",
        "images/Xiao.png",
        "images/Shenhe.png",
        "images/Hu_Tao.png",
        "images/Keqing.png",
        "images/Ganyu.png",
        "images/Tighnari.png",
        "images/Cyno.png",
        "images/Yae_Miko.png",
        "images/Kamizato_Ayaka.png",
        "images/Kamizato_Ayato.png",
        "images/Yoimiya.png",
        "images/Sangonomiya_Kokomi.png",
        "images/Maguu_Kenki.png",
        "images/Rhodeia_of_Loch.png",
        "images/Gold_Lawachurls.png",
        "images/Jadeplume_Terrorshroom.png",
        "images/Agents.png",
        "images/Mirror_Maiden.png",
        "images/Skyward_Atlas.png",
        "images/Skyward_Harp.png",
        "images/Skyward_Spine.png",
        "images/Wolf_Gravestone.png"
    ],
    'sr': [
        "images/Kaeya.png",
        "images/Amber.png",
        "images/Barbara.png",
        "images/Noelle.png",
        "images/Diona.png",
        "images/Fischl.png",
        "images/Sucrose.png",
        "images/Razor.png",
        "images/char_bennett.png",
        "images/Ningguang.png",
        "images/Beidou.png",
        "images/char_xingqiu.png",
        "images/Chongyun.png",
        "images/char_xiangling.png",
        "images/Collei.png",
        "images/Kujo_Sara.png",
        "images/Sacrificial_Sword.png",
        "images/Sacrificial_Fragments.png",
        "images/Sacrificial_Greatsword.png",
        "images/Sacrificial_Bow.png",
        "images/Lithic_Spear.png",
        "images/Large_Hydro_Slime.png",
        "images/Large_Cryo_Slime.png"
    ],
    'r': [
        "images/Hydro_Slime.png",
        "images/Cryo_Slime.png",
        "images/Electro_Slime.png",
        "images/weapon_bow.png",
        "images/weapon_claymore.png",
        "images/weapon_book.png",
        "images/Traverler_Sword.png",
        "images/White_Tassel.png"
    ]
};

// 2. 核心DOM（保持不变）
const cardBox = document.querySelector(".card-box");
const singleBtn = document.getElementById("singleBtn");
const tenBtn = document.getElementById("tenBtn");
const currentWishItem = document.querySelector('.card-level');

// 2.5 全局保底计数器（必须在函数之前定义！）
let pityCounter = {
    ssr: 0,  // 距离上次5星的抽数
    sr: 0    // 距离上次4星的抽数
};

// 3. 抽卡概率（原神机制）
function getCardRarity(isTenthWish = false) {
    // 每次抽卡计数器增加
    pityCounter.ssr++;
    pityCounter.sr++;

    const random = Math.random();

    // 如果是10连抽的第10抽
    if (isTenthWish) {
        // 第10抽必出4星或5星
        // 小概率出5星（约0.6%），否则出4星
        if (random < 0.006) {
            pityCounter.ssr = 0;
            pityCounter.sr = 0;
            return "ssr";
        } else {
            pityCounter.sr = 0;
            return "sr";
        }
    }

    // 5星保底：最多90抽必出5星
    if (pityCounter.ssr >= 90) {
        pityCounter.ssr = 0;
        pityCounter.sr = 0;
        return "ssr";
    }

    // 4星保底：最多10抽必出4星
    if (pityCounter.sr >= 10) {
        pityCounter.sr = 0;
        // 4星保底时，有概率出5星（硬保底时是0.6%概率）
        if (random < 0.006) {
            pityCounter.ssr = 0;
            return "ssr";
        }
        return "sr";
    }

    // 正常概率计算
    if (random < 0.006) {
        pityCounter.ssr = 0;
        pityCounter.sr = 0;
        return "ssr";
    }

    if (random < 0.16) {
        pityCounter.sr = 0;
        return "sr";
    }

    return "r";
}

// 4. 创建卡片函数
function createCard(isTenthWish = false) {
    const rarity = getCardRarity(isTenthWish);
    const cardImg = cardList[rarity][Math.floor(Math.random() * cardList[rarity].length)];

    const card = document.createElement("div");
    card.className = `card ${rarity}`;
    card.dataset.rarity = rarity;

let cardBackClass;
    switch(rarity) {
        case "ssr":
            cardBackClass = "ssr-card-back";
            break;
        case "sr":
            cardBackClass = "sr-card-back";
            break;
        case "r":
            cardBackClass = "r-card-back";
            break;
        default:
            cardBackClass = "r-card-back"; // 默认使用R卡背
}

    // 根据稀有度添加不同的声音效果
let raritySound;
    switch(rarity) {
        case "ssr":
            raritySound = "ssrSound";
            break;
        case "sr":
            raritySound = "srSound";
            break;
        case "r":
            raritySound = "rSound";
            break;
        default:
            raritySound = "cardFlip";
}
    card.dataset.sound = raritySound;

card.innerHTML = `
        <div class="${cardBackClass}"></div>
        <div class="card-front" style="background-image: url(${cardImg})"></div>`;

    // 添加卡片点击翻转效果
    card.addEventListener('click', () => {
        const subElement = card.firstElementChild;
        if (!subElement.classList.contains('animate-roll')) {
            soundManager.playSound(card.dataset.sound);
            subElement.classList.add("animate-roll");
            subElement.onanimationend = () => {
                card.classList.add('active');
            }
        }
    });

    return card;
}

// 5. 抽卡函数
function gacha(count = 1) {
    currentWishItem.style.display = "none";
    cardBox.innerHTML = "";

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            // 判断是否是10连抽的第10抽
            const isTenthWish = (count === 10 && i === 9);
            const newCard = createCard(isTenthWish);

            cardBox.appendChild(newCard);
            soundManager.playSound("card");

            // 根据稀有度播放特效音
            const rarity = newCard.dataset.rarity;
            setTimeout(() => {
                switch(rarity) {
                    case "ssr":
                        soundManager.playSound("ssrSound");
                        break;
                    case "sr":
                        soundManager.playSound("srSound");
                        break;
                    case "r":
                        soundManager.playSound("rSound");
                        break;
                }
            }, 200);

        }, i * 150);
    }
}

// 6. 绑定按钮
singleBtn.addEventListener("click", () => {
    soundManager.playSound("wishClick");
    gacha(1);
});

tenBtn.addEventListener("click", () => {
    soundManager.playSound("wishClick");
    gacha(10);
});

function closeWeb() {
    location.href = ''
    window.close()
}

const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
    soundManager.playSound("wishClose");
    closeWeb();
});

// 7. 音效管理器
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

// 8. 初始化音效管理器
let soundManager = new SoundManager();
soundManager.loadSound("card", "./audio/card.wav");
soundManager.loadSound("cardFlip", "./audio/Card_Open.wav");
soundManager.loadSound("wishClick", "./audio/Wish_click.wav");
soundManager.loadSound("wishClose", "./audio/Wish_Close.wav");
// 添加稀有度音效（你需要准备这些音频文件）
soundManager.loadSound("ssrSound", "./audio/5_star.wav");
soundManager.loadSound("srSound", "./audio/4_star.wav");
soundManager.loadSound("rSound", "./audio/3_star.wav");

// 图片预加载管理器
class ImagePreloader {
    constructor() {
        this.loadedCount = 0;
        this.totalCount = 0;
        this.images = {};
        this.callbacks = {
            progress: null,
            complete: null
        };
    }

    // 收集所有需要预加载的图片
    collectAllImages() {
        const allImages = [];

        // 收集卡牌图片
        Object.values(cardList).forEach(rarityList => {
            rarityList.forEach(imgPath => {
                allImages.push(imgPath);
            });
        });

        // 收集卡背图片（从CSS中提取或手动添加）
        const cardBackImages = [
            "../images/card_back.png",
            "../images/Neko_card_back.png",
            "../images/传说牌背.png"
        ];

        // 收集UI图片
        const uiImages = [
            "../images/button.png",
            "../images/gacha_bg/exit.png",
            "../images/gacha_bg/mask.png"
        ];

        return [...allImages, ...cardBackImages, ...uiImages];
    }

    // 预加载单张图片
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                this.loadedCount++;
                this.images[url] = img;

                // 触发进度回调
                if (this.callbacks.progress) {
                    const progress = Math.floor((this.loadedCount / this.totalCount) * 100);
                    this.callbacks.progress(progress, this.loadedCount, this.totalCount);
                }

                resolve(img);
            };

            img.onerror = () => {
                console.warn(`图片加载失败: ${url}`);
                this.loadedCount++;
                resolve(null);
            };

            img.src = url;
        });
    }

    // 开始预加载所有图片
    async preloadAll() {
        const allImages = this.collectAllImages();
        this.totalCount = allImages.length;
        this.loadedCount = 0;

        console.log(`开始预加载 ${this.totalCount} 张图片...`);

        // 使用Promise.all同时加载多张图片，但限制并发数
        const CONCURRENCY_LIMIT = 6; // 同时加载6张图片
        const batches = [];

        for (let i = 0; i < allImages.length; i += CONCURRENCY_LIMIT) {
            const batch = allImages.slice(i, i + CONCURRENCY_LIMIT);
            batches.push(batch);
        }

        // 分批加载
        for (const batch of batches) {
            await Promise.all(batch.map(url => this.loadImage(url)));
        }

        // 所有图片加载完成
        if (this.callbacks.complete) {
            this.callbacks.complete();
        }

        console.log('图片预加载完成！');
        return this.images;
    }

    // 设置回调函数
    onProgress(callback) {
        this.callbacks.progress = callback;
    }

    onComplete(callback) {
        this.callbacks.complete = callback;
    }

    // 获取已加载的图片
    getImage(url) {
        return this.images[url];
    }
}
