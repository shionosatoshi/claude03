import { FlowerType, GrowthStage } from '../types/plant';

export const MAX_GROWTH_POINTS = 50000;
export const APP_NAME = '歩いて咲く花';
export const DEFAULT_FLOWER_TYPE_ID = 'sunflower';

export const flowerTypes: FlowerType[] = [
  {
    id: 'sunflower',
    name: 'ひまわり',
    mysteryLabel: 'なぞの種 A',
    scientificName: 'Sunflower',
    description: '元気な黄色い花。大きな花びらが明るく開きます。',
    accentColor: '#D99A1E',
  },
  {
    id: 'tulip',
    name: 'チューリップ',
    mysteryLabel: 'なぞの種 B',
    scientificName: 'Tulip',
    description: '春らしい花。すっと伸びた茎の先に鮮やかに咲きます。',
    accentColor: '#D95F8D',
  },
  {
    id: 'rose',
    name: 'バラ',
    mysteryLabel: 'なぞの種 C',
    scientificName: 'Rose',
    description: '華やかな花。重なった花びらが美しく開きます。',
    accentColor: '#C84A5A',
  },
  {
    id: 'lavender',
    name: 'ラベンダー',
    mysteryLabel: 'なぞの種 D',
    scientificName: 'Lavender',
    description: '紫の穂が美しい香りの花。落ち着いた雰囲気で咲きます。',
    accentColor: '#8E6CCB',
  },
  {
    id: 'cherry',
    name: 'さくら',
    mysteryLabel: 'なぞの種 E',
    scientificName: 'Cherry blossom',
    description: '淡いピンクの花。小さな木にやさしく花を咲かせます。',
    accentColor: '#E8A0B8',
  },
];

export const growthStages: GrowthStage[] = [
  {
    id: 0,
    label: '空の鉢',
    minPoints: 0,
    message: 'まだ静かな鉢です。お世話を始めましょう。',
    accentColor: '#8B6F47',
  },
  {
    id: 1,
    label: '芽',
    minPoints: 10000,
    message: '小さな芽が出ました。少しずつ育っています。',
    accentColor: '#66A15D',
  },
  {
    id: 2,
    label: '若い茎',
    minPoints: 20000,
    message: '茎が伸び、葉が増えてきました。',
    accentColor: '#4D9A62',
  },
  {
    id: 3,
    label: '葉',
    minPoints: 30000,
    message: '葉がしっかり広がりました。開花に近づいています。',
    accentColor: '#2F8F5B',
  },
  {
    id: 4,
    label: 'つぼみ',
    minPoints: 40000,
    message: 'つぼみがふくらんでいます。あと少しで咲きそうです。',
    accentColor: '#DD8E4F',
  },
  {
    id: 5,
    label: '開花',
    minPoints: MAX_GROWTH_POINTS,
    message: '花が咲きました。図鑑に保存できます。',
    accentColor: '#D95F8D',
  },
];

export function clampGrowthPoints(points: number) {
  return Math.min(Math.max(Math.round(points), 0), MAX_GROWTH_POINTS);
}

export function getGrowthStage(points: number) {
  const safePoints = clampGrowthPoints(points);

  return growthStages.reduce((current, stage) => {
    return safePoints >= stage.minPoints ? stage : current;
  }, growthStages[0]);
}

export function getNextGrowthStage(points: number) {
  const safePoints = clampGrowthPoints(points);

  return growthStages.find((stage) => stage.minPoints > safePoints);
}

export function getFlowerType(flowerTypeId?: string) {
  return flowerTypes.find((flowerType) => flowerType.id === flowerTypeId) ?? flowerTypes[0];
}

export function getProgressRatio(points: number) {
  return clampGrowthPoints(points) / MAX_GROWTH_POINTS;
}

export function isBloomed(points: number) {
  return clampGrowthPoints(points) >= MAX_GROWTH_POINTS;
}
