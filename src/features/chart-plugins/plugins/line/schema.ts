import { z } from 'zod';

const sortOrderSchema = z.enum(['asc', 'desc', 'data']).default('data');

export const lineChartConfigSchema = z.object({
  chartType: z.literal('line'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  
  // 基本 X 軸（未啟用階層式時使用）
  xAxisField: z.string().optional().default(''),
  
  // 基本 Y 軸（向下相容，未啟用雙軸時使用）
  yAxisFields: z.array(z.string()).optional().default([]),
  
  // 雙 Y 軸
  enableDualYAxis: z.boolean().optional().default(false),
  leftYAxisFields: z.array(z.string()).optional().default([]),
  rightYAxisFields: z.array(z.string()).optional().default([]),
  
  // 階層式 X 軸
  enableHierarchicalXAxis: z.boolean().optional().default(false),
  outerXAxisField: z.string().optional().default(''),
  innerXAxisField: z.string().optional().default(''),
  outerXAxisSort: sortOrderSchema,
  innerXAxisSort: sortOrderSchema,
  
  // Series 分群
  enableGroupBy: z.boolean().optional().default(false),
  groupByField: z.string().optional().default(''),
  groupBySort: sortOrderSchema,
  
  smooth: z.boolean().optional().default(false),
  showArea: z.boolean().optional().default(false),
}).refine((data) => {
  // 階層式 X 軸：外層/內層同時填或同時不填
  if (data.enableHierarchicalXAxis) {
    const hasOuter = !!data.outerXAxisField;
    const hasInner = !!data.innerXAxisField;
    return hasOuter === hasInner;
  }
  return true;
}, {
  message: '外層與內層 X 軸欄位須同時設定',
  path: ['outerXAxisField'],
}).refine((data) => {
  // groupByField 啟用時：只能有一個 Y 軸欄位
  if (data.enableGroupBy && data.groupByField) {
    if (data.enableDualYAxis) {
      const totalYFields = 
        (data.leftYAxisFields?.length || 0) + 
        (data.rightYAxisFields?.length || 0);
      return totalYFields === 1;
    }
  }
  return true;
}, {
  message: '啟用分群時，只能選擇一個 Y 軸欄位',
  path: ['groupByField'],
}).refine((data) => {
  // 基本驗證：至少要有 X 軸
  if (data.enableHierarchicalXAxis) {
    return !!data.outerXAxisField && !!data.innerXAxisField;
  }
  return !!data.xAxisField;
}, {
  message: '請選擇 X 軸欄位',
  path: ['xAxisField'],
}).refine((data) => {
  // 基本驗證：至少要有 Y 軸
  if (data.enableDualYAxis) {
    return (data.leftYAxisFields?.length || 0) + (data.rightYAxisFields?.length || 0) > 0;
  }
  return (data.yAxisFields?.length || 0) > 0;
}, {
  message: '請至少選擇一個 Y 軸欄位',
  path: ['yAxisFields'],
});

export type LineChartConfig = z.infer<typeof lineChartConfigSchema>;
