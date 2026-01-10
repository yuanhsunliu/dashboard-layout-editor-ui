import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA } from '@/components/chart/demoData';
import type { ChartRendererProps } from '../../types';
import type { BarChartConfig } from './schema';
import { getHighlightOpacity } from '../../utils/filterUtils';

export function BarChartRenderer({ 
  config, 
  data,
  filters = [],
  widgetId,
  onInteraction,
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

  const handleChartClick = useCallback((params: { name?: string; seriesName?: string }) => {
    if (!onInteraction || !widgetId) return;
    
    const clickedValue = params.name;
    if (clickedValue && config.xAxisField) {
      onInteraction({
        type: 'click',
        field: config.xAxisField,
        value: clickedValue,
        widgetId,
      });
    }
  }, [onInteraction, widgetId, config.xAxisField]);

  const option: EChartsOption = useMemo(() => {
    const chartData = data || DEMO_DATA.bar;
    const xAxisField = config.xAxisField || 'x';
    const xAxisData = chartData.xAxis || [];
    const seriesData = chartData.series || [];
    const categoryAxis = { type: 'category' as const, data: xAxisData };
    const valueAxis = { type: 'value' as const };

    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      xAxis: config.horizontal ? valueAxis : categoryAxis,
      yAxis: config.horizontal ? categoryAxis : valueAxis,
      series: seriesData.map((s) => ({
        name: s.name,
        type: 'bar' as const,
        data: s.data.map((value, index) => {
          const xValue = xAxisData[index];
          const opacity = getHighlightOpacity(xValue, xAxisField, filters);
          return {
            value,
            itemStyle: { opacity },
          };
        }),
        stack: config.stacked ? 'total' : undefined,
      })),
      grid: { left: 50, right: 20, top: config.title ? 50 : 30, bottom: 30 },
    };
  }, [config.title, config.stacked, config.horizontal, config.xAxisField, data, filters]);

  const onEvents = useMemo(() => ({
    click: handleChartClick,
  }), [handleChartClick]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="bar-chart">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
        onEvents={onEvents}
        notMerge
      />
    </div>
  );
}
