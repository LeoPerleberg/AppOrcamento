import { FlatList, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Card, ValueRow, styles as ui } from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import { formatDateTime, formatMoney } from '../utils/format';

export default function ApprovedListScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { approved } = useAppStore();

  return (
    <FlatList
      style={ui.screen}
      contentContainerStyle={ui.content}
      data={approved}
      keyExtractor={a => a.id}
      ListEmptyComponent={
        <Text style={ui.empty}>
          Nenhuma precificação aprovada ainda.{'\n'}Aprove uma na tela de
          resumo.
        </Text>
      }
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('ApprovedDetail', { id: item.id })}
        >
          <Card>
            <Text style={ui.title}>{item.productName}</Text>
            <Text style={ui.subtitle}>
              Aprovada em {formatDateTime(item.approvedAt)} ·{' '}
              {item.lines.length} {item.lines.length === 1 ? 'item' : 'itens'}
            </Text>
            <ValueRow
              label="Custo"
              value={formatMoney(item.totals.totalCost)}
            />
            <ValueRow
              label="Preço cobrado"
              value={formatMoney(item.totals.finalPrice)}
              strong
            />
          </Card>
        </Pressable>
      )}
    />
  );
}
