import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WidgetEmptyStateProps {
  onAddWidget: () => void;
}

export function WidgetEmptyState({ onAddWidget }: WidgetEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-[400px] border-2 border-dashed border-muted rounded-lg"
      data-testid="widget-empty-state"
    >
      <p className="text-muted-foreground mb-4">尚無 Widget</p>
      <Button onClick={onAddWidget} data-testid="add-first-widget-button">
        <Plus className="h-4 w-4 mr-2" />
        新增第一個 Widget
      </Button>
    </div>
  );
}
