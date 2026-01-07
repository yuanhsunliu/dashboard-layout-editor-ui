import { AreaChart } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { areaChartConfigSchema, type AreaChartConfig } from './schema';
import { AreaChartRenderer } from './AreaChartRenderer';
import { AreaChartConfigFields } from './ConfigFields';

export const AreaChartPlugin: ChartPlugin<AreaChartConfig> = {
  type: 'area',
  name: '面積圖',
  description: '用於顯示數量隨時間變化的趨勢',
  icon: AreaChart,
  configSchema: areaChartConfigSchema,
  ConfigFields: AreaChartConfigFields,
  Renderer: AreaChartRenderer,
};

export type { AreaChartConfig };
