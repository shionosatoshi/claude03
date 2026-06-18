# からだ原因マップ MVP 実装計画

## 方針

- `app11/` に Next.js + TypeScript + Tailwind CSS のWeb MVPを独立作成する。
- 質問、結果タイプ、スコア計算、型定義はUIから分離し、将来のReact Native / Expo移植に備える。
- 医療診断・治療に見える断定表現を避け、セルフチェック、原因候補、見直し候補、改善のヒントとして表現する。

## タスク

1. Next.jsアプリの最小構成を作成する。
2. `src/types/check.ts`、`src/data/questions.ts`、`src/data/resultTypes.ts`、`src/lib/calculateResult.ts` を作成する。
3. `/`、`/check/body-parts`、`/check/questions`、`/result`、`/about` を実装する。
4. 選択状態と回答状態はMVPとしてブラウザの `localStorage` に保存する。
5. `npm run lint` と `npm run build`、ローカル表示確認を行う。

## レビュー

- `codex-review` スキルは現在の環境で利用可能なスキル一覧にないため、セルフレビューで確認する。
- 注意書きがトップページと結果画面に表示されることを確認する。
- 「診断」「治る」「原因を特定」などの不適切な断定表現がUIに混じっていないか確認する。
