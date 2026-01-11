import { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { ChartRendererProps } from '../../types';
import type { AiCommentConfig, AiAnalyzeResponse } from './schema';
import { analyzeWidget } from './aiService';
import { captureWidget } from './captureWidget';

interface AiCommentRendererProps extends ChartRendererProps<AiCommentConfig> {
  targetWidgetExists?: boolean;
  targetWidgetData?: Record<string, unknown>[];
  dataVersion?: number;
}

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

export function AiCommentRenderer({
  config,
  targetWidgetExists = true,
  targetWidgetData,
  dataVersion,
}: AiCommentRendererProps) {
  const [state, setState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<AiAnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastDataVersion, setLastDataVersion] = useState<number | undefined>();

  const hasTarget = !!config.targetWidgetId;

  const runAnalysis = useCallback(async () => {
    if (!config.targetWidgetId) return;

    setState('loading');
    setError(null);

    try {
      const imageBase64 = await captureWidget(config.targetWidgetId);

      const response = await analyzeWidget({
        widgetId: config.targetWidgetId,
        imageBase64: imageBase64 || '',
        data: targetWidgetData || [],
      });

      setResult(response);
      setState('success');
      setLastDataVersion(dataVersion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 分析失敗，請稍後再試');
      setState('error');
    }
  }, [config.targetWidgetId, targetWidgetData, dataVersion]);

  useEffect(() => {
    if (
      state === 'success' &&
      dataVersion !== undefined &&
      lastDataVersion !== undefined &&
      dataVersion !== lastDataVersion
    ) {
      runAnalysis();
    }
  }, [dataVersion, lastDataVersion, state, runAnalysis]);

  if (!hasTarget) {
    return (
      <Card className="h-full" data-testid="ai-comment">
        <CardContent className="flex items-center justify-center h-full p-6">
          <p className="text-muted-foreground text-center" data-testid="ai-no-target">
            請選擇要分析的 Widget
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!targetWidgetExists) {
    return (
      <Card className="h-full" data-testid="ai-comment">
        <CardContent className="flex items-center justify-center h-full p-6">
          <Alert variant="destructive" data-testid="ai-target-not-found">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>目標 Widget 已不存在</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col py-0" data-testid="ai-comment">
      <CardContent className="flex-1 flex flex-col p-3 overflow-hidden">
        {state === 'idle' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <p>點擊下方按鈕開始 AI 洞察</p>
            <Button
              onClick={runAnalysis}
              size="sm"
              data-testid="ai-analyze-button"
            >
              分析
            </Button>
          </div>
        )}

        {state === 'loading' && (
          <div
            className="flex-1 flex items-center justify-center"
            data-testid="ai-loading"
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">AI 分析中...</span>
          </div>
        )}

        {state === 'error' && error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Alert variant="destructive" data-testid="ai-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={runAnalysis}
              size="sm"
              variant="outline"
              data-testid="ai-retry-button"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              重試
            </Button>
          </div>
        )}

        {state === 'success' && result && (
          <>
            <div
              className="flex-1 overflow-auto prose prose-sm max-w-none"
              data-testid="ai-insight-content"
            >
              <ReactMarkdown>{result.insight}</ReactMarkdown>
            </div>
            <div className="flex items-center justify-between pt-2 border-t shrink-0">
              <span
                className="text-xs text-muted-foreground"
                data-testid="ai-analyzed-at"
              >
                {new Date(result.analyzedAt).toLocaleString('zh-TW')}
              </span>
              <Button
                onClick={runAnalysis}
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-xs"
                data-testid="ai-reanalyze-button"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                重新分析
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
