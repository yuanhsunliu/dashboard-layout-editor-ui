export type ChartType = 'line' | 'bar' | 'area' | 'embed' | 'kpi-card' | 'kpi-card-dynamic';

export interface BaseChartConfig {
  chartType: ChartType;
  title?: string;
  dataSourceId: string;
}

export interface LineChartConfig extends BaseChartConfig {
  chartType: 'line';
  xAxisField: string;
  yAxisFields: string[];
  smooth?: boolean;
  showArea?: boolean;
}

export interface BarChartConfig extends BaseChartConfig {
  chartType: 'bar';
  xAxisField: string;
  yAxisFields: string[];
  stacked?: boolean;
  horizontal?: boolean;
}

export interface EmbedConfig {
  chartType: 'embed';
  title?: string;
  url: string;
}

export interface KpiCardFormat {
  thousandSeparator?: boolean;
  decimalPlaces?: number;
  isPercentage?: boolean;
  suffix?: string;
}

export interface KpiCardConfig {
  chartType: 'kpi-card';
  title?: string;
  value: number;
  compareValue?: number;
  fontSize?: 'sm' | 'md' | 'lg';
  format?: KpiCardFormat;
}

export interface KpiCardDynamicConfig extends BaseChartConfig {
  chartType: 'kpi-card-dynamic';
  valueField: string;
  showTrend?: boolean;
  fontSize?: 'sm' | 'md' | 'lg';
  format?: KpiCardFormat;
}

export type ChartConfig = LineChartConfig | BarChartConfig | EmbedConfig | KpiCardConfig | KpiCardDynamicConfig;
