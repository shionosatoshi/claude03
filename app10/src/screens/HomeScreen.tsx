import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { PlantPlaceholder } from '../components/PlantPlaceholder';
import { ProgressBar } from '../components/ProgressBar';
import { APP_NAME, flowerTypes, MAX_GROWTH_POINTS } from '../data/plantGrowth';
import { careActions } from '../services/growthPointService';
import { CareActionId, FlowerType, GrowthStage, PlantProgress, ScreenName } from '../types/plant';

type HomeScreenProps = {
  progress: PlantProgress;
  stage: GrowthStage;
  flowerType: FlowerType;
  progressRatio: number;
  remainingToBloom: number;
  remainingToNextStage: number;
  showAchievement: boolean;
  isSavedToCollection: boolean;
  onCareAction: (careActionId: CareActionId) => void;
  onBloom: () => void;
  onSaveBloom: () => void;
  onSelectFlowerType: (flowerTypeId: string) => void;
  onResetProgress: () => void;
  onNavigate: (screen: ScreenName) => void;
};

export function HomeScreen({
  progress,
  stage,
  flowerType,
  progressRatio,
  remainingToBloom,
  remainingToNextStage,
  showAchievement,
  isSavedToCollection,
  onCareAction,
  onBloom,
  onSaveBloom,
  onSelectFlowerType,
  onResetProgress,
  onNavigate,
}: HomeScreenProps) {
  const isBloomed = progress.growthPoints >= MAX_GROWTH_POINTS;
  const visibleFlowerName = isBloomed ? flowerType.name : 'なぞの花';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Webデモ</Text>
        <Text style={styles.title}>{APP_NAME}</Text>
        <Text style={styles.subtitle}>
          {isBloomed ? `${flowerType.name}が咲きました` : 'お世話で成長ポイントをためて花を咲かせましょう'}
        </Text>
      </View>

      <PlantPlaceholder flowerType={flowerType} stage={stage} />

      {showAchievement ? (
        <View style={styles.achievementPanel}>
          <Text style={styles.achievementTitle}>開花しました</Text>
          <Text style={styles.achievementBody}>{flowerType.name}が咲きました。図鑑に保存できます。</Text>
          <AppButton
            disabled={isSavedToCollection}
            label={isSavedToCollection ? '図鑑に保存済み' : '図鑑に保存'}
            onPress={onSaveBloom}
          />
        </View>
      ) : null}

      <View style={styles.panel}>
        <View style={styles.row}>
          <View>
            <Text style={styles.metric}>{progress.growthPoints.toLocaleString()}</Text>
            <Text style={styles.label}>成長ポイント</Text>
          </View>
          <View style={styles.stageBadge}>
            <Text style={styles.stageBadgeText}>{stage.id + 1}/6 段階</Text>
          </View>
        </View>

        <Text style={styles.stageTitle}>
          {visibleFlowerName}：{stage.label}
        </Text>
        <Text style={styles.message}>{stage.message}</Text>
        <ProgressBar progress={progressRatio} color={stage.accentColor} />

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{remainingToBloom.toLocaleString()}</Text>
            <Text style={styles.statLabel}>開花まで</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{remainingToNextStage.toLocaleString()}</Text>
            <Text style={styles.statLabel}>次の段階まで</Text>
          </View>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>お世話する</Text>
        <View style={styles.actionGrid}>
          {careActions.map((action) => (
            <Pressable
              accessibilityRole="button"
              key={action.id}
              onPress={() => onCareAction(action.id)}
              style={styles.careAction}
            >
              <Text style={styles.careActionTitle}>{action.label}</Text>
              <Text style={styles.careActionPoints}>+{action.points.toLocaleString()} pt</Text>
              <Text style={styles.careActionBody}>{action.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>育てる種</Text>
        <View style={styles.flowerGrid}>
          {flowerTypes.map((option) => {
            const isSelected = option.id === flowerType.id;

            return (
              <Pressable
                accessibilityRole="button"
                key={option.id}
                onPress={() => onSelectFlowerType(option.id)}
                style={[styles.flowerOption, isSelected && styles.selectedFlowerOption]}
              >
                <Text style={[styles.flowerOptionText, isSelected && styles.selectedFlowerOptionText]}>
                  {option.mysteryLabel}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hintText}>どの花が咲くかは、開花までのお楽しみです。</Text>
      </View>

      <View style={styles.debugGrid}>
        <AppButton label="リセット" onPress={onResetProgress} variant="secondary" />
        <AppButton label="デモ用に開花" onPress={onBloom} variant="secondary" />
        <AppButton label="詳細を見る" onPress={() => onNavigate('detail')} variant="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  header: {
    gap: 4,
  },
  kicker: {
    color: '#5C7665',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#17251C',
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
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
  achievementPanel: {
    gap: 10,
    borderWidth: 1,
    borderColor: '#F1CF70',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFF8DC',
  },
  achievementTitle: {
    color: '#73520E',
    fontSize: 22,
    fontWeight: '800',
  },
  achievementBody: {
    color: '#73520E',
    fontSize: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  metric: {
    color: '#17251C',
    fontSize: 30,
    fontWeight: '800',
  },
  label: {
    color: '#6C7B70',
    fontSize: 13,
  },
  stageBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E7F2EA',
  },
  stageBadgeText: {
    color: '#256D45',
    fontWeight: '800',
  },
  stageTitle: {
    color: '#24342A',
    fontSize: 18,
    fontWeight: '800',
  },
  message: {
    color: '#607166',
    fontSize: 14,
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F4F8F5',
  },
  statValue: {
    color: '#24342A',
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: '#607166',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#24342A',
    fontSize: 17,
    fontWeight: '800',
  },
  actionGrid: {
    gap: 10,
  },
  careAction: {
    gap: 4,
    borderWidth: 1,
    borderColor: '#C9D8CE',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F9FCFA',
  },
  careActionTitle: {
    color: '#24342A',
    fontSize: 16,
    fontWeight: '800',
  },
  careActionPoints: {
    color: '#256D45',
    fontSize: 14,
    fontWeight: '800',
  },
  careActionBody: {
    color: '#607166',
    fontSize: 13,
    lineHeight: 18,
  },
  flowerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  flowerOption: {
    minHeight: 42,
    minWidth: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C9D8CE',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FCFA',
  },
  selectedFlowerOption: {
    borderColor: '#256D45',
    backgroundColor: '#E7F2EA',
  },
  flowerOptionText: {
    color: '#607166',
    fontSize: 14,
    fontWeight: '800',
  },
  selectedFlowerOptionText: {
    color: '#256D45',
  },
  hintText: {
    color: '#607166',
    fontSize: 13,
    lineHeight: 19,
  },
  debugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
