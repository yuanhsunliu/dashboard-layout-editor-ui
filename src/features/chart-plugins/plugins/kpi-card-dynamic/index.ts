import { Activity } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { kpiCardDynamicConfigSchema, type KpiCardDynamicConfig } from './schema';
import { KpiCardDynamicRenderer } from './KpiCardDynamicRenderer';
import { KpiCardDynamicConfigFields } from './ConfigFields';

export const KpiCardDynamicPlugin: ChartPlugin<KpiCardDynamicConfig> = {
  type: 'kpi-card-dynamic',
  name: 'KPI Card (動態)',
  description: '從資料來源取得 KPI 數值',
  icon: Activity,
  configSchema: kpiCardDynamicConfigSchema,
  ConfigFields: KpiCardDynamicConfigFields,
  Renderer: KpiCardDynamicRenderer,
};

export { kpiCardDynamicConfigSchema, type KpiCardDynamicConfig };
