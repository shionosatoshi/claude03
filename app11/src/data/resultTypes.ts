import type { ResultType } from "@/types/check";

export const resultTypes: ResultType[] = [
  {
    id: "foot-support",
    title: "足部サポート不足タイプ",
    shortLabel: "足部サポート",
    description: "足指、足裏、靴、インソールなどの支え方が、歩き方や立ち姿勢に影響している可能性があります。",
    reviewCandidates: ["靴のサイズと幅", "靴底の減り方", "足指の使いやすさ", "長時間歩いた後の足裏の状態"],
    selfCareExamples: ["足指を軽く広げる運動", "短時間の裸足チェック", "靴紐の締め方を見直す"],
    consultationGuide: "足裏の痛みが続く、歩き方が大きく変わる、しびれがある場合は専門家への相談も検討してください。"
  },
  {
    id: "desk-posture",
    title: "デスク姿勢負荷タイプ",
    shortLabel: "デスク姿勢",
    description: "机、椅子、モニター、キーボードの配置が、首・肩・背中・腰への負担につながっている可能性があります。",
    reviewCandidates: ["モニターの高さ", "肘の置き場", "椅子と机の高さ", "休憩の取り方"],
    selfCareExamples: ["画面上端を目線付近に近づける", "30分から60分ごとに姿勢を変える", "肩をすくめずに入力できる位置を探す"],
    consultationGuide: "作業環境を整えても強い違和感が続く場合は、医療機関や専門家への相談も検討してください。"
  },
  {
    id: "core-stability",
    title: "体幹安定性不足タイプ",
    shortLabel: "体幹安定性",
    description: "腹部や背中まわりの支え方が、腰や背中の負担感に関係している可能性があります。",
    reviewCandidates: ["反り腰になりやすい場面", "座っている時の骨盤の傾き", "腹筋運動時の腰の感覚", "長時間同じ姿勢での疲れ方"],
    selfCareExamples: ["呼吸に合わせた軽い腹部の力入れ", "腰を反らせすぎない範囲での体幹練習", "短時間から始める姿勢リセット"],
    consultationGuide: "腰の痛みが強い、脚へのしびれを伴う、急に悪化した場合は医療機関に相談してください。"
  },
  {
    id: "hip-lower-link",
    title: "股関節・下半身連動不足タイプ",
    shortLabel: "下半身連動",
    description: "股関節、膝、足首の動きのつながりが、腰・膝・足まわりの違和感に関わっている可能性があります。",
    reviewCandidates: ["片足立ちの安定感", "階段やしゃがみ動作", "歩幅と足の向き", "膝とつま先の向き"],
    selfCareExamples: ["壁に手を添えた片足バランス", "股関節をゆっくり回す運動", "無理のない範囲のスクワット確認"],
    consultationGuide: "膝や股関節の痛みで日常動作が難しい場合は、専門家への相談も検討してください。"
  },
  {
    id: "rounded-shoulder-forward-neck",
    title: "巻き肩・首前方タイプ",
    shortLabel: "首肩の前方姿勢",
    description: "スマホやPC作業で頭や肩が前に出やすく、首・肩・背中に負担が集まっている可能性があります。",
    reviewCandidates: ["スマホを見る高さ", "肩が前に入る作業姿勢", "胸まわりのこわばり", "首だけで画面に近づく癖"],
    selfCareExamples: ["胸を軽く開くストレッチ", "あごを軽く引く姿勢リセット", "スマホを目線に近づける"],
    consultationGuide: "首や肩の違和感にしびれ、めまい、強い痛みが伴う場合は医療機関に相談してください。"
  },
  {
    id: "exercise-form",
    title: "運動フォーム負荷タイプ",
    shortLabel: "運動フォーム",
    description: "筋トレや運動中のフォーム、負荷量、準備不足が、腰・肩・膝などへの負担につながっている可能性があります。",
    reviewCandidates: ["負荷を上げるペース", "準備運動の有無", "痛みが出る種目", "反動を使いすぎていないか"],
    selfCareExamples: ["負荷を一段下げて動作を確認する", "鏡や動画でフォームを確認する", "痛みの出ない範囲で回数を調整する"],
    consultationGuide: "運動中に鋭い痛みが出る、翌日以降も強く残る場合は専門家への相談も検討してください。"
  },
  {
    id: "lifestyle",
    title: "生活環境・習慣タイプ",
    shortLabel: "生活習慣",
    description: "睡眠、休憩、移動量、同じ姿勢の継続など、日々の環境や習慣が違和感に関係している可能性があります。",
    reviewCandidates: ["睡眠と疲労感", "休憩の頻度", "同じ姿勢の継続時間", "靴やバッグなど日用品の使い方"],
    selfCareExamples: ["小さな休憩を予定に入れる", "同じ姿勢を続ける時間を短くする", "疲れが強い日は負荷を控えめにする"],
    consultationGuide: "疲労感や痛みが長く続く、生活に支障がある場合は医療機関や専門家への相談も検討してください。"
  }
];
