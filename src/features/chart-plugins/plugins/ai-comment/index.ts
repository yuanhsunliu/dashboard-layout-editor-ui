import { MessageSquareText } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { aiCommentConfigSchema, type AiCommentConfig } from './schema';
import { AiCommentRenderer } from './AiCommentRenderer';
import { AiCommentConfigFields } from './ConfigFields';

export const AiCommentPlugin: ChartPlugin<AiCommentConfig> = {
  type: 'ai-comment',
  name: 'AI 洞察',
  description: '使用 AI 分析指定 Widget 的數據洞察',
  icon: MessageSquareText,
  configSchema: aiCommentConfigSchema,
  ConfigFields: AiCommentConfigFields as ChartPlugin<AiCommentConfig>['ConfigFields'],
  Renderer: AiCommentRenderer as ChartPlugin<AiCommentConfig>['Renderer'],
  configBehavior: {
    requiresDataSource: false,
    showTitleInput: false,
    previewHeight: 'sm',
    getInitialPluginConfig: () => ({ targetWidgetId: '' }),
    isPreviewReady: () => true,
  },
};

export { aiCommentConfigSchema, type AiCommentConfig };
export { AiCommentRenderer } from './AiCommentRenderer';
export { AiCommentConfigFields } from './ConfigFields';
