import { Alert, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PricingBreakdown from '../components/PricingBreakdown';
import { AppButton, Footer, styles as ui } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import { formatDateTime } from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ApprovedDetail'>;

export default function ApprovedDetailScreen({ navigation, route }: Props) {
  const { approved, removeApproved } = useAppStore();
  const record = approved.find(a => a.id === route.params.id);

  if (!record) {
    return (
      <View style={ui.screen}>
        <Text style={ui.empty}>Precificação não encontrada.</Text>
      </View>
    );
  }

  const confirmDelete = () =>
    Alert.alert(
      'Excluir',
      `Excluir a precificação de "${record.productName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            navigation.goBack();
            removeApproved(record.id);
          },
        },
      ],
    );

  return (
    <View style={ui.screen}>
      <ScrollView contentContainerStyle={ui.content}>
        <PricingBreakdown
          header={`Aprovada em ${formatDateTime(record.approvedAt)}`}
          productName={record.productName}
          lines={record.lines}
          totals={record.totals}
        />
      </ScrollView>
      <Footer safeBottom>
        <AppButton variant="danger" title="Excluir" onPress={confirmDelete} />
      </Footer>
    </View>
  );
}
