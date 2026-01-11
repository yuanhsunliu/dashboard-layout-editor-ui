import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { ConfigFieldsProps } from '../../types';
import type { LineChartConfig } from './schema';

const SORT_OPTIONS = [
  { value: 'data', label: '依資料順序' },
  { value: 'asc', label: '遞增' },
  { value: 'desc', label: '遞減' },
] as const;

export function LineChartConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<LineChartConfig>) {
  const hasAdvancedEnabled = value.enableHierarchicalXAxis || value.enableDualYAxis || value.enableGroupBy || false;
  const [advancedOpen, setAdvancedOpen] = useState(hasAdvancedEnabled);
  
  useEffect(() => {
    if (hasAdvancedEnabled) {
      setAdvancedOpen(true);
    }
  }, [hasAdvancedEnabled]);
  
  const numberFields = (fields ?? []).filter(f => f.type === 'number');
  const allFields = fields ?? [];

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

  const handleLeftYAxisToggle = (fieldName: string, checked: boolean) => {
    const currentFields = value.leftYAxisFields || [];
    
    if (value.enableGroupBy) {
      if (checked) {
        onChange({ ...value, leftYAxisFields: [fieldName], rightYAxisFields: [] });
      } else {
        onChange({ ...value, leftYAxisFields: [] });
      }
    } else {
      if (checked) {
        onChange({ ...value, leftYAxisFields: [...currentFields, fieldName] });
      } else {
        onChange({ ...value, leftYAxisFields: currentFields.filter(f => f !== fieldName) });
      }
    }
  };

  const handleRightYAxisToggle = (fieldName: string, checked: boolean) => {
    const currentFields = value.rightYAxisFields || [];
    
    if (value.enableGroupBy) {
      if (checked) {
        onChange({ ...value, rightYAxisFields: [fieldName], leftYAxisFields: [] });
      } else {
        onChange({ ...value, rightYAxisFields: [] });
      }
    } else {
      if (checked) {
        onChange({ ...value, rightYAxisFields: [...currentFields, fieldName] });
      } else {
        onChange({ ...value, rightYAxisFields: currentFields.filter(f => f !== fieldName) });
      }
    }
  };

  const handleEnableHierarchicalXAxis = (enabled: boolean) => {
    onChange({
      ...value,
      enableHierarchicalXAxis: enabled,
      outerXAxisField: enabled ? value.outerXAxisField : '',
      innerXAxisField: enabled ? value.innerXAxisField : '',
    });
  };

  const handleEnableDualYAxis = (enabled: boolean) => {
    if (enabled) {
      onChange({
        ...value,
        enableDualYAxis: true,
        leftYAxisFields: value.yAxisFields || [],
        rightYAxisFields: [],
      });
    } else {
      onChange({
        ...value,
        enableDualYAxis: false,
        yAxisFields: value.leftYAxisFields || [],
      });
    }
  };

  const handleEnableGroupBy = (enabled: boolean) => {
    onChange({
      ...value,
      enableGroupBy: enabled,
      groupByField: enabled ? value.groupByField : '',
    });
  };

  return (
    <div className="space-y-4" data-testid="field-mapping-form">
      {/* 基本 X 軸欄位 - 未啟用階層式時顯示 */}
      {!value.enableHierarchicalXAxis && (
        <div className="space-y-2">
          <Label>X 軸欄位</Label>
          <Select value={value.xAxisField || ''} onValueChange={handleXAxisChange}>
            <SelectTrigger data-testid="x-axis-select">
              <SelectValue placeholder="選擇 X 軸欄位..." />
            </SelectTrigger>
            <SelectContent>
              {allFields.map((field) => (
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
      )}

      {/* 基本 Y 軸欄位 - 未啟用雙軸時顯示 */}
      {!value.enableDualYAxis && (
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
      )}

      {/* 進階設定 */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger 
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
          data-testid="advanced-settings-trigger"
        >
          {advancedOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          進階設定
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-4" data-testid="advanced-settings-content">
          {/* 階層式 X 軸 */}
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-hierarchical-x">啟用階層式 X 軸</Label>
              <Switch
                id="enable-hierarchical-x"
                checked={value.enableHierarchicalXAxis || false}
                onCheckedChange={handleEnableHierarchicalXAxis}
                data-testid="enable-hierarchical-x-switch"
              />
            </div>
            
            {value.enableHierarchicalXAxis && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>外層 X 軸欄位</Label>
                    <Select 
                      value={value.outerXAxisField || ''} 
                      onValueChange={(v) => onChange({ ...value, outerXAxisField: v })}
                    >
                      <SelectTrigger data-testid="outer-x-axis-select">
                        <SelectValue placeholder="選擇欄位..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>外層排序</Label>
                    <Select 
                      value={value.outerXAxisSort || 'data'} 
                      onValueChange={(v) => onChange({ ...value, outerXAxisSort: v as 'asc' | 'desc' | 'data' })}
                    >
                      <SelectTrigger data-testid="outer-x-axis-sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>內層 X 軸欄位</Label>
                    <Select 
                      value={value.innerXAxisField || ''} 
                      onValueChange={(v) => onChange({ ...value, innerXAxisField: v })}
                    >
                      <SelectTrigger data-testid="inner-x-axis-select">
                        <SelectValue placeholder="選擇欄位..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>內層排序</Label>
                    <Select 
                      value={value.innerXAxisSort || 'data'} 
                      onValueChange={(v) => onChange({ ...value, innerXAxisSort: v as 'asc' | 'desc' | 'data' })}
                    >
                      <SelectTrigger data-testid="inner-x-axis-sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 雙 Y 軸 */}
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-dual-y">啟用雙 Y 軸</Label>
              <Switch
                id="enable-dual-y"
                checked={value.enableDualYAxis || false}
                onCheckedChange={handleEnableDualYAxis}
                data-testid="enable-dual-y-switch"
              />
            </div>
            
            {value.enableDualYAxis && (
              <div className="space-y-4 pt-2">
                {value.enableGroupBy && (
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ 啟用分群時，Y 軸只能選擇一個欄位
                  </p>
                )}
                <div className="space-y-2">
                  <Label>左軸欄位</Label>
                  <div className="border rounded-md p-3 space-y-2" data-testid="left-y-axis-checkboxes">
                    {numberFields.map((field) => (
                      <div key={field.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`left-y-axis-${field.name}`}
                          checked={(value.leftYAxisFields || []).includes(field.name)}
                          onCheckedChange={(checked) => handleLeftYAxisToggle(field.name, checked === true)}
                          data-testid={`left-y-axis-checkbox-${field.name}`}
                        />
                        <label
                          htmlFor={`left-y-axis-${field.name}`}
                          className="text-sm cursor-pointer"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>右軸欄位</Label>
                  <div className="border rounded-md p-3 space-y-2" data-testid="right-y-axis-checkboxes">
                    {numberFields.map((field) => (
                      <div key={field.name} className="flex items-center space-x-2">
                        <Checkbox
                          id={`right-y-axis-${field.name}`}
                          checked={(value.rightYAxisFields || []).includes(field.name)}
                          onCheckedChange={(checked) => handleRightYAxisToggle(field.name, checked === true)}
                          data-testid={`right-y-axis-checkbox-${field.name}`}
                        />
                        <label
                          htmlFor={`right-y-axis-${field.name}`}
                          className="text-sm cursor-pointer"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Series 分群 */}
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-group-by">啟用 Series 分群</Label>
              <Switch
                id="enable-group-by"
                checked={value.enableGroupBy || false}
                onCheckedChange={handleEnableGroupBy}
                data-testid="enable-group-by-switch"
              />
            </div>
            
            {value.enableGroupBy && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>分群欄位</Label>
                    <Select 
                      value={value.groupByField || ''} 
                      onValueChange={(v) => onChange({ ...value, groupByField: v })}
                    >
                      <SelectTrigger data-testid="group-by-field-select">
                        <SelectValue placeholder="選擇欄位..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allFields.map((field) => (
                          <SelectItem key={field.name} value={field.name}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>分群排序</Label>
                    <Select 
                      value={value.groupBySort || 'data'} 
                      onValueChange={(v) => onChange({ ...value, groupBySort: v as 'asc' | 'desc' | 'data' })}
                    >
                      <SelectTrigger data-testid="group-by-sort-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
