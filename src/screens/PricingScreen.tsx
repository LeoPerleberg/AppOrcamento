import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  type ScrollViewInstance,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ItemPickerModal from '../components/ItemPickerModal';
import {
  AppButton,
  Card,
  Field,
  Segmented,
  ValueRow,
  colors,
  styles as ui,
} from '../components/ui';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/AppStore';
import type { ItemType, PricingItem } from '../types';
import { formatMoney } from '../utils/format';
import { computeLine, computeLines, computeTotals } from '../utils/pricing';

const typeOptions: { value: ItemType; label: string }[] = [
  { value: 'material', label: 'Material' },
  { value: 'service', label: 'Serviço' },
];

export default function PricingScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    materials,
    services,
    pricing,
    setProductName,
    addPricingItem,
    updatePricingItem,
    removePricingItem,
    resetPricing,
    templates,
    saveTemplateFromPricing,
  } = useAppStore();
  const [pickerItem, setPickerItem] = useState<PricingItem | null>(null);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const scrollToEndOnResize = useRef(false);

  const addItem = (type: ItemType) => {
    scrollToEndOnResize.current = true;
    addPricingItem(type);
  };

  const totals = useMemo(
    () => computeTotals(computeLines(pricing.items, materials, services)),
    [pricing.items, materials, services],
  );

  const pickerOptions = useMemo(() => {
    if (!pickerItem) {
      return [];
    }
    return pickerItem.type === 'material'
      ? materials.map(m => ({
          id: m.id,
          label: m.name,
          detail: `${formatMoney(m.unitCost)} / ${m.unit}`,
        }))
      : services.map(s => ({
          id: s.id,
          label: s.name,
          detail: formatMoney(s.unitCost),
        }));
  }, [pickerItem, materials, services]);

  const confirmClear = () =>
    Alert.alert('Limpar precificação', 'Remover o produto e todos os itens?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Limpar', style: 'destructive', onPress: resetPricing },
    ]);

  const saveAsTemplate = () => {
    const name = pricing.productName.trim();
    if (!name || !pricing.items.some(i => i.refId)) {
      Alert.alert(
        'Salvar como modelo',
        'Informe o nome do produto e selecione ao menos um item.',
      );
      return;
    }
    const existing = templates.find(
      t => t.name.toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      Alert.alert(
        'Modelo existente',
        `Já existe o modelo "${existing.name}". Deseja substituí-lo?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Substituir',
            onPress: () => {
              saveTemplateFromPricing(name, existing.id);
              Alert.alert('Modelo atualizado', `"${name}" foi atualizado.`);
            },
          },
        ],
      );
      return;
    }
    saveTemplateFromPricing(name);
    Alert.alert('Modelo salvo', `"${name}" está disponível na aba Modelos.`);
  };

  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          if (scrollToEndOnResize.current) {
            scrollToEndOnResize.current = false;
            scrollRef.current?.scrollToEnd();
          }
        }}
        contentContainerStyle={ui.content}
        keyboardShouldPersistTaps="handled"
      >
        <Card>
          <Field
            label="Produto"
            placeholder="Ex.: Quadro personalizado"
            value={pricing.productName}
            onChangeText={setProductName}
          />
        </Card>

        {pricing.items.length === 0 ? (
          <Text style={ui.empty}>
            Nenhum item adicionado. Adicione materiais e serviços abaixo.
          </Text>
        ) : null}

        {pricing.items.map((item, index) => {
          const line = computeLine(item, materials, services);
          return (
            <Card key={item.id}>
              <View style={ui.rowCenter}>
                <Text style={[ui.title, ui.flex]}>Item {index + 1}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remover item ${index + 1}`}
                  hitSlop={10}
                  onPress={() => removePricingItem(item.id)}
                >
                  <Text style={ui.dangerLink}>Remover</Text>
                </Pressable>
              </View>

              <Segmented
                options={typeOptions}
                value={item.type}
                onChange={type =>
                  type !== item.type &&
                  updatePricingItem(item.id, { type, refId: null })
                }
              />

              <View>
                <Text style={ui.label}>
                  {item.type === 'material' ? 'Material' : 'Serviço'}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  style={ui.input}
                  onPress={() => setPickerItem(item)}
                >
                  <Text
                    style={[ui.text, !line.name && { color: colors.muted }]}
                  >
                    {line.name || 'Selecionar...'}
                  </Text>
                </Pressable>
              </View>

              <View style={ui.row}>
                <Field
                  style={ui.flex}
                  label={line.unit ? `Quantidade (${line.unit})` : 'Quantidade'}
                  keyboardType="decimal-pad"
                  value={item.quantity}
                  onChangeText={quantity =>
                    updatePricingItem(item.id, { quantity })
                  }
                />
                <Field
                  style={ui.flex}
                  label="Margem de lucro (%)"
                  keyboardType="decimal-pad"
                  value={item.margin}
                  onChangeText={margin =>
                    updatePricingItem(item.id, { margin })
                  }
                />
              </View>

              <ValueRow
                label="Custo unitário"
                value={formatMoney(line.unitCost)}
              />
              <ValueRow
                label="Custo total"
                value={formatMoney(line.totalCost)}
              />
              <ValueRow
                label="Preço final"
                value={formatMoney(line.finalPrice)}
                strong
              />
            </Card>
          );
        })}

        <View style={ui.row}>
          <AppButton
            style={ui.flex}
            variant="outline"
            title="+ Material"
            onPress={() => addItem('material')}
          />
          <AppButton
            style={ui.flex}
            variant="outline"
            title="+ Serviço"
            onPress={() => addItem('service')}
          />
        </View>
        <AppButton
          variant="outline"
          title="Salvar como modelo"
          onPress={saveAsTemplate}
        />
      </ScrollView>

      <View style={ui.footer}>
        <ValueRow label="Custo total" value={formatMoney(totals.totalCost)} />
        <ValueRow
          label="Preço total"
          value={formatMoney(totals.finalPrice)}
          strong
        />
        <View style={ui.row}>
          <AppButton
            style={ui.flex}
            variant="outline"
            title="Limpar"
            onPress={confirmClear}
            disabled={!pricing.productName && pricing.items.length === 0}
          />
          <AppButton
            style={ui.flex}
            title="Ver resumo"
            onPress={() => navigation.navigate('Summary')}
          />
        </View>
      </View>

      <ItemPickerModal
        visible={pickerItem !== null}
        title={
          pickerItem?.type === 'material'
            ? 'Selecionar material'
            : 'Selecionar serviço'
        }
        options={pickerOptions}
        onClose={() => setPickerItem(null)}
        onSelect={refId => {
          if (pickerItem) {
            updatePricingItem(pickerItem.id, { refId });
          }
          setPickerItem(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}
