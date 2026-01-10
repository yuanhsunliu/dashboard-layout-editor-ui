import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ConfigFieldsProps } from '../../types';
import type { ToolTimelineConfig, StatusColor, KpiField } from './schema';
import { DEFAULT_STATUS_COLORS } from './schema';

export function ToolTimelineConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<ToolTimelineConfig>) {
  const statusColors = value.statusColors?.length ? value.statusColors : DEFAULT_STATUS_COLORS;
  const kpiFields = value.kpiFields || [];

  useEffect(() => {
    if (!value.statusColors?.length) {
      onChange({ ...value, statusColors: DEFAULT_STATUS_COLORS });
    }
  }, []);

  const stringFields = (fields ?? []).filter(f => f.type === 'string');
  const timeFields = (fields ?? []).filter(f => f.type === 'string' || f.type === 'date');
  const numberFields = (fields ?? []).filter(f => f.type === 'number');

  const handleStatusColorChange = (index: number, key: keyof StatusColor, val: string) => {
    const updated = [...statusColors];
    updated[index] = { ...updated[index], [key]: val };
    onChange({ ...value, statusColors: updated });
  };

  const addStatusColor = () => {
    onChange({
      ...value,
      statusColors: [...statusColors, { status: '', color: '#808080', label: '' }],
    });
  };

  const removeStatusColor = (index: number) => {
    const updated = statusColors.filter((_, i) => i !== index);
    onChange({ ...value, statusColors: updated });
  };

  const handleKpiFieldChange = (index: number, key: keyof KpiField, val: string) => {
    const updated = [...kpiFields];
    updated[index] = { ...updated[index], [key]: val };
    onChange({ ...value, kpiFields: updated });
  };

  const addKpiField = () => {
    onChange({
      ...value,
      kpiFields: [...kpiFields, { field: '', label: '', format: 'number' }],
    });
  };

  const removeKpiField = (index: number) => {
    const updated = kpiFields.filter((_, i) => i !== index);
    onChange({ ...value, kpiFields: updated });
  };

  return (
    <div className="space-y-4" data-testid="tool-timeline-config-form">
      <div className="space-y-2">
        <Label>標題</Label>
        <Input
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="輸入標題..."
          maxLength={50}
          data-testid="tool-timeline-title-input"
        />
      </div>

      <div className="space-y-2">
        <Label>機台 ID 欄位 *</Label>
        <Select
          value={value.toolIdField || ''}
          onValueChange={(v) => onChange({ ...value, toolIdField: v })}
        >
          <SelectTrigger data-testid="tool-id-field-select">
            <SelectValue placeholder="選擇機台 ID 欄位..." />
          </SelectTrigger>
          <SelectContent>
            {stringFields.length === 0 ? (
              <SelectItem value="" disabled>無可用欄位</SelectItem>
            ) : (
              stringFields.map((field) => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors?.toolIdField && (
          <p className="text-sm text-destructive">{errors.toolIdField}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>開始時間欄位 *</Label>
        <Select
          value={value.startTimeField || ''}
          onValueChange={(v) => onChange({ ...value, startTimeField: v })}
        >
          <SelectTrigger data-testid="start-time-field-select">
            <SelectValue placeholder="選擇開始時間欄位..." />
          </SelectTrigger>
          <SelectContent>
            {timeFields.length === 0 ? (
              <SelectItem value="" disabled>無可用欄位</SelectItem>
            ) : (
              timeFields.map((field) => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors?.startTimeField && (
          <p className="text-sm text-destructive">{errors.startTimeField}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>結束時間欄位 *</Label>
        <Select
          value={value.endTimeField || ''}
          onValueChange={(v) => onChange({ ...value, endTimeField: v })}
        >
          <SelectTrigger data-testid="end-time-field-select">
            <SelectValue placeholder="選擇結束時間欄位..." />
          </SelectTrigger>
          <SelectContent>
            {timeFields.length === 0 ? (
              <SelectItem value="" disabled>無可用欄位</SelectItem>
            ) : (
              timeFields.map((field) => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors?.endTimeField && (
          <p className="text-sm text-destructive">{errors.endTimeField}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>狀態欄位 *</Label>
        <Select
          value={value.statusField || ''}
          onValueChange={(v) => onChange({ ...value, statusField: v })}
        >
          <SelectTrigger data-testid="status-field-select">
            <SelectValue placeholder="選擇狀態欄位..." />
          </SelectTrigger>
          <SelectContent>
            {stringFields.length === 0 ? (
              <SelectItem value="" disabled>無可用欄位</SelectItem>
            ) : (
              stringFields.map((field) => (
                <SelectItem key={field.name} value={field.name}>
                  {field.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors?.statusField && (
          <p className="text-sm text-destructive">{errors.statusField}</p>
        )}
      </div>

      <div className="space-y-3 border rounded-md p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">狀態顏色對應</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addStatusColor}
            data-testid="add-status-color-button"
          >
            <Plus className="h-4 w-4 mr-1" />
            新增
          </Button>
        </div>
        
        <div className="space-y-2">
          {statusColors.map((sc, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={sc.status}
                onChange={(e) => handleStatusColorChange(index, 'status', e.target.value)}
                placeholder="狀態值"
                className="flex-1"
                data-testid={`status-value-input-${index}`}
              />
              <Input
                type="color"
                value={sc.color}
                onChange={(e) => handleStatusColorChange(index, 'color', e.target.value)}
                className="w-12 h-9 p-1 cursor-pointer"
                data-testid={`status-color-input-${index}`}
              />
              <Input
                value={sc.label}
                onChange={(e) => handleStatusColorChange(index, 'label', e.target.value)}
                placeholder="顯示名稱"
                className="flex-1"
                data-testid={`status-label-input-${index}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeStatusColor(index)}
                disabled={statusColors.length <= 1}
                data-testid={`remove-status-color-button-${index}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border rounded-md p-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">OEE 指標欄位（可選）</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addKpiField}
            data-testid="add-kpi-field-button"
          >
            <Plus className="h-4 w-4 mr-1" />
            新增
          </Button>
        </div>

        {kpiFields.length === 0 ? (
          <p className="text-sm text-muted-foreground">尚未設定 KPI 欄位</p>
        ) : (
          <div className="space-y-2">
            {kpiFields.map((kpi, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={kpi.field || ''}
                  onValueChange={(v) => handleKpiFieldChange(index, 'field', v)}
                >
                  <SelectTrigger className="flex-1" data-testid={`kpi-field-select-${index}`}>
                    <SelectValue placeholder="欄位..." />
                  </SelectTrigger>
                  <SelectContent>
                    {numberFields.map((field) => (
                      <SelectItem key={field.name} value={field.name}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={kpi.label}
                  onChange={(e) => handleKpiFieldChange(index, 'label', e.target.value)}
                  placeholder="標籤"
                  className="w-20"
                  data-testid={`kpi-label-input-${index}`}
                />
                <Select
                  value={kpi.format || 'number'}
                  onValueChange={(v) => handleKpiFieldChange(index, 'format', v)}
                >
                  <SelectTrigger className="w-24" data-testid={`kpi-format-select-${index}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="number">數值</SelectItem>
                    <SelectItem value="percent">百分比</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKpiField(index)}
                  data-testid={`remove-kpi-field-button-${index}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
