import type { ChartConfig } from '@/types/chart';
import { LineChart, BarChart } from './charts';

interface ChartRendererProps {
  config: ChartConfig;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  switch (config.chartType) {
    case 'line':
      return (
        <LineChart
          title={config.title}
          smooth={config.smooth}
          showArea={config.showArea}
        />
      );
    case 'bar':
      return (
        <BarChart
          title={config.title}
          stacked={config.stacked}
          horizontal={config.horizontal}
        />
      );
    default:
      return null;
  }
}
