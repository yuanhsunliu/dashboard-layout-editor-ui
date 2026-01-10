import { TrendingUp } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { lineChartConfigSchema, type LineChartConfig } from './schema';
import { LineChartRenderer } from './LineChartRenderer';
import { LineChartConfigFields } from './ConfigFields';

export const LineChartPlugin: ChartPlugin<LineChartConfig> = {
  type: 'line',
  name: '折線圖',
  description: '用於顯示趨勢變化的圖表',
  icon: TrendingUp,
  configSchema: lineChartConfigSchema,
  ConfigFields: LineChartConfigFields,
  Renderer: LineChartRenderer,
  configBehavior: {
    requiresDataSource: true,
    showTitleInput: true,
    previewHeight: 'md',
    getInitialPluginConfig: () => ({ xAxisField: '', yAxisFields: [] }),
    isPreviewReady: ({ pluginConfig, dataSource }) =>
      !!dataSource &&
      !!pluginConfig.xAxisField &&
      Array.isArray(pluginConfig.yAxisFields) &&
      pluginConfig.yAxisFields.length > 0,
  },
};

export type { LineChartConfig };
