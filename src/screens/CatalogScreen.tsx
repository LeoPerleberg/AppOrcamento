import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import {
  AppButton,
  Card,
  Field,
  Segmented,
  colors,
  styles as ui,
} from '../components/ui';
import { useAppStore } from '../store/AppStore';
import type { ItemType } from '../types';
import { formatMoney, parseNumber } from '../utils/format';

interface Row {
  id: string;
  name: string;
  unit?: string;
  unitCost: number;
}

const emptyForm = { name: '', unit: '', cost: '' };

export default function CatalogScreen() {
  const { materials, services, saveMaterial, saveService, removeCatalogItem } =
    useAppStore();
  const [tab, setTab] = useState<ItemType>('material');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const isMaterial = tab === 'material';
  const data: Row[] = isMaterial ? materials : services;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const changeTab = (t: ItemType) => {
    setTab(t);
    resetForm();
  };

  const save = () => {
    const name = form.name.trim();
    const unitCost = parseNumber(form.cost);
    if (!name || form.cost.trim() === '' || unitCost < 0) {
      Alert.alert('Dados inválidos', 'Informe o nome e um custo válido.');
      return;
    }
    const duplicate = data.some(
      r => r.id !== editingId && r.name.toLowerCase() === name.toLowerCase(),
    );
    if (duplicate) {
      Alert.alert('Item duplicado', `Já existe um item chamado "${name}".`);
      return;
    }
    if (isMaterial) {
      saveMaterial(
        { name, unit: form.unit.trim() || 'un', unitCost },
        editingId ?? undefined,
      );
    } else {
      saveService({ name, unitCost }, editingId ?? undefined);
    }
    resetForm();
  };

  const edit = (r: Row) => {
    setEditingId(r.id);
    setForm({
      name: r.name,
      unit: r.unit ?? '',
      cost: String(r.unitCost).replace('.', ','),
    });
  };

  const remove = (r: Row) =>
    Alert.alert('Excluir', `Excluir "${r.name}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          const inUse = removeCatalogItem(tab, r.id);
          if (inUse) {
            Alert.alert(
              'Item em uso',
              inUse === 'pricing'
                ? 'Remova este item da precificação atual antes de excluí-lo.'
                : 'Este item faz parte de um modelo. Exclua o modelo ou atualize-o antes de excluir o item.',
            );
          } else if (editingId === r.id) {
            resetForm();
          }
        },
      },
    ]);

  const header = (
    <View style={ui.listHeader}>
      <Segmented
        options={[
          { value: 'material', label: `Materiais (${materials.length})` },
          { value: 'service', label: `Serviços (${services.length})` },
        ]}
        value={tab}
        onChange={changeTab}
      />
      <Card>
        <Text style={ui.title}>
          {editingId ? 'Editar' : 'Novo'} {isMaterial ? 'material' : 'serviço'}
        </Text>
        <Field
          label="Nome"
          value={form.name}
          onChangeText={name => setForm(f => ({ ...f, name }))}
        />
        <View style={ui.row}>
          {isMaterial ? (
            <Field
              style={ui.flex}
              label="Unidade"
              placeholder="un, folha..."
              value={form.unit}
              onChangeText={unit => setForm(f => ({ ...f, unit }))}
            />
          ) : null}
          <Field
            style={ui.flex}
            label="Custo unitário (R$)"
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={form.cost}
            onChangeText={cost => setForm(f => ({ ...f, cost }))}
          />
        </View>
        <View style={ui.row}>
          {editingId ? (
            <AppButton
              style={ui.flex}
              variant="outline"
              title="Cancelar"
              onPress={resetForm}
            />
          ) : null}
          <AppButton
            style={ui.flex}
            title={editingId ? 'Salvar alterações' : 'Adicionar'}
            onPress={save}
          />
        </View>
      </Card>
    </View>
  );

  return (
    <FlatList
      style={ui.screen}
      contentContainerStyle={ui.content}
      data={data}
      keyExtractor={r => r.id}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={header}
      ListEmptyComponent={<Text style={ui.empty}>Nenhum item cadastrado.</Text>}
      renderItem={({ item }) => (
        <Card
          style={[
            ui.rowCenter,
            item.id === editingId && { borderColor: colors.primary },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Editar item"
            style={ui.flex}
            onPress={() => edit(item)}
          >
            <Text style={ui.text}>{item.name}</Text>
            <Text style={ui.subtitle}>
              {formatMoney(item.unitCost)}
              {item.unit ? ` / ${item.unit}` : ''}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Excluir ${item.name}`}
            hitSlop={10}
            onPress={() => remove(item)}
          >
            <Text style={ui.dangerLink}>Excluir</Text>
          </Pressable>
        </Card>
      )}
    />
  );
}
