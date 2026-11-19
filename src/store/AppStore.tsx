import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_MARGIN,
  initialMaterials,
  initialServices,
  initialTemplates,
} from '../data/initialData';
import type {
  ApprovedPricing,
  ItemType,
  Material,
  Pricing,
  PricingItem,
  ProjectTemplate,
  Service,
} from '../types';
import { newId } from '../utils/format';
import { computeLines, computeTotals } from '../utils/pricing';

const emptyPricing = (): Pricing => ({ productName: '', items: [] });

interface AppStore {
  materials: Material[];
  services: Service[];
  pricing: Pricing;
  approved: ApprovedPricing[];

  saveMaterial: (data: Omit<Material, 'id'>, id?: string) => void;
  saveService: (data: Omit<Service, 'id'>, id?: string) => void;
  /** Retorna onde o item está em uso (e não exclui) ou null se excluiu. */
  removeCatalogItem: (
    type: ItemType,
    id: string,
  ) => null | 'pricing' | 'template';

  templates: ProjectTemplate[];
  /** Salva os itens válidos da precificação atual como modelo (substitui se `id` for informado). */
  saveTemplateFromPricing: (name: string, id?: string) => void;
  /** Substitui a precificação atual pelos itens do modelo. */
  applyTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;

  setProductName: (name: string) => void;
  addPricingItem: (type: ItemType) => void;
  updatePricingItem: (id: string, patch: Partial<PricingItem>) => void;
  removePricingItem: (id: string) => void;
  resetPricing: () => void;

  /** Salva uma cópia estática da precificação atual. */
  approvePricing: () => ApprovedPricing;
  removeApproved: (id: string) => void;
}

const AppStoreContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [pricing, setPricing] = useState<Pricing>(emptyPricing);
  const [approved, setApproved] = useState<ApprovedPricing[]>([]);
  const [templates, setTemplates] =
    useState<ProjectTemplate[]>(initialTemplates);

  const saveMaterial = useCallback(
    (data: Omit<Material, 'id'>, id?: string) => {
      setMaterials(list =>
        id
          ? list.map(m => (m.id === id ? { ...data, id } : m))
          : [...list, { ...data, id: newId() }],
      );
    },
    [],
  );

  const saveService = useCallback((data: Omit<Service, 'id'>, id?: string) => {
    setServices(list =>
      id
        ? list.map(s => (s.id === id ? { ...data, id } : s))
        : [...list, { ...data, id: newId() }],
    );
  }, []);

  const removeCatalogItem = useCallback(
    (type: ItemType, id: string) => {
      const uses = (i: { type: ItemType; refId: string | null }) =>
        i.type === type && i.refId === id;
      if (pricing.items.some(uses)) {
        return 'pricing';
      }
      if (templates.some(t => t.items.some(uses))) {
        return 'template';
      }
      if (type === 'material') {
        setMaterials(list => list.filter(m => m.id !== id));
      } else {
        setServices(list => list.filter(s => s.id !== id));
      }
      return null;
    },
    [pricing.items, templates],
  );

  const saveTemplateFromPricing = useCallback(
    (name: string, id?: string) => {
      const items = pricing.items
        .filter(i => i.refId)
        .map(({ id: _id, ...rest }) => rest);
      setTemplates(list =>
        id
          ? list.map(t => (t.id === id ? { id, name, items } : t))
          : [...list, { id: newId(), name, items }],
      );
    },
    [pricing.items],
  );

  const applyTemplate = useCallback(
    (id: string) => {
      const template = templates.find(t => t.id === id);
      if (template) {
        setPricing({
          productName: template.name,
          items: template.items.map(i => ({ ...i, id: newId() })),
        });
      }
    },
    [templates],
  );

  const removeTemplate = useCallback((id: string) => {
    setTemplates(list => list.filter(t => t.id !== id));
  }, []);

  const setProductName = useCallback((productName: string) => {
    setPricing(p => ({ ...p, productName }));
  }, []);

  const addPricingItem = useCallback((type: ItemType) => {
    setPricing(p => ({
      ...p,
      items: [
        ...p.items,
        {
          id: newId(),
          type,
          refId: null,
          quantity: '1',
          margin: DEFAULT_MARGIN,
        },
      ],
    }));
  }, []);

  const updatePricingItem = useCallback(
    (id: string, patch: Partial<PricingItem>) => {
      setPricing(p => ({
        ...p,
        items: p.items.map(i => (i.id === id ? { ...i, ...patch } : i)),
      }));
    },
    [],
  );

  const removePricingItem = useCallback((id: string) => {
    setPricing(p => ({ ...p, items: p.items.filter(i => i.id !== id) }));
  }, []);

  const resetPricing = useCallback(() => setPricing(emptyPricing()), []);

  const approvePricing = useCallback(() => {
    const lines = computeLines(pricing.items, materials, services);
    const record: ApprovedPricing = {
      id: newId(),
      productName: pricing.productName.trim(),
      approvedAt: new Date().toISOString(),
      lines,
      totals: computeTotals(lines),
    };
    setApproved(list => [record, ...list]);
    return record;
  }, [pricing, materials, services]);

  const removeApproved = useCallback((id: string) => {
    setApproved(list => list.filter(a => a.id !== id));
  }, []);

  const value = useMemo<AppStore>(
    () => ({
      materials,
      services,
      pricing,
      approved,
      saveMaterial,
      saveService,
      removeCatalogItem,
      templates,
      saveTemplateFromPricing,
      applyTemplate,
      removeTemplate,
      setProductName,
      addPricingItem,
      updatePricingItem,
      removePricingItem,
      resetPricing,
      approvePricing,
      removeApproved,
    }),
    [
      templates,
      saveTemplateFromPricing,
      applyTemplate,
      removeTemplate,
      materials,
      services,
      pricing,
      approved,
      saveMaterial,
      saveService,
      removeCatalogItem,
      setProductName,
      addPricingItem,
      updatePricingItem,
      removePricingItem,
      resetPricing,
      approvePricing,
      removeApproved,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStore {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error('useAppStore deve ser usado dentro de AppStoreProvider');
  }
  return ctx;
}
