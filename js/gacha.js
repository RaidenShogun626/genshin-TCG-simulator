// 2. 核心DOM
const cardBox = document.querySelector(".card-box");
const singleBtn = document.getElementById("singleBtn");
const tenBtn = document.getElementById("tenBtn");
const currentWishItem = document.querySelector('.card-level');
const skipBtn = document.getElementById("skipBtn"); // 添加跳过按钮

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
    const cardItem = CharList[rarity][Math.floor(Math.random() * cardList[rarity].length)];
    if (!sessionStorage[RecordName]) {
        sessionStorage[RecordName] = "[]";
    }
    const itemsNow = JSON.parse(sessionStorage[RecordName]);
    itemsNow.push(cardItem);
    sessionStorage[RecordName] = JSON.stringify(itemsNow)
    const cardImg = cardItem.path;

    const card = document.createElement("div");
    card.className = `card ${rarity}`;
    card.dataset.rarity = rarity;

    let cardBackClass;
    switch (rarity) {
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
            cardBackClass = "r-card-back";
    }

    // 根据稀有度添加不同的声音效果
    let raritySound;
    switch (rarity) {
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

let isGachaEnabled = true

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
            if (i === count - 1) {
                newCard.addEventListener('animationend', () => {
                    setTimeout(function () {
                        isGachaEnabled = true;
                        console.log('last-pity-count', pityCounter);

                        // 如果是10连抽，显示跳过按钮
                        if (count === 10) {
                            setTimeout(() => {
                                skipBtn.classList.add('show');
                            }, 300);
                        }
                    }, 0);
                });
            }

            // 根据稀有度播放特效音
            const rarity = newCard.dataset.rarity;
            setTimeout(() => {
                switch (rarity) {
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
    if (!isGachaEnabled) {
        return;
    }
    isGachaEnabled = false;
    soundManager.playSound("wishClick");
    gacha(1);
});

tenBtn.addEventListener("click", () => {
    if (!isGachaEnabled) {
        return;
    }
    isGachaEnabled = false;
    soundManager.playSound("wishClick");
    gacha(10);
    skipBtn.classList.add('show');
});

// === 跳过功能 ===

// 存储当前是否正在跳过
let isSkipping = false;

// 跳过按钮点击事件
if (skipBtn) {
    skipBtn.addEventListener('click', function() {
        if (isSkipping) return; // 防止重复点击

        const allCards = document.querySelectorAll('.card:not(.active)');
        if (allCards.length === 0) return;

        isSkipping = true; // 标记正在跳过

        // 记录需要翻开的卡片数量
        let cardsToFlip = allCards.length;
        let cardsFlipped = 0;

        console.log('开始跳过，需要翻开的卡片数量:', cardsToFlip);

        // 依次翻开所有卡片
        allCards.forEach((card, index) => {
            setTimeout(() => {
                const subElement = card.firstElementChild;
                if (subElement && !subElement.classList.contains('animate-roll')) {
                    // 播放翻牌音效
                    const raritySound = card.dataset.sound;
                    if (raritySound) {
                        soundManager.playSound(raritySound);
                    }

                    subElement.classList.add("animate-roll");

                    // 使用动画结束事件
                    const onAnimationEnd = () => {
                        card.classList.add('active');
                        cardsFlipped++;

                        console.log('卡片翻完，已翻:', cardsFlipped, '/', cardsToFlip);

                        // 检查是否所有卡片都翻完了
                        if (cardsFlipped === cardsToFlip) {
                            console.log('所有卡牌翻完，隐藏按钮');
                            // 所有卡牌都翻完后才隐藏按钮
                            setTimeout(() => {
                                skipBtn.classList.remove('show');
                                isSkipping = false; // 重置跳过状态
                            }, 500); // 额外延迟，确保动画完全结束
                        }
                    };

                    // 确保动画结束事件只绑定一次
                    subElement.addEventListener('animationend', onAnimationEnd, { once: true });
                } else {
                    // 如果卡片已经翻开了，也计数
                    cardsFlipped++;
                    if (cardsFlipped === cardsToFlip) {
                        console.log('所有卡片已翻开，隐藏按钮');
                        setTimeout(() => {
                            skipBtn.classList.remove('show');
                            isSkipping = false;
                        }, 500);
                    }
                }
            }, index * 100); // 增加间隔时间
        });
    });

    // 键盘空格键跳过
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && skipBtn.classList.contains('show') && !isSkipping) {
            event.preventDefault();
            skipBtn.click();
        }
    });
}
