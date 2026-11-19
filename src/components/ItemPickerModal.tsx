import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, styles as ui, AppButton } from './ui';

export interface PickerOption {
  id: string;
  label: string;
  detail?: string;
}

/** Lista selecionável com busca, substitui o "menu suspenso" da planilha. */
export default function ItemPickerModal({
  visible,
  title,
  options,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: PickerOption[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const insets = useSafeAreaInsets();
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter(o => o.label.toLowerCase().includes(q)) : options;
  }, [options, search]);

  const close = () => {
    setSearch('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View
        style={[
          ui.screen,
          ui.content,
          { paddingTop: 12 + insets.top, paddingBottom: 12 + insets.bottom },
        ]}
      >
        <Text style={ui.title}>{title}</Text>
        <TextInput
          style={ui.input}
          placeholder="Buscar..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filtered}
          keyExtractor={o => o.id}
          keyboardShouldPersistTaps="handled"
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={
            <Text style={ui.empty}>Nenhum item encontrado.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                ui.pickerOption,
                { opacity: pressed ? 0.5 : 1 },
              ]}
              onPress={() => {
                setSearch('');
                onSelect(item.id);
              }}
            >
              <Text style={ui.text}>{item.label}</Text>
              {item.detail ? (
                <Text style={ui.subtitle}>{item.detail}</Text>
              ) : null}
            </Pressable>
          )}
        />
        <AppButton title="Cancelar" variant="outline" onPress={close} />
      </View>
    </Modal>
  );
}

function Separator() {
  return <View style={ui.separator} />;
}
