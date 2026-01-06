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
import { FieldMappingForm } from './fields';
import { ChartPreview } from './ChartPreview';
import { getDataSources, getDataSourceById } from '../services/mockDataSources';
import { chartConfigSchema } from '../schemas';
import type { ChartConfig, ChartType } from '@/types/chart';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (isOpen) {
      if (initialConfig) {
        setChartType(initialConfig.chartType);
        setTitle(initialConfig.title || '');
        setDataSourceId(initialConfig.dataSourceId);
        setXAxisField(initialConfig.xAxisField);
        setYAxisFields(initialConfig.yAxisFields);
      } else {
        setChartType('line');
        setTitle('');
        setDataSourceId('');
        setXAxisField('');
        setYAxisFields([]);
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
    setChartType(type);
  };

  const handleDataSourceChange = (id: string) => {
    setDataSourceId(id);
    setXAxisField('');
    setYAxisFields([]);
  };

  const handleSave = () => {
    const formData = {
      chartType,
      title,
      dataSourceId,
      xAxisField,
      yAxisFields,
    };

    const result = chartConfigSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const config: ChartConfig = {
      chartType,
      title: title || undefined,
      dataSourceId,
      xAxisField,
      yAxisFields,
    } as ChartConfig;

    onSave(config);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        className="w-[400px] sm:w-[540px] overflow-y-auto"
        data-testid="chart-config-panel"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>圖表設定</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="chart-title">圖表標題</Label>
            <Input
              id="chart-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="輸入圖表標題..."
              maxLength={50}
              data-testid="chart-title-input"
            />
          </div>

          <ChartTypeSelector value={chartType} onChange={handleChartTypeChange} error={errors.chartType} />

          <DataSourceSelector
            dataSources={dataSources}
            value={dataSourceId}
            onChange={handleDataSourceChange}
            error={errors.dataSourceId}
          />

          {selectedDataSource && (
            <FieldMappingForm
              fields={selectedDataSource.fields}
              xAxisField={xAxisField}
              yAxisFields={yAxisFields}
              onXAxisChange={setXAxisField}
              onYAxisChange={setYAxisFields}
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
