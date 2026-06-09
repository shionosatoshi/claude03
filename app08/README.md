# app08 - Brick Sprint

スマホとPCで遊べるブロック崩しゲームです。ゲーム本体は `shared/` に置き、スマホ用とPC用で別々の入口URLを用意しています。

## URL

GitHub Pages でこのリポジトリを root から公開する場合のURL例です。

- スマホ用: `https://shionosatoshi.github.io/claude03/app08/mobile/`
- PC用: `https://shionosatoshi.github.io/claude03/app08/desktop/`

ローカルで確認する場合:

- スマホ用: `app08/mobile/index.html`
- PC用: `app08/desktop/index.html`

## 操作

- スマホ: 画面上で指を左右に動かしてパドル操作、`Launch` でボール発射
- PC: 矢印キーまたは A/D で移動、Space で発射/一時停止、R でリスタート
- マウス/トラックパッド: プレイ画面上で左右に動かすとパドル操作

## 機能

- レベル進行つきブロック崩し
- ブロックを崩したときの軽いSE
- 各ステージのブロック数は42個で固定
- ステージクリアごとにブロック配置をランダム再生成
- ボール数はステージ1で1個、ステージ2で2個、ステージ3以降で3個
- スコア、ライフ、ベストスコア表示
- ベストスコアを端末の LocalStorage に保存
- Service Worker と Manifest によるPWA対応
- `mobile/` と `desktop/` の別URLデプロイに対応

## 実装メモ

ランダム生成は固定スロットをシャッフルして42個だけ選ぶ方式です。ステージごとの見た目は変わりますが、生成処理は軽く、スマホでも重くなりにくい構成です。
