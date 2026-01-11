import { X, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetFilterBadge } from '@/components/dashboard';
import type { Widget } from '@/types/dashboard';
import type { DashboardFilter } from '@/types/filter';

interface WidgetContainerProps {
  widget: Widget;
  onDelete: () => void;
  onConfig: () => void;
  filters?: DashboardFilter[];
  children?: React.ReactNode;
}

export function WidgetContainer({ widget, onDelete, onConfig, filters = [], children }: WidgetContainerProps) {
  const getTitle = () => {
    if (!widget.chartConfig) return '未設定';
    if (widget.chartConfig.title) return widget.chartConfig.title;
    if (widget.chartConfig.chartType === 'embed') return '嵌入報表';
    return widget.chartConfig.chartType || '未設定';
  };

  const title = getTitle();

  return (
    <div className="relative flex flex-col h-full bg-card border shadow-sm overflow-hidden">
      <div
        className="flex items-center justify-between px-3 py-2 border-b bg-muted/50 cursor-move widget-drag-handle"
        data-testid="widget-header"
      >
        <span className="text-sm font-medium truncate" data-testid="widget-title">
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <WidgetFilterBadge filters={filters} />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onConfig();
            }}
            data-testid="widget-config-button"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            data-testid="widget-delete-button"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden" data-testid="widget-content">
        {children}
      </div>
    </div>
  );
}
