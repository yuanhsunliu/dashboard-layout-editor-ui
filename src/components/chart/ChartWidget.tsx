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

    const filteredSeries = dataSource.demoData.series.filter(s =>
      chartConfig.yAxisFields.some(field => {
        const fieldDef = dataSource.fields.find(f => f.name === field);
        return fieldDef && s.name === fieldDef.label;
      })
    );

    return {
      xAxis: dataSource.demoData.xAxis,
      series: filteredSeries.length > 0 
        ? filteredSeries 
        : dataSource.demoData.series.slice(0, chartConfig.yAxisFields.length),
    };
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
