import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardFilterStore } from '@/stores/useDashboardFilterStore';
import { formatFilterDisplay } from '@/features/chart-plugins/utils/filterUtils';

export function DashboardFilterBar() {
  const { filters, removeFiltersAfter, clearAllFilters } = useDashboardFilterStore();

  if (filters.length === 0) return null;

  return (
    <div 
      className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2"
      data-testid="dashboard-filter-bar"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-2">篩選中:</span>
        {filters.map((filter) => (
          <Badge
            key={filter.id}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
            data-testid={`filter-tag-${filter.field}`}
          >
            <span>{formatFilterDisplay(filter)}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-destructive/20"
              onClick={() => removeFiltersAfter(filter.id)}
              data-testid={`remove-filter-${filter.field}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={clearAllFilters}
          data-testid="clear-all-filters"
        >
          清除全部
        </Button>
      </div>
    </div>
  );
}
