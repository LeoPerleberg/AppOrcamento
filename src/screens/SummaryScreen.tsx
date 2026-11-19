import { useMemo } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import PricingBreakdown from '../components/PricingBreakdown';
import { AppButton, Footer, styles as ui } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import { computeLines, computeTotals } from '../utils/pricing';

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

export default function SummaryScreen({ navigation }: Props) {
  const { materials, services, pricing, approvePricing, resetPricing } =
    useAppStore();

  const lines = useMemo(
    () => computeLines(pricing.items, materials, services),
    [pricing.items, materials, services],
  );
  const totals = useMemo(() => computeTotals(lines), [lines]);
  const canApprove = pricing.productName.trim() !== '' && lines.length > 0;

  const approve = () => {
    if (!canApprove) {
      Alert.alert(
        'Não é possível aprovar',
        'Informe o nome do produto e ao menos um item com quantidade.',
      );
      return;
    }
    Alert.alert(
      'Aprovar precificação',
      'Os valores serão salvos como estão agora e não mudarão se o cadastro for alterado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprovar',
          onPress: () => {
            approvePricing();
            resetPricing();
            navigation.navigate('Tabs', { screen: 'Approved' });
          },
        },
      ],
    );
  };

  return (
    <View style={ui.screen}>
      <ScrollView contentContainerStyle={ui.content}>
        <PricingBreakdown
          productName={pricing.productName}
          lines={lines}
          totals={totals}
        />
      </ScrollView>
      <Footer safeBottom style={ui.row}>
        <AppButton
          style={ui.flex}
          variant="outline"
          title="Editar"
          onPress={() => navigation.goBack()}
        />
        <AppButton
          style={ui.flex}
          variant="success"
          title="Aprovar"
          onPress={approve}
          disabled={!canApprove}
        />
      </Footer>
    </View>
  );
}
