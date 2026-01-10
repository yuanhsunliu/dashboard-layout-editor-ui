import { Activity } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { kpiCardConfigSchema, type KpiCardConfig } from './schema';
import { KpiCardRenderer } from './KpiCardRenderer';
import { KpiCardConfigFields } from './ConfigFields';

export const KpiCardPlugin: ChartPlugin<KpiCardConfig> = {
  type: 'kpi-card',
  name: 'KPI 卡片',
  description: '用於顯示單一關鍵績效指標的卡片',
  icon: Activity,
  configSchema: kpiCardConfigSchema,
  ConfigFields: KpiCardConfigFields,
  Renderer: KpiCardRenderer,
  configBehavior: {
    requiresDataSource: false,
    showTitleInput: false,
    previewHeight: 'sm',
    getInitialPluginConfig: () => ({
      value: undefined,
      compareValue: undefined,
      fontSize: 'md',
      format: {},
      conditionalColor: undefined,
    }),
    isPreviewReady: () => true,
  },
};

export type { KpiCardConfig };
