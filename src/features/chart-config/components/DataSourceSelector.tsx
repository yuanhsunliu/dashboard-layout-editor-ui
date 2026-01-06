import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { DataSource } from '../types';

interface DataSourceSelectorProps {
  dataSources: DataSource[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DataSourceSelector({ dataSources, value, onChange, error }: DataSourceSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>資料來源</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger data-testid="data-source-select">
          <SelectValue placeholder="選擇資料來源..." />
        </SelectTrigger>
        <SelectContent>
          {dataSources.map((ds) => (
            <SelectItem 
              key={ds.id} 
              value={ds.id}
              data-testid={`data-source-option-${ds.id}`}
            >
              {ds.name}
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
