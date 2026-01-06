import { z } from 'zod';

export const chartConfigSchema = z.object({
  chartType: z.enum(['line', 'bar']),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  xAxisField: z.string().min(1, '請選擇 X 軸欄位'),
  yAxisFields: z.array(z.string()).min(1, '請至少選擇一個 Y 軸欄位'),
});

export type ChartConfigSchema = z.infer<typeof chartConfigSchema>;
