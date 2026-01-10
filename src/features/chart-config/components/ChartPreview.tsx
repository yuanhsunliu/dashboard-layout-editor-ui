import { useMemo } from 'react';
import { ChartRenderer } from '@/components/chart';
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

export function ChartPreview({
  chartType,
  dataSource,
  xAxisField,
  yAxisFields,
  title,
  pluginConfig,
}: ChartPreviewProps) {
  const isKpiCard = chartType === 'kpi-card';
  const isKpiCardDynamic = chartType === 'kpi-card-dynamic';
  const isAiComment = chartType === 'ai-comment';
  const isComplete = isKpiCard 
    ? true
    : isKpiCardDynamic
      ? true
      : isAiComment
        ? true
        : dataSource && xAxisField && yAxisFields.length > 0;

  const previewConfig: ChartConfig | undefined = useMemo(() => {
    if (isKpiCard) {
      const valueNum = pluginConfig?.value !== undefined ? Number(pluginConfig.value) : undefined;
      const compareNum = pluginConfig?.compareValue !== undefined ? Number(pluginConfig.compareValue) : undefined;
      return {
        chartType: 'kpi-card',
        title: title || 'KPI',
        value: valueNum as number,
        compareValue: compareNum,
        fontSize: (pluginConfig?.fontSize as 'sm' | 'md' | 'lg') || 'md',
        format: (pluginConfig?.format as Record<string, unknown>) || {},
      } as ChartConfig;
    }

    if (isKpiCardDynamic) {
      return {
        chartType: 'kpi-card-dynamic',
        title: title || 'KPI',
        dataSourceId: dataSource?.id || '',
        valueField: (pluginConfig?.valueField as string) || '',
        showTrend: (pluginConfig?.showTrend as boolean) || false,
        fontSize: (pluginConfig?.fontSize as 'sm' | 'md' | 'lg') || 'md',
        format: (pluginConfig?.format as Record<string, unknown>) || {},
      } as ChartConfig;
    }

    if (isAiComment) {
      return {
        chartType: 'ai-comment',
        title: title || 'AI 洞察',
        targetWidgetId: (pluginConfig?.targetWidgetId as string) || '',
      } as ChartConfig;
    }

    if (!isComplete || !dataSource) return undefined;

    const baseConfig = {
      chartType,
      title: title || '預覽',
      dataSourceId: dataSource.id,
      xAxisField,
      yAxisFields,
    };

    return baseConfig as ChartConfig;
  }, [chartType, dataSource, xAxisField, yAxisFields, title, isComplete, isKpiCard, isKpiCardDynamic, isAiComment, pluginConfig]);

  const previewData = useMemo(() => {
    if (isKpiCard || isAiComment) {
      return undefined;
    }
    if (isKpiCardDynamic && dataSource) {
      return { rows: dataSource.demoData.rows };
    }
    if (!dataSource || !xAxisField || yAxisFields.length === 0) return undefined;

    const { rows } = dataSource.demoData;
    const xAxis = rows.map(row => String(row[xAxisField] ?? ''));
    const series = yAxisFields.map(field => {
      const fieldDef = dataSource.fields.find(f => f.name === field);
      return {
        name: fieldDef?.label ?? field,
        data: rows.map(row => Number(row[field]) || 0),
      };
    });

    return { xAxis, series };
  }, [dataSource, xAxisField, yAxisFields, isKpiCard, isKpiCardDynamic, isAiComment]);

  if (!isComplete && !isKpiCard && !isKpiCardDynamic && !isAiComment) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">預覽</p>
        <div 
          className="border rounded-md h-48 flex items-center justify-center text-muted-foreground"
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
        className={`border rounded-md overflow-hidden ${isKpiCard || isKpiCardDynamic || isAiComment ? 'h-40' : 'h-48'}`}
        data-testid="chart-preview"
      >
        <ChartRenderer config={previewConfig!} previewData={previewData} />
      </div>
    </div>
  );
}
