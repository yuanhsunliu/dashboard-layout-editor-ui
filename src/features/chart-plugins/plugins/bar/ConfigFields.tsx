import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { ConfigFieldsProps } from '../../types';
import type { BarChartConfig } from './schema';

export function BarChartConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<BarChartConfig>) {
  const numberFields = (fields ?? []).filter(f => f.type === 'number');

  const handleXAxisChange = (xAxisField: string) => {
    onChange({ ...value, xAxisField });
  };

  const handleYAxisToggle = (fieldName: string, checked: boolean) => {
    const currentYAxisFields = value.yAxisFields || [];
    if (checked) {
      onChange({ ...value, yAxisFields: [...currentYAxisFields, fieldName] });
    } else {
      onChange({ ...value, yAxisFields: currentYAxisFields.filter(f => f !== fieldName) });
    }
  };

  return (
    <div className="space-y-4" data-testid="field-mapping-form">
      <div className="space-y-2">
        <Label>X 軸欄位</Label>
        <Select value={value.xAxisField || ''} onValueChange={handleXAxisChange}>
          <SelectTrigger data-testid="x-axis-select">
            <SelectValue placeholder="選擇 X 軸欄位..." />
          </SelectTrigger>
          <SelectContent>
            {(fields ?? []).map((field) => (
              <SelectItem 
                key={field.name} 
                value={field.name}
                data-testid={`x-axis-option-${field.name}`}
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

      <div className="space-y-2">
        <Label>Y 軸欄位</Label>
        <div className="border rounded-md p-3 space-y-2" data-testid="y-axis-checkboxes">
          {numberFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">無可用的數值欄位</p>
          ) : (
            numberFields.map((field) => (
              <div key={field.name} className="flex items-center space-x-2">
                <Checkbox
                  id={`y-axis-${field.name}`}
                  checked={(value.yAxisFields || []).includes(field.name)}
                  onCheckedChange={(checked) => handleYAxisToggle(field.name, checked === true)}
                  data-testid="y-axis-field-checkbox"
                />
                <label
                  htmlFor={`y-axis-${field.name}`}
                  className="text-sm cursor-pointer"
                >
                  {field.label}
                </label>
              </div>
            ))
          )}
        </div>
        {errors?.yAxisFields && (
          <p className="text-sm text-destructive">{errors.yAxisFields}</p>
        )}
      </div>
    </div>
  );
}
