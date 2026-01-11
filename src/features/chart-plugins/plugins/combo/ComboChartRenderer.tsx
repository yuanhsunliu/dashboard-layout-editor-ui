import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ChartRendererProps } from '../../types';
import type { ComboChartConfig } from './schema';

const DEMO_DATA = {
  xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
  leftSeries: [
    { name: '銷售額', data: [320, 420, 350, 480, 390, 520] },
  ],
  rightSeries: [
    { name: '成長率', data: [12, 18, 15, 22, 16, 25] },
  ],
};

export function ComboChartRenderer({ 
  config, 
  data,
}: ChartRendererProps<ComboChartConfig>) {
  const chartRef = useRef<ReactECharts>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      chartRef.current?.getEchartsInstance().resize();
    }, 200);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  const option: EChartsOption = useMemo(() => {
    const leftYAxisFields = config.leftYAxisFields || [];
    const rightYAxisFields = config.rightYAxisFields || [];
    
    let xAxisData: string[] = DEMO_DATA.xAxis;
    let leftSeriesData: { name: string; data: number[] }[] = DEMO_DATA.leftSeries;
    let rightSeriesData: { name: string; data: number[] }[] = DEMO_DATA.rightSeries;

    if (data?.rawData && config.xAxisField) {
      xAxisData = data.rawData.map(row => String(row[config.xAxisField] ?? ''));
      
      leftSeriesData = leftYAxisFields.map(field => ({
        name: field,
        data: data.rawData!.map(row => Number(row[field]) || 0),
      }));
      
      rightSeriesData = rightYAxisFields.map(field => ({
        name: field,
        data: data.rawData!.map(row => Number(row[field]) || 0),
      }));
    }

    const barSeries = leftSeriesData.map(s => ({
      name: s.name,
      type: 'bar' as const,
      yAxisIndex: 0,
      data: s.data,
    }));

    const lineSeries = rightSeriesData.map(s => ({
      name: s.name,
      type: 'line' as const,
      yAxisIndex: 1,
      smooth: config.smooth || false,
      data: s.data,
    }));

    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { 
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: [...leftSeriesData.map(s => s.name), ...rightSeriesData.map(s => s.name)],
        top: config.title ? 35 : 10,
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: [
        {
          type: 'value',
          name: config.leftYAxisLabel || '',
          position: 'left',
        },
        {
          type: 'value',
          name: config.rightYAxisLabel || '',
          position: 'right',
        },
      ],
      series: [...barSeries, ...lineSeries],
      grid: { 
        left: 60, 
        right: 60, 
        top: config.title ? 70 : 50, 
        bottom: 30,
      },
    };
  }, [config, data]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="combo-chart">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        notMerge
      />
    </div>
  );
}
