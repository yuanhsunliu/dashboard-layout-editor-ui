import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { chartRegistry } from '@/features/chart-plugins';
import type { ChartType } from '@/types/chart';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
  error?: string;
}

export function ChartTypeSelector({ value, onChange, error }: ChartTypeSelectorProps) {
  const chartTypes = chartRegistry.getAll();

  return (
    <div className="space-y-2">
      <Label>Widget 類型</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ChartType)}>
        <SelectTrigger data-testid="chart-type-select">
          <SelectValue placeholder="選擇 Widget 類型" />
        </SelectTrigger>
        <SelectContent>
          {chartTypes.map((plugin) => {
            const Icon = plugin.icon;
            return (
              <SelectItem 
                key={plugin.type} 
                value={plugin.type}
                data-testid={`chart-type-option-${plugin.type}`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {plugin.name}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
