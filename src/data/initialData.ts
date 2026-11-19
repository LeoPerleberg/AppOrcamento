import type { Material, ProjectTemplate, Service } from '../types';

// Valores iniciais extraídos de Arquivos/Planilha_Precificacao_MenuSuspenso.ods
export const initialMaterials: Material[] = [
  { id: 'm1', name: 'Papel fotográfico 230g', unit: 'folha', unitCost: 0.35 },
  { id: 'm2', name: 'Papel fotográfico 180g', unit: 'folha', unitCost: 0.25 },
  { id: 'm3', name: 'Papel ofset 240g', unit: 'folha', unitCost: 0.35 },
  { id: 'm4', name: 'Papel adesivo 130g', unit: 'folha', unitCost: 0.5 },
  { id: 'm5', name: 'Fita de cetin n1 (10 cm)', unit: 'un', unitCost: 0.04 },
  { id: 'm6', name: 'Fita de cetin n3 (10 cm)', unit: 'un', unitCost: 0.05 },
  { id: 'm7', name: 'Fita de cetin n5 (10 cm)', unit: 'un', unitCost: 0.07 },
  { id: 'm8', name: 'Laço', unit: 'un', unitCost: 0.25 },
  { id: 'm9', name: 'Saco transparente 25x35', unit: 'un', unitCost: 0.46 },
  { id: 'm10', name: 'Saco transparente 30x45', unit: 'un', unitCost: 0.58 },
  { id: 'm11', name: 'Quadro A4', unit: 'un', unitCost: 8 },
  { id: 'm12', name: 'Quadro A5', unit: 'un', unitCost: 7 },
  { id: 'm13', name: 'Quadro 10x15', unit: 'un', unitCost: 4 },
  { id: 'm14', name: 'Fio de led', unit: 'un', unitCost: 1.35 },
  { id: 'm15', name: 'Chaveiro', unit: 'un', unitCost: 1 },
  { id: 'm16', name: 'Papel comum 75g', unit: 'un', unitCost: 0.1 },
  { id: 'm17', name: 'Plastificação F/V', unit: 'un', unitCost: 1 },
  { id: 'm18', name: 'Adesivo Vinil', unit: 'un', unitCost: 1.26 },
  { id: 'm19', name: 'Caixa de chocolate', unit: 'un', unitCost: 12 },
  { id: 'm20', name: 'Bombom', unit: 'un', unitCost: 0.75 },
  { id: 'm21', name: 'Embalagem coração', unit: 'un', unitCost: 1.5 },
  { id: 'm22', name: 'Máscara de transferência', unit: 'un', unitCost: 4 },
  { id: 'm23', name: 'Papel comum 120g', unit: 'un', unitCost: 0.2 },
];

export const initialServices: Service[] = [
  { id: 's1', name: 'Cola', unitCost: 0.1 },
  { id: 's2', name: 'Corte retos', unitCost: 0.1 },
  { id: 's3', name: 'Corte máquina', unitCost: 0.5 },
  { id: 's4', name: 'Impressão simples', unitCost: 0.5 },
  { id: 's5', name: 'Impressão complexa', unitCost: 1 },
  { id: 's6', name: 'Montagem canva simples', unitCost: 2 },
  { id: 's7', name: 'Montagem canva complexa', unitCost: 5 },
  { id: 's8', name: 'Vinco/dobra', unitCost: 0.15 },
];

export const DEFAULT_MARGIN = '100';

export const initialTemplates: ProjectTemplate[] = [
  {
    id: 't1',
    name: 'Quadro A4 personalizado',
    items: [
      { type: 'material', refId: 'm11', quantity: '1', margin: DEFAULT_MARGIN },
      { type: 'material', refId: 'm1', quantity: '1', margin: DEFAULT_MARGIN },
      { type: 'service', refId: 's5', quantity: '1', margin: DEFAULT_MARGIN },
      { type: 'service', refId: 's6', quantity: '1', margin: DEFAULT_MARGIN },
    ],
  },
];
