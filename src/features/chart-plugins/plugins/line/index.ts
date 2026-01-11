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
    getInitialPluginConfig: () => ({ 
      xAxisField: '', 
      yAxisFields: [],
      enableHierarchicalXAxis: false,
      enableDualYAxis: false,
      enableGroupBy: false,
      leftYAxisFields: [],
      rightYAxisFields: [],
      outerXAxisField: '',
      innerXAxisField: '',
      groupByField: '',
    }),
    isPreviewReady: ({ pluginConfig, dataSource }) => {
      if (!dataSource) return false;
      
      if (pluginConfig.enableHierarchicalXAxis) {
        if (!pluginConfig.outerXAxisField || !pluginConfig.innerXAxisField) {
          return false;
        }
      } else {
        if (!pluginConfig.xAxisField) return false;
      }
      
      if (pluginConfig.enableDualYAxis) {
        const leftFields = pluginConfig.leftYAxisFields;
        const rightFields = pluginConfig.rightYAxisFields;
        const totalYFields = 
          (Array.isArray(leftFields) ? leftFields.length : 0) + 
          (Array.isArray(rightFields) ? rightFields.length : 0);
        return totalYFields > 0;
      }
      
      return Array.isArray(pluginConfig.yAxisFields) && pluginConfig.yAxisFields.length > 0;
    },
  },
};

export type { LineChartConfig };
