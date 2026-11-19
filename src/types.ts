export type ItemType = 'material' | 'service';

export interface Material {
  id: string;
  name: string;
  unit: string;
  unitCost: number;
}

export interface Service {
  id: string;
  name: string;
  unitCost: number;
}

/** Linha editável da precificação; quantidade e margem ficam como texto digitado. */
export interface PricingItem {
  id: string;
  type: ItemType;
  refId: string | null;
  quantity: string;
  margin: string;
}

/** Projeto pré-cadastrado: referencia o cadastro, então usa sempre os custos atuais. */
export interface ProjectTemplate {
  id: string;
  name: string;
  items: Omit<PricingItem, 'id'>[];
}

export interface Pricing {
  productName: string;
  items: PricingItem[];
}

/** Linha calculada, com valores copiados do cadastro (usada no resumo e nas aprovadas). */
export interface ComputedLine {
  id: string;
  type: ItemType;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  margin: number;
  finalPrice: number;
}

export interface PricingTotals {
  totalCost: number;
  finalPrice: number;
  profit: number;
}

export interface ApprovedPricing {
  id: string;
  productName: string;
  approvedAt: string;
  lines: ComputedLine[];
  totals: PricingTotals;
}
