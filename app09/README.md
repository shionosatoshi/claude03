# app09 - Octa Othello

四隅を削った八角形盤面で遊ぶオセロです。基本ルールは通常のオセロと同じで、盤面形状だけを変えています。

## URL

- Mobile URL: `https://shionosatoshi.github.io/claude03/app09/mobile/`
- Desktop URL: `https://shionosatoshi.github.io/claude03/app09/desktop/`
- Local mobile entry: `app09/mobile/index.html`
- Local desktop entry: `app09/desktop/index.html`

## Rules

- 灰色の欠けマスには石を置けません。
- 欠けマスや盤面外をまたいで石は反転しません。
- 勝敗は有効マス上の石数で判定します。
- 置ける場所がない場合は自動でパスします。

## Features

- CPU戦と2人対戦
- CPU難易度「中」「強」
- 合法手の表示ON/OFF
- 置いた時と反転時の効果音
- PC/スマホ両対応のレスポンシブUI
- Service WorkerとManifestによるPWA対応

## Design Notes

サブエージェントA/Bの検討では、どちらも「8x8ベースの四隅欠け盤面」が最もバランスを取りやすいという結論でした。従来の四隅が消え、端点が複数に分散するため、角を取るだけで勝負が決まりにくくなります。
