import { Clock } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { toolTimelineConfigSchema, type ToolTimelineConfig } from './schema';
import { ToolTimelineRenderer } from './ToolTimelineRenderer';
import { ToolTimelineConfigFields } from './ConfigFields';
import { toolTimelineLocales } from './locales';

export const ToolTimelinePlugin: ChartPlugin<ToolTimelineConfig> = {
  type: 'tool-timeline',
  name: '機台時間軸',
  description: '顯示機台狀態時間軸與 OEE 指標',
  icon: Clock,
  configSchema: toolTimelineConfigSchema,
  ConfigFields: ToolTimelineConfigFields,
  Renderer: ToolTimelineRenderer,
  supportedInteractions: ['click'],
  locales: toolTimelineLocales,
};

export { toolTimelineConfigSchema, type ToolTimelineConfig };
export { DEFAULT_STATUS_COLORS, type StatusColor, type KpiField } from './schema';
