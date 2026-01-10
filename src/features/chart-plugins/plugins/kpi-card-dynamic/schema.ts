import { z } from 'zod';

export const kpiCardDynamicFormatSchema = z.object({
  thousandSeparator: z.boolean().optional(),
  decimalPlaces: z.number().min(0).max(2).optional(),
  isPercentage: z.boolean().optional(),
  suffix: z.string().max(10).optional(),
});

export const kpiCardDynamicConfigSchema = z.object({
  chartType: z.literal('kpi-card-dynamic'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  valueField: z.string().min(1, '請選擇數值欄位'),
  showTrend: z.boolean().optional().default(false),
  fontSize: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  format: kpiCardDynamicFormatSchema.optional(),
});

export type KpiCardDynamicFormat = z.infer<typeof kpiCardDynamicFormatSchema>;
export type KpiCardDynamicConfig = z.infer<typeof kpiCardDynamicConfigSchema>;
