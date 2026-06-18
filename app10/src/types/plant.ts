export type ScreenName = 'home' | 'detail' | 'collection' | 'settings';

export type InputSource = 'care-action' | 'debug' | 'steps-api';

export type CareActionId = 'water' | 'sunlight' | 'fertilizer';

export type GrowthStage = {
  id: number;
  label: string;
  minPoints: number;
  message: string;
  accentColor: string;
};

export type FlowerType = {
  id: string;
  name: string;
  mysteryLabel: string;
  scientificName?: string;
  description: string;
  accentColor: string;
};

export type PlantProgress = {
  growthPoints: number;
  currentStageId: number;
  flowerTypeId: string;
  updatedAt: string;
  lastInputSource?: InputSource;
};

export type BloomedPlant = {
  id: string;
  name: string;
  flowerTypeId: string;
  bloomedAt: string;
  pointsAtBloom: number;
};

export type PlantStorageService = {
  loadProgress: () => Promise<PlantProgress>;
  saveProgress: (progress: PlantProgress) => Promise<void>;
  loadCollection: () => Promise<BloomedPlant[]>;
  saveCollection: (collection: BloomedPlant[]) => Promise<void>;
  resetAll: () => Promise<void>;
};
