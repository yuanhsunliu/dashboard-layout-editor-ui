import { z } from 'zod';

export const areaChartConfigSchema = z.object({
  chartType: z.literal('area'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  xAxisField: z.string().min(1, '請選擇 X 軸欄位'),
  yAxisFields: z.array(z.string()).min(1, '請至少選擇一個 Y 軸欄位'),
  smooth: z.boolean().optional().default(true),
  stacked: z.boolean().optional().default(false),
});

export type AreaChartConfig = z.infer<typeof areaChartConfigSchema>;
