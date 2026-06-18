import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';

type SettingsScreenProps = {
  onResetProgress: () => void;
  onResetAll: () => void;
};

export function SettingsScreen({ onResetProgress, onResetAll }: SettingsScreenProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>設定</Text>
        <Text style={styles.subtitle}>デモ用の保存データ管理</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>成長データ</Text>
        <Text style={styles.body}>現在育てている花だけをリセットします。保存済みの図鑑は残ります。</Text>
        <AppButton label="成長をリセット" onPress={onResetProgress} variant="secondary" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>ローカル保存</Text>
        <Text style={styles.body}>AsyncStorageに保存した成長データと図鑑をすべて削除します。</Text>
        <AppButton label="保存データを全削除" onPress={onResetAll} variant="danger" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>将来の入力元</Text>
        <Text style={styles.body}>
          現在はお世話アクションで成長ポイントを加算します。将来は同じサービス層に歩数API由来のポイントを渡す想定です。
        </Text>
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
    fontSize: 14,
    lineHeight: 20,
  },
});
