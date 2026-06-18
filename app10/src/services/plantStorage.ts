import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_FLOWER_TYPE_ID, getFlowerType, getGrowthStage } from '../data/plantGrowth';
import { BloomedPlant, PlantProgress, PlantStorageService } from '../types/plant';

const PROGRESS_KEY = 'plant-progress-v2';
const COLLECTION_KEY = 'plant-collection-v2';
const LEGACY_PROGRESS_KEY = 'plant-progress-v1';
const LEGACY_COLLECTION_KEY = 'plant-collection-v1';

type LegacyProgress = Partial<PlantProgress> & {
  steps?: number;
};

type LegacyBloomedPlant = Partial<BloomedPlant> & {
  stepsAtBloom?: number;
};

export function createDefaultProgress(): PlantProgress {
  const growthPoints = 0;

  return {
    growthPoints,
    currentStageId: getGrowthStage(growthPoints).id,
    flowerTypeId: DEFAULT_FLOWER_TYPE_ID,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeProgress(rawProgress: LegacyProgress): PlantProgress {
  const growthPoints = typeof rawProgress.growthPoints === 'number' ? rawProgress.growthPoints : rawProgress.steps ?? 0;
  const flowerTypeId = rawProgress.flowerTypeId ?? DEFAULT_FLOWER_TYPE_ID;

  return {
    growthPoints,
    currentStageId: getGrowthStage(growthPoints).id,
    flowerTypeId,
    updatedAt: rawProgress.updatedAt ?? new Date().toISOString(),
    lastInputSource: rawProgress.lastInputSource,
  };
}

function normalizeCollection(rawCollection: LegacyBloomedPlant[]) {
  return rawCollection.map((plant, index) => {
    const flowerType = getFlowerType(plant.flowerTypeId);

    return {
      id: plant.id ?? `${Date.now()}-${index}`,
      name: plant.name ?? flowerType.name,
      flowerTypeId: plant.flowerTypeId ?? DEFAULT_FLOWER_TYPE_ID,
      bloomedAt: plant.bloomedAt ?? new Date().toISOString(),
      pointsAtBloom: plant.pointsAtBloom ?? plant.stepsAtBloom ?? 0,
    };
  });
}

async function loadFirstAvailable(keys: string[]) {
  for (const key of keys) {
    const raw = await AsyncStorage.getItem(key);

    if (raw) {
      return raw;
    }
  }

  return null;
}

export const asyncStoragePlantService: PlantStorageService = {
  async loadProgress() {
    const raw = await loadFirstAvailable([PROGRESS_KEY, LEGACY_PROGRESS_KEY]);

    if (!raw) {
      return createDefaultProgress();
    }

    try {
      return normalizeProgress(JSON.parse(raw) as LegacyProgress);
    } catch {
      return createDefaultProgress();
    }
  },

  async saveProgress(progress) {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  async loadCollection() {
    const raw = await loadFirstAvailable([COLLECTION_KEY, LEGACY_COLLECTION_KEY]);

    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as LegacyBloomedPlant[];
      return Array.isArray(parsed) ? normalizeCollection(parsed) : [];
    } catch {
      return [];
    }
  },

  async saveCollection(collection) {
    await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  },

  async resetAll() {
    await AsyncStorage.multiRemove([PROGRESS_KEY, COLLECTION_KEY, LEGACY_PROGRESS_KEY, LEGACY_COLLECTION_KEY]);
  },
};
