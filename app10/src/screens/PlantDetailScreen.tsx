import { StyleSheet, Text, View } from 'react-native';
import { PlantPlaceholder } from '../components/PlantPlaceholder';
import { ProgressBar } from '../components/ProgressBar';
import { growthStages, MAX_GROWTH_POINTS } from '../data/plantGrowth';
import { FlowerType, GrowthStage, PlantProgress } from '../types/plant';

type PlantDetailScreenProps = {
  progress: PlantProgress;
  stage: GrowthStage;
  flowerType: FlowerType;
  progressRatio: number;
};

export function PlantDetailScreen({ progress, stage, flowerType, progressRatio }: PlantDetailScreenProps) {
  const isBloomed = progress.growthPoints >= MAX_GROWTH_POINTS;

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{isBloomed ? flowerType.name : 'なぞの花'}</Text>
        <Text style={styles.subtitle}>
          {isBloomed ? flowerType.description : '開花すると、この花の名前と説明がわかります。'}
        </Text>
      </View>

      <PlantPlaceholder flowerType={flowerType} stage={stage} />

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>成長ポイント</Text>
        <ProgressBar progress={progressRatio} color={stage.accentColor} />
        <Text style={styles.body}>
          {progress.growthPoints.toLocaleString()} / {MAX_GROWTH_POINTS.toLocaleString()} pt
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>成長段階</Text>
        {growthStages.map((growthStage) => {
          const isCurrent = growthStage.id === stage.id;
          const isReached = progress.growthPoints >= growthStage.minPoints;

          return (
            <View key={growthStage.id} style={[styles.stageRow, isCurrent && styles.currentStageRow]}>
              <View style={[styles.stageDot, isReached && { backgroundColor: growthStage.accentColor }]} />
              <View style={styles.stageText}>
                <Text style={styles.stageLabel}>
                  {growthStage.id + 1}. {growthStage.label}
                </Text>
                <Text style={styles.stageSteps}>{growthStage.minPoints.toLocaleString()} pt</Text>
                <Text style={styles.stageMessage}>{growthStage.message}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  title: {
    color: '#17251C',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#607166',
    fontSize: 15,
    lineHeight: 21,
  },
  panel: {
    gap: 12,
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    color: '#24342A',
    fontSize: 18,
    fontWeight: '800',
  },
  body: {
    color: '#607166',
    fontSize: 15,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 8,
    padding: 10,
  },
  currentStageRow: {
    backgroundColor: '#F0F6F2',
  },
  stageDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    marginTop: 4,
    backgroundColor: '#CBD8CF',
  },
  stageText: {
    flex: 1,
    gap: 3,
  },
  stageLabel: {
    color: '#24342A',
    fontSize: 15,
    fontWeight: '800',
  },
  stageSteps: {
    color: '#6C7B70',
    fontSize: 12,
    fontWeight: '700',
  },
  stageMessage: {
    color: '#607166',
    fontSize: 12,
    lineHeight: 17,
  },
});
