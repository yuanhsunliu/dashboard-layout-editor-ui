import { useMemo, useCallback } from 'react';
import type { ChartConfig } from '@/types/chart';
import type { ChartInteractionEvent } from '@/types/filter';
import { ChartRenderer } from './ChartRenderer';
import { ChartEmpty } from './ChartEmpty';
import { getDataSourceById } from '@/features/chart-config/services/mockDataSources';
import { useDashboardFilterStore, getConfigFields } from '@/stores/useDashboardFilterStore';

interface ChartWidgetProps {
  chartConfig?: ChartConfig;
  widgetId?: string;
  onConfigClick?: () => void;
}

export function ChartWidget({ chartConfig, widgetId, onConfigClick }: ChartWidgetProps) {
  const { filters, toggleFilterValue } = useDashboardFilterStore();

  const dataSource = useMemo(() => {
    if (!chartConfig) return undefined;
    if (!('dataSourceId' in chartConfig)) return undefined;
    return getDataSourceById(chartConfig.dataSourceId);
  }, [chartConfig]);

  const chartData = useMemo(() => {
    if (!chartConfig) return undefined;
    if (chartConfig.chartType === 'embed') return undefined;
    if (chartConfig.chartType === 'kpi-card') return undefined;
    if (chartConfig.chartType === 'ai-comment') return undefined;
    
    if (!dataSource) return undefined;

    if (chartConfig.chartType === 'kpi-card-dynamic') {
      return { rows: dataSource.demoData.rows };
    }

    const { rows } = dataSource.demoData;
    
    // For line chart with hierarchical X axis, pass rawData
    if (chartConfig.chartType === 'line' && chartConfig.enableHierarchicalXAxis) {
      return { rawData: rows };
    }
    
    const xAxisField = 'xAxisField' in chartConfig ? chartConfig.xAxisField : '';
    const yAxisFields = 'yAxisFields' in chartConfig ? chartConfig.yAxisFields : [];
    
    // Handle dual Y axis for line chart
    let effectiveYAxisFields = yAxisFields;
    if (chartConfig.chartType === 'line' && chartConfig.enableDualYAxis) {
      effectiveYAxisFields = [
        ...(chartConfig.leftYAxisFields || []),
        ...(chartConfig.rightYAxisFields || []),
      ];
    }
    
    const xAxis = rows.map(row => String(row[xAxisField] ?? ''));
    const series = effectiveYAxisFields.map(field => {
      const fieldDef = dataSource.fields.find(f => f.name === field);
      return {
        name: fieldDef?.label ?? field,
        fieldName: field,
        data: rows.map(row => Number(row[field]) || 0),
      };
    });

    return { xAxis, series };
  }, [chartConfig, dataSource]);

  const relevantFilters = useMemo(() => {
    if (!chartConfig) return [];
    const fields = getConfigFields(chartConfig);
    return filters.filter(f => fields.includes(f.field));
  }, [chartConfig, filters]);

  const handleInteraction = useCallback((event: ChartInteractionEvent) => {
    toggleFilterValue(event.field, event.value, event.widgetId);
  }, [toggleFilterValue]);

  if (!chartConfig) {
    return (
      <div className="h-full w-full">
        <ChartEmpty onConfigClick={onConfigClick} />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ChartRenderer 
        config={chartConfig} 
        previewData={chartData}
        fields={dataSource?.fields}
        filters={relevantFilters}
        widgetId={widgetId}
        onInteraction={handleInteraction}
      />
    </div>
  );
}
