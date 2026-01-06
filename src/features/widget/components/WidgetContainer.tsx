import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Widget } from '@/types/dashboard';

interface WidgetContainerProps {
  widget: Widget;
  onDelete: () => void;
  children?: React.ReactNode;
}

export function WidgetContainer({ widget, onDelete, children }: WidgetContainerProps) {
  const title = widget.chartConfig?.title || widget.chartConfig?.chartType || '未設定';

  return (
    <div className="flex flex-col h-full bg-card border rounded-lg shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 cursor-move widget-drag-handle"
        data-testid="widget-header"
      >
        <span className="text-sm font-medium truncate" data-testid="widget-title">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          data-testid="widget-delete-button"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden" data-testid="widget-content">
        {children}
      </div>
    </div>
  );
}
