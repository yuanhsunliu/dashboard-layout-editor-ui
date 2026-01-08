import type { z } from 'zod';
import type { ComponentType } from 'react';
import type { DemoData } from '@/components/chart/demoData';
import type { DataSourceField } from '@/features/chart-config/types';

export interface BaseChartConfig {
  chartType: string;
  dataSourceId?: string;
}

export interface ChartRendererProps<TConfig extends BaseChartConfig = BaseChartConfig> {
  config: TConfig;
  data?: DemoData;
}

export interface ConfigFieldsProps<TConfig extends BaseChartConfig = BaseChartConfig> {
  value: Partial<TConfig>;
  onChange: (value: Partial<TConfig>) => void;
  fields?: DataSourceField[];
  errors?: Record<string, string>;
}

export interface ChartPlugin<TConfig extends BaseChartConfig = BaseChartConfig> {
  type: string;
  name: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  configSchema: z.ZodSchema<TConfig>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ConfigFields: ComponentType<ConfigFieldsProps<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer: ComponentType<ChartRendererProps<any>>;
}
