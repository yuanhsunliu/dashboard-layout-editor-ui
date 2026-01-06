import { useMemo } from 'react';
import GridLayout, { verticalCompactor } from 'react-grid-layout';
import type { LayoutItem as RGLLayoutItem } from 'react-grid-layout';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WidgetContainer, WidgetEmptyState } from '@/features/widget/components';
import { ChartWidget } from '@/components/chart';
import type { Dashboard, LayoutItem } from '@/types/dashboard';
import 'react-grid-layout/css/styles.css';

const GRID_CONFIG = {
  cols: 12,
  rowHeight: 80,
  margin: [16, 16] as const,
};

const DEFAULT_WIDGET_SIZE = { minW: 2, minH: 2, maxW: 12 };

interface DashboardGridProps {
  dashboard: Dashboard;
  onAddWidget: () => void;
  onRemoveWidget: (widgetId: string) => void;
  onLayoutChange: (layout: LayoutItem[]) => void;
  containerWidth: number;
}

export function DashboardGrid({
  dashboard,
  onAddWidget,
  onRemoveWidget,
  onLayoutChange,
  containerWidth,
}: DashboardGridProps) {
  const widgetMap = useMemo(() => {
    return new Map(dashboard.widgets.map(w => [w.id, w]));
  }, [dashboard.widgets]);

  const layoutWithConstraints: RGLLayoutItem[] = useMemo(() => {
    return dashboard.layout.map(item => ({
      ...item,
      ...DEFAULT_WIDGET_SIZE,
    }));
  }, [dashboard.layout]);

  const handleLayoutChange = (newLayout: readonly RGLLayoutItem[]) => {
    const layoutItems: LayoutItem[] = newLayout.map(({ i, x, y, w, h }) => ({
      i,
      x,
      y,
      w,
      h,
    }));
    onLayoutChange(layoutItems);
  };

  if (dashboard.widgets.length === 0) {
    return <WidgetEmptyState onAddWidget={onAddWidget} />;
  }

  return (
    <div className="relative" data-testid="dashboard-grid">
      <div className="absolute top-0 right-0 z-10 p-2">
        <Button onClick={() => onAddWidget()} size="sm" data-testid="add-widget-button">
          <Plus className="h-4 w-4 mr-2" />
          新增 Widget
        </Button>
      </div>
      <GridLayout
        className="layout"
        layout={layoutWithConstraints}
        width={containerWidth}
        gridConfig={{
          cols: GRID_CONFIG.cols,
          rowHeight: GRID_CONFIG.rowHeight,
          margin: GRID_CONFIG.margin,
        }}
        dragConfig={{
          handle: '.widget-drag-handle',
        }}
        onLayoutChange={handleLayoutChange}
        compactor={verticalCompactor}
      >
        {dashboard.layout.map(item => {
          const widget = widgetMap.get(item.i);
          if (!widget) return null;

          return (
            <div key={item.i} data-testid={`widget-${item.i}`}>
              <WidgetContainer
                widget={widget}
                onDelete={() => onRemoveWidget(item.i)}
              >
                <ChartWidget chartConfig={widget.chartConfig} />
              </WidgetContainer>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
