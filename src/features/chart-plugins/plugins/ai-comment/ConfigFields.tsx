import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ConfigFieldsProps } from '../../types';
import type { AiCommentConfig } from './schema';

interface WidgetOption {
  id: string;
  title: string;
  chartType: string;
}

interface AiCommentConfigFieldsProps extends ConfigFieldsProps<AiCommentConfig> {
  availableWidgets?: WidgetOption[];
}

const CHART_TYPE_LABELS: Record<string, string> = {
  line: '折線圖',
  bar: '長條圖',
  area: '面積圖',
  embed: '嵌入',
  'kpi-card': 'KPI 卡片',
  'kpi-card-dynamic': 'KPI 卡片 (動態)',
};

export function AiCommentConfigFields({
  value,
  onChange,
  errors,
  availableWidgets = [],
}: AiCommentConfigFieldsProps) {
  return (
    <div className="space-y-4" data-testid="ai-comment-config-form">
      <div className="space-y-2">
        <Label>標題</Label>
        <Input
          value={value.title || ''}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="輸入標題..."
          maxLength={50}
          data-testid="ai-comment-title-input"
        />
      </div>

      <div className="space-y-2">
        <Label>目標 Widget *</Label>
        <Select
          value={value.targetWidgetId || ''}
          onValueChange={(v) => onChange({ ...value, targetWidgetId: v })}
        >
          <SelectTrigger data-testid="target-widget-select">
            <SelectValue placeholder="選擇要分析的 Widget..." />
          </SelectTrigger>
          <SelectContent>
            {availableWidgets.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                無可用的 Widget
              </div>
            ) : (
              availableWidgets.map((widget) => (
                <SelectItem
                  key={widget.id}
                  value={widget.id}
                  data-testid={`target-widget-option-${widget.id}`}
                >
                  {widget.title || '未設定'} ({CHART_TYPE_LABELS[widget.chartType] || widget.chartType})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors?.targetWidgetId && (
          <p className="text-sm text-destructive">{errors.targetWidgetId}</p>
        )}
      </div>
    </div>
  );
}
