import { computeLine, computeLines, computeTotals } from '../src/utils/pricing';
import { formatMoney, parseNumber } from '../src/utils/format';
import { initialMaterials, initialServices } from '../src/data/initialData';
import type { PricingItem } from '../src/types';

const item = (p: Partial<PricingItem>): PricingItem => ({
  id: Math.random().toString(),
  type: 'material',
  refId: null,
  quantity: '1',
  margin: '100',
  ...p,
});

describe('precificação (mesmos valores da planilha)', () => {
  // Linhas de exemplo da aba "Precificação": total R$ 3,15 / R$ 6,30
  const items = [
    item({ type: 'material', refId: 'm3', quantity: '1' }), // Papel ofset 240g
    item({ type: 'service', refId: 's4', quantity: '2' }), // Impressão simples
    item({ type: 'service', refId: 's2', quantity: '4' }), // Corte retos
    item({ type: 'service', refId: 's1', quantity: '2' }), // Cola
    item({ type: 'service', refId: 's8', quantity: '8' }), // Vinco/dobra
  ];

  it('calcula custo total e preço final por linha', () => {
    const line = computeLine(items[4], initialMaterials, initialServices);
    expect(line.unitCost).toBe(0.15);
    expect(line.totalCost).toBeCloseTo(1.2);
    expect(line.finalPrice).toBeCloseTo(2.4);
  });

  it('calcula os totais do resumo', () => {
    const totals = computeTotals(
      computeLines(items, initialMaterials, initialServices),
    );
    expect(totals.totalCost).toBeCloseTo(3.15);
    expect(totals.finalPrice).toBeCloseTo(6.3);
    expect(totals.profit).toBeCloseTo(3.15);
  });

  it('ignora linhas sem item ou com quantidade zero', () => {
    const lines = computeLines(
      [item({ refId: null }), item({ refId: 'm1', quantity: '0' })],
      initialMaterials,
      initialServices,
    );
    expect(lines).toHaveLength(0);
  });

  it('aplica margem diferente por linha', () => {
    const line = computeLine(
      item({ refId: 'm11', quantity: '2', margin: '50' }),
      initialMaterials,
      initialServices,
    );
    expect(line.totalCost).toBe(16);
    expect(line.finalPrice).toBe(24);
  });
});

describe('formatação', () => {
  it('converte números com vírgula', () => {
    expect(parseNumber('1,5')).toBe(1.5);
    expect(parseNumber('1.000,50')).toBe(1000.5);
    expect(parseNumber('abc')).toBe(0);
  });

  it('formata moeda em real', () => {
    expect(formatMoney(6.3)).toBe('R$ 6,30');
    expect(formatMoney(1234.5)).toBe('R$ 1.234,50');
  });
});
