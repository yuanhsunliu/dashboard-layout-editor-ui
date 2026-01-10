import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ConditionalColor, ColorCondition, ColorOperator } from './conditional-color';
import { colorOperators } from './conditional-color';

const MAX_RULES = 5;

const OPERATOR_LABELS: Record<ColorOperator, string> = {
  '>': '大於 (>)',
  '>=': '大於等於 (>=)',
  '<': '小於 (<)',
  '<=': '小於等於 (<=)',
  '==': '等於 (==)',
};

interface ConditionalColorConfigProps {
  value?: ConditionalColor;
  onChange: (value: ConditionalColor) => void;
}

export function ConditionalColorConfig({
  value,
  onChange,
}: ConditionalColorConfigProps) {
  const config: ConditionalColor = value || { enabled: false, rules: [] };
  const rules = config.rules || [];

  const handleEnabledChange = (enabled: boolean) => {
    onChange({ ...config, enabled });
  };

  const handleAddRule = () => {
    if (rules.length >= MAX_RULES) return;
    const newRule: ColorCondition = {
      operator: '>',
      threshold: 0,
      color: '#22c55e',
    };
    onChange({ ...config, rules: [...rules, newRule] });
  };

  const handleRemoveRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    onChange({ ...config, rules: newRules });
  };

  const handleRuleChange = (index: number, field: keyof ColorCondition, fieldValue: string | number) => {
    const newRules = rules.map((rule, i) => {
      if (i !== index) return rule;
      return { ...rule, [field]: fieldValue };
    });
    onChange({ ...config, rules: newRules });
  };

  const handleDefaultColorChange = (color: string) => {
    onChange({ ...config, defaultColor: color || undefined });
  };

  return (
    <div className="space-y-3 border rounded-md p-3" data-testid="conditional-color-config">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">條件式顏色</Label>
        <Switch
          checked={config.enabled}
          onCheckedChange={handleEnabledChange}
          data-testid="conditional-color-enabled"
        />
      </div>

      {config.enabled && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            規則依序檢查，第一個符合的規則會套用顏色
          </p>

          {rules.map((rule, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded"
              data-testid={`color-rule-${index}`}
            >
              <Select
                value={rule.operator}
                onValueChange={(v) => handleRuleChange(index, 'operator', v as ColorOperator)}
              >
                <SelectTrigger className="w-32" data-testid={`rule-operator-${index}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOperators.map((op) => (
                    <SelectItem key={op} value={op}>
                      {OPERATOR_LABELS[op]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                value={rule.threshold}
                onChange={(e) => handleRuleChange(index, 'threshold', parseFloat(e.target.value) || 0)}
                className="w-20"
                data-testid={`rule-threshold-${index}`}
              />

              <div className="flex items-center gap-1">
                <Input
                  type="text"
                  value={rule.color}
                  onChange={(e) => handleRuleChange(index, 'color', e.target.value)}
                  className="w-24 font-mono text-xs"
                  placeholder="#000000"
                  data-testid={`rule-color-input-${index}`}
                />
                <input
                  type="color"
                  value={rule.color.length === 7 ? rule.color : '#000000'}
                  onChange={(e) => handleRuleChange(index, 'color', e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border"
                  data-testid={`rule-color-picker-${index}`}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRule(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
                data-testid={`rule-remove-${index}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {rules.length < MAX_RULES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRule}
              className="w-full"
              data-testid="add-color-rule"
            >
              <Plus className="h-4 w-4 mr-1" />
              新增規則 ({rules.length}/{MAX_RULES})
            </Button>
          )}

          <div className="space-y-2 pt-2 border-t">
            <Label className="text-xs">預設顏色（無規則符合時使用）</Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={config.defaultColor || ''}
                onChange={(e) => handleDefaultColorChange(e.target.value)}
                className="w-24 font-mono text-xs"
                placeholder="#000000"
                data-testid="default-color-input"
              />
              <input
                type="color"
                value={config.defaultColor?.length === 7 ? config.defaultColor : '#000000'}
                onChange={(e) => handleDefaultColorChange(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border"
                data-testid="default-color-picker"
              />
              {config.defaultColor && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDefaultColorChange('')}
                  className="text-xs"
                >
                  清除
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
