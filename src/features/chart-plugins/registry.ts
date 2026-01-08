import type { ChartPlugin, BaseChartConfig } from './types';
import { LineChartPlugin } from './plugins/line';
import { BarChartPlugin } from './plugins/bar';
import { AreaChartPlugin } from './plugins/area';
import { EmbedPlugin } from './plugins/embed';

const plugins: ChartPlugin<BaseChartConfig>[] = [
  LineChartPlugin,
  BarChartPlugin,
  AreaChartPlugin,
  EmbedPlugin,
];

export const chartRegistry = {
  getAll: () => plugins,
  getByType: (type: string) => plugins.find(p => p.type === type),
  getTypes: () => plugins.map(p => p.type),
};
