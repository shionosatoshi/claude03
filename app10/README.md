# 歩いて咲く花 MVP

Expo + React Native + TypeScriptで作った、植物育成Webデモです。

現時点では歩数API連携は行わず、デモ用の「お世話アクション」で成長ポイントを加算します。将来は、この成長ポイントの入力元を歩数APIに差し替える想定です。

## 実装済み

- 4画面構成
  - `HomeScreen`
  - `PlantDetailScreen`
  - `CollectionScreen`
  - `SettingsScreen`
- 0〜50,000成長ポイントで6段階に成長
- お世話アクション
  - 水をあげる: +500
  - 日光をあてる: +800
  - 肥料をあげる: +2,000
- 開花するまで花の名前を非表示
- 開花時に達成演出を表示
- 開花した花を図鑑に保存
- 花の種類
  - ひまわり
  - チューリップ
  - バラ
  - ラベンダー
  - さくら
- 成長段階ごとの画像
- 現在ポイント、開花までの残りポイント、次段階までの残りポイント表示
- 進捗バー表示
- AsyncStorageによる進捗と図鑑保存
- 入力元に依存しない `growthPointService`

## セットアップ

```bash
cd app10
npm install
npm run web
```

## Webで確認する

```bash
npm run web
```

公開用の静的ファイルを書き出す場合:

```bash
npm run export:web
```

出力先は `dist/` です。

## 将来の歩数API連携

ポイント加算処理は `src/services/growthPointService.ts` に分離しています。

今は `inputSource: 'care-action'` で加算しています。将来歩数APIに差し替える場合は、歩数から成長ポイントを計算し、同じサービスに `inputSource: 'steps-api'` として渡す想定です。

## データ保存

現在は `src/services/plantStorage.ts` の `asyncStoragePlantService` が保存処理を担当しています。

将来Supabaseへ移行する場合は、`PlantStorageService` と同じインターフェースで `supabasePlantService` を実装し、`App.tsx` の `plantService` を差し替える想定です。
