import type { ChartConfig } from '@/types/chart';
import type { DemoData } from './demoData';
import type { DataSourceField } from '@/features/chart-config/types';
import type { DashboardFilter, ChartInteractionEvent } from '@/types/filter';
import { chartRegistry, ChartErrorBoundary } from '@/features/chart-plugins';
import { AlertTriangle } from 'lucide-react';

interface ChartRendererProps {
  config: ChartConfig;
  previewData?: DemoData;
  fields?: DataSourceField[];
  filters?: DashboardFilter[];
  widgetId?: string;
  onInteraction?: (event: ChartInteractionEvent) => void;
}

export function ChartRenderer({ 
  config, 
  previewData,
  fields,
  filters,
  widgetId,
  onInteraction,
}: ChartRendererProps) {
  const plugin = chartRegistry.getByType(config.chartType);

  if (!plugin) {
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2"
        data-testid="chart-error-unknown-type"
      >
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="text-sm">未知的圖表類型: {config.chartType}</p>
      </div>
    );
  }

  const Renderer = plugin.Renderer;

  return (
    <ChartErrorBoundary>
      <Renderer 
        config={config} 
        data={previewData}
        fields={fields}
        filters={filters}
        widgetId={widgetId}
        onInteraction={onInteraction}
      />
    </ChartErrorBoundary>
  );
}
