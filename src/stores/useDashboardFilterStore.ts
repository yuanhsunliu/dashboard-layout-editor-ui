import { create } from 'zustand';
import type { DashboardFilter } from '@/types/filter';
import type { ChartConfig } from '@/types/chart';

interface DashboardFilterState {
  filters: DashboardFilter[];
  
  toggleFilterValue: (field: string, value: string, sourceWidgetId: string) => void;
  removeFilter: (filterId: string) => void;
  removeFiltersAfter: (filterId: string) => void;
  clearAllFilters: () => void;
  
  getFiltersForField: (field: string) => DashboardFilter | undefined;
  isValueSelected: (field: string, value: string) => boolean;
  getAffectedFilters: (config: ChartConfig | undefined) => DashboardFilter[];
}

function generateFilterId(): string {
  return `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getConfigFields(config: ChartConfig | undefined): string[] {
  if (!config) return [];
  
  switch (config.chartType) {
    case 'line':
    case 'bar':
      return [config.xAxisField, ...config.yAxisFields];
    case 'embed':
      return [];
    default:
      return [];
  }
}

export const useDashboardFilterStore = create<DashboardFilterState>((set, get) => ({
  filters: [],

  toggleFilterValue: (field: string, value: string, sourceWidgetId: string) => {
    const { filters } = get();
    const existingFilter = filters.find(f => f.field === field);

    if (existingFilter) {
      const currentValues: string[] = Array.isArray(existingFilter.value) 
        ? existingFilter.value 
        : [existingFilter.value];
      
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex >= 0) {
        const newValues = currentValues.filter((_, i) => i !== valueIndex);
        if (newValues.length === 0) {
          set({ filters: filters.filter(f => f.id !== existingFilter.id) });
        } else {
          const newValue: string | string[] = newValues.length === 1 ? newValues[0] : newValues;
          set({
            filters: filters.map(f =>
              f.id === existingFilter.id
                ? { ...f, value: newValue, timestamp: Date.now() }
                : f
            ),
          });
        }
      } else {
        const newValues: string[] = [...currentValues, value];
        set({
          filters: filters.map(f =>
            f.id === existingFilter.id
              ? { ...f, value: newValues, operator: 'in' as const, timestamp: Date.now() }
              : f
          ),
        });
      }
    } else {
      const newFilter: DashboardFilter = {
        id: generateFilterId(),
        field,
        operator: 'eq',
        value,
        sourceWidgetId,
        timestamp: Date.now(),
      };
      set({ filters: [...filters, newFilter] });
    }
  },

  removeFilter: (filterId: string) => {
    set({ filters: get().filters.filter(f => f.id !== filterId) });
  },

  removeFiltersAfter: (filterId: string) => {
    const { filters } = get();
    const filterIndex = filters.findIndex(f => f.id === filterId);
    if (filterIndex >= 0) {
      set({ filters: filters.slice(0, filterIndex) });
    }
  },

  clearAllFilters: () => {
    set({ filters: [] });
  },

  getFiltersForField: (field: string) => {
    return get().filters.find(f => f.field === field);
  },

  isValueSelected: (field: string, value: string) => {
    const filter = get().filters.find(f => f.field === field);
    if (!filter) return false;
    
    if (Array.isArray(filter.value)) {
      return filter.value.includes(value);
    }
    return filter.value === value;
  },

  getAffectedFilters: (config: ChartConfig | undefined) => {
    if (!config) return [];
    const fields = getConfigFields(config);
    return get().filters.filter(f => fields.includes(f.field));
  },
}));

export { getConfigFields };

if (typeof window !== 'undefined') {
  (window as unknown as { __DASHBOARD_FILTER_STORE__: typeof useDashboardFilterStore }).__DASHBOARD_FILTER_STORE__ = useDashboardFilterStore;
}
