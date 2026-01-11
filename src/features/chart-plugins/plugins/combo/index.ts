import { BarChartBig } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { comboChartConfigSchema, type ComboChartConfig } from './schema';
import { ComboChartRenderer } from './ComboChartRenderer';
import { ComboChartConfigFields } from './ConfigFields';

export const ComboChartPlugin: ChartPlugin<ComboChartConfig> = {
  type: 'combo',
  name: '組合圖',
  description: '左軸 Bar + 右軸 Line，用於比較不同量綱的指標',
  icon: BarChartBig,
  configSchema: comboChartConfigSchema,
  ConfigFields: ComboChartConfigFields,
  Renderer: ComboChartRenderer,
  configBehavior: {
    requiresDataSource: true,
    showTitleInput: true,
    previewHeight: 'md',
    getInitialPluginConfig: () => ({ 
      xAxisField: '', 
      leftYAxisFields: [],
      rightYAxisFields: [],
      leftYAxisLabel: '',
      rightYAxisLabel: '',
      smooth: false,
    }),
    isPreviewReady: ({ pluginConfig, dataSource }) =>
      !!dataSource &&
      !!pluginConfig.xAxisField &&
      Array.isArray(pluginConfig.leftYAxisFields) &&
      pluginConfig.leftYAxisFields.length > 0 &&
      Array.isArray(pluginConfig.rightYAxisFields) &&
      pluginConfig.rightYAxisFields.length > 0,
  },
};

export type { ComboChartConfig };
