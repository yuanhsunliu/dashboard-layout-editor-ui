import type { DashboardFilter } from '@/types/filter';

export function isValueHighlighted(
  value: string,
  field: string,
  filters: DashboardFilter[]
): boolean {
  const filter = filters.find(f => f.field === field);
  if (!filter) return true;
  
  if (Array.isArray(filter.value)) {
    return filter.value.includes(value);
  }
  return filter.value === value;
}

export function getHighlightOpacity(
  value: string,
  field: string,
  filters: DashboardFilter[]
): number {
  if (filters.length === 0) return 1;
  
  const hasRelevantFilter = filters.some(f => f.field === field);
  if (!hasRelevantFilter) return 1;
  
  return isValueHighlighted(value, field, filters) ? 1 : 0.2;
}

export function getSeriesHighlightStyle(
  seriesName: string,
  xAxisField: string,
  filters: DashboardFilter[]
) {
  const opacity = getHighlightOpacity(seriesName, xAxisField, filters);
  return {
    opacity,
    emphasis: {
      opacity: 1,
    },
  };
}

export function formatFilterDisplay(filter: DashboardFilter): string {
  const values = Array.isArray(filter.value) ? filter.value : [filter.value];
  if (values.length === 1) {
    return `${filter.field} = ${values[0]}`;
  }
  if (values.length <= 2) {
    return `${filter.field} = ${values.join(', ')}`;
  }
  return `${filter.field} = ${values[0]} +${values.length - 1}`;
}

export function formatBadgeDisplay(filter: DashboardFilter): string {
  const values = Array.isArray(filter.value) ? filter.value : [filter.value];
  if (values.length === 1) {
    return String(values[0]);
  }
  if (values.length === 2) {
    return values.join(', ');
  }
  return `${values[0]} +${values.length - 1}`;
}
