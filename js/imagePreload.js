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