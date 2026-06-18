import { clampGrowthPoints, getGrowthStage } from '../data/plantGrowth';
import { CareActionId, InputSource, PlantProgress } from '../types/plant';

export const careActions: { id: CareActionId; label: string; points: number; description: string }[] = [
  {
    id: 'water',
    label: '水をあげる',
    points: 500,
    description: '土をうるおして、少し成長します。',
  },
  {
    id: 'sunlight',
    label: '日光をあてる',
    points: 800,
    description: '明るい光で、葉が元気になります。',
  },
  {
    id: 'fertilizer',
    label: '肥料をあげる',
    points: 2000,
    description: '栄養をあげて、大きく成長します。',
  },
];

export type GrowthPointInput = {
  points: number;
  inputSource: InputSource;
};

export function applyGrowthPointInput(progress: PlantProgress, input: GrowthPointInput): PlantProgress {
  const growthPoints = clampGrowthPoints(progress.growthPoints + input.points);

  return {
    ...progress,
    growthPoints,
    currentStageId: getGrowthStage(growthPoints).id,
    lastInputSource: input.inputSource,
    updatedAt: new Date().toISOString(),
  };
}

export function applyCareAction(progress: PlantProgress, careActionId: CareActionId): PlantProgress {
  const action = careActions.find((careAction) => careAction.id === careActionId);

  if (!action) {
    return progress;
  }

  return applyGrowthPointInput(progress, {
    points: action.points,
    inputSource: 'care-action',
  });
}
