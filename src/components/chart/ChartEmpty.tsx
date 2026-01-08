import { BarChart3 } from 'lucide-react';

interface ChartEmptyProps {
  onConfigClick?: () => void;
}

export function ChartEmpty({ onConfigClick }: ChartEmptyProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      onClick={onConfigClick}
      data-testid="chart-empty"
    >
      <BarChart3 className="h-10 w-10 mb-2" />
      <p className="text-sm">點擊設定</p>
      <p className="text-xs">選擇 Widget 類型</p>
    </div>
  );
}
