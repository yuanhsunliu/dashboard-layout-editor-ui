import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp, BarChart3 } from 'lucide-react';
import type { ChartType } from '@/types/chart';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
  error?: string;
}

const chartTypes: { value: ChartType; label: string; icon: React.ReactNode }[] = [
  { value: 'line', label: '折線圖', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'bar', label: '長條圖', icon: <BarChart3 className="h-4 w-4" /> },
];

export function ChartTypeSelector({ value, onChange, error }: ChartTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>圖表類型</Label>
      <Select value={value} onValueChange={(v) => onChange(v as ChartType)}>
        <SelectTrigger data-testid="chart-type-select">
          <SelectValue placeholder="選擇圖表類型" />
        </SelectTrigger>
        <SelectContent>
          {chartTypes.map((type) => (
            <SelectItem 
              key={type.value} 
              value={type.value}
              data-testid={`chart-type-option-${type.value}`}
            >
              <span className="flex items-center gap-2">
                {type.icon}
                {type.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
