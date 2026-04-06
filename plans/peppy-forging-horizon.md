# Vercelデザインシステム導入計画

## Context

claudeappプロジェクトは6つのWebアプリ（カレンダー日記、RPG ToDo、メモ、天気予報、割り勘計算機、チャットボット）を含んでいます。現在、各アプリは独自のカラーテーマとデザインパターンを持っていますが、統一されたデザインシステムがありません。

この変更により、Vercelデザインシステムを導入して以下を実現します：
- **一貫性のあるUI**: すべてのアプリで統一されたデザイン言語
- **モダンな見た目**: クリーンでミニマルなVercelスタイル
- **改善されたアクセシビリティ**: 高コントラスト、明確なヒエラルキー
- **保守性の向上**: 共通のデザイントークンとCSS変数

## 実装アプローチ

### フェーズ1: 基盤整備

#### 1.1 DESIGN.mdの作成
**ファイル**: `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\DESIGN.md`

Vercelデザインシステムのドキュメントを作成：
- カラーパレット（ブラック#000、ホワイト#fff、ブルー#0070f3）
- タイポグラフィ（Geistフォント、4pxベーススケール）
- コンポーネントガイドライン（ボタン、カード、フォーム）
- アクセシビリティ要件

#### 1.2 共通CSS変数ファイルの作成
**ファイル**: `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\common\vercel-vars.css`

```css
:root {
  /* Colors */
  --vercel-black: #000000;
  --vercel-white: #ffffff;
  --vercel-blue: #0070f3;
  --vercel-blue-hover: #0060df;
  --vercel-gray: #797979;
  --vercel-gray-light: #eaeaea;
  --vercel-gray-lighter: #fafafa;

  /* Typography */
  --vercel-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --vercel-text-xs: 11px;
  --vercel-text-sm: 12px;
  --vercel-text-base: 14px;
  --vercel-text-md: 16px;
  --vercel-text-lg: 18px;

  /* Spacing */
  --vercel-space-1: 4px;
  --vercel-space-2: 8px;
  --vercel-space-4: 16px;
  --vercel-space-6: 24px;

  /* Borders */
  --vercel-border-width: 1px;
  --vercel-border-color: #eaeaea;
  --vercel-border-radius: 4px;
  --vercel-border-radius-lg: 8px;

  /* Shadows */
  --vercel-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --vercel-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);
}
```

### フェーズ2: 基本要素の移行（app01から開始）

#### 2.1 HTMLファイルの更新
**対象**: `app01/index.html`

共通CSS変数ファイルを読み込み：
```html
<link rel="stylesheet" href="../common/vercel-vars.css">
```

#### 2.2 タイポグラフィの更新
**現在**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`
**Vercel**: `var(--vercel-font-family)`

#### 2.3 カラーシステムの更新
**アプローチ**: ハイブリッド方式
- 背景: 白/グレーベース（`var(--vercel-gray-lighter)`）
- テキスト: 高コントラストな黒/グレー（`var(--vercel-black)`）
- アクセント: Vercelブルー（`var(--vercel-blue)`）+ 既存の紫を保持

**現在のapp01のカラーテーマ**:
- 背景: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- テキスト: `#1f2937`
- ボタン: `#2563eb`

**Vercelスタイルに変更**:
- 背景: `var(--vercel-gray-lighter)`
- テキスト: `var(--vercel-black)`
- ボタン: `var(--vercel-blue)`

#### 2.4 ボーダーとシャドウの更新
**現在**: `border: 2px solid`, `box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3)`
**Vercel**: `border: var(--vercel-border-width) solid var(--vercel-border-color)`, `box-shadow: var(--vercel-shadow-md)`

### フェーズ3: コンポーネントの移行

#### 3.1 ボタンコンポーネント
**変更内容**:
```css
/* 現在 */
.btn {
    padding: 12px 32px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
}

/* Vercel */
.btn {
    padding: var(--vercel-space-2) var(--vercel-space-6);
    border: var(--vercel-border-width) solid var(--vercel-border-color);
    border-radius: var(--vercel-border-radius);
    font-weight: 500;
}
```

#### 3.2 カードコンポーネント
**変更内容**:
```css
/* 現在 */
.container {
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Vercel */
.container {
    border-radius: var(--vercel-border-radius-lg);
    box-shadow: var(--vercel-shadow-md);
}
```

#### 3.3 フォームコンポーネント
**変更内容**:
```css
/* 現在 */
#diaryText {
    border: 2px solid #e5e7eb;
    border-radius: 12px;
}

/* Vercel */
#diaryText {
    border: var(--vercel-border-width) solid var(--vercel-border-color);
    border-radius: var(--vercel-border-radius);
}
```

### フェーズ4: 段階的な他アプリへの展開

#### 展開順序
1. **app01** (カレンダー日記) - 最もシンプル、最初の移行対象
2. **app05** (割り勘計算機) - シンプルなカードUI
3. **app03** (メモ) - カテゴリ別色分けを保持
4. **app04** (天気予報) - 天気アイコンのアニメーションを保持
5. **app06** (チャットボット) - チャットUIのレイアウトを保持
6. **app02** (RPG ToDo) - ゲーム風UIを最後に調整

#### 各アプリでの保持要素
- **app02**: ボスキャラクターのアニメーション、HPバーのゲーム風UI
- **app03**: カテゴリ別の色分けシステム
- **app04**: 天気アイコンのアニメーション、天気別の色分け
- **app06**: チャットメッセージバブルのスタイル

## 主要なファイルパス

### 新規作成ファイル
- `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\DESIGN.md` - デザインシステムドキュメント
- `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\common\vercel-vars.css` - 共通CSS変数

### 変更対象ファイル（優先順位順）
1. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app01\index.html` - 共通CSS読み込み追加
2. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app01\styles.css` - CSS変数使用に更新
3. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app02\index.html` - 共通CSS読み込み追加
4. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app02\styles.css` - ゲームUI保持
5. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app03\index.html` - 共通CSS読み込み追加
6. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app03\styles.css` - カテゴリ色保持
7. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app04\index.html` - 共通CSS読み込み追加
8. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app04\styles.css` - 天気UI保持
9. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app05\index.html` - 共通CSS読み込み追加
10. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app05\styles.css` - 計算UI更新
11. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app06\index.html` - 共通CSS読み込み追加
12. `c:\Users\sunfi\OneDrive\デスクトップ\claudeapp\app06\styles.css` - チャットUI更新

## 検証方法

### 1. 視覚的検証
- 各アプリをブラウザで開き、Vercelデザインシステムが適用されているか確認
- 色、フォント、ボーダー、シャドウがVercelスタイルになっているか確認
- アプリ固有の特徴（ゲームUI、天気アイコンなど）が保持されているか確認

### 2. 機能的検証
- 既存の機能が正常に動作しているか確認
  - app01: 日記の保存・削除
  - app02: ToDoの追加・完了・リセット
  - app03: メモの作成・編集・削除
  - app04: 天気表示・服装アドバイス
  - app05: 割り勘計算
  - app06: チャット送信
- PWA機能が維持されているか確認（app02, app03, app04）
- LocalStorageが正常に動作しているか確認

### 3. レスポンシブデザインの確認
- モバイル（375px）で正常に表示されるか確認
- タブレット（768px）で正常に表示されるか確認
- デスクトップ（1024px以上）で正常に表示されるか確認
- タッチ操作が最適化されているか確認

### 4. アクセシビリティの確認
- コントラスト比がWCAG AA以上であることを確認
- キーボードナビゲーションが可能であることを確認
- フォーカス状態が視覚的に認識できることを確認

### 5. クロスブラウザテスト
- Chrome, Firefox, Safari, Edgeで正常に動作するか確認
- モバイルブラウザ（iOS Safari, Chrome Mobile）で正常に動作するか確認

## 実装の進め方

1. **app01から開始**: 最もシンプルなアプリから始めて、アプローチを検証
2. **1アプリずつ移行**: 各アプリの移行後に検証を実施
3. **フィードバックループ**: 各フェーズ後に確認と調整
4. **既存機能の維持**: すべての機能が動作し続けることを確認

この計画により、claudeappプロジェクトにVercelデザインシステムを段階的に導入し、一貫性のあるモダンなデザインを実現しながら、各アプリの固有の特徴と機能を維持できます。
