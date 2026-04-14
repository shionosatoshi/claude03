/**
 * サブスクリプション管理アプリ
 * Subscription Manager App
 */

class SubscriptionManager {
    constructor() {
        this.subscriptions = JSON.parse(localStorage.getItem('subscription-data')) || [];
        this.displayCurrency = localStorage.getItem('display-currency') || 'JPY';
        this.chart = null;
        this.deleteTargetId = null;

        // 通貨シンボル
        this.currencySymbols = {
            JPY: '¥',
            USD: '$',
            EUR: '€',
            GBP: '£',
            CNY: '¥'
        };

        // 支払い周期の月額換算レート
        this.cycleRates = {
            monthly: 1,
            yearly: 1 / 12,
            weekly: 4.33,
            daily: 30.44
        };

        // カテゴリ名（日本語）
        this.categoryNames = {
            video: '動画配信',
            music: '音楽',
            software: 'ソフトウェア',
            game: 'ゲーム',
            storage: 'クラウドストレージ',
            news: 'ニュース・雑誌',
            fitness: 'フィットネス',
            education: '教育',
            other: 'その他'
        };

        // プリセットデータ（ブランドカラー使用）
        this.presets = {
            'netflix-standard': { name: 'Netflix', amount: 1490, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#E50914' },
            'netflix-premium': { name: 'Netflix (Premium)', amount: 1980, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#E50914' },
            'youtube-premium': { name: 'YouTube Premium', amount: 1500, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#FF0000' },
            'amazon-prime': { name: 'Amazon Prime Video', amount: 600, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#00A8E1' },
            'disney-plus': { name: 'Disney+', amount: 990, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#113CCF' },
            'unext': { name: 'U-NEXT', amount: 2289, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#FF5733' },
            'hulu': { name: 'Hulu', amount: 1026, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#1CE783' },
            'dazn': { name: 'DAZN', amount: 3750, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#BA8B02' },
            'apple-music': { name: 'Apple Music', amount: 1080, currency: 'JPY', cycle: 'monthly', category: 'music', color: '#FA233B' },
            'spotify': { name: 'Spotify', amount: 1290, currency: 'JPY', cycle: 'monthly', category: 'music', color: '#1DB954' },
            'amazon-music': { name: 'Amazon Music Unlimited', amount: 1080, currency: 'JPY', cycle: 'monthly', category: 'music', color: '#00A8E1' },
            'youtube-music': { name: 'YouTube Music', amount: 1280, currency: 'JPY', cycle: 'monthly', category: 'music', color: '#FF0000' },
            'line-music': { name: 'LINE MUSIC', amount: 980, currency: 'JPY', cycle: 'monthly', category: 'music', color: '#06C755' },
            'google-one': { name: 'Google One (200GB)', amount: 250, currency: 'JPY', cycle: 'monthly', category: 'storage', color: '#4285F4' },
            'icloud-plus': { name: 'iCloud+ (200GB)', amount: 130, currency: 'JPY', cycle: 'monthly', category: 'storage', color: '#007AFF' },
            'dropbox-plus': { name: 'Dropbox Plus', amount: 1580, currency: 'JPY', cycle: 'yearly', category: 'storage', color: '#0061FF' },
            'adobe-cc': { name: 'Adobe Creative Cloud', amount: 6180, currency: 'JPY', cycle: 'monthly', category: 'software', color: '#FF0000' },
            'microsoft-365': { name: 'Microsoft 365 Personal', amount: 1380, currency: 'JPY', cycle: 'yearly', category: 'software', color: '#00A4EF' },
            'figma-pro': { name: 'Figma Professional', amount: 3000, currency: 'JPY', cycle: 'monthly', category: 'software', color: '#F24E1E' },
            'chatgpt-plus': { name: 'ChatGPT Plus', amount: 2500, currency: 'JPY', cycle: 'monthly', category: 'software', color: '#10A37F' },
            'notion-personal': { name: 'Notion Personal', amount: 1200, currency: 'JPY', cycle: 'monthly', category: 'software', color: '#000000' },
            'canva-pro': { name: 'Canva Pro', amount: 770, currency: 'JPY', cycle: 'monthly', category: 'software', color: '#00C4CC' },
            'game-pass': { name: 'Xbox Game Pass', amount: 1180, currency: 'JPY', cycle: 'monthly', category: 'game', color: '#107C10' },
            'ps-plus': { name: 'PlayStation Plus', amount: 1050, currency: 'JPY', cycle: 'monthly', category: 'game', color: '#003791' },
            'nso': { name: 'Nintendo Switch Online', amount: 340, currency: 'JPY', cycle: 'yearly', category: 'game', color: '#E60012' },
            'nikkei-mj': { name: '日経MJ', amount: 12000, currency: 'JPY', cycle: 'yearly', category: 'news', color: '#E31837' },
            'youtube-premium-news': { name: 'YouTube Premium (ニュース)', amount: 1500, currency: 'JPY', cycle: 'monthly', category: 'news', color: '#FF0000' }
        };

        // DOM要素
        this.elements = {
            totalMonthly: document.getElementById('totalMonthly'),
            subscriptionCount: document.getElementById('subscriptionCount'),
            chartCanvas: document.getElementById('subscriptionChart'),
            chartEmpty: document.getElementById('chartEmpty'),
            subscriptionList: document.getElementById('subscriptionList'),
            emptyState: document.getElementById('emptyState'),
            subscriptionModal: document.getElementById('subscriptionModal'),
            settingsModal: document.getElementById('settingsModal'),
            deleteModal: document.getElementById('deleteModal'),
            subscriptionForm: document.getElementById('subscriptionForm'),
            modalTitle: document.getElementById('modalTitle'),
            subscriptionId: document.getElementById('subscriptionId'),
            presetSelect: document.getElementById('presetSelect'),
            serviceName: document.getElementById('serviceName'),
            amount: document.getElementById('amount'),
            currency: document.getElementById('currency'),
            cycle: document.getElementById('cycle'),
            category: document.getElementById('category'),
            color: document.getElementById('color'),
            monthlyPreviewValue: document.getElementById('monthlyPreviewValue'),
            openAddModalBtn: document.getElementById('openAddModalBtn'),
            closeModalBtn: document.getElementById('closeModalBtn'),
            cancelBtn: document.getElementById('cancelBtn'),
            openSettingsBtn: document.getElementById('openSettingsBtn'),
            closeSettingsBtn: document.getElementById('closeSettingsBtn'),
            closeSettingsOkBtn: document.getElementById('closeSettingsOkBtn'),
            displayCurrency: document.getElementById('displayCurrency'),
            exportBtn: document.getElementById('exportBtn'),
            importBtn: document.getElementById('importBtn'),
            importFile: document.getElementById('importFile'),
            clearAllBtn: document.getElementById('clearAllBtn'),
            randomColorBtn: document.getElementById('randomColorBtn'),
            closeDeleteModalBtn: document.getElementById('closeDeleteModalBtn'),
            cancelDeleteBtn: document.getElementById('cancelDeleteBtn'),
            confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
            deleteTargetName: document.getElementById('deleteTargetName')
        };

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.initCurrencySelector();
    }

    bindEvents() {
        // 追加モーダル
        this.elements.openAddModalBtn.addEventListener('click', () => this.openAddModal());
        this.elements.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.elements.cancelBtn.addEventListener('click', () => this.closeModal());

        // フォーム送信
        this.elements.subscriptionForm.addEventListener('submit', (e) => this.handleSubmit(e));

        // 金額・周期変更でプレビュー更新
        this.elements.amount.addEventListener('input', () => this.updateMonthlyPreview());
        this.elements.cycle.addEventListener('change', () => this.updateMonthlyPreview());

        // プリセット選択
        this.elements.presetSelect.addEventListener('change', (e) => this.handlePresetSelect(e));

        // ランダム色ボタン
        this.elements.randomColorBtn.addEventListener('click', () => this.setRandomColor());

        // 設定モーダル
        this.elements.openSettingsBtn.addEventListener('click', () => this.openSettingsModal());
        this.elements.closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
        this.elements.closeSettingsOkBtn.addEventListener('click', () => this.closeSettingsModal());

        // 表示通貨変更
        this.elements.displayCurrency.addEventListener('change', (e) => this.changeDisplayCurrency(e.target.value));

        // データ管理
        this.elements.exportBtn.addEventListener('click', () => this.exportData());
        this.elements.importBtn.addEventListener('click', () => this.elements.importFile.click());
        this.elements.importFile.addEventListener('change', (e) => this.importData(e));
        this.elements.clearAllBtn.addEventListener('click', () => this.clearAllData());

        // 削除確認モーダル
        this.elements.closeDeleteModalBtn.addEventListener('click', () => this.closeDeleteModal());
        this.elements.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        this.elements.confirmDeleteBtn.addEventListener('click', () => this.executeDelete());

        // モーダル外クリックで閉じる（無効化 - 入力内容を保持するため）
        // this.elements.subscriptionModal.addEventListener('click', (e) => {
        //     if (e.target === this.elements.subscriptionModal) this.closeModal();
        // });
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) this.closeSettingsModal();
        });
        this.elements.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.elements.deleteModal) this.closeDeleteModal();
        });
    }

    initCurrencySelector() {
        this.elements.displayCurrency.value = this.displayCurrency;
    }

    // ===== 表示更新 =====
    updateDisplay() {
        this.updateTotal();
        this.updateChart();
        this.updateList();
    }

    updateTotal() {
        const total = this.calculateTotalMonthly();
        this.elements.totalMonthly.textContent = this.formatCurrency(total, this.displayCurrency);
        this.elements.subscriptionCount.textContent = this.subscriptions.length;
    }

    calculateTotalMonthly() {
        return this.subscriptions.reduce((sum, sub) => {
            return sum + this.convertToMonthly(sub.amount, sub.currency, sub.cycle);
        }, 0);
    }

    convertToMonthly(amount, currency, cycle) {
        // まず月額換算
        const monthly = amount * this.cycleRates[cycle];
        // 通貨が異なる場合は簡易換算（実際には為替レートが必要ですが、ここでは1:1とします）
        // TODO: 為替レートAPIを組み込む
        return monthly;
    }

    formatCurrency(amount, currency) {
        const symbol = this.currencySymbols[currency] || currency;
        if (currency === 'JPY') {
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        }
        return `${symbol}${amount.toFixed(2)}`;
    }

    // ===== グラフ =====
    updateChart() {
        if (this.subscriptions.length === 0) {
            this.elements.chartEmpty.style.display = 'block';
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            return;
        }

        this.elements.chartEmpty.style.display = 'none';

        const labels = this.subscriptions.map(sub => sub.name);
        const data = this.subscriptions.map(sub =>
            this.convertToMonthly(sub.amount, sub.currency, sub.cycle)
        );
        const colors = this.subscriptions.map(sub => sub.color);

        if (this.chart) {
            this.chart.data.labels = labels;
            this.chart.data.datasets[0].data = data;
            this.chart.data.datasets[0].backgroundColor = colors;
            this.chart.update();
        } else {
            this.chart = new Chart(this.elements.chartCanvas, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 16,
                                usePointStyle: true,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                    return `${label}: ${this.formatCurrency(value, this.displayCurrency)} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });
        }
    }

    // ===== リスト =====
    updateList() {
        if (this.subscriptions.length === 0) {
            this.elements.emptyState.style.display = 'block';
            this.elements.subscriptionList.innerHTML = '';
            this.elements.subscriptionList.appendChild(this.elements.emptyState);
            return;
        }

        this.elements.emptyState.style.display = 'none';
        this.elements.subscriptionList.innerHTML = '';

        this.subscriptions.forEach(sub => {
            const card = this.createSubscriptionCard(sub);
            this.elements.subscriptionList.appendChild(card);
        });
    }

    createSubscriptionCard(subscription) {
        const monthlyAmount = this.convertToMonthly(subscription.amount, subscription.currency, subscription.cycle);
        const cycleText = this.getCycleText(subscription.cycle);

        const card = document.createElement('div');
        card.className = 'subscription-card';
        card.style.setProperty('--card-color', subscription.color);
        card.innerHTML = `
            <div class="subscription-color" style="background-color: ${subscription.color}"></div>
            <div class="subscription-info">
                <div class="subscription-name">${this.escapeHtml(subscription.name)}</div>
                <div class="subscription-meta">
                    <span class="subscription-amount">${this.formatCurrency(subscription.amount, subscription.currency)}${cycleText}</span>
                    ${subscription.category ? `<span class="subscription-category">${this.categoryNames[subscription.category]}</span>` : ''}
                </div>
                <div class="subscription-monthly">月額換算: ${this.formatCurrency(monthlyAmount, this.displayCurrency)}</div>
            </div>
            <div class="subscription-actions">
                <button class="icon-btn edit" data-id="${subscription.id}" title="編集">✏️</button>
                <button class="icon-btn delete" data-id="${subscription.id}" title="削除">🗑️</button>
            </div>
        `;

        // イベントリスナー
        card.querySelector('.edit').addEventListener('click', () => this.openEditModal(subscription));
        card.querySelector('.delete').addEventListener('click', () => this.openDeleteModal(subscription));

        return card;
    }

    getCycleText(cycle) {
        const cycleTexts = {
            monthly: '/月',
            yearly: '/年',
            weekly: '/週',
            daily: '/日'
        };
        return cycleTexts[cycle] || '';
    }

    // ===== モーダル操作 =====
    openAddModal() {
        this.elements.modalTitle.textContent = 'サブスクリプションを追加';
        this.elements.subscriptionForm.reset();
        this.elements.subscriptionId.value = '';
        this.elements.presetSelect.value = '';
        this.elements.color.value = this.getRandomColor();
        this.elements.serviceName.disabled = true;
        this.updateMonthlyPreview();
        this.elements.subscriptionModal.classList.add('active');
        this.elements.presetSelect.focus();
    }

    openEditModal(subscription) {
        this.elements.modalTitle.textContent = 'サブスクリプションを編集';
        this.elements.subscriptionId.value = subscription.id;
        this.elements.serviceName.value = subscription.name;
        this.elements.amount.value = subscription.amount;
        this.elements.currency.value = subscription.currency;
        this.elements.cycle.value = subscription.cycle;
        this.elements.category.value = subscription.category || '';
        this.elements.color.value = subscription.color;
        this.updateMonthlyPreview();
        this.elements.subscriptionModal.classList.add('active');
        this.elements.serviceName.focus();
    }

    closeModal() {
        this.elements.subscriptionModal.classList.remove('active');
    }

    handlePresetSelect(e) {
        const value = e.target.value;

        if (value === 'other') {
            // その他（自由入力）
            this.elements.serviceName.disabled = false;
            this.elements.serviceName.value = '';
            this.elements.serviceName.focus();
        } else if (value && this.presets[value]) {
            // プリセット選択
            const preset = this.presets[value];
            this.elements.serviceName.disabled = true;
            this.elements.serviceName.value = preset.name;
            this.elements.amount.value = preset.amount;
            this.elements.currency.value = preset.currency;
            this.elements.cycle.value = preset.cycle;
            this.elements.category.value = preset.category;
            this.elements.color.value = preset.color;
            this.updateMonthlyPreview();
        } else {
            // 未選択
            this.elements.serviceName.disabled = true;
            this.elements.serviceName.value = '';
        }
    }

    openSettingsModal() {
        this.elements.settingsModal.classList.add('active');
    }

    closeSettingsModal() {
        this.elements.settingsModal.classList.remove('active');
    }

    openDeleteModal(subscription) {
        this.deleteTargetId = subscription.id;
        this.elements.deleteTargetName.textContent = subscription.name;
        this.elements.deleteModal.classList.add('active');
    }

    closeDeleteModal() {
        this.deleteTargetId = null;
        this.elements.deleteModal.classList.remove('active');
    }

    // ===== フォーム処理 =====
    handleSubmit(e) {
        e.preventDefault();

        const id = this.elements.subscriptionId.value;
        const data = {
            id: id || this.generateId(),
            name: this.elements.serviceName.value.trim(),
            amount: parseFloat(this.elements.amount.value),
            currency: this.elements.currency.value,
            cycle: this.elements.cycle.value,
            category: this.elements.category.value || null,
            color: this.elements.color.value,
            createdAt: id ? this.subscriptions.find(s => s.id === id)?.createdAt : Date.now()
        };

        if (id) {
            // 更新
            const index = this.subscriptions.findIndex(s => s.id === id);
            if (index !== -1) {
                this.subscriptions[index] = data;
            }
        } else {
            // 追加
            this.subscriptions.push(data);
        }

        this.saveData();
        this.updateDisplay();
        this.closeModal();
    }

    // ===== 月額プレビュー =====
    updateMonthlyPreview() {
        const amount = parseFloat(this.elements.amount.value) || 0;
        const cycle = this.elements.cycle.value;
        const currency = this.elements.currency.value;

        const monthly = this.convertToMonthly(amount, currency, cycle);
        this.elements.monthlyPreviewValue.textContent = this.formatCurrency(monthly, currency);
    }

    // ===== 削除 =====
    executeDelete() {
        if (this.deleteTargetId) {
            this.subscriptions = this.subscriptions.filter(s => s.id !== this.deleteTargetId);
            this.saveData();
            this.updateDisplay();
        }
        this.closeDeleteModal();
    }

    // ===== 通貨設定 =====
    changeDisplayCurrency(currency) {
        this.displayCurrency = currency;
        localStorage.setItem('display-currency', currency);
        this.updateDisplay();
    }

    // ===== データ管理 =====
    saveData() {
        localStorage.setItem('subscription-data', JSON.stringify(this.subscriptions));
    }

    exportData() {
        const data = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            subscriptions: this.subscriptions,
            displayCurrency: this.displayCurrency
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.subscriptions && Array.isArray(data.subscriptions)) {
                    this.subscriptions = data.subscriptions;
                    if (data.displayCurrency) {
                        this.displayCurrency = data.displayCurrency;
                        localStorage.setItem('display-currency', data.displayCurrency);
                        this.elements.displayCurrency.value = data.displayCurrency;
                    }
                    this.saveData();
                    this.updateDisplay();
                    alert('データをインポートしました');
                } else {
                    alert('無効なファイル形式です');
                }
            } catch (err) {
                alert('ファイルの読み込みに失敗しました');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    clearAllData() {
        if (confirm('すべてのサブスクリプションデータを削除しますか？\nこの操作は取り消せません。')) {
            this.subscriptions = [];
            this.saveData();
            this.updateDisplay();
            this.closeSettingsModal();
        }
    }

    // ===== ユーティリティ =====
    generateId() {
        return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getRandomColor() {
        const colors = [
            '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
            '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setRandomColor() {
        this.elements.color.value = this.getRandomColor();
    }
}

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    new SubscriptionManager();
});
