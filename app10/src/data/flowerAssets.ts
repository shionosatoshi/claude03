import { ImageSourcePropType } from 'react-native';

const flowerStageAssets: Record<string, ImageSourcePropType[]> = {
  sunflower: [
    require('../../assets/flowers/stages/sunflower-stage-0.png'),
    require('../../assets/flowers/stages/sunflower-stage-1.png'),
    require('../../assets/flowers/stages/sunflower-stage-2.png'),
    require('../../assets/flowers/stages/sunflower-stage-3.png'),
    require('../../assets/flowers/stages/sunflower-stage-4.png'),
    require('../../assets/flowers/stages/sunflower-stage-5.png'),
  ],
  tulip: [
    require('../../assets/flowers/stages/tulip-stage-0.png'),
    require('../../assets/flowers/stages/tulip-stage-1.png'),
    require('../../assets/flowers/stages/tulip-stage-2.png'),
    require('../../assets/flowers/stages/tulip-stage-3.png'),
    require('../../assets/flowers/stages/tulip-stage-4.png'),
    require('../../assets/flowers/stages/tulip-stage-5.png'),
  ],
  rose: [
    require('../../assets/flowers/stages/rose-stage-0.png'),
    require('../../assets/flowers/stages/rose-stage-1.png'),
    require('../../assets/flowers/stages/rose-stage-2.png'),
    require('../../assets/flowers/stages/rose-stage-3.png'),
    require('../../assets/flowers/stages/rose-stage-4.png'),
    require('../../assets/flowers/stages/rose-stage-5.png'),
  ],
  lavender: [
    require('../../assets/flowers/stages/lavender-stage-0.png'),
    require('../../assets/flowers/stages/lavender-stage-1.png'),
    require('../../assets/flowers/stages/lavender-stage-2.png'),
    require('../../assets/flowers/stages/lavender-stage-3.png'),
    require('../../assets/flowers/stages/lavender-stage-4.png'),
    require('../../assets/flowers/stages/lavender-stage-5.png'),
  ],
  cherry: [
    require('../../assets/flowers/stages/cherry-stage-0.png'),
    require('../../assets/flowers/stages/cherry-stage-1.png'),
    require('../../assets/flowers/stages/cherry-stage-2.png'),
    require('../../assets/flowers/stages/cherry-stage-3.png'),
    require('../../assets/flowers/stages/cherry-stage-4.png'),
    require('../../assets/flowers/stages/cherry-stage-5.png'),
  ],
};

export function getFlowerStageAsset(flowerTypeId: string, stageId: number) {
  const assets = flowerStageAssets[flowerTypeId] ?? flowerStageAssets.sunflower;
  const safeStageId = Math.min(Math.max(stageId, 0), assets.length - 1);

  return assets[safeStageId];
}
