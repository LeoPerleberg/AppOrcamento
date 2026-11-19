import type {
  ComputedLine,
  Material,
  PricingItem,
  PricingTotals,
  Service,
} from '../types';
import { parseNumber } from './format';

/**
 * Mesma lógica da aba "Precificação" da planilha:
 * custo unitário = PROCV no cadastro (0 se não encontrado)
 * custo total    = quantidade × custo unitário
 * preço final    = custo total × (1 + margem / 100)
 */
export function computeLine(
  item: PricingItem,
  materials: Material[],
  services: Service[],
): ComputedLine {
  const quantity = parseNumber(item.quantity);
  const margin = parseNumber(item.margin);
  let name = '';
  let unit = '';
  let unitCost = 0;

  if (item.type === 'material') {
    const m = materials.find(x => x.id === item.refId);
    if (m) {
      name = m.name;
      unit = m.unit;
      unitCost = m.unitCost;
    }
  } else {
    const s = services.find(x => x.id === item.refId);
    if (s) {
      name = s.name;
      unitCost = s.unitCost;
    }
  }

  const totalCost = quantity * unitCost;
  return {
    id: item.id,
    type: item.type,
    name,
    unit,
    quantity,
    unitCost,
    totalCost,
    margin,
    finalPrice: totalCost * (1 + margin / 100),
  };
}

/** Linhas válidas (item selecionado e quantidade > 0), como no resumo da planilha. */
export function computeLines(
  items: PricingItem[],
  materials: Material[],
  services: Service[],
): ComputedLine[] {
  return items
    .map(i => computeLine(i, materials, services))
    .filter(l => l.name !== '' && l.quantity > 0);
}

export function computeTotals(lines: ComputedLine[]): PricingTotals {
  const totalCost = lines.reduce((s, l) => s + l.totalCost, 0);
  const finalPrice = lines.reduce((s, l) => s + l.finalPrice, 0);
  return { totalCost, finalPrice, profit: finalPrice - totalCost };
}
