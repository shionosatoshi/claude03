import type { BodyPartId } from "@/types/check";

export const bodyParts: Array<{ id: BodyPartId; label: string; hint: string }> = [
  { id: "neck", label: "首", hint: "スマホやモニター姿勢との関係" },
  { id: "shoulder", label: "肩", hint: "巻き肩や作業環境との関係" },
  { id: "back", label: "背中", hint: "座り方や体幹の使い方との関係" },
  { id: "waist", label: "腰", hint: "姿勢、筋力、下半身連動との関係" },
  { id: "hip", label: "股関節", hint: "歩き方や下半身の動きとの関係" },
  { id: "knee", label: "膝", hint: "足部や運動フォームとの関係" },
  { id: "ankle", label: "足首", hint: "靴、歩行、バランスとの関係" },
  { id: "sole", label: "足裏", hint: "足部サポートや歩行量との関係" },
  { id: "toe", label: "足指", hint: "靴や足の使い方との関係" },
  { id: "posture", label: "全身の姿勢", hint: "生活習慣と環境を広く確認" }
];
