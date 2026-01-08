export type ChartType = 'line' | 'bar' | 'area' | 'embed';

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

export type ChartConfig = LineChartConfig | BarChartConfig | EmbedConfig;
