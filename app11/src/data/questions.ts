import type { Question } from "@/types/check";

export const questions: Question[] = [
  {
    id: "long-sitting",
    label: "長時間座っていることが多い",
    bodyParts: ["neck", "shoulder", "back", "waist", "hip", "posture"],
    scores: { "desk-posture": 2, "core-stability": 1, lifestyle: 1 }
  },
  {
    id: "desk-work",
    label: "デスクワークが多い",
    bodyParts: ["neck", "shoulder", "back", "waist", "posture"],
    scores: { "desk-posture": 3, "rounded-shoulder-forward-neck": 1 }
  },
  {
    id: "phone-time",
    label: "スマホを見る時間が長い",
    bodyParts: ["neck", "shoulder", "back", "posture"],
    scores: { "rounded-shoulder-forward-neck": 3, "desk-posture": 1, lifestyle: 1 }
  },
  {
    id: "slouch-feedback",
    label: "猫背と言われたことがある",
    bodyParts: ["neck", "shoulder", "back", "waist", "posture"],
    scores: { "rounded-shoulder-forward-neck": 3, "core-stability": 1 }
  },
  {
    id: "swayback",
    label: "反り腰気味だと思う",
    bodyParts: ["back", "waist", "hip", "posture"],
    scores: { "core-stability": 3, "hip-lower-link": 2 }
  },
  {
    id: "rounded-shoulders",
    label: "巻き肩気味だと思う",
    bodyParts: ["neck", "shoulder", "back", "posture"],
    scores: { "rounded-shoulder-forward-neck": 3, "desk-posture": 1 }
  },
  {
    id: "waist-sensitive",
    label: "腰が痛くなりやすい",
    bodyParts: ["waist", "back", "hip", "posture"],
    scores: { "core-stability": 2, "hip-lower-link": 2, lifestyle: 1 }
  },
  {
    id: "situp-waist",
    label: "腹筋運動で腰が痛くなる",
    bodyParts: ["waist", "back", "hip"],
    scores: { "core-stability": 3, "exercise-form": 2 }
  },
  {
    id: "training-pain",
    label: "筋トレをすると腰や肩が痛くなることがある",
    bodyParts: ["neck", "shoulder", "back", "waist", "hip", "knee", "posture"],
    scores: { "exercise-form": 3, "core-stability": 1, "hip-lower-link": 1 }
  },
  {
    id: "single-leg",
    label: "片足立ちが苦手",
    bodyParts: ["hip", "knee", "ankle", "sole", "toe", "posture"],
    scores: { "hip-lower-link": 3, "foot-support": 2, "core-stability": 1 }
  },
  {
    id: "little-toe",
    label: "足の小指が内側に曲がっている",
    bodyParts: ["ankle", "sole", "toe", "knee"],
    scores: { "foot-support": 3 }
  },
  {
    id: "shoe-outer",
    label: "靴底の外側だけ減りやすい",
    bodyParts: ["ankle", "sole", "toe", "knee", "hip"],
    scores: { "foot-support": 2, "hip-lower-link": 1 }
  },
  {
    id: "sole-walk",
    label: "長時間歩くと足裏が痛くなる",
    bodyParts: ["ankle", "sole", "toe", "knee", "hip"],
    scores: { "foot-support": 3, lifestyle: 1 }
  },
  {
    id: "insole-better",
    label: "インソールを変えたら歩きやすくなった経験がある",
    bodyParts: ["ankle", "sole", "toe", "knee", "hip", "waist"],
    scores: { "foot-support": 3, "hip-lower-link": 1 }
  },
  {
    id: "keyboard",
    label: "キーボード作業が多い",
    bodyParts: ["neck", "shoulder", "back", "posture"],
    scores: { "desk-posture": 2, "rounded-shoulder-forward-neck": 1 }
  },
  {
    id: "monitor-low",
    label: "モニターの高さが低い",
    bodyParts: ["neck", "shoulder", "back", "posture"],
    scores: { "desk-posture": 3, "rounded-shoulder-forward-neck": 2 }
  },
  {
    id: "chair-desk-height",
    label: "椅子や机の高さが合っていない気がする",
    bodyParts: ["neck", "shoulder", "back", "waist", "hip", "posture"],
    scores: { "desk-posture": 3, lifestyle: 1 }
  },
  {
    id: "sleep-short",
    label: "睡眠時間が短い、または疲れが残りやすい",
    bodyParts: ["neck", "shoulder", "back", "waist", "hip", "knee", "ankle", "sole", "toe", "posture"],
    scores: { lifestyle: 3, "core-stability": 1 }
  },
  {
    id: "same-shoes",
    label: "同じ靴を長時間履くことが多い",
    bodyParts: ["ankle", "sole", "toe", "knee", "hip"],
    scores: { "foot-support": 2, lifestyle: 1 }
  },
  {
    id: "warmup-skip",
    label: "運動前の準備運動やフォーム確認を省くことが多い",
    bodyParts: ["shoulder", "back", "waist", "hip", "knee", "ankle", "posture"],
    scores: { "exercise-form": 3, "hip-lower-link": 1 }
  }
];
