import type { ChartPlugin, BaseChartConfig } from './types';
import { LineChartPlugin } from './plugins/line';
import { BarChartPlugin } from './plugins/bar';
import { AreaChartPlugin } from './plugins/area';
import { EmbedPlugin } from './plugins/embed';
import { KpiCardPlugin } from './plugins/kpi-card';
import { KpiCardDynamicPlugin } from './plugins/kpi-card-dynamic';
import { AiCommentPlugin } from './plugins/ai-comment';
import { ToolTimelinePlugin } from './plugins/tool-timeline';

const plugins: ChartPlugin<BaseChartConfig>[] = [
  LineChartPlugin,
  BarChartPlugin,
  AreaChartPlugin,
  EmbedPlugin,
  KpiCardPlugin,
  KpiCardDynamicPlugin,
  AiCommentPlugin,
  ToolTimelinePlugin,
];

export const chartRegistry = {
  getAll: () => plugins,
  getByType: (type: string) => plugins.find(p => p.type === type),
  getTypes: () => plugins.map(p => p.type),
};
