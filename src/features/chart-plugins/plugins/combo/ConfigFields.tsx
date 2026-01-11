import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { ConfigFieldsProps } from '../../types';
import type { ComboChartConfig } from './schema';

export function ComboChartConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<ComboChartConfig>) {
  const numberFields = (fields ?? []).filter(f => f.type === 'number');

  const handleXAxisChange = (xAxisField: string) => {
    onChange({ ...value, xAxisField });
  };

  const handleLeftYAxisToggle = (fieldName: string, checked: boolean) => {
    const currentFields = value.leftYAxisFields || [];
    if (checked) {
      onChange({ ...value, leftYAxisFields: [...currentFields, fieldName] });
    } else {
      onChange({ ...value, leftYAxisFields: currentFields.filter(f => f !== fieldName) });
    }
  };

  const handleRightYAxisToggle = (fieldName: string, checked: boolean) => {
    const currentFields = value.rightYAxisFields || [];
    if (checked) {
      onChange({ ...value, rightYAxisFields: [...currentFields, fieldName] });
    } else {
      onChange({ ...value, rightYAxisFields: currentFields.filter(f => f !== fieldName) });
    }
  };

  return (
    <div className="space-y-4" data-testid="combo-chart-config-fields">
      {/* X Axis Field */}
      <div className="space-y-2">
        <Label>X 軸欄位</Label>
        <Select value={value.xAxisField || ''} onValueChange={handleXAxisChange}>
          <SelectTrigger data-testid="combo-x-axis-select">
            <SelectValue placeholder="選擇 X 軸欄位..." />
          </SelectTrigger>
          <SelectContent>
            {(fields ?? []).map((field) => (
              <SelectItem 
                key={field.name} 
                value={field.name}
                data-testid={`combo-x-axis-option-${field.name}`}
              >
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.xAxisField && (
          <p className="text-sm text-destructive">{errors.xAxisField}</p>
        )}
      </div>

      {/* Left Y Axis (Bar) */}
      <div className="space-y-2">
        <Label>左軸欄位（Bar）</Label>
        <div className="border rounded-md p-3 space-y-2" data-testid="combo-left-y-axis-checkboxes">
          {numberFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">無可用的數值欄位</p>
          ) : (
            numberFields.map((field) => (
              <div key={field.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`left-y-axis-${field.name}`}
                  checked={(value.leftYAxisFields || []).includes(field.name)}
                  onCheckedChange={(checked) => handleLeftYAxisToggle(field.name, checked === true)}
                  data-testid={`combo-left-y-field-${field.name}`}
                />
                <label
                  htmlFor={`left-y-axis-${field.name}`}
                  className="text-sm cursor-pointer"
                >
                  {field.label}
                </label>
              </div>
            ))
          )}
        </div>
        {errors?.leftYAxisFields && (
          <p className="text-sm text-destructive">{errors.leftYAxisFields}</p>
        )}
      </div>

      {/* Left Y Axis Label */}
      <div className="space-y-2">
        <Label>左軸標籤</Label>
        <Input
          value={value.leftYAxisLabel || ''}
          onChange={(e) => onChange({ ...value, leftYAxisLabel: e.target.value })}
          placeholder="例如：銷售額（萬）"
          data-testid="combo-left-y-label-input"
        />
      </div>

      {/* Right Y Axis (Line) */}
      <div className="space-y-2">
        <Label>右軸欄位（Line）</Label>
        <div className="border rounded-md p-3 space-y-2" data-testid="combo-right-y-axis-checkboxes">
          {numberFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">無可用的數值欄位</p>
          ) : (
            numberFields.map((field) => (
              <div key={field.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`right-y-axis-${field.name}`}
                  checked={(value.rightYAxisFields || []).includes(field.name)}
                  onCheckedChange={(checked) => handleRightYAxisToggle(field.name, checked === true)}
                  data-testid={`combo-right-y-field-${field.name}`}
                />
                <label
                  htmlFor={`right-y-axis-${field.name}`}
                  className="text-sm cursor-pointer"
                >
                  {field.label}
                </label>
              </div>
            ))
          )}
        </div>
        {errors?.rightYAxisFields && (
          <p className="text-sm text-destructive">{errors.rightYAxisFields}</p>
        )}
      </div>

      {/* Right Y Axis Label */}
      <div className="space-y-2">
        <Label>右軸標籤</Label>
        <Input
          value={value.rightYAxisLabel || ''}
          onChange={(e) => onChange({ ...value, rightYAxisLabel: e.target.value })}
          placeholder="例如：成長率（%）"
          data-testid="combo-right-y-label-input"
        />
      </div>

      {/* Smooth Line Option */}
      <div className="flex items-center justify-between">
        <Label htmlFor="smooth-switch">平滑曲線</Label>
        <Switch
          id="smooth-switch"
          checked={value.smooth || false}
          onCheckedChange={(checked) => onChange({ ...value, smooth: checked })}
          data-testid="combo-smooth-switch"
        />
      </div>
    </div>
  );
}
