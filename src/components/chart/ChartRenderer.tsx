import type { ChartConfig } from '@/types/chart';
import type { DemoData } from './demoData';
import { LineChart, BarChart } from './charts';

interface ChartRendererProps {
  config: ChartConfig;
  previewData?: DemoData;
}

export function ChartRenderer({ config, previewData }: ChartRendererProps) {
  switch (config.chartType) {
    case 'line':
      return (
        <LineChart
          title={config.title}
          smooth={config.smooth}
          showArea={config.showArea}
          data={previewData}
        />
      );
    case 'bar':
      return (
        <BarChart
          title={config.title}
          stacked={config.stacked}
          horizontal={config.horizontal}
          data={previewData}
        />
      );
    default:
      return null;
  }
}
