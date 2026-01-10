import { Badge } from '@/components/ui/badge';
import type { DashboardFilter } from '@/types/filter';
import { formatBadgeDisplay } from '@/features/chart-plugins/utils/filterUtils';

interface WidgetFilterBadgeProps {
  filters: DashboardFilter[];
}

export function WidgetFilterBadge({ filters }: WidgetFilterBadgeProps) {
  if (filters.length === 0) return null;

  return (
    <div className="flex gap-1" data-testid="widget-filter-badge">
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="outline"
          className="text-xs bg-background/80 backdrop-blur"
        >
          {formatBadgeDisplay(filter)}
        </Badge>
      ))}
    </div>
  );
}
