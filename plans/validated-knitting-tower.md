# 名言が日付ごとに変わらない問題の修正

## Context
ユーザーがカレンダーで日付を選択しても名言が変わらないというバグを報告。コードを確認したところ、`getDayOfYear`メソッドの日付計算に問題がある。

## 問題の原因

現在の`getDayOfYear`メソッド（app.js:226-231）:
```javascript
getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) + 1;
}
```

この計算ではタイムゾーンの影響で正確な日数が計算されない場合がある。特に夏時間などの要因でズレが生じる可能性がある。

## 修正方法

`getDayOfYear`メソッドを、より確実な計算方法に書き換える：

```javascript
getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
```

変更点：
1. `getTime()`を明示的に使用してミリ秒を取得
2. `+1`を削除（1月1日は0、1月2日は1...となる）

または、さらに確実な方法：

```javascript
getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - start) / (1000 * 60 * 60 * 24));
    return days;
}
```

## 検証方法

1. ブラウザでリロード
2. 異なる日付（例：1月1日、1月15日、2月1日など）をクリック
3. 日付ごとに違う名言が表示されることを確認

## クリティカルファイル
- `app01/app.js` - `getDayOfYear`メソッドを修正（226-231行目）
