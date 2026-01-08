import { useMemo } from 'react';
import type { ChartConfig } from '@/types/chart';
import { ChartRenderer } from './ChartRenderer';
import { ChartEmpty } from './ChartEmpty';
import { getDataSourceById } from '@/features/chart-config/services/mockDataSources';

interface ChartWidgetProps {
  chartConfig?: ChartConfig;
  onConfigClick?: () => void;
}

export function ChartWidget({ chartConfig, onConfigClick }: ChartWidgetProps) {
  const chartData = useMemo(() => {
    if (!chartConfig) return undefined;
    
    const dataSource = getDataSourceById(chartConfig.dataSourceId);
    if (!dataSource) return undefined;

    const { rows } = dataSource.demoData;
    const xAxis = rows.map(row => String(row[chartConfig.xAxisField] ?? ''));
    const series = chartConfig.yAxisFields.map(field => {
      const fieldDef = dataSource.fields.find(f => f.name === field);
      return {
        name: fieldDef?.label ?? field,
        data: rows.map(row => Number(row[field]) || 0),
      };
    });

    return { xAxis, series };
  }, [chartConfig]);

  if (!chartConfig) {
    return (
      <div className="h-full w-full">
        <ChartEmpty onConfigClick={onConfigClick} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChartRenderer config={chartConfig} previewData={chartData} />
    </div>
  );
}
