import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const colors = {
  primary: '#2563eb',
  danger: '#dc2626',
  success: '#16a34a',
  text: '#111827',
  muted: '#6b7280',
  border: '#d1d5db',
  background: '#f3f4f6',
  card: '#ffffff',
};

type ButtonVariant = 'primary' | 'outline' | 'danger' | 'success';

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const outline = variant === 'outline';
  const bg = outline ? 'transparent' : colors[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.7 : 1 },
        outline && styles.buttonOutline,
        style,
      ]}
    >
      <Text style={[styles.buttonText, outline && { color: colors.primary }]}>
        {title}
      </Text>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

/** Rodapé fixo; use `safeBottom` em telas sem barra de abas para não ficar sob a navegação do sistema. */
export function Footer({
  children,
  safeBottom,
  style,
}: {
  children: ReactNode;
  safeBottom?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.footer,
        safeBottom && { paddingBottom: 12 + insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Field({
  label,
  style,
  ...props
}: TextInputProps & { label: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text
              style={[styles.segmentText, active && styles.segmentTextActive]}
            >
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function ValueRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <View style={styles.valueRow}>
      <Text style={[styles.valueLabel, strong && styles.strong]}>{label}</Text>
      <Text style={[styles.valueText, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 12, gap: 12, paddingBottom: 24 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  subtitle: { fontSize: 14, color: colors.muted },
  text: { fontSize: 15, color: colors.text },
  label: { fontSize: 13, color: colors.muted, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  flex: { flex: 1 },
  button: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonOutline: { borderWidth: 1, borderColor: colors.primary },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 6,
    overflow: 'hidden',
  },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.primary, fontWeight: '600' },
  segmentTextActive: { color: '#fff' },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between' },
  valueLabel: { fontSize: 14, color: colors.muted },
  valueText: { fontSize: 14, color: colors.text },
  strong: { fontWeight: 'bold', color: colors.text, fontSize: 16 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 24 },
  rowCenter: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  bold: { fontWeight: '600' },
  dangerLink: { color: colors.danger, fontWeight: '600' },
  separator: { height: 1, backgroundColor: colors.border },
  lineItem: { paddingVertical: 6, gap: 2 },
  lineDivider: { borderTopWidth: 1, borderColor: colors.border },
  listHeader: { gap: 12, marginBottom: 12 },
  pickerOption: { paddingVertical: 12 },
  footer: {
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 12,
    gap: 8,
  },
});
