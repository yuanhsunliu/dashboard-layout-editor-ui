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
}

export function ChartPreview({
  chartType,
  dataSource,
  xAxisField,
  yAxisFields,
  title,
}: ChartPreviewProps) {
  const isComplete = dataSource && xAxisField && yAxisFields.length > 0;

  const previewConfig: ChartConfig | undefined = useMemo(() => {
    if (!isComplete || !dataSource) return undefined;

    const baseConfig = {
      chartType,
      title: title || '預覽',
      dataSourceId: dataSource.id,
      xAxisField,
      yAxisFields,
    };

    return baseConfig as ChartConfig;
  }, [chartType, dataSource, xAxisField, yAxisFields, title, isComplete]);

  const previewData = useMemo(() => {
    if (!dataSource || !xAxisField || yAxisFields.length === 0) return undefined;

    const filteredSeries = dataSource.demoData.series.filter(s =>
      yAxisFields.some(field => {
        const fieldDef = dataSource.fields.find(f => f.name === field);
        return fieldDef && s.name === fieldDef.label;
      })
    );

    return {
      xAxis: dataSource.demoData.xAxis,
      series: filteredSeries.length > 0 ? filteredSeries : dataSource.demoData.series.slice(0, yAxisFields.length),
    };
  }, [dataSource, xAxisField, yAxisFields]);

  if (!isComplete) {
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
        className="border rounded-md h-48 overflow-hidden"
        data-testid="chart-preview"
      >
        <ChartRenderer config={previewConfig!} previewData={previewData} />
      </div>
    </div>
  );
}
