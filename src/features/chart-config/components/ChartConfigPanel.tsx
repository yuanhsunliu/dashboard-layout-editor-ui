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

  const currentPlugin = useMemo(
    () => chartRegistry.getByType(chartType),
    [chartType]
  );

  const configBehavior = currentPlugin?.configBehavior;
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
            conditionalColor: initialConfig.conditionalColor,
          });
        } else if (initialConfig.chartType === 'kpi-card-dynamic') {
          setDataSourceId(initialConfig.dataSourceId || '');
          setPluginConfig({
            valueField: initialConfig.valueField || '',
            showTrend: initialConfig.showTrend || false,
            fontSize: initialConfig.fontSize || 'md',
            format: initialConfig.format || {},
            conditionalColor: initialConfig.conditionalColor,
          });
        } else if (initialConfig.chartType === 'ai-comment') {
          setDataSourceId('');
          setPluginConfig({
            targetWidgetId: initialConfig.targetWidgetId || '',
          });
        } else if (initialConfig.chartType === 'tool-timeline') {
          setDataSourceId('dataSourceId' in initialConfig ? (initialConfig as { dataSourceId?: string }).dataSourceId || '' : '');
          const config = initialConfig as unknown as Record<string, unknown>;
          setPluginConfig({
            toolIdField: config.toolIdField || '',
            startTimeField: config.startTimeField || '',
            endTimeField: config.endTimeField || '',
            statusField: config.statusField || '',
            statusColors: config.statusColors || [],
            kpiFields: config.kpiFields || [],
            tooltip: config.tooltip || { enabled: true },
          });
        } else {
          setDataSourceId('dataSourceId' in initialConfig ? initialConfig.dataSourceId : '');
          const config = initialConfig as unknown as Record<string, unknown>;
          setPluginConfig({
            xAxisField: 'xAxisField' in initialConfig ? initialConfig.xAxisField : '',
            yAxisFields: 'yAxisFields' in initialConfig ? initialConfig.yAxisFields : [],
            // Line Chart 進階設定
            enableHierarchicalXAxis: config.enableHierarchicalXAxis || false,
            outerXAxisField: config.outerXAxisField || '',
            innerXAxisField: config.innerXAxisField || '',
            outerXAxisSort: config.outerXAxisSort || 'data',
            innerXAxisSort: config.innerXAxisSort || 'data',
            enableDualYAxis: config.enableDualYAxis || false,
            leftYAxisFields: config.leftYAxisFields || [],
            rightYAxisFields: config.rightYAxisFields || [],
            enableGroupBy: config.enableGroupBy || false,
            groupByField: config.groupByField || '',
            groupBySort: config.groupBySort || 'data',
            smooth: config.smooth || false,
            showArea: config.showArea || false,
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

  const handleChartTypeChange = (type: ChartType) => {
    const oldPlugin = currentPlugin;
    const newPlugin = chartRegistry.getByType(type);
    
    setChartType(type);
    setErrors({});
    
    if (newPlugin && oldPlugin) {
      const oldBehavior = oldPlugin.configBehavior;
      const newBehavior = newPlugin.configBehavior;
      
      if (oldBehavior.requiresDataSource !== newBehavior.requiresDataSource) {
        setPluginConfig(newBehavior.getInitialPluginConfig());
        if (!newBehavior.requiresDataSource) {
          setDataSourceId('');
        }
      }
    } else if (newPlugin) {
      setPluginConfig(newPlugin.configBehavior.getInitialPluginConfig());
    }
    
    if (type === 'embed') {
      setTitle('嵌入報表');
    } else if (chartType === 'embed') {
      setTitle('');
    }
  };

  const handleDataSourceChange = (id: string) => {
    setDataSourceId(id);
    if (currentPlugin) {
      setPluginConfig(currentPlugin.configBehavior.getInitialPluginConfig());
    }
  };

  const handleSave = () => {
    if (!currentPlugin) return;

    const formData: Record<string, unknown> = {
      chartType,
      title,
      ...pluginConfig,
    };

    if (configBehavior?.requiresDataSource) {
      formData.dataSourceId = dataSourceId;
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
    return {
      title,
      ...pluginConfig,
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

          {configBehavior?.showTitleInput && (
            <div className="space-y-2">
              <Label htmlFor="chart-title">標題</Label>
              <Input
                id="chart-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={chartType === 'embed' ? '嵌入報表' : '輸入標題...'}
                maxLength={50}
                data-testid="chart-title-input"
              />
            </div>
          )}

          {configBehavior?.requiresDataSource && (
            <DataSourceSelector
              dataSources={dataSources}
              value={dataSourceId}
              onChange={handleDataSourceChange}
              error={errors.dataSourceId}
            />
          )}

          {ConfigFields && (configBehavior?.requiresDataSource ? selectedDataSource : true) && (
            <ConfigFields
              value={getConfigFieldsValue()}
              onChange={handleKpiConfigChange}
              fields={selectedDataSource?.fields || []}
              errors={errors}
              {...(isAiCommentType ? { availableWidgets: availableWidgetsForAiComment } : {})}
            />
          )}

          {chartType === 'embed' ? (
            <EmbedPreview url={(pluginConfig.url as string) || ''} title={title} />
          ) : (
            <ChartPreview
              chartType={chartType}
              dataSource={selectedDataSource}
              xAxisField={(pluginConfig.xAxisField as string) || ''}
              yAxisFields={(pluginConfig.yAxisFields as string[]) || []}
              title={title}
              pluginConfig={pluginConfig}
            />
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
