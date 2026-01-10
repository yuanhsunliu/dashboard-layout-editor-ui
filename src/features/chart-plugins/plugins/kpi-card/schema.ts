import { z } from 'zod';
import { conditionalColorSchema } from './conditional-color';

export const kpiCardFormatSchema = z.object({
  thousandSeparator: z.boolean().optional(),
  decimalPlaces: z.number().min(0).max(2).optional(),
  isPercentage: z.boolean().optional(),
  suffix: z.string().max(10).optional(),
});

export const kpiCardConfigSchema = z.object({
  chartType: z.literal('kpi-card'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  value: z.number({ message: '請輸入數值' }),
  compareValue: z.number().optional(),
  fontSize: z.enum(['sm', 'md', 'lg']).optional().default('md'),
  format: kpiCardFormatSchema.optional(),
  conditionalColor: conditionalColorSchema.optional(),
});

export type KpiCardFormat = z.infer<typeof kpiCardFormatSchema>;
export type KpiCardConfig = z.infer<typeof kpiCardConfigSchema>;
