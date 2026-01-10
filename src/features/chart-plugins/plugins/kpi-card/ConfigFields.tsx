import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { ConfigFieldsProps } from '../../types';
import type { KpiCardConfig } from './schema';

const FONT_SIZE_OPTIONS = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
] as const;

export function KpiCardConfigFields({
  value,
  onChange,
  errors,
}: ConfigFieldsProps<KpiCardConfig>) {
  const format = value.format || {};

  const handleFormatChange = (key: string, val: boolean | number | string) => {
    onChange({
      ...value,
      format: {
        ...format,
        [key]: val,
      },
    });
  };

  const handleValueChange = (numValue: string) => {
    const parsed = parseFloat(numValue);
    onChange({
      ...value,
      value: isNaN(parsed) ? undefined : parsed,
    });
  };

  const handleCompareValueChange = (numValue: string) => {
    const parsed = parseFloat(numValue);
    onChange({
      ...value,
      compareValue: isNaN(parsed) ? undefined : parsed,
    });
  };

  return (
    <div className="space-y-4" data-testid="kpi-config-form">
      <div className="space-y-2">
        <Label>標題</Label>
        <Input
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="輸入 KPI 標題..."
          maxLength={50}
          data-testid="kpi-title-input"
        />
      </div>

      <div className="space-y-2">
        <Label>數值 *</Label>
        <Input
          type="number"
          value={value.value ?? ''}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="輸入 KPI 數值..."
          data-testid="kpi-value-input"
        />
        {errors?.value && (
          <p className="text-sm text-destructive">{errors.value}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>比較數值（可選）</Label>
        <Input
          type="number"
          value={value.compareValue ?? ''}
          onChange={(e) => handleCompareValueChange(e.target.value)}
          placeholder="輸入比較數值以顯示趨勢..."
          data-testid="kpi-compare-input"
        />
        <p className="text-xs text-muted-foreground">
          輸入後會自動計算變化百分比並顯示趨勢箭頭
        </p>
      </div>

      <div className="space-y-2">
        <Label>字體大小</Label>
        <Select
          value={value.fontSize || 'md'}
          onValueChange={(v) => onChange({ ...value, fontSize: v as 'sm' | 'md' | 'lg' })}
        >
          <SelectTrigger data-testid="font-size-select">
            <SelectValue placeholder="選擇字體大小..." />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 border rounded-md p-3">
        <Label className="text-sm font-medium">格式化選項</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="thousandSeparator"
            checked={format.thousandSeparator !== false}
            onCheckedChange={(checked) =>
              handleFormatChange('thousandSeparator', checked === true)
            }
            data-testid="thousand-separator-checkbox"
          />
          <label htmlFor="thousandSeparator" className="text-sm cursor-pointer">
            千分位分隔
          </label>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">小數位數</Label>
          <Select
            value={String(format.decimalPlaces ?? 0)}
            onValueChange={(v) => handleFormatChange('decimalPlaces', parseInt(v))}
          >
            <SelectTrigger data-testid="decimal-places-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">0</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPercentage"
            checked={format.isPercentage === true}
            onCheckedChange={(checked) =>
              handleFormatChange('isPercentage', checked === true)
            }
            data-testid="percentage-checkbox"
          />
          <label htmlFor="isPercentage" className="text-sm cursor-pointer">
            百分比顯示
          </label>
        </div>

        <div className="space-y-2">
          <Label className="text-sm">單位後綴</Label>
          <Input
            value={format.suffix || ''}
            onChange={(e) => handleFormatChange('suffix', e.target.value)}
            placeholder="例：元、件、人"
            maxLength={10}
            data-testid="suffix-input"
          />
        </div>
      </div>
    </div>
  );
}
