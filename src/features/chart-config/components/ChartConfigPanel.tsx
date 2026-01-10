import { useState, useMemo, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartTypeSelector } from './ChartTypeSelector';
import { DataSourceSelector } from './DataSourceSelector';
import { ChartPreview } from './ChartPreview';
import { EmbedPreview } from './EmbedPreview';
import { getDataSources, getDataSourceById } from '../services/mockDataSources';
import { chartRegistry } from '@/features/chart-plugins';
import type { ChartConfig, ChartType } from '@/types/chart';

interface ChartConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ChartConfig) => void;
  initialConfig?: ChartConfig;
  widgets?: Array<{ id: string; chartConfig?: ChartConfig }>;
  currentWidgetId?: string;
}

export function ChartConfigPanel({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  widgets = [],
  currentWidgetId,
}: ChartConfigPanelProps) {
  const dataSources = useMemo(() => getDataSources(), []);

  const [chartType, setChartType] = useState<ChartType>('line');
  const [title, setTitle] = useState('');
  const [dataSourceId, setDataSourceId] = useState('');
  const [pluginConfig, setPluginConfig] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEmbedType = chartType === 'embed';
  const isKpiCardType = chartType === 'kpi-card';
  const isKpiCardDynamicType = chartType === 'kpi-card-dynamic';
  const isAiCommentType = chartType === 'ai-comment';

  const availableWidgetsForAiComment = useMemo(() => {
    return widgets
      .filter((w) => w.id !== currentWidgetId && w.chartConfig?.chartType !== 'ai-comment')
      .map((w) => ({
        id: w.id,
        title: w.chartConfig?.title || '',
        chartType: w.chartConfig?.chartType || '',
      }));
  }, [widgets, currentWidgetId]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      if (initialConfig) {
        setChartType(initialConfig.chartType);
        setTitle(initialConfig.title || '');
        if (initialConfig.chartType === 'embed') {
          setDataSourceId('');
          setPluginConfig({ url: initialConfig.url || '' });
        } else if (initialConfig.chartType === 'kpi-card') {
          setDataSourceId('');
          setPluginConfig({
            value: initialConfig.value,
            compareValue: initialConfig.compareValue,
            fontSize: initialConfig.fontSize || 'md',
            format: initialConfig.format || {},
          });
        } else if (initialConfig.chartType === 'kpi-card-dynamic') {
          setDataSourceId(initialConfig.dataSourceId || '');
          setPluginConfig({
            valueField: initialConfig.valueField || '',
            showTrend: initialConfig.showTrend || false,
            fontSize: initialConfig.fontSize || 'md',
            format: initialConfig.format || {},
          });
        } else if (initialConfig.chartType === 'ai-comment') {
          setDataSourceId('');
          setPluginConfig({
            targetWidgetId: initialConfig.targetWidgetId || '',
          });
        } else {
          setDataSourceId('dataSourceId' in initialConfig ? initialConfig.dataSourceId : '');
          setPluginConfig({
            xAxisField: 'xAxisField' in initialConfig ? initialConfig.xAxisField : '',
            yAxisFields: 'yAxisFields' in initialConfig ? initialConfig.yAxisFields : [],
          });
        }
      } else {
        setChartType('line');
        setTitle('');
        setDataSourceId('');
        setPluginConfig({});
      }
      setErrors({});
    }
  }, [isOpen, initialConfig]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const selectedDataSource = useMemo(
    () => getDataSourceById(dataSourceId),
    [dataSourceId]
  );

  const currentPlugin = useMemo(
    () => chartRegistry.getByType(chartType),
    [chartType]
  );

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    setErrors({});
    setPluginConfig({});
    if (type === 'embed') {
      setTitle('嵌入報表');
    } else if (chartType === 'embed') {
      setTitle('');
    }
  };

  const handleDataSourceChange = (id: string) => {
    setDataSourceId(id);
    setPluginConfig({ xAxisField: '', yAxisFields: [] });
  };

  const handleFieldsChange = (value: Record<string, unknown>) => {
    setPluginConfig((prev) => ({ ...prev, ...value }));
  };

  const handleSave = () => {
    if (!currentPlugin) return;

    let formData: Record<string, unknown>;
    
    if (isEmbedType) {
      formData = {
        chartType,
        title: title || '嵌入報表',
        url: pluginConfig.url || '',
      };
    } else if (isKpiCardType) {
      const valueNum = pluginConfig.value !== undefined ? Number(pluginConfig.value) : undefined;
      const compareNum = pluginConfig.compareValue !== undefined ? Number(pluginConfig.compareValue) : undefined;
      formData = {
        chartType,
        title,
        value: valueNum,
        compareValue: compareNum,
        fontSize: pluginConfig.fontSize || 'md',
        format: pluginConfig.format || {},
      };
    } else if (isKpiCardDynamicType) {
      formData = {
        chartType,
        title,
        dataSourceId,
        valueField: pluginConfig.valueField || '',
        showTrend: pluginConfig.showTrend || false,
        fontSize: pluginConfig.fontSize || 'md',
        format: pluginConfig.format || {},
      };
    } else if (isAiCommentType) {
      formData = {
        chartType,
        title,
        targetWidgetId: pluginConfig.targetWidgetId || '',
      };
    } else {
      formData = {
        chartType,
        title,
        dataSourceId,
        xAxisField: pluginConfig.xAxisField || '',
        yAxisFields: pluginConfig.yAxisFields || [],
      };
    }

    const result = currentPlugin.configSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSave(result.data as ChartConfig);
  };

  const ConfigFields = currentPlugin?.ConfigFields;

  const getConfigFieldsValue = () => {
    if (isEmbedType) {
      return { url: pluginConfig.url || '' };
    }
    if (isKpiCardType) {
      return {
        title,
        value: pluginConfig.value,
        compareValue: pluginConfig.compareValue,
        fontSize: pluginConfig.fontSize || 'md',
        format: pluginConfig.format || {},
      };
    }
    if (isKpiCardDynamicType) {
      return {
        title,
        valueField: pluginConfig.valueField || '',
        showTrend: pluginConfig.showTrend || false,
        fontSize: pluginConfig.fontSize || 'md',
        format: pluginConfig.format || {},
      };
    }
    if (isAiCommentType) {
      return {
        title,
        targetWidgetId: pluginConfig.targetWidgetId || '',
      };
    }
    return {
      xAxisField: pluginConfig.xAxisField || '',
      yAxisFields: (pluginConfig.yAxisFields as string[]) || [],
    };
  };

  const handleKpiConfigChange = (value: Record<string, unknown>) => {
    if ('title' in value && typeof value.title === 'string') {
      setTitle(value.title);
    }
    setPluginConfig((prev) => ({ ...prev, ...value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        className="w-[400px] sm:w-[540px] overflow-y-auto"
        data-testid="chart-config-panel"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Widget 設定</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <ChartTypeSelector value={chartType} onChange={handleChartTypeChange} error={errors.chartType} />

          {!isKpiCardType && !isKpiCardDynamicType && !isAiCommentType && (
            <div className="space-y-2">
              <Label htmlFor="chart-title">標題</Label>
              <Input
                id="chart-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isEmbedType ? '嵌入報表' : '輸入標題...'}
                maxLength={50}
                data-testid="chart-title-input"
              />
            </div>
          )}

          {isEmbedType ? (
            <>
              {ConfigFields && (
                <ConfigFields
                  value={{ url: pluginConfig.url || '' }}
                  onChange={handleFieldsChange}
                  fields={[]}
                  errors={{ url: errors.url }}
                />
              )}
              <EmbedPreview url={(pluginConfig.url as string) || ''} title={title} />
            </>
          ) : isKpiCardType ? (
            <>
              {ConfigFields && (
                <ConfigFields
                  value={getConfigFieldsValue()}
                  onChange={handleKpiConfigChange}
                  fields={[]}
                  errors={errors}
                />
              )}

              <ChartPreview
                chartType={chartType}
                dataSource={undefined}
                xAxisField=""
                yAxisFields={[]}
                title={title}
                pluginConfig={pluginConfig}
              />
            </>
          ) : isKpiCardDynamicType ? (
            <>
              <DataSourceSelector
                dataSources={dataSources}
                value={dataSourceId}
                onChange={(id) => {
                  setDataSourceId(id);
                  setPluginConfig((prev) => ({ ...prev, valueField: '' }));
                }}
                error={errors.dataSourceId}
              />

              {selectedDataSource && ConfigFields && (
                <ConfigFields
                  value={getConfigFieldsValue()}
                  onChange={handleKpiConfigChange}
                  fields={selectedDataSource.fields}
                  errors={errors}
                />
              )}

              <ChartPreview
                chartType={chartType}
                dataSource={selectedDataSource}
                xAxisField=""
                yAxisFields={[]}
                title={title}
                pluginConfig={pluginConfig}
              />
            </>
          ) : isAiCommentType ? (
            <>
              {ConfigFields && (
                <ConfigFields
                  value={getConfigFieldsValue()}
                  onChange={handleKpiConfigChange}
                  fields={[]}
                  errors={errors}
                  availableWidgets={availableWidgetsForAiComment}
                />
              )}

              <ChartPreview
                chartType={chartType}
                dataSource={undefined}
                xAxisField=""
                yAxisFields={[]}
                title={title}
                pluginConfig={pluginConfig}
              />
            </>
          ) : (
            <>
              <DataSourceSelector
                dataSources={dataSources}
                value={dataSourceId}
                onChange={handleDataSourceChange}
                error={errors.dataSourceId}
              />

              {selectedDataSource && ConfigFields && (
                <ConfigFields
                  value={getConfigFieldsValue()}
                  onChange={handleFieldsChange}
                  fields={selectedDataSource.fields}
                  errors={{
                    xAxisField: errors.xAxisField,
                    yAxisFields: errors.yAxisFields,
                  }}
                />
              )}

              <ChartPreview
                chartType={chartType}
                dataSource={selectedDataSource}
                xAxisField={(pluginConfig.xAxisField as string) || ''}
                yAxisFields={(pluginConfig.yAxisFields as string[]) || []}
                title={title}
              />
            </>
          )}
        </div>

        <SheetFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} data-testid="config-cancel-button">
            取消
          </Button>
          <Button onClick={handleSave} data-testid="config-save-button">
            儲存
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
