import { z } from 'zod';

export const statusColorSchema = z.object({
  status: z.string().min(1, '請輸入狀態值'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/i, '請輸入有效的顏色格式 (例：#FF0000)'),
  label: z.string().min(1, '請輸入顯示名稱'),
});

export const kpiFieldSchema = z.object({
  field: z.string().min(1, '請選擇欄位'),
  label: z.string().min(1, '請輸入顯示名稱'),
  format: z.enum(['percent', 'number']).optional().default('number'),
});

export const tooltipFieldSchema = z.object({
  field: z.string().min(1, '請選擇欄位'),
  label: z.string().min(1, '請輸入顯示標籤'),
  format: z.enum(['text', 'time', 'duration', 'percent', 'number']).optional().default('text'),
});

export const tooltipConfigSchema = z.object({
  enabled: z.boolean().default(true),
  fields: z.array(tooltipFieldSchema).optional(),
});

export const toolTimelineConfigSchema = z.object({
  chartType: z.literal('tool-timeline'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  
  date: z.string().optional(),
  
  toolIdField: z.string().min(1, '請選擇機台 ID 欄位'),
  startTimeField: z.string().min(1, '請選擇開始時間欄位'),
  endTimeField: z.string().min(1, '請選擇結束時間欄位'),
  statusField: z.string().min(1, '請選擇狀態欄位'),
  
  statusColors: z.array(statusColorSchema).min(1, '至少需要一個狀態顏色對應'),
  
  kpiFields: z.array(kpiFieldSchema).optional(),
  
  tooltip: tooltipConfigSchema.optional(),
});

export type StatusColor = z.infer<typeof statusColorSchema>;
export type KpiField = z.infer<typeof kpiFieldSchema>;
export type TooltipField = z.infer<typeof tooltipFieldSchema>;
export type TooltipConfig = z.infer<typeof tooltipConfigSchema>;
export type ToolTimelineConfig = z.infer<typeof toolTimelineConfigSchema>;

export const DEFAULT_STATUS_COLORS: StatusColor[] = [
  { status: 'running', color: '#4CAF50', label: '運作中' },
  { status: 'error', color: '#F44336', label: '異常' },
  { status: 'idle', color: '#D7CCC8', label: '閒置' },
];

const FALLBACK_COLORS = [
  '#2196F3', '#FF9800', '#9C27B0', '#00BCD4', '#795548',
  '#607D8B', '#E91E63', '#3F51B5', '#009688', '#FFEB3B',
];

export function getStatusColor(
  status: string,
  statusColors: StatusColor[],
  usedColors: Set<string>
): string {
  const configured = statusColors.find(s => s.status === status);
  if (configured) return configured.color;
  
  for (const color of FALLBACK_COLORS) {
    if (!usedColors.has(color)) {
      usedColors.add(color);
      return color;
    }
  }
  
  return FALLBACK_COLORS[Math.floor(Math.random() * FALLBACK_COLORS.length)];
}
