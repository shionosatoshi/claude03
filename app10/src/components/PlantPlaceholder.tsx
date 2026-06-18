import { Image, StyleSheet, Text, View } from 'react-native';
import { getFlowerStageAsset } from '../data/flowerAssets';
import { FlowerType, GrowthStage } from '../types/plant';

type PlantPlaceholderProps = {
  stage: GrowthStage;
  flowerType: FlowerType;
  size?: 'small' | 'large';
};

export function PlantPlaceholder({ stage, flowerType, size = 'large' }: PlantPlaceholderProps) {
  const isSmall = size === 'small';
  const isBloomed = stage.id >= 5;
  const visibleName = isBloomed ? flowerType.name : 'なぞの花';
  const imageSource = getFlowerStageAsset(flowerType.id, stage.id);

  return (
    <View style={[styles.frame, isSmall && styles.smallFrame]} accessibilityLabel={`${visibleName}、${stage.label}`}>
      <Image source={imageSource} style={[styles.image, isSmall && styles.smallImage]} />
      {!isSmall ? (
        <View style={styles.captionGroup}>
          <Text style={styles.flowerName}>{visibleName}</Text>
          <Text style={styles.caption}>{isBloomed ? '名前がわかりました' : stage.label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D8E2DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFF8E8',
  },
  smallFrame: {
    width: 112,
    height: 112,
  },
  image: {
    width: '100%',
    height: 248,
    resizeMode: 'contain',
  },
  smallImage: {
    height: 104,
  },
  captionGroup: {
    alignItems: 'center',
    gap: 2,
    marginTop: 8,
    paddingHorizontal: 12,
  },
  flowerName: {
    color: '#24342A',
    fontSize: 17,
    fontWeight: '800',
  },
  caption: {
    color: '#708077',
    fontSize: 12,
    fontWeight: '700',
  },
});
