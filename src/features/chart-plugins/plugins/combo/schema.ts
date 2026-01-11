import { z } from 'zod';

export const comboChartConfigSchema = z.object({
  chartType: z.literal('combo'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  xAxisField: z.string().min(1, '請選擇 X 軸欄位'),
  leftYAxisFields: z.array(z.string()).min(1, '請至少選擇一個左軸欄位（Bar）'),
  rightYAxisFields: z.array(z.string()).min(1, '請至少選擇一個右軸欄位（Line）'),
  leftYAxisLabel: z.string().max(30, '標籤不能超過 30 字元').optional().default(''),
  rightYAxisLabel: z.string().max(30, '標籤不能超過 30 字元').optional().default(''),
  smooth: z.boolean().optional().default(false),
});

export type ComboChartConfig = z.infer<typeof comboChartConfigSchema>;
