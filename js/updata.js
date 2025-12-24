class HotUpdater {
    constructor() {
        this.updateUrl = 'http://localhost:3000'; // 更新服务器地址
        this.checkInterval = 5 * 60 * 1000; // 5分钟检查一次
        this.currentVersion = '1.0.0';
        this.isChecking = false;
    }

    // 检查更新
    async checkForUpdates() {
        if (this.isChecking) return;

        this.isChecking = true;
        try {
            const response = await fetch(`${this.updateUrl}/api/version`);
            const data = await response.json();

            if (data.version !== this.currentVersion) {
                this.showUpdateNotification(data);
            }
        } catch (error) {
            console.log('检查更新失败:', error);
        } finally {
            this.isChecking = false;
        }
    }

    // 显示更新通知
    showUpdateNotification(updateData) {
        const notice = document.getElementById('update-notice');
        const info = document.getElementById('update-info');
        const updateNow = document.getElementById('update-now');
        const updateLater = document.getElementById('update-later');

        info.textContent = `发现新版本 v${updateData.version}\n${updateData.description || ''}`;
        notice.style.display = 'flex';

        updateNow.onclick = () => this.applyUpdate(updateData);
        updateLater.onclick = () => notice.style.display = 'none';
    }

    // 应用更新
    async applyUpdate(updateData) {
        try {
            // 下载更新文件
            const response = await fetch(`${this.updateUrl}/api/update`);
            const updateFiles = await response.json();

            // 更新卡片数据
            if (updateFiles.cards) {
                cardData.updateCardData(updateFiles.cards);
                console.log('卡片数据已更新');
            }

            // 更新配置文件
            if (updateFiles.config) {
                await this.updateConfig(updateFiles.config);
            }

            // 更新版本号
            this.currentVersion = updateData.version;
            localStorage.setItem('app_version', this.currentVersion);

            alert('更新成功！新版本已应用。');
            document.getElementById('update-notice').style.display = 'none';

            // 重新加载页面
            location.reload();

        } catch (error) {
            console.error('更新失败:', error);
            alert('更新失败，请稍后重试');
        }
    }

    // 更新配置文件
    async updateConfig(config) {
        for (const [file, content] of Object.entries(config)) {
            if (file.endsWith('.css')) {
                // 动态更新CSS
                const link = document.querySelector(`link[href*="${file}"]`);
                if (link) {
                    link.href = `${link.href.split('?')[0]}?v=${Date.now()}`;
                }
            }
        }
    }

    // 开始定期检查
    start() {
        this.checkForUpdates();
        setInterval(() => this.checkForUpdates(), this.checkInterval);
    }
}

// 初始化热更新
const hotUpdater = new HotUpdater();

// 页面加载后启动更新检查
window.addEventListener('load', () => {
    hotUpdater.start();
});