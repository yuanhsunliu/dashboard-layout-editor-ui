export type ChartType = 'line' | 'bar' | 'area' | 'embed' | 'kpi-card' | 'kpi-card-dynamic' | 'ai-comment' | 'tool-timeline';

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

export interface AiCommentConfig {
  chartType: 'ai-comment';
  title?: string;
  targetWidgetId: string;
}

export interface ToolTimelineStatusColor {
  status: string;
  color: string;
  label: string;
}

export interface ToolTimelineKpiField {
  field: string;
  label: string;
  format?: 'percent' | 'number';
}

export interface ToolTimelineConfig {
  chartType: 'tool-timeline';
  title?: string;
  dataSourceId: string;
  date?: string;
  toolIdField: string;
  startTimeField: string;
  endTimeField: string;
  statusField: string;
  statusColors: ToolTimelineStatusColor[];
  kpiFields?: ToolTimelineKpiField[];
  tooltip?: {
    enabled: boolean;
    fields?: Array<{
      field: string;
      label: string;
      format?: 'text' | 'time' | 'duration' | 'percent' | 'number';
    }>;
  };
}

export type ChartConfig = LineChartConfig | BarChartConfig | EmbedConfig | KpiCardConfig | KpiCardDynamicConfig | AiCommentConfig | ToolTimelineConfig;
