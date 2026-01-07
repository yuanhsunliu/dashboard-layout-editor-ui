import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA } from '@/components/chart/demoData';
import type { ChartRendererProps } from '../../types';
import type { BarChartConfig } from './schema';

export function BarChartRenderer({ 
  config, 
  data 
}: ChartRendererProps<BarChartConfig>) {
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
    const chartData = data || DEMO_DATA.bar;
    const categoryAxis = { type: 'category' as const, data: chartData.xAxis };
    const valueAxis = { type: 'value' as const };

    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      xAxis: config.horizontal ? valueAxis : categoryAxis,
      yAxis: config.horizontal ? categoryAxis : valueAxis,
      series: chartData.series.map((s) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        stack: config.stacked ? 'total' : undefined,
      })),
      grid: { left: 50, right: 20, top: config.title ? 50 : 30, bottom: 30 },
    };
  }, [config.title, config.stacked, config.horizontal, data]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="bar-chart">
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
