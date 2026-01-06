import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA, type DemoData } from '../demoData';

interface BarChartProps {
  title?: string;
  stacked?: boolean;
  horizontal?: boolean;
  data?: DemoData;
}

export function BarChart({ title, stacked = false, horizontal = false, data }: BarChartProps) {
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
      title: title ? { text: title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      xAxis: horizontal ? valueAxis : categoryAxis,
      yAxis: horizontal ? categoryAxis : valueAxis,
      series: chartData.series.map((s) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data,
        stack: stacked ? 'total' : undefined,
      })),
      grid: { left: 50, right: 20, top: title ? 50 : 30, bottom: 30 },
    };
  }, [title, stacked, horizontal, data]);

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
