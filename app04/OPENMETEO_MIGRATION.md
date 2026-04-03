# OpenMeteo版への移行ガイド

このドキュメントは、WeatherAPI.com版からOpenMeteo版への移行を検討するための参考情報です。

## 📊 比較表

| 項目 | WeatherAPI.com（現在） | OpenMeteo（移行後） |
|------|----------------------|-------------------|
| APIキー | 必要 | **不要** |
| 無料枠 | 月1,000,000回 | **無制限** |
| 天気予報日数 | 3日間 | **7日間** |
| 日本語対応 | ✅ | コード変換が必要 |
| 天気アイコン | ✅ | 自前で用意 |
| 商用利用 | 有料プランのみ | **無料で可能** |
| 都市名検索 | 直接検索可能 | ジオコーディングAPI使用 |

---

## ✅ OpenMeteo版のメリット

### 1. APIキー不要（最大のメリット）
- ユーザーはURLを開くだけですぐ使える
- 登録手続きが不要
- APIキーの管理が不要

### 2. 7日間の天気予報
- WeatherAPI.com: 3日間
- OpenMeteo: **7日間**（より長期間の予報）

### 3. 完全無料・無制限
- 利用制限なし
- リクエスト数制限なし
- サインアップ不要

### 4. 商業利用可能
- ビジネスでの使用も無料
- 著作権表示のみ必要

### 5. ヨーロッパの気象機関データ
- 信頼性の高いデータソース
- 定期的に更新

---

## ⚠️ OpenMeteo版の注意点

### 1. 日本語の天気説明
- OpenMeteoは英語のみ返す
- WMOコードから日本語に変換する処理が必要
- 例: `code: 0` → "晴れ"、`code: 61` → "雨"

### 2. 天気アイコン
- WeatherAPI.com: アイコンURL提供
- OpenMeteo: **自前で用意が必要**
- 絵文字使用が推奨（現在と同様）

### 3. データパラメータ指定
- 必要なデータを明示的に指定する必要がある
- 例: `temperature_2m_max,weathercode,windspeed`

### 4. 都市名検索
- 直接都市名で検索できない
- ジオコーディングAPIを別途呼ぶ必要がある
- ステップ1: 都市名→座標
- ステップ2: 座標で天気取得

---

## 🎯 難易度評価

### 技術的な難易度: ⭐⭐☆☆☆

**理由**:
- API呼び出しのロジック変更が必要
- データ構造が異なる
- WMOコードへの対応が必要
- ただし、WeatherAPI.comよりシンプル

### 作業時間の見積もり: ⏱️ 1〜1.5時間

**内訳**:
- コード修正: 30分〜1時間
- テスト: 15分
- README更新: 10分
- 動作確認: 5分

### 修正コード量

- **削除**: 約100行（APIキー関連の処理）
- **追加**: 約150行（OpenMeteo対応）
- **変更**: 約50行（データ処理ロジック）

**全体の約30%を書き換え**

---

## 📝 具体的な変更箇所

### app.jsで変更する関数

1. **コンストラクタ**
   - APIキー関連の削除
   - localStorageからのAPIキー読み込みを削除
   - APIキーモーダル関連を削除

2. **`fetchWeatherData(lat, lon)`**
   ```javascript
   // WeatherAPI.com版（現在）
   const url = `https://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=3`;

   // OpenMeteo版
   const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relativehumidity_2m_max&timezone=auto`;
   ```

3. **`getWeatherByCity(cityName)`**
   ```javascript
   // ステップ1: ジオコーディングAPIで座標取得
   const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
   const geoResponse = await fetch(geoUrl);
   const geoData = await geoResponse.json();

   // ステップ2: 座標で天気取得
   const lat = geoData.results[0].latitude;
   const lon = geoData.results[0].longitude;
   await this.fetchWeatherData(lat, lon);
   ```

4. **`processWeatherData(data)`**
   ```javascript
   // OpenMeteoのデータ構造に対応
   const current = {
       temp: Math.round(data.current_weather.temperature),
       weatherCode: data.current_weather.weathercode,
       wind: Math.round(data.daily.windspeed_10m_max[0])
       // など
   };
   ```

5. **`weatherCodeMap`**
   ```javascript
   // WMOコード（OpenMeteo）に変更
   this.weatherCodeMap = {
       0: '☀️',   // 晴れ
       1: '🌤️',   // 主に晴れ
       2: '⛅',   // 一時曇り
       3: '☁️',   // 曇り
       45: '🌫️',  // 霧
       51: '🌧️',  // 小雨
       61: '🌧️',  // 雨
       71: '🌨️',  // 雪
       95: '⛈️'   // 雷
   };
   ```

6. **HTML/CSSの変更**
   - APIキー設定モーダルを削除
   - 初期化ロジックを簡素化

---

## 🔧 OpenMeteo API エンドポイント

### 天気取得API
```
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,relativehumidity_2m_max&timezone=auto
```

### ジオコーディングAPI（都市名→座標）
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=ja&format=json
```

---

## 📋 WMO天気コード一覧

OpenMeteoで使用されるWMOコードと対応する天気：

| コード | 説明 | アイコン |
|--------|------|----------|
| 0 | 晴れ（Clear sky） | ☀️ |
| 1 | 主に晴れ（Mainly clear） | 🌤️ |
| 2 | 一時曇り（Partly cloudy） | ⛅ |
| 3 | 曇り（Overcast） | ☁️ |
| 45 | 霧（Fog） | 🌫️ |
| 48 | 霧氷（Depositing rime fog） | 🌫️ |
| 51 | 小雨（Light drizzle） | 🌧️ |
| 53 | 中雨（Moderate drizzle） | 🌧️ |
| 55 | 強雨（Dense drizzle） | 🌧️ |
| 61 | 小雨（Slight rain） | 🌧️ |
| 63 | 中雨（Moderate rain） | 🌧️ |
| 65 | 強雨（Heavy rain） | 🌧️ |
| 71 | 小雪（Slight snow fall） | 🌨️ |
| 73 | 中雪（Moderate snow fall） | 🌨️ |
| 75 | 大雪（Heavy snow fall） | 🌨️ |
| 77 | 霧雪（Snow grains） | 🌨️ |
| 80 | にわか雨（Slight rain showers） | 🌧️ |
| 81 | にわか雨（Moderate rain showers） | 🌧️ |
| 82 | にわか大雨（Violent rain showers） | 🌧️ |
| 85 | にわか雪（Slight snow showers） | 🌨️ |
| 86 | にわか大雪（Heavy snow showers） | 🌨️ |
| 95 | 雷（Thunderstorm） | ⛈️ |
| 96 | 雷と霧雨（Thunderstorm with slight hail） | ⛈️ |
| 99 | 雷と雹（Thunderstorm with heavy hail） | ⛈️ |

---

## 🚀 移行手順（実際に行う場合）

### ステップ1: コードの修正
1. app.jsを開く
2. 上記の変更箇所を修正
3. 動作確認

### ステップ2: テスト
1. 都市名検索のテスト
2. 現在地取得のテスト
3. 7日間の予報表示確認

### ステップ3: ドキュメント更新
1. README.mdを更新
2. APIキー取得手順を削除
3. OpenMeteoについて追記

### ステップ4: GitHubにプッシュ
1. コミット作成
2. プッシュ

---

## 💡 参考リンク

- **OpenMeteo公式**: https://open-meteo.com/
- **OpenMeteo APIドキュメント**: https://open-meteo.com/en/docs
- **ジオコーディングAPI**: https://open-meteo.com/en/docs/geocoding-api
- **WMOコード説明**: https://open-meteo.com/en/docs/daily-api#weathercode

---

## 📊 まとめ

### 移行すべきケース
- ✅ 多くの人に使ってもらいたい
- ✅ APIキーの取得ハードルを下げたい
- ✅ 7日間の予報が必要
- ✅ 商用利用を検討している

### 現状維持が良いケース
- ✅ 個人使用のみ
- ✅ 3日間の予報で十分
- ✅ 日本語対応が重要
- ✅ 既に動いているので変更したくない

---

## 📅 更新履歴

- **2026-04-04**: 初版作成（WeatherAPI.com版からOpenMeteo版への移行ガイド）

---

**最終更新**: 2026-04-04
**現在のバージョン**: WeatherAPI.com版
**作成者**: Claude Sonnet 4.6
