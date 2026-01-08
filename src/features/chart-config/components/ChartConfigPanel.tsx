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
import type { ChartConfig, ChartType, EmbedConfig } from '@/types/chart';

interface ChartConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: ChartConfig) => void;
  initialConfig?: ChartConfig;
}

export function ChartConfigPanel({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}: ChartConfigPanelProps) {
  const dataSources = useMemo(() => getDataSources(), []);

  const [chartType, setChartType] = useState<ChartType>('line');
  const [title, setTitle] = useState('');
  const [dataSourceId, setDataSourceId] = useState('');
  const [xAxisField, setXAxisField] = useState('');
  const [yAxisFields, setYAxisFields] = useState<string[]>([]);
  const [embedUrl, setEmbedUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEmbedType = chartType === 'embed';

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      if (initialConfig) {
        setChartType(initialConfig.chartType);
        setTitle(initialConfig.title || '');
        if (initialConfig.chartType === 'embed') {
          setEmbedUrl((initialConfig as EmbedConfig).url || '');
          setDataSourceId('');
          setXAxisField('');
          setYAxisFields([]);
        } else {
          setDataSourceId('dataSourceId' in initialConfig ? initialConfig.dataSourceId : '');
          setXAxisField('xAxisField' in initialConfig ? initialConfig.xAxisField : '');
          setYAxisFields('yAxisFields' in initialConfig ? initialConfig.yAxisFields : []);
          setEmbedUrl('');
        }
      } else {
        setChartType('line');
        setTitle('');
        setDataSourceId('');
        setXAxisField('');
        setYAxisFields([]);
        setEmbedUrl('');
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
    if (type === 'embed') {
      setTitle('嵌入報表');
    } else if (chartType === 'embed') {
      setTitle('');
    }
  };

  const handleDataSourceChange = (id: string) => {
    setDataSourceId(id);
    setXAxisField('');
    setYAxisFields([]);
  };

  const handleFieldsChange = (value: Record<string, unknown>) => {
    if (typeof value.xAxisField === 'string') setXAxisField(value.xAxisField);
    if (Array.isArray(value.yAxisFields)) setYAxisFields(value.yAxisFields as string[]);
    if (typeof value.url === 'string') setEmbedUrl(value.url);
  };

  const handleSave = () => {
    if (!currentPlugin) return;

    let formData: Record<string, unknown>;
    
    if (isEmbedType) {
      formData = {
        chartType,
        title: title || '嵌入報表',
        url: embedUrl,
      };
    } else {
      formData = {
        chartType,
        title,
        dataSourceId,
        xAxisField,
        yAxisFields,
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

          {isEmbedType ? (
            <>
              {ConfigFields && (
                <ConfigFields
                  value={{ url: embedUrl }}
                  onChange={handleFieldsChange}
                  fields={[]}
                  errors={{ url: errors.url }}
                />
              )}
              <EmbedPreview url={embedUrl} title={title} />
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
                  value={{ xAxisField, yAxisFields }}
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
                xAxisField={xAxisField}
                yAxisFields={yAxisFields}
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
