import { DimensionValue, StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  progress: number;
  color: string;
};

export function ProgressBar({ progress, color }: ProgressBarProps) {
  const width = `${Math.min(Math.max(progress, 0), 1) * 100}%` as DimensionValue;

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#E2E8E4',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
