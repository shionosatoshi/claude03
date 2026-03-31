// RPG風ToDoリストアプリのメインロジック

class RpgTodoApp {
    constructor() {
        this.todos = [];
        this.bossState = {
            currentBoss: "👹",
            currentHP: 100,
            maxHP: 100,
            totalDamage: 0,
            defeatedCount: 0,
            lastResetDate: null
        };
        this.settings = {
            damagePerTodo: 25,
            todosToDefeat: 4,
            bossEmojis: ["👹", "🐉", "👾", "👻", "🤖", "💀", "🦕", "🦁"]
        };

        this.loadData();
        this.checkDailyReset();
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    // ===== 初期化 =====
    initializeElements() {
        this.bossEmoji = document.getElementById('bossEmoji');
        this.hpFill = document.getElementById('hpFill');
        this.hpText = document.getElementById('hpText');
        this.defeatMessage = document.getElementById('defeatMessage');
        this.todayProgress = document.getElementById('todayProgress');
        this.defeatedCount = document.getElementById('defeatedCount');
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.inputStatus = document.getElementById('inputStatus');
    }

    attachEventListeners() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.resetBtn.addEventListener('click', () => this.manualReset());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.todoList.addEventListener('click', (e) => this.handleTodoClick(e));
    }

    // ===== データ管理 =====
    loadData() {
        this.loadTodos();
        this.loadBossState();
    }

    loadTodos() {
        this.todos = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('rpg-todo-')) {
                const todo = JSON.parse(localStorage.getItem(key));
                this.todos.push(todo);
            }
        }
        this.todos.sort((a, b) => a.id - b.id);
    }

    loadBossState() {
        const saved = localStorage.getItem('rpg-boss-state');
        if (saved) {
            this.bossState = JSON.parse(saved);
        }
    }

    saveTodo(todo) {
        localStorage.setItem(`rpg-todo-${todo.id}`, JSON.stringify(todo));
    }

    deleteTodoFromStorage(id) {
        localStorage.removeItem(`rpg-todo-${id}`);
    }

    saveBossState() {
        localStorage.setItem('rpg-boss-state', JSON.stringify(this.bossState));
    }

    // ===== ToDo操作 =====
    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) {
            this.showInputStatus('ToDoを入力してください', 'error');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            completedAt: null
        };

        this.todos.push(todo);
        this.saveTodo(todo);
        this.todoInput.value = '';
        this.showInputStatus('ToDoを追加しました', 'success');
        this.renderTodoList();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        if (!todo.completed) {
            this.applyDamage(todo);
        } else {
            this.removeDamage(todo);
        }

        this.saveTodo(todo);
        this.saveBossState();
        this.render();
    }

    deleteTodo(id) {
        if (!confirm('このToDoを削除しますか？')) return;

        const todo = this.todos.find(t => t.id === id);
        if (todo && todo.completed && todo.completedAt === this.getTodayDateString()) {
            this.removeDamage(todo);
        }

        this.todos = this.todos.filter(t => t.id !== id);
        this.deleteTodoFromStorage(id);
        this.saveBossState();
        this.render();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return;

        const newText = prompt('ToDoを編集:', todo.text);
        if (newText === null) return;
        if (!newText.trim()) {
            this.showInputStatus('ToDoを空にすることはできません', 'error');
            return;
        }

        todo.text = newText.trim();
        this.saveTodo(todo);
        this.showInputStatus('ToDoを更新しました', 'success');
        this.renderTodoList();
    }

    handleTodoClick(e) {
        const id = parseInt(e.target.closest('[data-id]')?.dataset.id);
        if (!id) return;

        if (e.target.classList.contains('todo-checkbox')) {
            this.toggleTodo(id);
        } else if (e.target.classList.contains('delete-btn')) {
            this.deleteTodo(id);
        } else if (e.target.classList.contains('edit-btn')) {
            this.editTodo(id);
        }
    }

    // ===== ボス戦システム =====
    calculateDamage() {
        return this.settings.damagePerTodo;
    }

    applyDamage(todo) {
        todo.completedAt = this.getTodayDateString();
        todo.completed = true;

        const damage = this.calculateDamage();
        this.bossState.totalDamage += damage;
        this.bossState.currentHP = Math.max(0, this.bossState.currentHP - damage);

        if (this.isBossDefeated()) {
            this.defeatBoss();
        }
    }

    removeDamage(todo) {
        if (todo.completedAt === this.getTodayDateString()) {
            const damage = this.calculateDamage();
            this.bossState.totalDamage = Math.max(0, this.bossState.totalDamage - damage);
            this.bossState.currentHP = Math.min(
                this.bossState.maxHP,
                this.bossState.currentHP + damage
            );
        }

        todo.completed = false;
        todo.completedAt = null;
    }

    isBossDefeated() {
        return this.bossState.currentHP <= 0;
    }

    defeatBoss() {
        this.bossState.defeatedCount++;
        this.showDefeatMessage();
        setTimeout(() => {
            this.spawnNewBoss();
        }, 3000);
    }

    spawnNewBoss() {
        const randomIndex = Math.floor(Math.random() * this.settings.bossEmojis.length);
        this.bossState.currentBoss = this.settings.bossEmojis[randomIndex];
        this.bossState.currentHP = this.bossState.maxHP;
        this.bossState.totalDamage = 0;
        this.saveBossState();
        this.render();
    }

    showDefeatMessage() {
        this.defeatMessage.style.display = 'block';
        setTimeout(() => {
            this.defeatMessage.style.display = 'none';
        }, 3000);
    }

    // ===== リセット機能 =====
    checkDailyReset() {
        const today = this.getTodayDateString();
        if (this.bossState.lastResetDate !== today) {
            this.performDailyReset();
        }
    }

    performDailyReset() {
        this.spawnNewBoss();
        this.bossState.lastResetDate = this.getTodayDateString();
        this.saveBossState();
        this.showInputStatus('新しい日が始まりました！新しいボスが現れました！', 'info');
    }

    manualReset() {
        if (!confirm('ボスをリセットしますか？')) return;
        this.performDailyReset();
    }

    // ===== 描画メソッド =====
    render() {
        this.renderBoss();
        this.renderStats();
        this.renderTodoList();
    }

    renderBoss() {
        this.bossEmoji.textContent = this.bossState.currentBoss;

        const hpPercentage = (this.bossState.currentHP / this.bossState.maxHP) * 100;
        this.hpFill.style.width = `${hpPercentage}%`;

        // HPバーの色分け
        if (hpPercentage > 50) {
            this.hpFill.style.backgroundColor = 'var(--success-color)';
        } else if (hpPercentage > 20) {
            this.hpFill.style.backgroundColor = 'var(--warning-color)';
        } else {
            this.hpFill.style.backgroundColor = 'var(--danger-color)';
        }

        this.hpText.textContent = `${this.bossState.currentHP}/${this.bossState.maxHP}`;
    }

    renderStats() {
        const todayCompleted = this.getTodayCompletedCount();
        this.todayProgress.textContent = `${todayCompleted}/${this.settings.todosToDefeat}`;
        this.defeatedCount.textContent = this.bossState.defeatedCount;
    }

    renderTodoList() {
        if (this.todos.length === 0) {
            this.todoList.innerHTML = '';
            this.todoList.appendChild(this.emptyState);
            this.emptyState.style.display = 'block';
            return;
        }

        this.emptyState.style.display = 'none';
        this.todoList.innerHTML = '';

        this.todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            this.todoList.appendChild(todoItem);
        });
    }

    createTodoElement(todo) {
        const div = document.createElement('div');
        div.className = `todo-item${todo.completed ? ' completed' : ''}`;
        div.dataset.id = todo.id;

        div.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="todo-btn edit-btn">編集</button>
                <button class="todo-btn delete-btn">削除</button>
            </div>
        `;

        return div;
    }

    // ===== ユーティリティ =====
    getTodayDateString() {
        const today = new Date();
        return this.formatDate(today.getFullYear(), today.getMonth(), today.getDate());
    }

    formatDate(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    getTodayCompletedCount() {
        return this.todos.filter(t =>
            t.completed && t.completedAt === this.getTodayDateString()
        ).length;
    }

    showInputStatus(message, type) {
        this.inputStatus.textContent = message;
        this.inputStatus.className = `input-status ${type}`;
        setTimeout(() => {
            this.inputStatus.textContent = '';
            this.inputStatus.className = 'input-status';
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// アプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
    new RpgTodoApp();
});
