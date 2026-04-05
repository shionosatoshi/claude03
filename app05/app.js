/**
 * Split Bill App
 * 金額割り勘アプリ
 */

class SplitBillApp {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('split-history')) || [];
        this.currentResults = null;

        // DOM要素
        this.elements = {
            totalAmount: document.getElementById('totalAmount'),
            peopleCount: document.getElementById('peopleCount'),
            calculateBtn: document.getElementById('calculateBtn'),
            clearResultsBtn: document.getElementById('clearResultsBtn'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            shareBtn: document.getElementById('shareBtn'),
            resultGrid: document.getElementById('resultGrid'),
            resultSection: document.getElementById('resultSection'),
            statsSection: document.getElementById('statsSection'),
            maxAmount: document.getElementById('maxAmount'),
            minAmount: document.getElementById('minAmount'),
            avgAmount: document.getElementById('avgAmount'),
            totalDisplay: document.getElementById('totalDisplay'),
            historyList: document.getElementById('historyList'),
            historyEmptyState: document.getElementById('historyEmptyState'),
            errorModal: document.getElementById('errorModal'),
            errorMessage: document.getElementById('errorMessage'),
            closeErrorModalBtn: document.getElementById('closeErrorModalBtn'),
            closeErrorBtn: document.getElementById('closeErrorBtn'),
            shareModal: document.getElementById('shareModal'),
            shareUrlInput: document.getElementById('shareUrlInput'),
            copyUrlBtn: document.getElementById('copyUrlBtn'),
            closeShareModalBtn: document.getElementById('closeShareModalBtn'),
            closeShareBtn: document.getElementById('closeShareBtn')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.displayHistory();
    }

    bindEvents() {
        // 計算ボタン
        this.elements.calculateBtn.addEventListener('click', () => {
            this.calculate();
        });

        // クリアボタン
        this.elements.clearResultsBtn.addEventListener('click', () => {
            this.clearResults();
        });

        // 履歴全削除ボタン
        this.elements.clearHistoryBtn.addEventListener('click', () => {
            if (confirm('履歴を全削除しますか？')) {
                this.clearHistory();
            }
        });

        // エラーモーダル
        this.elements.closeErrorModalBtn.addEventListener('click', () => {
            this.elements.errorModal.classList.remove('active');
        });

        this.elements.closeErrorBtn.addEventListener('click', () => {
            this.elements.errorModal.classList.remove('active');
        });

        // 共有ボタン
        this.elements.shareBtn.addEventListener('click', () => {
            this.showShareModal();
        });

        // 共有モーダル
        this.elements.closeShareModalBtn.addEventListener('click', () => {
            this.elements.shareModal.classList.remove('active');
        });

        this.elements.closeShareBtn.addEventListener('click', () => {
            this.elements.shareModal.classList.remove('active');
        });

        // URLコピー
        this.elements.copyUrlBtn.addEventListener('click', () => {
            this.copyShareUrl();
        });

        // Enterキーで計算
        this.elements.totalAmount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculate();
            }
        });

        this.elements.peopleCount.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculate();
            }
        });
    }

    calculate() {
        const totalAmount = parseInt(this.elements.totalAmount.value);
        const peopleCount = parseInt(this.elements.peopleCount.value);
        const splitMethod = document.querySelector('input[name="splitMethod"]:checked').value;

        // バリデーション
        if (isNaN(totalAmount) || totalAmount < 1 || totalAmount > 1000000) {
            this.showError('金額は1円〜1,000,000円の間で入力してください。');
            return;
        }

        if (isNaN(peopleCount) || peopleCount < 2 || peopleCount > 100) {
            this.showError('人数は2人〜100人の間で入力してください。');
            return;
        }

        // ランダム割りのバリデーション
        if (splitMethod === 'random') {
            const minAmount = Math.floor(totalAmount * 0.05);
            const totalMinAmount = minAmount * peopleCount;
            if (totalMinAmount > totalAmount) {
                this.showError(`ランダム割りの場合、${peopleCount}人 × 最小${minAmount.toLocaleString()}円（金額の5%）= ${totalMinAmount.toLocaleString()}円が必要です。合計金額を増やすか、人数を減らしてください。`);
                return;
            }
        }

        // 計算実行
        let amounts;
        if (splitMethod === 'even') {
            amounts = this.calculateEvenSplit(totalAmount, peopleCount);
        } else {
            amounts = this.calculateRandomSplit(totalAmount, peopleCount);
        }

        // 結果を表示
        this.currentResults = {
            timestamp: Date.now(),
            totalAmount: totalAmount,
            peopleCount: peopleCount,
            method: splitMethod,
            amounts: amounts
        };

        this.displayResults(amounts, totalAmount);
        this.saveToHistory(this.currentResults);
        this.displayHistory();
    }

    calculateEvenSplit(totalAmount, peopleCount) {
        const baseAmount = Math.floor(totalAmount / peopleCount);
        const remainder = totalAmount % peopleCount;
        const results = Array(peopleCount).fill(baseAmount);

        // 端数を最初の人に加算
        for (let i = 0; i < remainder; i++) {
            results[i]++;
        }

        return results;
    }

    calculateRandomSplit(totalAmount, peopleCount) {
        // 最小値を金額の5%に設定
        const minAmount = Math.floor(totalAmount * 0.05);
        const results = Array(peopleCount).fill(minAmount);
        let remaining = totalAmount - (minAmount * peopleCount);

        // 残りをランダムに分配
        for (let i = 0; i < peopleCount - 1; i++) {
            const maxAdd = remaining; // 残りを全て使って良い
            const randomAdd = Math.floor(Math.random() * (maxAdd + 1));
            results[i] += randomAdd;
            remaining -= randomAdd;
        }
        results[peopleCount - 1] += remaining;

        // シャッフル
        return this.shuffleArray(results);
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    displayResults(amounts, totalAmount) {
        // 統計計算
        const maxAmount = Math.max(...amounts);
        const minAmount = Math.min(...amounts);
        const avgAmount = Math.round(totalAmount / amounts.length);

        // 統計表示
        this.elements.maxAmount.textContent = `${maxAmount.toLocaleString()}円`;
        this.elements.minAmount.textContent = `${minAmount.toLocaleString()}円`;
        this.elements.avgAmount.textContent = `${avgAmount.toLocaleString()}円`;
        this.elements.totalDisplay.textContent = `${totalAmount.toLocaleString()}円`;

        // 統計セクションを表示
        this.elements.statsSection.style.display = 'block';

        // 結果カードを生成
        let html = '';
        amounts.forEach((amount, index) => {
            html += `
                <div class="result-card">
                    <div class="result-number">No.${index + 1}</div>
                    <div class="result-amount">${amount.toLocaleString()}円</div>
                    <div class="result-label">${this.calculatePercentage(amount, totalAmount)}%</div>
                </div>
            `;
        });

        this.elements.resultGrid.innerHTML = html;
        this.elements.resultSection.style.display = 'block';
    }

    calculatePercentage(amount, total) {
        return ((amount / total) * 100).toFixed(1);
    }

    clearResults() {
        this.elements.resultGrid.innerHTML = '';
        this.elements.resultSection.style.display = 'none';
        this.elements.statsSection.style.display = 'none';
        this.currentResults = null;
    }

    saveToHistory(results) {
        // 履歴の先頭に追加
        this.history.unshift(results);

        // 最大5件まで保持
        if (this.history.length > 5) {
            this.history = this.history.slice(0, 5);
        }

        // localStorageに保存
        localStorage.setItem('split-history', JSON.stringify(this.history));
    }

    displayHistory() {
        if (this.history.length === 0) {
            this.elements.historyEmptyState.style.display = 'block';
            this.elements.historyList.innerHTML = '';
            this.elements.historyList.appendChild(this.elements.historyEmptyState);
            return;
        }

        this.elements.historyEmptyState.style.display = 'none';

        let html = '';
        this.history.forEach((item, index) => {
            const date = new Date(item.timestamp);
            const dateStr = date.toLocaleString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            const methodText = item.method === 'even' ? '均等割り' : 'ランダム';
            const methodClass = item.method === 'even' ? 'even' : 'random';

            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-header">
                        <span class="history-date">${dateStr}</span>
                        <span class="history-method ${methodClass}">${methodText}</span>
                    </div>
                    <div class="history-details">
                        <span class="history-detail">合計: <strong>${item.totalAmount.toLocaleString()}円</strong></span>
                        <span class="history-detail">人数: <strong>${item.peopleCount}人</strong></span>
                    </div>
                </div>
            `;
        });

        this.elements.historyList.innerHTML = html;

        // 履歴アイテムのクリックイベント
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.restoreFromHistory(index);
            });
        });
    }

    restoreFromHistory(index) {
        const item = this.history[index];
        if (!item) return;

        // 入力欄を復元
        this.elements.totalAmount.value = item.totalAmount;
        this.elements.peopleCount.value = item.peopleCount;

        // 割り方を復元
        const radioButtons = document.querySelectorAll('input[name="splitMethod"]');
        radioButtons.forEach(radio => {
            if (radio.value === item.method) {
                radio.checked = true;
            }
        });

        // 結果を表示
        this.currentResults = item;
        this.displayResults(item.amounts, item.totalAmount);

        // スクロール
        this.elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    clearHistory() {
        this.history = [];
        localStorage.removeItem('split-history');
        this.displayHistory();
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorModal.classList.add('active');
    }

    showShareModal() {
        if (!this.currentResults) {
            this.showError('共有する計算結果がありません。');
            return;
        }

        // 計算結果をJSON文字列化してBase64エンコード
        const data = {
            totalAmount: this.currentResults.totalAmount,
            peopleCount: this.currentResults.peopleCount,
            method: this.currentResults.method,
            amounts: this.currentResults.amounts
        };

        const jsonString = JSON.stringify(data);
        const base64Encoded = btoa(unescape(encodeURIComponent(jsonString)));

        // URL生成
        const url = `${window.location.origin}${window.location.pathname}?data=${base64Encoded}`;
        this.elements.shareUrlInput.value = url;
        this.elements.shareModal.classList.add('active');
    }

    copyShareUrl() {
        const urlInput = this.elements.shareUrlInput;
        urlInput.select();
        urlInput.setSelectionRange(0, 99999); // モバイル対応

        // Clipboard APIを使用
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(urlInput.value)
                .then(() => {
                    this.elements.copyUrlBtn.textContent = '✅ コピーしました！';
                    setTimeout(() => {
                        this.elements.copyUrlBtn.textContent = '📋 コピー';
                    }, 2000);
                })
                .catch(() => {
                    this.fallbackCopy(urlInput.value);
                });
        } else {
            this.fallbackCopy(urlInput.value);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.elements.copyUrlBtn.textContent = '✅ コピーしました！';
                setTimeout(() => {
                    this.elements.copyUrlBtn.textContent = '📋 コピー';
                }, 2000);
            } else {
                this.showError('コピーに失敗しました。URLを手動でコピーしてください。');
            }
        } catch (err) {
            this.showError('コピーに失敗しました。URLを手動でコピーしてください。');
        }

        document.body.removeChild(textarea);
    }

    loadFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const data = urlParams.get('data');

        if (!data) {
            return;
        }

        try {
            // Base64デコードしてJSONパース
            const jsonString = decodeURIComponent(escape(atob(data)));
            const results = JSON.parse(jsonString);

            // バリデーション
            if (!results.totalAmount || !results.peopleCount || !results.method || !results.amounts) {
                throw new Error('無効なデータ形式');
            }

            // 計算結果を復元
            this.currentResults = results;
            this.elements.totalAmount.value = results.totalAmount;
            this.elements.peopleCount.value = results.peopleCount;

            // 割り方を復元
            const radioButtons = document.querySelectorAll('input[name="splitMethod"]');
            radioButtons.forEach(radio => {
                if (radio.value === results.method) {
                    radio.checked = true;
                }
            });

            // 結果を表示
            this.displayResults(results.amounts, results.totalAmount);

            // URLからパラメータを削除
            window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
            console.error('URLからのデータ読み込みエラー:', error);
            this.showError('無効な共有URLです。');
        }
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    const app = new SplitBillApp();
    app.loadFromUrl();
});
