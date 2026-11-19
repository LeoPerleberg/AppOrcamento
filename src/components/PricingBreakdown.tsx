import { Text, View } from 'react-native';
import { Card, ValueRow, styles as ui } from './ui';
import type { ComputedLine, PricingTotals } from '../types';
import { formatMoney, formatNumber } from '../utils/format';

/** Tabela de itens + totais, compartilhada entre o resumo e as aprovadas. */
export default function PricingBreakdown({
  productName,
  lines,
  totals,
  header,
}: {
  productName: string;
  lines: ComputedLine[];
  totals: PricingTotals;
  header?: string;
}) {
  return (
    <>
      <Card>
        {header ? <Text style={ui.subtitle}>{header}</Text> : null}
        <Text style={ui.title}>{productName || 'Produto sem nome'}</Text>
      </Card>

      <Card>
        <Text style={ui.title}>Itens</Text>
        {lines.length === 0 ? (
          <Text style={ui.subtitle}>Nenhum item válido.</Text>
        ) : null}
        {lines.map((l, i) => (
          <View key={l.id} style={[ui.lineItem, i > 0 && ui.lineDivider]}>
            <Text style={[ui.text, ui.bold]}>
              {l.name}{' '}
              <Text style={ui.subtitle}>
                ({l.type === 'material' ? 'Material' : 'Serviço'})
              </Text>
            </Text>
            <Text style={ui.subtitle}>
              {formatNumber(l.quantity)}
              {l.unit ? ` ${l.unit}` : ''} × {formatMoney(l.unitCost)} ={' '}
              {formatMoney(l.totalCost)} · margem {formatNumber(l.margin)}%
            </Text>
            <ValueRow label="Preço final" value={formatMoney(l.finalPrice)} />
          </View>
        ))}
      </Card>

      <Card>
        <Text style={ui.title}>Resumo</Text>
        <ValueRow label="Custo total" value={formatMoney(totals.totalCost)} />
        <ValueRow label="Lucro" value={formatMoney(totals.profit)} />
        <ValueRow
          label="Preço total cobrado"
          value={formatMoney(totals.finalPrice)}
          strong
        />
      </Card>
    </>
  );
}
