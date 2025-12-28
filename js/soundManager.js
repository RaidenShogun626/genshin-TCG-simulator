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

function closeWeb() {
    location.href = ''
    window.close()
}

const closeBtn = document.getElementById("closeBtn");
closeBtn.addEventListener("click", () => {
    soundManager.playSound("wishClose");
    closeWeb();
});