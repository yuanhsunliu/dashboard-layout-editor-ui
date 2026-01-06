import type { ChartConfig } from './chart';

export interface Dashboard {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  layout: LayoutItem[];
  widgets: Widget[];
  theme: 'light' | 'dark';
}

export interface DashboardListItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Widget {
  id: string;
  chartConfig?: ChartConfig;
}

export interface DashboardStore {
  dashboards: Dashboard[];
}
