import { StyleSheet, Text, View } from 'react-native';
import { PlantPlaceholder } from '../components/PlantPlaceholder';
import { getFlowerType, growthStages } from '../data/plantGrowth';
import { BloomedPlant } from '../types/plant';

type CollectionScreenProps = {
  collection: BloomedPlant[];
};

export function CollectionScreen({ collection }: CollectionScreenProps) {
  const bloomStage = growthStages[growthStages.length - 1];

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>図鑑</Text>
        <Text style={styles.subtitle}>保存した花 {collection.length} 件</Text>
      </View>

      {collection.length === 0 ? (
        <View style={styles.emptyPanel}>
          <PlantPlaceholder flowerType={getFlowerType()} stage={bloomStage} size="small" />
          <View style={styles.emptyCopy}>
            <Text style={styles.emptyTitle}>まだ保存されていません</Text>
            <Text style={styles.emptyBody}>開花したら、ホーム画面から図鑑に保存できます。</Text>
          </View>
        </View>
      ) : (
        <View style={styles.list}>
          {collection.map((plant) => {
            const flowerType = getFlowerType(plant.flowerTypeId);

            return (
              <View key={plant.id} style={styles.card}>
                <PlantPlaceholder flowerType={flowerType} stage={bloomStage} size="small" />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{plant.name}</Text>
                  <Text style={styles.cardBody}>開花日: {new Date(plant.bloomedAt).toLocaleDateString('ja-JP')}</Text>
                  <Text style={styles.cardBody}>開花時: {plant.pointsAtBloom.toLocaleString()} pt</Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
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
  },
  emptyPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyCopy: {
    flex: 1,
    gap: 4,
  },
  emptyTitle: {
    color: '#24342A',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyBody: {
    color: '#607166',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: '#24342A',
    fontSize: 17,
    fontWeight: '800',
  },
  cardBody: {
    color: '#607166',
    fontSize: 13,
  },
});
