import { useRef, useEffect, useCallback, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { DEMO_DATA } from '@/components/chart/demoData';
import type { ChartRendererProps } from '../../types';
import type { LineChartConfig } from './schema';
import { getHighlightOpacity } from '../../utils/filterUtils';

type SortOrder = 'asc' | 'desc' | 'data';

function sortValues(values: string[], order: SortOrder): string[] {
  if (order === 'data') return values;
  
  const sorted = [...values].sort((a, b) => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    return a.localeCompare(b);
  });
  
  return order === 'desc' ? sorted.reverse() : sorted;
}

function getUniqueValues(data: Record<string, unknown>[], field: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const row of data) {
    const val = String(row[field] ?? '');
    if (!seen.has(val)) {
      seen.add(val);
      result.push(val);
    }
  }
  return result;
}

interface HierarchicalData {
  xAxisLabels: string[];
  outerLabels: Array<{ value: string; startIndex: number; endIndex: number }>;
  groupedData: Map<string, number[]>;
}

function transformToHierarchicalData(
  rawData: Record<string, unknown>[],
  outerField: string,
  innerField: string,
  yFields: string[],
  groupByField: string | undefined,
  outerSort: SortOrder,
  innerSort: SortOrder,
  groupBySort: SortOrder
): HierarchicalData {
  const outerValues = sortValues(getUniqueValues(rawData, outerField), outerSort);
  const innerValues = sortValues(getUniqueValues(rawData, innerField), innerSort);
  
  const xAxisLabels: string[] = [];
  const outerLabels: Array<{ value: string; startIndex: number; endIndex: number }> = [];
  
  for (const outer of outerValues) {
    const startIndex = xAxisLabels.length;
    for (const inner of innerValues) {
      xAxisLabels.push(inner);
    }
    outerLabels.push({
      value: outer,
      startIndex,
      endIndex: xAxisLabels.length - 1,
    });
  }
  
  const groupedData = new Map<string, number[]>();
  
  if (groupByField) {
    const groupValues = sortValues(getUniqueValues(rawData, groupByField), groupBySort);
    const yField = yFields[0] || 'value';
    
    for (const groupVal of groupValues) {
      const seriesData: number[] = [];
      for (const outer of outerValues) {
        for (const inner of innerValues) {
          const row = rawData.find(
            r => String(r[outerField]) === outer &&
                 String(r[innerField]) === inner &&
                 String(r[groupByField]) === groupVal
          );
          seriesData.push(row ? Number(row[yField]) || 0 : 0);
        }
      }
      groupedData.set(groupVal, seriesData);
    }
  } else {
    for (const yField of yFields) {
      const seriesData: number[] = [];
      for (const outer of outerValues) {
        for (const inner of innerValues) {
          const row = rawData.find(
            r => String(r[outerField]) === outer && String(r[innerField]) === inner
          );
          seriesData.push(row ? Number(row[yField]) || 0 : 0);
        }
      }
      groupedData.set(yField, seriesData);
    }
  }
  
  return { xAxisLabels, outerLabels, groupedData };
}

export function LineChartRenderer({ 
  config, 
  data,
  fields = [],
  filters = [],
  widgetId,
  onInteraction,
}: ChartRendererProps<LineChartConfig>) {
  const chartRef = useRef<ReactECharts>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const getFieldLabel = useCallback((fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    return field?.label || fieldName;
  }, [fields]);

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
    const xAxisField = config.enableHierarchicalXAxis 
      ? config.innerXAxisField 
      : config.xAxisField;
      
    if (clickedValue && xAxisField) {
      onInteraction({
        type: 'click',
        field: xAxisField,
        value: clickedValue,
        widgetId,
      });
    }
  }, [onInteraction, widgetId, config.enableHierarchicalXAxis, config.innerXAxisField, config.xAxisField]);

  const option: EChartsOption = useMemo(() => {
    const chartData = data || DEMO_DATA.line;
    
    if (config.enableHierarchicalXAxis && 
        config.outerXAxisField && 
        config.innerXAxisField && 
        Array.isArray(chartData.rawData)) {
      
      let yFields: string[];
      const isGroupByEnabled = config.enableGroupBy && config.groupByField;
      
      if (isGroupByEnabled) {
        const singleYField = config.enableDualYAxis 
          ? (config.leftYAxisFields?.[0] || config.rightYAxisFields?.[0] || 'value')
          : (config.yAxisFields?.[0] || 'value');
        yFields = [singleYField];
      } else {
        yFields = config.enableDualYAxis
          ? [...(config.leftYAxisFields || []), ...(config.rightYAxisFields || [])]
          : (config.yAxisFields || []);
        if (yFields.length === 0) yFields = ['value'];
      }
      
      const hierarchicalData = transformToHierarchicalData(
        chartData.rawData as Record<string, unknown>[],
        config.outerXAxisField,
        config.innerXAxisField,
        yFields,
        isGroupByEnabled ? config.groupByField : undefined,
        config.outerXAxisSort || 'data',
        config.innerXAxisSort || 'data',
        config.groupBySort || 'data'
      );
      
      const series: EChartsOption['series'] = [];
      hierarchicalData.groupedData.forEach((values, name) => {
        const isRightAxis = config.enableDualYAxis && 
          config.rightYAxisFields?.includes(name);
        
        series.push({
          name,
          type: 'line',
          yAxisIndex: isRightAxis ? 1 : 0,
          data: values,
          smooth: config.smooth,
          areaStyle: config.showArea ? {} : undefined,
        });
      });
      
      return {
        title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
        tooltip: { trigger: 'axis' },
        legend: {
          type: 'scroll',
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: hierarchicalData.xAxisLabels,
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: config.enableDualYAxis ? [
          { 
            type: 'value', 
            position: 'left',
            name: config.leftYAxisFields?.map(getFieldLabel).join(', ') || '',
            nameLocation: 'middle',
            nameGap: 35,
          },
          { 
            type: 'value', 
            position: 'right',
            name: config.rightYAxisFields?.map(getFieldLabel).join(', ') || '',
            nameLocation: 'middle',
            nameGap: 35,
          },
        ] : { type: 'value' },
        series,
        grid: { 
          left: config.enableDualYAxis ? 70 : 50, 
          right: config.enableDualYAxis ? 70 : 20, 
          top: config.title ? 50 : 30, 
          bottom: 80 
        },
        graphic: hierarchicalData.outerLabels.map((label) => ({
          type: 'text',
          left: `${((label.startIndex + label.endIndex) / 2 / hierarchicalData.xAxisLabels.length) * 100}%`,
          bottom: 25,
          style: {
            text: label.value,
            fontSize: 12,
            fill: '#666',
          },
          z: 100,
        })),
      };
    }
    
    const xAxisField = config.xAxisField || 'x';
    const xAxisData = chartData.xAxis || [];
    const seriesData = chartData.series || [];
    
    const yAxisConfig = config.enableDualYAxis ? [
      { 
        type: 'value' as const, 
        position: 'left' as const,
        name: config.leftYAxisFields?.map(getFieldLabel).join(', ') || '',
        nameLocation: 'middle' as const,
        nameGap: 35,
      },
      { 
        type: 'value' as const, 
        position: 'right' as const,
        name: config.rightYAxisFields?.map(getFieldLabel).join(', ') || '',
        nameLocation: 'middle' as const,
        nameGap: 35,
      },
    ] : { type: 'value' as const };
    
    const seriesConfig = seriesData.map((s) => {
      const fieldName = s.fieldName || s.name;
      const isRightAxis = config.enableDualYAxis && 
        config.rightYAxisFields?.includes(fieldName);
      
      return {
        name: s.name,
        type: 'line' as const,
        yAxisIndex: isRightAxis ? 1 : 0,
        data: s.data.map((value, index) => {
          const xValue = xAxisData[index];
          const opacity = getHighlightOpacity(xValue, xAxisField, filters);
          return {
            value,
            itemStyle: { opacity },
          };
        }),
        smooth: config.smooth,
        areaStyle: config.showArea ? {} : undefined,
        lineStyle: {
          opacity: filters.length > 0 && filters.some(f => f.field === xAxisField) ? 0.5 : 1,
        },
      };
    });

    return {
      title: config.title ? { text: config.title, left: 'center', top: 10 } : undefined,
      tooltip: { trigger: 'axis' },
      legend: seriesData.length > 1 ? {
        type: 'scroll',
        bottom: 0,
      } : undefined,
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: yAxisConfig,
      series: seriesConfig,
      grid: { 
        left: config.enableDualYAxis ? 70 : 50, 
        right: config.enableDualYAxis ? 70 : 20, 
        top: config.title ? 50 : 30, 
        bottom: seriesData.length > 1 ? 50 : 30 
      },
    };
  }, [config, data, filters]);

  const onEvents = useMemo(() => ({
    click: handleChartClick,
  }), [handleChartClick]);

  return (
    <div ref={containerRef} className="w-full h-full" data-testid="line-chart">
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
