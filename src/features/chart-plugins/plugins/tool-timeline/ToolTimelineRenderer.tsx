import { useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import type { CustomSeriesRenderItemParams, CustomSeriesRenderItemAPI } from 'echarts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChartRendererProps } from '../../types';
import type { ToolTimelineConfig } from './schema';
import { DEFAULT_STATUS_COLORS, getStatusColor } from './schema';

interface TimelineSegment {
  toolId: string;
  startTime: string;
  endTime: string;
  status: string;
  [key: string]: unknown;
}

interface ToolKpiData {
  toolId: string;
  [key: string]: unknown;
}

const DEMO_SEGMENTS: TimelineSegment[] = [
  { toolId: 'XCG10001', startTime: '00:00', endTime: '06:00', status: 'running' },
  { toolId: 'XCG10001', startTime: '06:00', endTime: '08:00', status: 'idle' },
  { toolId: 'XCG10001', startTime: '08:00', endTime: '09:00', status: 'error' },
  { toolId: 'XCG10001', startTime: '09:00', endTime: '24:00', status: 'running' },
  { toolId: 'XCG10002', startTime: '00:00', endTime: '04:00', status: 'idle' },
  { toolId: 'XCG10002', startTime: '04:00', endTime: '20:00', status: 'running' },
  { toolId: 'XCG10002', startTime: '20:00', endTime: '24:00', status: 'idle' },
  { toolId: 'XCG10003', startTime: '00:00', endTime: '12:00', status: 'running' },
  { toolId: 'XCG10003', startTime: '12:00', endTime: '14:00', status: 'error' },
  { toolId: 'XCG10003', startTime: '14:00', endTime: '24:00', status: 'running' },
];

const DEMO_KPI_DATA: ToolKpiData[] = [
  { toolId: 'XCG10001', availability: 85, utilization: 92 },
  { toolId: 'XCG10002', availability: 78, utilization: 88 },
  { toolId: 'XCG10003', availability: 91, utilization: 95 },
];

function parseTimeToHour(time: string): number {
  if (time.includes(':')) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours + (minutes || 0) / 60;
  }
  return parseFloat(time) || 0;
}

function formatDuration(startTime: string, endTime: string): string {
  const start = parseTimeToHour(startTime);
  const end = parseTimeToHour(endTime);
  const duration = end - start;
  const hours = Math.floor(duration);
  const minutes = Math.round((duration - hours) * 60);
  if (hours === 0) return `${minutes} 分鐘`;
  if (minutes === 0) return `${hours} 小時`;
  return `${hours} 小時 ${minutes} 分鐘`;
}

export function ToolTimelineRenderer({
  config,
  data,
  onInteraction,
  widgetId,
}: ChartRendererProps<ToolTimelineConfig>) {
  const statusColors = config.statusColors?.length > 0 
    ? config.statusColors 
    : DEFAULT_STATUS_COLORS;

  const segments: TimelineSegment[] = useMemo(() => {
    if (!data?.rows?.length || !config.toolIdField || !config.startTimeField || 
        !config.endTimeField || !config.statusField) {
      return DEMO_SEGMENTS;
    }
    return data.rows.map(row => ({
      toolId: String(row[config.toolIdField]),
      startTime: String(row[config.startTimeField]),
      endTime: String(row[config.endTimeField]),
      status: String(row[config.statusField]),
      ...row,
    }));
  }, [data, config.toolIdField, config.startTimeField, config.endTimeField, config.statusField]);

  const kpiData: ToolKpiData[] = useMemo(() => {
    if (!data?.rows?.length || !config.toolIdField) {
      return DEMO_KPI_DATA;
    }
    const toolMap = new Map<string, ToolKpiData>();
    data.rows.forEach(row => {
      const toolId = String(row[config.toolIdField]);
      if (!toolMap.has(toolId)) {
        toolMap.set(toolId, { toolId, ...row });
      }
    });
    return Array.from(toolMap.values());
  }, [data, config.toolIdField]);

  const isDemo = !data?.rows?.length || !config.toolIdField;

  const toolIds = useMemo(() => {
    const ids = [...new Set(segments.map(s => s.toolId))];
    return ids;
  }, [segments]);

  const colorMap = useMemo(() => {
    const map = new Map<string, string>();
    const usedColors = new Set<string>();
    statusColors.forEach(sc => {
      map.set(sc.status, sc.color);
      usedColors.add(sc.color);
    });
    segments.forEach(seg => {
      if (!map.has(seg.status)) {
        const color = getStatusColor(seg.status, statusColors, usedColors);
        map.set(seg.status, color);
      }
    });
    return map;
  }, [segments, statusColors]);

  const handleClick = useCallback((params: { data?: unknown }) => {
    if (!onInteraction || !widgetId || !params.data) return;
    const segmentData = params.data as TimelineSegment;
    onInteraction({
      type: 'click',
      field: config.toolIdField || 'toolId',
      value: segmentData.toolId,
      widgetId,
    });
  }, [onInteraction, widgetId, config.toolIdField]);

  const chartOption = useMemo(() => {
    const rowHeight = 32;
    const chartHeight = toolIds.length * rowHeight;
    
    const seriesData = segments.map(seg => {
      const toolIndex = toolIds.indexOf(seg.toolId);
      const startHour = parseTimeToHour(seg.startTime);
      const endHour = parseTimeToHour(seg.endTime);
      return {
        value: [startHour, endHour, toolIndex, seg.status],
        itemStyle: { color: colorMap.get(seg.status) || '#999' },
        ...seg,
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter: (params: any) => {
          const d = params.data;
          if (!d) return '';
          const statusLabel = statusColors.find(s => s.status === d.status)?.label || d.status;
          return `
            <div style="padding: 8px;">
              <strong>${d.toolId}</strong><br/>
              狀態: ${statusLabel}<br/>
              時間: ${d.startTime} - ${d.endTime}<br/>
              持續: ${formatDuration(d.startTime, d.endTime)}
            </div>
          `;
        },
      },
      grid: {
        left: 100,
        right: 20,
        top: 20,
        bottom: 60,
        height: chartHeight,
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 24,
        interval: 4,
        axisLabel: {
          formatter: (val: number) => `${val}:00`,
        },
        name: '時間',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'category',
        data: toolIds,
        inverse: true,
        axisLabel: {
          width: 80,
          overflow: 'truncate',
        },
      },
      series: [{
        type: 'custom',
        renderItem: (
          _params: CustomSeriesRenderItemParams,
          api: CustomSeriesRenderItemAPI
        ) => {
          const startVal = api.value(0) as number;
          const endVal = api.value(1) as number;
          const categoryIndex = api.value(2) as number;
          
          const startCoord = api.coord([startVal, categoryIndex]);
          const endCoord = api.coord([endVal, categoryIndex]);
          
          const barHeight = rowHeight * 0.6;
          
          return {
            type: 'rect',
            shape: {
              x: startCoord[0],
              y: startCoord[1] - barHeight / 2,
              width: endCoord[0] - startCoord[0],
              height: barHeight,
            },
            style: api.style(),
          };
        },
        data: seriesData,
        encode: {
          x: [0, 1],
          y: 2,
        },
      }],
      _rowHeight: rowHeight,
    };
  }, [segments, toolIds, colorMap, statusColors]);

  const legendItems = useMemo(() => {
    const items: { status: string; color: string; label: string }[] = [];
    const seen = new Set<string>();
    
    statusColors.forEach(sc => {
      if (!seen.has(sc.status)) {
        items.push(sc);
        seen.add(sc.status);
      }
    });
    
    segments.forEach(seg => {
      if (!seen.has(seg.status)) {
        const color = colorMap.get(seg.status) || '#999';
        items.push({ status: seg.status, color, label: seg.status });
        seen.add(seg.status);
      }
    });
    
    return items;
  }, [statusColors, segments, colorMap]);

  const ROW_HEIGHT = 32;
  const GRID_TOP = 20;

  const formatKpiValue = (value: unknown, format?: 'percent' | 'number'): string => {
    const num = Number(value);
    if (isNaN(num)) return '-';
    if (format === 'percent') return `${num.toFixed(0)}%`;
    return num.toLocaleString();
  };

  return (
    <Card className="h-full relative" data-testid="tool-timeline">
      <CardContent className="h-full p-2 flex flex-col">
        <div className="flex-1 flex" style={{ minHeight: 0 }}>
          <div 
            className={config.kpiFields?.length ? "flex-shrink-0" : "flex-1"} 
            style={config.kpiFields?.length ? { width: 'calc(100% - 140px)', minWidth: 200 } : undefined}
            data-testid="tool-timeline-chart"
          >
            <ReactECharts
              option={chartOption}
              style={{ height: '100%', width: '100%' }}
              onEvents={{ click: handleClick }}
            />
          </div>
          
          {config.kpiFields && config.kpiFields.length > 0 && (
            <div 
              className="flex-shrink-0 border-l pl-3 overflow-hidden flex flex-col"
              style={{ 
                width: Math.max(config.kpiFields.length * 70 + 20, 140),
              }}
              data-testid="tool-timeline-kpi-table"
            >
              <div 
                className="flex text-xs font-medium border-b"
                style={{ height: GRID_TOP, lineHeight: `${GRID_TOP}px` }}
              >
                {config.kpiFields.map(kpi => (
                  <div key={kpi.field} className="flex-1 text-center truncate px-1">
                    {kpi.label}
                  </div>
                ))}
              </div>
              <table className="text-xs w-full border-collapse">
                <tbody>
                  {toolIds.map(toolId => {
                    const kpi = kpiData.find(k => k.toolId === toolId);
                    return (
                      <tr key={toolId}>
                        {config.kpiFields!.map(kpiField => (
                          <td 
                            key={kpiField.field} 
                            className="px-1 text-center"
                            style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
                            title={kpiField.label}
                          >
                            {kpi ? formatKpiValue(kpi[kpiField.field], kpiField.format) : '-'}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div 
          className="flex flex-wrap gap-3 justify-center pt-2 border-t mt-2"
          data-testid="tool-timeline-legend"
        >
          {legendItems.map(item => (
            <div key={item.status} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.label}</span>
            </div>
          ))}
        </div>
        
        {isDemo && (
          <Badge
            variant="outline"
            className="absolute top-2 right-2 bg-amber-50 text-amber-700 border-amber-200"
            data-testid="tool-timeline-demo-badge"
          >
            示範資料
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
