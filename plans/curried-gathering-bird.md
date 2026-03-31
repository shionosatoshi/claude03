# app02 - RPG風ToDoリストアプリ実装計画

## Context

ユーザーはゲーム要素を取り入れたToDoリストアプリを作成したい。ToDoを完了するごとにボスキャラにダメージを与え、1日4つのToDoを完了するとボスを撃破できる。これにより、日々のタスク達成をゲーム的に楽しみながら継続できるようにする。

## 要件まとめ

- **基本機能**: ToDo追加・編集・削除・完了
- **ゲーム要素**: 1Todo完了=25ダメージ、4Todo完了=ボス撃破（100HP）
- **ボス表現**: 絵文字（👹、🐉など）
- **リセット**: 毎日0時自動 + 手動ボタン
- **完了Todo**: 完了済みとして残す（取り消し線表示）
- **データ保存**: LocalStorage（app01パターン継承）

## ファイル構成

```
app02/
├── index.html          # メインHTML（ボスセクション・入力・リスト）
├── styles.css          # RPG風UIデザイン
└── app.js             # RpgTodoAppクラス
```

## データ構造設計

### LocalStorageキー

- **ToDoデータ**: `rpg-todo-{ID}` (例: `rpg-todo-1714567890123`)
- **ボス状態**: `rpg-boss-state`
- **設定**: `rpg-settings`

### ボス状態データ構造
```javascript
{
  currentBoss: "👹",        // 現在のボス絵文字
  currentHP: 100,           // 現在のHP
  maxHP: 100,               // 最大HP
  totalDamage: 0,           // 今日の与ダメージ合計
  defeatedCount: 0,         // 撃破数
  lastResetDate: "2026-03-31"  // 最終リセット日
}
```

### ToDoデータ構造
```javascript
{
  id: 1714567890123,        // タイムスタンプベースID
  text: "タスク内容",
  completed: false,
  completedAt: null         // 完了日時（YYYY-MM-DD）
}
```

## 主要メソッドと実装内容

### コアロジック（ダメージ計算・HP管理）

**toggleTodo(id)**
- ToDo完了時：applyDamage()を呼び出して25ダメージを適用
- ToDo未完了時：removeDamage()を呼び出してダメージを取り消し
- HPが0以下になったらdefeatBoss()を実行

**applyDamage(todo)**
- completedAtに今日の日付をセット
- totalDamageに25を加算
- currentHPから25を減算
- HPが0ならisBossDefeated()で判定後defeatBoss()実行

**removeDamage(todo)**
- completedAtが今日の日付の場合のみダメージを取り消し
- totalDamageから25を減算（最小0）
- currentHPに25を加算（最大maxHP）

**defeatBoss()**
- defeatedCountをインクリメント
- 撃破エフェクト（🎉 ボスを撃破！🎉）を3秒間表示
- spawnNewBoss()で新しいボスを出現

**spawnNewBoss()**
- ボス絵文字リストからランダムで選択
- currentHPを100にリセット
- totalDamageを0にリセット

### 日次リセット

**checkDailyReset()**
- アプリ起動時に実行
- lastResetDateと今日の日付を比較
- 異なる場合はperformDailyReset()を実行

**performDailyReset()**
- spawnNewBoss()でボスをリセット
- lastResetDateを今日の日付に更新
- 「新しい日が始まりました！」メッセージを表示

**manualReset()**
- 確認ダイアログ表示
- performDailyReset()を実行

### 描画メソッド

**renderBoss()**
- ボス絵文字を更新
- HPバーの幅を計算：(currentHP / maxHP) * 100%
- HPバーの色分け：
  - 50%以上：緑（#10b981）
  - 20-50%：黄（#fbbf24）
  - 20%以下：赤（#ef4444）
- HPテキスト：「100/100」形式で表示

**renderTodoList()**
- ToDo配列をループして描画
- 完了済み：取り消し線 + グレーアウト
- 各Todoにチェックボックス、テキスト、編集ボタン、削除ボタン

**renderStats()**
- 今日の進捗：「0/4」形式
- 撃破数：「撃破数: 5」

## HTML構造

```html
<div class="container">
  <header>
    <h1>⚔️ RPG ToDo ⚔️</h1>
  </header>

  <section class="boss-section">
    <div class="boss-emoji" id="bossEmoji">👹</div>
    <div class="hp-bar-container">
      <div class="hp-fill" id="hpFill"></div>
    </div>
    <div class="hp-text" id="hpText">100/100</div>
    <div class="defeat-message" id="defeatMessage">🎉 ボスを撃破！🎉</div>
    <div class="stats">
      <span id="todayProgress">0/4</span>
      <span id="defeatedCount">撃破数: 0</span>
    </div>
  </section>

  <section class="input-section">
    <input type="text" id="todoInput" placeholder="新しいToDoを入力...">
    <button id="addBtn">追加</button>
  </section>

  <section class="todo-section">
    <button id="resetBtn">🔄 リセット</button>
    <div id="todoList"></div>
  </section>
</div>
```

## CSSデザイン

### カラーパレット
```css
:root {
  --primary-color: #8b5cf6;      /* 紫（RPG風） */
  --secondary-color: #f59e0b;    /* オレンジ（ダメージ） */
  --success-color: #10b981;      /* 緑（完了・高HP） */
  --danger-color: #ef4444;       /* 赤（削除・低HP） */
  --warning-color: #fbbf24;      /* 黄（中HP） */
  --bg-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### 主要スタイル
- **ボスセクション**: 大きな絵文字（5rem）、バウンスアニメーション
- **HPバー**: スムーズな遷移（transition: width 0.3s ease）
- **撃破メッセージ**: pulseアニメーション
- **ToDoリスト**: カードレイアウト、ホバー効果
- **完了済み**: opacity: 0.6 + line-through

## app01から再利用するパターン

以下のメソッド・パターンをapp01から再利用：

1. **formatDate(year, month, day)** - 日付フォーマット（app01:75-77行目）
2. **loadStorageData(prefix)** - LocalStorage読み込みパターン（app01:47-54行目）
3. **showStatus(element, message, type)** - ステータス表示パターン（app01:160-165行目）
4. **attachEventListeners()** - イベントハンドリングパターン（app01:67-72行目）
5. **クラスベース設計** - CalendarApp構造を継承

## 実装手順

### フェーズ1：ファイル作成
1. app02ディレクトリ作成
2. index.html作成（基本構造）
3. styles.css作成（基本設定）
4. app.js作成（クラス構造）

### フェーズ2：基本機能
5. RpgTodoAppクラスの基本構造
6. loadData(), saveTodo(), saveBossState()
7. addTodo(), renderTodoList()

### フェーズ3：ボス戦システム
8. toggleTodo(), applyDamage(), removeDamage()
9. renderBoss(), renderStats()
10. isBossDefeated(), defeatBoss(), spawnNewBoss()

### フェーズ4：リセット機能
11. checkDailyReset(), performDailyReset()
12. manualReset()

### フェーズ5：UI/UX
13. アニメーション追加
14. メッセージ表示機能
15. レスポンシブ対応

## 検証方法

### 機能テスト

1. **ToDo追加**
   - 入力フィールドにテキストを入力
   - 追加ボタンクリック
   - ✓ ToDoがリストに表示される

2. **完了とダメージ**
   - ToDoのチェックボックスをクリック
   - ✓ HPが25減少する（100→75）
   - ✓ ToDoに取り消し線が表示される
   - ✓ 進捗が「1/4」に更新される

3. **ボス撃破**
   - 4つのToDoを完了にする
   - ✓ HPが0になる
   - ✓ 「🎉 ボスを撃破！🎉」が表示される
   - ✓ 新しいボス絵文字が表示される
   - ✓ HPが100にリセットされる
   - ✓ 撃破数が増加する

4. **未完了取り消し**
   - 完了済みToDoのチェックボックスを再度クリック
   - ✓ HPが25回復する
   - ✓ 取り消し線が消える

5. **手動リセット**
   - リセットボタンクリック
   - ✓ 確認ダイアログ表示
   - ✓ OKでボスがリセットされる

6. **自動リセット**
   - lastResetDateを昨日の日付に変更
   - ページをリロード
   - ✓ ボスがリセットされる
   - ✓ 「新しい日が始まりました！」メッセージ表示

7. **データ永続化**
   - ToDoを追加・完了
   - ページをリロード
   - ✓ 全データが保持される

8. **削除・編集**
   - 編集ボタンでテキスト変更可能
   - 削除ボタンで確認ダイアログ後削除

### データ検証

- LocalStorageに `rpg-todo-{ID}` キーが存在すること
- LocalStorageに `rpg-boss-state` キーが存在すること
- ボスHPが0-100の範囲内であること
- 今日の完了数のみダメージにカウントされること

## 参考ファイル

- [app01/app.js](../app01/app.js) - formatDate()、showStatus()等を再利用
- [app01/index.html](../app01/index.html) - HTML構造パターン参考
- [app01/styles.css](../app01/styles.css) - CSS設計パターン参考
