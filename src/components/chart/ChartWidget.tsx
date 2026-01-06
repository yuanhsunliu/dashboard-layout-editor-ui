import type { ChartConfig } from '@/types/chart';
import { ChartRenderer } from './ChartRenderer';
import { ChartEmpty } from './ChartEmpty';

interface ChartWidgetProps {
  chartConfig?: ChartConfig;
  onConfigClick?: () => void;
}

export function ChartWidget({ chartConfig, onConfigClick }: ChartWidgetProps) {
  if (!chartConfig) {
    return (
      <div className="h-full w-full">
        <ChartEmpty onConfigClick={onConfigClick} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChartRenderer config={chartConfig} />
    </div>
  );
}
