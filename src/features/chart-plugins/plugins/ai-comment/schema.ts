import { z } from 'zod';

export const aiCommentConfigSchema = z.object({
  chartType: z.literal('ai-comment'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  targetWidgetId: z.string().min(1, '請選擇要分析的 Widget'),
});

export type AiCommentConfig = z.infer<typeof aiCommentConfigSchema>;

export interface AiAnalyzeRequest {
  widgetId: string;
  imageBase64: string;
  data: Record<string, unknown>[];
}

export interface AiAnalyzeResponse {
  insight: string;
  analyzedAt: string;
}
