import { Alert, FlatList, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppButton, Card, ValueRow, styles as ui } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import type { ProjectTemplate } from '../types';
import { formatMoney, formatNumber } from '../utils/format';
import { computeLines, computeTotals } from '../utils/pricing';

export default function TemplatesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    templates,
    materials,
    services,
    pricing,
    applyTemplate,
    removeTemplate,
  } = useAppStore();

  const use = (t: ProjectTemplate) => {
    const apply = () => {
      applyTemplate(t.id);
      navigation.navigate('Tabs', { screen: 'Pricing' });
    };
    if (pricing.productName.trim() || pricing.items.length > 0) {
      Alert.alert(
        'Usar modelo',
        'A precificação atual será substituída pelos itens deste modelo.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Substituir', onPress: apply },
        ],
      );
    } else {
      apply();
    }
  };

  const remove = (t: ProjectTemplate) =>
    Alert.alert('Excluir modelo', `Excluir "${t.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => removeTemplate(t.id),
      },
    ]);

  return (
    <FlatList
      style={ui.screen}
      contentContainerStyle={ui.content}
      data={templates}
      keyExtractor={t => t.id}
      ListEmptyComponent={
        <Text style={ui.empty}>
          Nenhum modelo cadastrado.{'\n'}Monte uma precificação e toque em
          "Salvar como modelo".
        </Text>
      }
      renderItem={({ item }) => {
        const lines = computeLines(
          item.items.map((i, idx) => ({ ...i, id: String(idx) })),
          materials,
          services,
        );
        const totals = computeTotals(lines);
        return (
          <Card>
            <Text style={ui.title}>{item.name}</Text>
            {lines.map(l => (
              <Text key={l.id} style={ui.subtitle}>
                • {formatNumber(l.quantity)} {l.unit || 'x'} {l.name}
              </Text>
            ))}
            <ValueRow
              label="Custo atual"
              value={formatMoney(totals.totalCost)}
            />
            <ValueRow
              label="Preço sugerido"
              value={formatMoney(totals.finalPrice)}
              strong
            />
            <View style={ui.row}>
              <AppButton
                style={ui.flex}
                variant="danger"
                title="Excluir"
                onPress={() => remove(item)}
              />
              <AppButton
                style={ui.flex}
                title="Usar"
                onPress={() => use(item)}
              />
            </View>
          </Card>
        );
      }}
    />
  );
}
