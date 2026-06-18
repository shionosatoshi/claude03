import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  getFlowerType,
  getGrowthStage,
  getNextGrowthStage,
  getProgressRatio,
  isBloomed,
  MAX_GROWTH_POINTS,
} from './src/data/plantGrowth';
import { CollectionScreen } from './src/screens/CollectionScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { PlantDetailScreen } from './src/screens/PlantDetailScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { applyCareAction, applyGrowthPointInput } from './src/services/growthPointService';
import { asyncStoragePlantService, createDefaultProgress } from './src/services/plantStorage';
import { BloomedPlant, CareActionId, PlantProgress, ScreenName } from './src/types/plant';

const plantService = asyncStoragePlantService;

const tabs: { key: ScreenName; label: string }[] = [
  { key: 'home', label: 'ホーム' },
  { key: 'detail', label: '詳細' },
  { key: 'collection', label: '図鑑' },
  { key: 'settings', label: '設定' },
];

export default function App() {
  const { width } = useWindowDimensions();
  const [activeScreen, setActiveScreen] = useState<ScreenName>('home');
  const [progress, setProgress] = useState<PlantProgress>(createDefaultProgress());
  const [collection, setCollection] = useState<BloomedPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);
  const [activeBloomSaved, setActiveBloomSaved] = useState(false);

  const stage = useMemo(() => getGrowthStage(progress.growthPoints), [progress.growthPoints]);
  const nextStage = useMemo(() => getNextGrowthStage(progress.growthPoints), [progress.growthPoints]);
  const flowerType = useMemo(() => getFlowerType(progress.flowerTypeId), [progress.flowerTypeId]);
  const progressRatio = useMemo(() => getProgressRatio(progress.growthPoints), [progress.growthPoints]);
  const remainingToBloom = Math.max(MAX_GROWTH_POINTS - progress.growthPoints, 0);
  const remainingToNextStage = nextStage ? Math.max(nextStage.minPoints - progress.growthPoints, 0) : 0;
  const contentWidth = Math.min(Math.max(width - 32, 0), 520);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const [savedProgress, savedCollection] = await Promise.all([
        plantService.loadProgress(),
        plantService.loadCollection(),
      ]);

      if (!mounted) {
        return;
      }

      setProgress(savedProgress);
      setCollection(savedCollection);
      setShowAchievement(isBloomed(savedProgress.growthPoints));
      setActiveBloomSaved(
        savedCollection.some((plant) => plant.flowerTypeId === savedProgress.flowerTypeId && plant.pointsAtBloom >= MAX_GROWTH_POINTS),
      );
      setIsLoading(false);
    }

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  async function persistProgress(nextProgress: PlantProgress) {
    const wasBloomed = isBloomed(progress.growthPoints);
    const nowBloomed = isBloomed(nextProgress.growthPoints);

    setProgress(nextProgress);
    await plantService.saveProgress(nextProgress);

    if (!wasBloomed && nowBloomed) {
      setShowAchievement(true);
      setActiveBloomSaved(false);
    }
  }

  function handleCareAction(careActionId: CareActionId) {
    persistProgress(applyCareAction(progress, careActionId));
  }

  function bloomNow() {
    persistProgress(
      applyGrowthPointInput(progress, {
        points: MAX_GROWTH_POINTS,
        inputSource: 'debug',
      }),
    );
  }

  async function saveBloomedPlant() {
    if (!isBloomed(progress.growthPoints) || activeBloomSaved) {
      return;
    }

    const bloomedPlant: BloomedPlant = {
      id: `${Date.now()}`,
      name: flowerType.name,
      flowerTypeId: flowerType.id,
      bloomedAt: new Date().toISOString(),
      pointsAtBloom: progress.growthPoints,
    };
    const nextCollection = [bloomedPlant, ...collection];

    setCollection(nextCollection);
    await plantService.saveCollection(nextCollection);
    setActiveBloomSaved(true);
  }

  async function resetProgress() {
    const nextProgress: PlantProgress = {
      ...createDefaultProgress(),
      flowerTypeId: flowerType.id,
    };
    setProgress(nextProgress);
    setShowAchievement(false);
    setActiveBloomSaved(false);
    await plantService.saveProgress(nextProgress);
  }

  async function selectFlowerType(flowerTypeId: string) {
    const nextProgress: PlantProgress = {
      ...createDefaultProgress(),
      flowerTypeId,
    };

    setProgress(nextProgress);
    setShowAchievement(false);
    setActiveBloomSaved(false);
    await plantService.saveProgress(nextProgress);
  }

  async function resetAll() {
    await plantService.resetAll();
    setProgress(createDefaultProgress());
    setCollection([]);
    setShowAchievement(false);
    setActiveBloomSaved(false);
    setActiveScreen('home');
  }

  function renderScreen() {
    if (activeScreen === 'detail') {
      return <PlantDetailScreen flowerType={flowerType} progress={progress} progressRatio={progressRatio} stage={stage} />;
    }

    if (activeScreen === 'collection') {
      return <CollectionScreen collection={collection} />;
    }

    if (activeScreen === 'settings') {
      return <SettingsScreen onResetAll={resetAll} onResetProgress={resetProgress} />;
    }

    return (
      <HomeScreen
        flowerType={flowerType}
        isSavedToCollection={activeBloomSaved}
        progress={progress}
        progressRatio={progressRatio}
        remainingToBloom={remainingToBloom}
        remainingToNextStage={remainingToNextStage}
        showAchievement={showAchievement}
        stage={stage}
        onBloom={bloomNow}
        onCareAction={handleCareAction}
        onNavigate={setActiveScreen}
        onResetProgress={resetProgress}
        onSaveBloom={saveBloomedPlant}
        onSelectFlowerType={selectFlowerType}
      />
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#256D45" />
          <Text style={styles.loadingText}>保存した花を読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.contentFrame, { width: contentWidth }]}>{renderScreen()}</View>
      </ScrollView>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeScreen;

          return (
            <Pressable
              accessibilityRole="tab"
              key={tab.key}
              onPress={() => setActiveScreen(tab.key)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF5F0',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 112,
  },
  contentFrame: {
    maxWidth: 520,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#607166',
    fontSize: 15,
    fontWeight: '700',
  },
  tabBar: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    width: '94%',
    maxWidth: 520,
    flexDirection: 'row',
    gap: 6,
    borderWidth: 1,
    borderColor: '#C9D8CE',
    borderRadius: 8,
    padding: 6,
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  activeTab: {
    backgroundColor: '#256D45',
  },
  tabText: {
    color: '#607166',
    fontSize: 12,
    fontWeight: '800',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
