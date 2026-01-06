import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA, type DemoData } from '../demoData';

interface LineChartProps {
  title?: string;
  smooth?: boolean;
  showArea?: boolean;
  data?: DemoData;
}

export function LineChart({ title, smooth = false, showArea = false, data }: LineChartProps) {
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
      title: title ? { text: title, left: 'center', top: 10 } : undefined,
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
        smooth,
        areaStyle: showArea ? {} : undefined,
      })),
      grid: { left: 40, right: 20, top: title ? 50 : 30, bottom: 30 },
    };
  }, [title, smooth, showArea, data]);

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
