import { z } from 'zod';

export const embedConfigSchema = z.object({
  chartType: z.literal('embed'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default('嵌入報表'),
  url: z.string().url('請輸入有效的網址'),
});

export type EmbedConfigType = z.infer<typeof embedConfigSchema>;
