import { useMemo } from 'react';
import { ChartRenderer } from '@/components/chart';
import { chartRegistry } from '@/features/chart-plugins';
import type { ChartConfig, ChartType } from '@/types/chart';
import type { DataSource } from '../types';

interface ChartPreviewProps {
  chartType: ChartType;
  dataSource: DataSource | undefined;
  xAxisField: string;
  yAxisFields: string[];
  title?: string;
  pluginConfig?: Record<string, unknown>;
}

const PREVIEW_HEIGHT_MAP = {
  sm: 'h-40',
  md: 'h-48',
  lg: 'h-64',
} as const;

export function ChartPreview({
  chartType,
  dataSource,
  xAxisField,
  yAxisFields,
  title,
  pluginConfig = {},
}: ChartPreviewProps) {
  const currentPlugin = useMemo(
    () => chartRegistry.getByType(chartType),
    [chartType]
  );

  const configBehavior = currentPlugin?.configBehavior;

  const isComplete = useMemo(() => {
    if (!configBehavior) return false;
    return configBehavior.isPreviewReady({ pluginConfig, dataSource });
  }, [configBehavior, pluginConfig, dataSource]);

  const previewHeight = configBehavior?.previewHeight || 'md';
  const heightClass = PREVIEW_HEIGHT_MAP[previewHeight];

  const previewConfig: ChartConfig | undefined = useMemo(() => {
    if (chartType === 'kpi-card') {
      const valueNum = pluginConfig?.value !== undefined ? Number(pluginConfig.value) : undefined;
      const compareNum = pluginConfig?.compareValue !== undefined ? Number(pluginConfig.compareValue) : undefined;
      return {
        chartType: 'kpi-card',
        title: title || 'KPI',
        value: valueNum as number,
        compareValue: compareNum,
        fontSize: (pluginConfig?.fontSize as 'sm' | 'md' | 'lg') || 'md',
        format: (pluginConfig?.format as Record<string, unknown>) || {},
        conditionalColor: pluginConfig?.conditionalColor,
      } as ChartConfig;
    }

    if (chartType === 'kpi-card-dynamic') {
      return {
        chartType: 'kpi-card-dynamic',
        title: title || 'KPI',
        dataSourceId: dataSource?.id || '',
        valueField: (pluginConfig?.valueField as string) || '',
        showTrend: (pluginConfig?.showTrend as boolean) || false,
        fontSize: (pluginConfig?.fontSize as 'sm' | 'md' | 'lg') || 'md',
        format: (pluginConfig?.format as Record<string, unknown>) || {},
        conditionalColor: pluginConfig?.conditionalColor,
      } as ChartConfig;
    }

    if (chartType === 'ai-comment') {
      return {
        chartType: 'ai-comment',
        title: title || 'AI 洞察',
        targetWidgetId: (pluginConfig?.targetWidgetId as string) || '',
      } as ChartConfig;
    }

    if (chartType === 'tool-timeline' && dataSource) {
      return {
        chartType: 'tool-timeline',
        title: title || '機台時間軸',
        dataSourceId: dataSource.id,
        toolIdField: (pluginConfig?.toolIdField as string) || '',
        startTimeField: (pluginConfig?.startTimeField as string) || '',
        endTimeField: (pluginConfig?.endTimeField as string) || '',
        statusField: (pluginConfig?.statusField as string) || '',
        statusColors: (pluginConfig?.statusColors as Array<{ status: string; color: string; label: string }>) || [],
        kpiFields: (pluginConfig?.kpiFields as Array<{ field: string; label: string; format?: 'percent' | 'number' }>) || [],
        tooltip: (pluginConfig?.tooltip as { enabled: boolean }) || { enabled: true },
      } as ChartConfig;
    }

    if (!isComplete || !dataSource) return undefined;

    const baseConfig = {
      chartType,
      title: title || '預覽',
      dataSourceId: dataSource.id,
      xAxisField,
      yAxisFields,
      ...pluginConfig,
    };

    return baseConfig as ChartConfig;
  }, [chartType, dataSource, xAxisField, yAxisFields, title, isComplete, pluginConfig]);

  const previewData = useMemo(() => {
    if (chartType === 'kpi-card' || chartType === 'ai-comment') {
      return undefined;
    }
    if (chartType === 'kpi-card-dynamic' && dataSource) {
      return { rows: dataSource.demoData.rows };
    }
    if (chartType === 'tool-timeline' && dataSource) {
      return { rows: dataSource.demoData.rows };
    }
    
    const enableDualYAxis = pluginConfig?.enableDualYAxis as boolean;
    const leftYAxisFields = (pluginConfig?.leftYAxisFields as string[]) || [];
    const rightYAxisFields = (pluginConfig?.rightYAxisFields as string[]) || [];
    const enableHierarchicalXAxis = pluginConfig?.enableHierarchicalXAxis as boolean;
    
    if (enableHierarchicalXAxis && dataSource) {
      return { rawData: dataSource.demoData.rows };
    }
    
    const effectiveYAxisFields = enableDualYAxis 
      ? [...leftYAxisFields, ...rightYAxisFields]
      : yAxisFields;
    
    if (!dataSource || !xAxisField || effectiveYAxisFields.length === 0) return undefined;

    const { rows } = dataSource.demoData;
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
  }, [dataSource, xAxisField, yAxisFields, chartType, pluginConfig]);

  if (!isComplete) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">預覽</p>
        <div 
          className={`border rounded-md ${heightClass} flex items-center justify-center text-muted-foreground`}
          data-testid="chart-preview-empty"
        >
          <p className="text-sm">請完成所有設定以預覽圖表</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">預覽</p>
      <div 
        className={`border rounded-md overflow-hidden ${heightClass}`}
        data-testid="chart-preview"
      >
        <ChartRenderer 
          config={previewConfig!} 
          previewData={previewData} 
          fields={dataSource?.fields}
        />
      </div>
    </div>
  );
}
