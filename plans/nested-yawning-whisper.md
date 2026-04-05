# app05: 金額割り勘アプリ - 実装計画

## コンテキスト

ユーザーが飲み会などの費用分担を簡易的に計算できる「割り勘アプリ」を作成する必要があります。

**ユースケース**: 飲み会の会費（例：10,000円）を5人で分担する際、均等割り（各2,000円）またはランダム割り（合計10,000円になるようにランダムに割り当て）を選択できる。

## 要件

1. **金額設定**: ユーザーが合計金額を入力可能（例：1円〜1,000,000円）
2. **人数設定**: ユーザーが人数を入力可能（例：2〜100人）
3. **割り方の選択**:
   - 均等割り: 合計金額 ÷ 人数で均等に割る（端数は最初の人に加算）
   - ランダム割り: 合計金額が同じになるように、各人にランダムに割り当て（最小1円以上）
4. **スマホ対応**: レスポンシブデザイン、PWA対応

## 実装計画

### 1. ディレクトリ構造の作成

```
app05/
├── index.html      # メインHTML
├── styles.css      # スタイルシート
├── app.js          # メインJavaScript
├── manifest.json   # PWAマニフェスト
├── sw.js          # Service Worker
└── README.md      # アプリ説明
```

### 2. HTML構造（index.html）

**セクション構成**:
- ヘッダー: アプリタイトル「💰 割り勘計算機」
- 入力セクション:
  - 合計金額入力（数値入力、デフォルト：10000）
  - 人数入力（数値入力、デフォルト：5）
  - 割り方選択（ラジオボタン：均等割り/ランダム割り）
  - 計算ボタン
- 結果セクション:
  - 各人の金額をカード形式で表示
  - 合計金額の確認
  - 最大/最小/平均の表示
- 履歴セクション:
  - 過去5回分の計算履歴
  - 履歴をクリックで再計算

### 3. CSSスタイル（styles.css）

**デザイン原則**:
- app04をベースにしたモダンなUI
- カラーテーマ: 緑系（#10b981）をプライマリーカラーに
- レスポンシブデザイン: 480px以下でも快適に操作
- カードデザイン: 結果を視覚的に分かりやすく表示

**主なスタイル**:
- `.result-card`: 各人の金額を表示するカード
- `.summary-stats`: 統計情報（最大/最小/平均）
- `.history-item`: 履歴アイテム

### 4. JavaScript機能（app.js）

**クラス構成**:
```javascript
class SplitBillApp {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('split-history')) || [];
        // DOM要素の初期化
        // イベントリスナーの設定
        // 履歴の表示
    }

    // 均等割り計算
    calculateEvenSplit(totalAmount, people) {
        const baseAmount = Math.floor(totalAmount / people);
        const remainder = totalAmount % people;
        const results = Array(people).fill(baseAmount);
        // 端数を最初の人に加算
        for (let i = 0; i < remainder; i++) {
            results[i]++;
        }
        return results;
    }

    // ランダム割り計算
    calculateRandomSplit(totalAmount, people) {
        // 最小1円を全員に割り当て
        const results = Array(people).fill(1);
        let remaining = totalAmount - people;

        // 残りをランダムに分配
        for (let i = 0; i < people - 1; i++) {
            const maxAdd = remaining - (people - i - 1); // 残りの人は最低1円必要
            const randomAdd = Math.floor(Math.random() * (maxAdd + 1));
            results[i] += randomAdd;
            remaining -= randomAdd;
        }
        results[people - 1] += remaining;

        // シャッフル
        return this.shuffleArray(results);
    }

    // 配列のシャッフル（Fisher-Yates）
    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // 結果表示
    displayResults(amounts) {
        // 統計計算（最大/最小/平均）
        // 結果をカードで表示
        // 履歴に保存
    }
}
```

### 5. PWA対応（manifest.json, sw.js）

**manifest.json**:
- name: "割り勘計算機"
- short_name: "割り勘"
- theme_color: #10b981（緑）
- icons: 💰絵文字を使用

**sw.js**:
- app04の構造をベースにキャッシングを実装
- キャッシュ名: `split-bill-v1`

### 6. ランダム割りのアルゴリズム詳細

**問題**: 合計金額が必ず一致するようにランダムに割り当てる

**解決策**:
1. 全員に最低1円を割り当てる
2. 残りの金額をランダムに分配
3. 最後の人に残りを全て割り当てる（合計が必ず一致）
4. 配列をシャッフルしてランダム性を保証

**例**: 1000円を5人でランダム割り
- 初期状態: [1, 1, 1, 1, 1]（残り: 995円）
- 1人目: +200 → [201, 1, 1, 1, 1]（残り: 795円）
- 2人目: +150 → [201, 151, 1, 1, 1]（残り: 645円）
- 3人目: +300 → [201, 151, 301, 1, 1]（残り: 345円）
- 4人目: +100 → [201, 151, 301, 101, 1]（残り: 245円）
- 5人目: +245 → [201, 151, 301, 101, 246]（残り: 0円）
- シャッフル: [301, 101, 246, 151, 201]（合計: 1000円）

### 7. バリデーション

- 金額: 1〜1,000,000円
- 人数: 2〜100人
- エラー表示: 入力値が不正な場合はメッセージ表示

### 8. 履歴機能

- 最大5件まで履歴を保存（localStorage）
- 各履歴: { timestamp, totalAmount, people, method, results }
- 履歴をクリックで再計算

## 検証

1. **均等割りのテスト**:
   - 1000円 ÷ 5人 = [200, 200, 200, 200, 200]
   - 1000円 ÷ 3人 = [334, 333, 333]（端数処理の確認）

2. **ランダム割りのテスト**:
   - 合計が必ず一致すること
   - 全員が1円以上であること
   - 実行ごとに結果が異なること

3. **UI/UXのテスト**:
   - スマホ（480px以下）で快適に操作できること
   - レスポンシブデザインが正しく動作すること

4. **PWA機能のテスト**:
   - オフラインで動作すること
   - ホーム画面に追加できること

## ファイルパス

- 新規作成: [app05/index.html](app05/index.html)
- 新規作成: [app05/styles.css](app05/styles.css)
- 新規作成: [app05/app.js](app05/app.js)
- 新規作成: [app05/manifest.json](app05/manifest.json)
- 新規作成: [app05/sw.js](app05/sw.js)
- 新規作成: [app05/README.md](app05/README.md)

## 参考ファイル

- 既存の構造パターン: [app04/index.html](app04/index.html)、[app04/styles.css](app04/styles.css)、[app04/app.js](app04/app.js)
- PWA実装: [app04/manifest.json](app04/manifest.json)、[app04/sw.js](app04/sw.js)
