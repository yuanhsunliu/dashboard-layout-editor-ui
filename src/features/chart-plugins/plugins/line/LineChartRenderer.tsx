import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA } from '@/components/chart/demoData';
import type { ChartRendererProps } from '../../types';
import type { LineChartConfig } from './schema';

export function LineChartRenderer({ 
  config, 
  data 
}: ChartRendererProps<LineChartConfig>) {
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
    const chartData = data || DEMO_DATA.line;
    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: chartData.xAxis,
      },
      yAxis: { type: 'value' },
      series: chartData.series.map((s) => ({
        name: s.name,
        type: 'line' as const,
        data: s.data,
        smooth: config.smooth,
        areaStyle: config.showArea ? {} : undefined,
      })),
      grid: { left: 40, right: 20, top: config.title ? 50 : 30, bottom: 30 },
    };
  }, [config.title, config.smooth, config.showArea, data]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="line-chart">
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
