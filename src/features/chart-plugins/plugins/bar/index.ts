import { BarChart3 } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { barChartConfigSchema, type BarChartConfig } from './schema';
import { BarChartRenderer } from './BarChartRenderer';
import { BarChartConfigFields } from './ConfigFields';

export const BarChartPlugin: ChartPlugin<BarChartConfig> = {
  type: 'bar',
  name: '長條圖',
  description: '用於比較類別數據的圖表',
  icon: BarChart3,
  configSchema: barChartConfigSchema,
  ConfigFields: BarChartConfigFields,
  Renderer: BarChartRenderer,
};

export type { BarChartConfig };
