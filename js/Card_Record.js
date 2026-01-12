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

    const backBtn = document.querySelector('.book-close')
    backBtn?.addEventListener('click', function() {
        location.href = './index.html';
    })

    const wishTable = document.querySelector('#wish-table')
    if (wishTable) {
        const wishData = JSON.parse(
            sessionStorage[RecordName]
        );
        const tBody = wishTable.querySelector('tbody')

        let currentPageIndex = 0;
        const previousButton = document.querySelector(`[data-action="prev"]`)
        const nextButton = document.querySelector(`[data-action="next"]`)

        previousButton.setAttribute('disabled', 'disabled');
        if (wishData.length < 5) {
            nextButton.setAttribute('disabled', 'disabled');
        } else {
            nextButton.removeAttribute('disabled');
        }
        const totalPages = document.querySelector(".total-pages")
        const currentPages = document.querySelector(".current-page")

        const shiftPage = function ( ) {
            tBody.innerHTML = '';
            const items = wishData.slice(
                5 * currentPageIndex,
                (currentPageIndex + 1) * 5,
            )
            const fragement = document.createDocumentFragment();
            items.forEach(wishItem => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${wishItem.type}</td><td style="color: ${wishItem.rarity.startsWith('4') ? "#A256E1" : wishItem.rarity.startsWith("5") ? "#BD6932" : "#8D8D8C"}">${wishItem.name}</td><td style="color: ${wishItem.rarity.startsWith('4') ? "#A256E1" : wishItem.rarity.startsWith("5") ? "#BD6932" : "#8D8D8C"}">${wishItem.rarity}</td><td>${new Date().toLocaleString()}</td>`;
                fragement.appendChild(tr);
            })
            tBody.appendChild(fragement);
            currentPages.innerHTML = `${currentPageIndex+1}`
            if (currentPageIndex === 0) {
                previousButton.setAttribute('disabled', 'disabled');
                nextButton.removeAttribute('disabled');
            }
            if (currentPageIndex >= Math.round(wishData.length / 5) - 1) {
                nextButton.setAttribute('disabled', 'disabled');
                previousButton.removeAttribute('disabled');
            }
        }
        shiftPage(
            currentPageIndex
        )
        totalPages.innerHTML = `${Math.round(wishData.length / 5)}`;
        if (previousButton) {
            previousButton.onclick = function () {
                if (currentPageIndex === 0) {
                    return;
                }
                currentPageIndex--;
                nextButton.removeAttribute('disabled');
                shiftPage(currentPageIndex);
            }
        }
        if (nextButton) {
            nextButton.onclick = function () {
                if (currentPageIndex >= Math.round(wishData.length / 5) - 1) {
                    return;
                }
                previousButton.removeAttribute('disabled');
                currentPageIndex++;
                shiftPage(currentPageIndex);
            }
        }
    }
};

const RecordName = "RecordWishes";

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

// 根据稀有度为元素添加对应的类
function applyRarityColors() {
    document.querySelectorAll('.wish-table tbody tr').forEach(row => {
        const rarity = row.getAttribute('data-rarity'); // 假设你的数据中有data-rarity属性

        if (rarity === '5') {
            row.classList.add('rarity-5');
        } else if (rarity === '4') {
            row.classList.add('rarity-4');
        } else if (rarity === '3') {
            row.classList.add('rarity-3');
        }
    });
}

// 在数据加载完成后调用
applyRarityColors();