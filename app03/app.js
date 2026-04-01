// メモ・ノートアプリのメインロジック
console.log('=== app.js読み込み開始 ===');

class NoteApp {
    constructor() {
        console.log('=== NoteApp.constructor開始 ===');
        this.notes = [];
        this.currentFilter = 'all';
        this.editingNoteId = null;
        this.deletingNoteId = null;

        // スワイプ用のプロパティ
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 80;

        this.initializeElements();
        this.attachEventListeners();
        this.loadNotes();
        this.render();
        console.log('✅ NoteApp初期化成功');
    }

    // ===== 初期化 =====
    initializeElements() {
        // 検索・アクション
        this.searchInput = document.getElementById('searchInput');
        this.addNoteBtn = document.getElementById('addNoteBtn');

        // フィルター
        this.filterButtons = document.querySelectorAll('.filter-btn');

        // メモ一覧
        this.notesList = document.getElementById('notesList');
        this.emptyState = document.getElementById('emptyState');
        this.noteCount = document.getElementById('noteCount');

        // メモ編集モーダル
        this.noteModal = document.getElementById('noteModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.noteForm = document.getElementById('noteForm');
        this.noteTitle = document.getElementById('noteTitle');
        this.noteCategory = document.getElementById('noteCategory');
        this.noteContent = document.getElementById('noteContent');
        this.charCount = document.getElementById('charCount');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.cancelBtn = document.getElementById('cancelBtn');

        // 削除確認モーダル
        this.deleteModal = document.getElementById('deleteModal');
        this.closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
        this.cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
        this.confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        // 要素チェック
        if (!this.notesList || !this.noteModal || !this.deleteModal) {
            console.error('必要な要素が見つかりません');
            throw new Error('必要なHTML要素が見つかりません');
        }
    }

    attachEventListeners() {
        // 検索
        this.searchInput.addEventListener('input', () => this.handleSearch());

        // メモ追加
        this.addNoteBtn.addEventListener('click', () => this.openAddModal());

        // フィルター
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });

        // メモ一覧のクリック
        this.notesList.addEventListener('click', (e) => this.handleNoteClick(e));

        // メモ一覧のスワイプ
        this.notesList.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.notesList.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });

        // メモ編集モーダル
        this.closeModalBtn.addEventListener('click', () => this.closeNoteModal());
        this.cancelBtn.addEventListener('click', () => this.closeNoteModal());
        this.noteForm.addEventListener('submit', (e) => this.handleNoteSubmit(e));
        this.noteContent.addEventListener('input', () => this.updateCharCount());

        // 削除確認モーダル
        this.closeDeleteModalBtn.addEventListener('click', () => this.closeDeleteModal());
        this.cancelDeleteBtn.addEventListener('click', () => this.closeDeleteModal());
        this.confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());

        // モーダル外クリックで閉じる
        this.noteModal.addEventListener('click', (e) => {
            if (e.target === this.noteModal) this.closeNoteModal();
        });
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) this.closeDeleteModal();
        });
    }

    // ===== データ管理 =====
    loadNotes() {
        this.notes = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('memo-note-')) {
                const note = JSON.parse(localStorage.getItem(key));
                this.notes.push(note);
            }
        }
        // 作成日順にソート（新しい順）
        this.notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log(`📝 ${this.notes.length}件のメモを読み込みました`);
    }

    saveNote(note) {
        const key = `memo-note-${note.id}`;
        localStorage.setItem(key, JSON.stringify(note));
        console.log(`✅ メモを保存: ${note.title}`);
    }

    deleteNoteFromStorage(noteId) {
        const key = `memo-note-${noteId}`;
        localStorage.removeItem(key);
        console.log(`🗑️ メモを削除: ${noteId}`);
    }

    // ===== レンダリング =====
    render() {
        const filteredNotes = this.getFilteredNotes();
        this.renderNotesList(filteredNotes);
        this.updateNoteCount(filteredNotes.length);
    }

    getFilteredNotes() {
        let filtered = [...this.notes];

        // カテゴリフィルター
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(note => note.category === this.currentFilter);
        }

        // 検索フィルター
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filtered = filtered.filter(note =>
                note.title.toLowerCase().includes(searchTerm) ||
                note.content.toLowerCase().includes(searchTerm)
            );
        }

        return filtered;
    }

    renderNotesList(notes) {
        if (notes.length === 0) {
            this.notesList.innerHTML = `
                <div class="empty-state">
                    <p>📝 メモがありません</p>
                    <p class="empty-hint">「新規メモ」ボタンで最初のメモを作成しましょう！</p>
                </div>
            `;
            return;
        }

        this.notesList.innerHTML = notes.map(note => `
            <div class="note-card" data-category="${note.category}" data-note-id="${note.id}">
                <div class="note-card-header">
                    <div class="note-title">${this.escapeHtml(note.title)}</div>
                    <div class="note-actions">
                        <button class="note-action-btn edit-btn" data-note-id="${note.id}">✏️</button>
                        <button class="note-action-btn delete-btn" data-note-id="${note.id}">🗑️</button>
                    </div>
                </div>
                <div class="note-meta">
                    <span class="note-category" data-category="${note.category}">${this.getCategoryLabel(note.category)}</span>
                    <span class="note-date">${this.formatDate(note.createdAt)}</span>
                </div>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
            </div>
        `).join('');
    }

    updateNoteCount(count) {
        this.noteCount.textContent = `${count}件`;
    }

    // ===== イベントハンドラー =====
    handleSearch() {
        this.render();
    }

    handleFilter(button) {
        // アクティブクラスの切り替え
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // フィルター適用
        this.currentFilter = button.dataset.category;
        this.render();
    }

    handleNoteClick(e) {
        const noteCard = e.target.closest('.note-card');
        if (!noteCard) return;

        const noteId = noteCard.dataset.noteId;

        // 編集ボタン
        if (e.target.classList.contains('edit-btn')) {
            e.stopPropagation();
            this.openEditModal(noteId);
            return;
        }

        // 削除ボタン
        if (e.target.classList.contains('delete-btn')) {
            e.stopPropagation();
            this.openDeleteModal(noteId);
            return;
        }

        // カードクリックで編集
        this.openEditModal(noteId);
    }

    handleNoteSubmit(e) {
        e.preventDefault();

        const title = this.noteTitle.value.trim();
        const category = this.noteCategory.value;
        const content = this.noteContent.value.trim();

        if (!title || !content) {
            alert('タイトルと本文を入力してください');
            return;
        }

        if (this.editingNoteId) {
            // 編集
            const note = this.notes.find(n => n.id === this.editingNoteId);
            if (note) {
                note.title = title;
                note.category = category;
                note.content = content;
                note.updatedAt = new Date().toISOString();
                this.saveNote(note);
                console.log('✅ メモを更新');
            }
        } else {
            // 新規作成
            const note = {
                id: Date.now().toString(),
                title,
                category,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.notes.push(note);
            this.saveNote(note);
            console.log('✅ 新規メモを作成');
        }

        this.loadNotes();
        this.render();
        this.closeNoteModal();
    }

    // ===== モーダル操作 =====
    openAddModal() {
        this.editingNoteId = null;
        this.modalTitle.textContent = '新規メモ';
        this.noteForm.reset();
        this.charCount.textContent = '0';
        this.noteModal.classList.add('active');
        this.noteTitle.focus();
    }

    openEditModal(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (!note) return;

        this.editingNoteId = noteId;
        this.modalTitle.textContent = 'メモを編集';
        this.noteTitle.value = note.title;
        this.noteCategory.value = note.category;
        this.noteContent.value = note.content;
        this.updateCharCount();
        this.noteModal.classList.add('active');
        this.noteTitle.focus();
    }

    closeNoteModal() {
        this.noteModal.classList.remove('active');
        this.noteForm.reset();
        this.editingNoteId = null;
    }

    openDeleteModal(noteId) {
        this.deletingNoteId = noteId;
        this.deleteModal.classList.add('active');
    }

    closeDeleteModal() {
        this.deleteModal.classList.remove('active');
        this.deletingNoteId = null;
    }

    confirmDelete() {
        if (!this.deletingNoteId) return;

        this.notes = this.notes.filter(n => n.id !== this.deletingNoteId);
        this.deleteNoteFromStorage(this.deletingNoteId);
        this.render();
        this.closeDeleteModal();
        console.log('✅ メモを削除しました');
    }

    updateCharCount() {
        const count = this.noteContent.value.length;
        this.charCount.textContent = count;
    }

    // ===== スワイプ操作 =====
    handleTouchStart(e) {
        const noteCard = e.target.closest('.note-card');
        if (!noteCard) return;

        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    handleTouchEnd(e) {
        const noteCard = e.target.closest('.note-card');
        if (!noteCard) return;

        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;

        this.handleSwipe(noteCard);
    }

    handleSwipe(noteCard) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;

        // 縦スワイプは無視
        if (Math.abs(deltaY) > Math.abs(deltaX)) return;

        const noteId = noteCard.dataset.noteId;

        // 右スワイプで編集
        if (deltaX > this.swipeThreshold) {
            noteCard.classList.add('swiping-right');
            setTimeout(() => {
                noteCard.classList.remove('swiping-right');
                this.openEditModal(noteId);
            }, 300);
        }

        // 左スワイプで削除
        if (deltaX < -this.swipeThreshold) {
            noteCard.classList.add('swiping-left');
            setTimeout(() => {
                noteCard.classList.remove('swiping-left');
                this.openDeleteModal(noteId);
            }, 300);
        }
    }

    // ===== ユーティリティ =====
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return '今日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return '昨日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return `${diffDays}日前`;
        } else {
            return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }

    getCategoryLabel(category) {
        const labels = {
            personal: '👤 個人',
            work: '💼 仕事',
            idea: '💡 アイデア',
            other: '📌 その他'
        };
        return labels[category] || category;
    }
}

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM読み込み完了、アプリ初期化開始 ===');
    try {
        window.noteApp = new NoteApp();
        console.log('🎉 アプリ起動成功');
    } catch (error) {
        console.error('❌ アプリ起動失敗:', error);
        alert('アプリの起動に失敗しました。ページを再読み込みしてください。');
    }
});
