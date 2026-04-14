# サブスク管理アプリ デザイン改善計画

## Context

ユーザーが「カラフル・ブランド」スタイルを希望。各サブスクリプションサービスのブランドカラーを活かしたデザインに改善する。

## デザイン方針

1. **ブランドカラー反映**: 各サービスの公式ブランドカラーを使用
2. **背景**: 現在のグラデーションを維持
3. **円グラフ**: 各サービスのブランドカラーで表示
4. **カード**: 各サービスカラーのインデント（弱い色）を使用

## 各サービスのブランドカラー

| サービス | ブランドカラー | カード用（薄い色） |
|---------|---------------|------------------|
| Netflix | #E50914 | rgba(229, 9, 20, 0.15) |
| YouTube Premium | #FF0000 | rgba(255, 0, 0, 0.15) |
| Amazon Prime | #00A8E1 | rgba(0, 168, 225, 0.15) |
| Disney+ | #113CCF | rgba(17, 60, 207, 0.15) |
| U-NEXT | #FF5733 | rgba(255, 87, 51, 0.15) |
| Hulu | #1CE783 | rgba(28, 231, 131, 0.15) |
| Apple Music | #FA233B | rgba(250, 35, 59, 0.15) |
| Spotify | #1DB954 | rgba(29, 185, 84, 0.15) |
| Adobe CC | #FF0000 | rgba(255, 0, 0, 0.15) |
| Microsoft 365 | #00A4EF | rgba(0, 164, 239, 0.15) |
| Figma | #F24E1E | rgba(242, 78, 30, 0.15) |
| ChatGPT Plus | #10A37F | rgba(16, 163, 127, 0.15) |
| Google One | #4285F4 | rgba(66, 133, 244, 0.15) |
| iCloud+ | #007AFF | rgba(0, 122, 255, 0.15) |
| Xbox Game Pass | #107C10 | rgba(16, 124, 16, 0.15) |
| PlayStation Plus | #003791 | rgba(0, 55, 145, 0.15) |
| Nintendo | #E60012 | rgba(230, 0, 18, 0.15) |
| LINE MUSIC | #06C755 | rgba(6, 199, 85, 0.15) |
| Dropbox | #0061FF | rgba(0, 97, 255, 0.15) |
| DAZN | #BA8B02 | rgba(186, 139, 2, 0.15) |
| Notion | #000000 | rgba(0, 0, 0, 0.08) |
| Canva | #00C4CC | rgba(0, 196, 204, 0.15) |
| 日経MJ | #E31837 | rgba(227, 24, 55, 0.15) |

## 実装変更

### 1. JavaScript (`app07/app.js`)

プリセットデータの色をブランドカラーに更新：

```javascript
this.presets = {
    'netflix-standard': { name: 'Netflix', amount: 1490, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#E50914' },
    'youtube-premium': { name: 'YouTube Premium', amount: 1500, currency: 'JPY', cycle: 'monthly', category: 'video', color: '#FF0000' },
    // ...
};
```

### 2. CSS (`app07/styles.css`)

デザイン改善：

```css
/* カードに各サービスカラーのボーダーを追加 */
.subscription-card {
    border-left: 4px solid var(--service-color, var(--app07-accent));
}

/* 合計カードをより華やかに */
.total-card {
    background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%);
}

/* 円グラフの中央に合計金額を表示 */
.chart-container::after {
    content: attr(data-total);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
```

### 3. HTML (`app07/index.html`)

サービスカラーを表示するための要素追加（必要に応じて）

## 実装手順

1. `app07/app.js`のプリセットデータの色をブランドカラーに更新
2. `app07/styles.css`でデザイン改善
3. 円グラフの色がブランドカラーで表示されるように調整
4. 動作確認

## 検証方法

1. 各プリセットサービスを選択し、ブランドカラーが反映されているか確認
2. 円グラフが各サービスのブランドカラーで表示されるか確認
3. 全体的なデザインが見やすいか確認
