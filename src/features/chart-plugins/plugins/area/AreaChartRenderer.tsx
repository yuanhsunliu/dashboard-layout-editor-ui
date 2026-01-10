import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA } from '@/components/chart/demoData';
import type { ChartRendererProps } from '../../types';
import type { AreaChartConfig } from './schema';
import { getHighlightOpacity } from '../../utils/filterUtils';

export function AreaChartRenderer({ 
  config, 
  data,
  filters = [],
  widgetId,
  onInteraction,
}: ChartRendererProps<AreaChartConfig>) {
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
    const chartData = data || DEMO_DATA.line;
    const xAxisField = config.xAxisField || 'x';
    const xAxisData = chartData.xAxis || [];
    const seriesData = chartData.series || [];
    
    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
      yAxis: { type: 'value' },
      series: seriesData.map((s) => ({
        name: s.name,
        type: 'line' as const,
        data: s.data.map((value, index) => {
          const xValue = xAxisData[index];
          const opacity = getHighlightOpacity(xValue, xAxisField, filters);
          return {
            value,
            itemStyle: { opacity },
          };
        }),
        smooth: config.smooth,
        areaStyle: {
          opacity: filters.length > 0 && filters.some(f => f.field === xAxisField) ? 0.3 : 0.7,
        },
        stack: config.stacked ? 'total' : undefined,
      })),
      grid: { left: 40, right: 20, top: config.title ? 50 : 30, bottom: 30 },
    };
  }, [config.title, config.smooth, config.stacked, config.xAxisField, data, filters]);

  const onEvents = useMemo(() => ({
    click: handleChartClick,
  }), [handleChartClick]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="area-chart">
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
