export interface DashboardFilter {
  id: string;
  field: string;
  operator: 'eq' | 'in' | 'range';
  value: string | string[];
  sourceWidgetId: string;
  timestamp: number;
}

export interface ChartInteractionEvent {
  type: 'click' | 'brush' | 'drilldown';
  field: string;
  value: string;
  widgetId: string;
}
