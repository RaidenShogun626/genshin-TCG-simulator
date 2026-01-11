// 等待页面完全加载后执行
window.onload = function() {
    // 找到历史记录按钮（第三个.footer-btn）
    const historyBtn = document.querySelectorAll('.footer-btn')[2];

    // 如果按钮存在
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            // 1. 播放点击音效
            playHistorySound();

            // 2. 延迟一小段时间后跳转（让声音有时间播放）
            setTimeout(function() {
                window.location.href = 'Card_Record.html';
            }, 300); // 300毫秒延迟
        });
    }
};

// 在 Card_Record.js 中添加返回首页功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取关闭按钮
    const closeBtn = document.getElementById('closeRecordBtn');

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // 播放关闭音效（如果配置了的话）
            playCloseSound();

            // 延迟后返回首页
            setTimeout(function() {
                // 返回到 index.html
                window.location.href = 'index.html';

                // 或者如果你想要有动画效果，可以这样做：
                // 先添加淡出效果
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.3s ease';

                // 然后跳转
                setTimeout(function() {
                    window.location.href = 'index.html';
                }, 300);

            }, 200); // 200ms延迟让音效播放
        });
    }

    // 播放关闭音效
    function playCloseSound() {
        try {
            // 如果使用了相同的音效
            const closeSound = new Audio('./audio/Click.wav');
            closeSound.volume = 0.4;
            closeSound.play().catch(e => {
                console.log("关闭音效播放失败:", e);
            });
        } catch (error) {
            console.log("音效播放错误:", error);
        }
    }
});

// 保持原有的历史记录按钮功能
window.onload = function() {
    const historyBtn = document.querySelectorAll('.footer-btn')[2];
    if (historyBtn) {
        historyBtn.addEventListener('click', function() {
            playHistorySound();
            setTimeout(function() {
                window.location.href = 'Card_Record.html';
            }, 300);
        });
    }
};

// 播放历史记录点击音效
function playHistorySound() {

    const clickSound = new Audio('./audio/Click.wav'); // 替换为你的音效路径

    // 设置音量
    clickSound.volume = 0.5;

    // 播放音效
    clickSound.play().catch(e => {
        console.log("音效播放失败:", e);
        // 如果播放失败，直接跳转
        window.location.href = 'Card_Record.html';
    });
}
