import { create } from 'zustand';
import type { Dashboard, LayoutItem, Widget } from '@/types/dashboard';
import type { ChartConfig } from '@/types/chart';
import { updateDashboard, getDashboard } from '@/services/dashboardApi';

interface DashboardEditorState {
  dashboard: Dashboard | null;
  isSaving: boolean;
  saveError: string | null;
  initDashboard: (id: string) => Promise<void>;
  addWidget: (chartConfig?: ChartConfig) => Promise<void>;
  removeWidget: (widgetId: string) => Promise<void>;
  updateWidgetConfig: (widgetId: string, chartConfig: ChartConfig) => Promise<void>;
  updateLayout: (layout: LayoutItem[]) => void;
  saveLayoutDebounced: () => void;
}

const DEFAULT_WIDGET_SIZE = { w: 4, h: 3, minW: 2, minH: 2, maxW: 12 };

function generateWidgetId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const useDashboardEditorStore = create<DashboardEditorState>((set, get) => ({
  dashboard: null,
  isSaving: false,
  saveError: null,

  initDashboard: async (id: string) => {
    const data = await getDashboard(id);
    set({ dashboard: data, saveError: null });
  },

  addWidget: async (chartConfig?: ChartConfig) => {
    const { dashboard } = get();
    if (!dashboard) return;

    const widgetId = generateWidgetId();
    const newWidget: Widget = {
      id: widgetId,
      chartConfig,
    };

    const maxY = dashboard.layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
    const newLayoutItem: LayoutItem = {
      i: widgetId,
      x: 0,
      y: maxY,
      w: DEFAULT_WIDGET_SIZE.w,
      h: DEFAULT_WIDGET_SIZE.h,
    };

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: [...dashboard.widgets, newWidget],
      layout: [...dashboard.layout, newLayoutItem],
    };

    set({ dashboard: updatedDashboard, isSaving: true });

    try {
      await updateDashboard(dashboard.id, {
        widgets: updatedDashboard.widgets,
        layout: updatedDashboard.layout,
      });
      set({ isSaving: false, saveError: null });
    } catch {
      set({ isSaving: false, saveError: '儲存失敗' });
    }
  },

  removeWidget: async (widgetId: string) => {
    const { dashboard } = get();
    if (!dashboard) return;

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      layout: dashboard.layout.filter(l => l.i !== widgetId),
    };

    set({ dashboard: updatedDashboard, isSaving: true });

    try {
      await updateDashboard(dashboard.id, {
        widgets: updatedDashboard.widgets,
        layout: updatedDashboard.layout,
      });
      set({ isSaving: false, saveError: null });
    } catch {
      set({ isSaving: false, saveError: '儲存失敗' });
    }
  },

  updateWidgetConfig: async (widgetId: string, chartConfig: ChartConfig) => {
    const { dashboard } = get();
    if (!dashboard) return;

    const updatedWidgets = dashboard.widgets.map(w =>
      w.id === widgetId ? { ...w, chartConfig } : w
    );

    const updatedDashboard: Dashboard = {
      ...dashboard,
      widgets: updatedWidgets,
    };

    set({ dashboard: updatedDashboard, isSaving: true });

    try {
      await updateDashboard(dashboard.id, { widgets: updatedWidgets });
      set({ isSaving: false, saveError: null });
    } catch {
      set({ isSaving: false, saveError: '儲存失敗' });
    }
  },

  updateLayout: (layout: LayoutItem[]) => {
    const { dashboard } = get();
    if (!dashboard) return;

    set({
      dashboard: { ...dashboard, layout },
    });

    get().saveLayoutDebounced();
  },

  saveLayoutDebounced: () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    saveTimeout = setTimeout(async () => {
      const { dashboard } = get();
      if (!dashboard) return;

      set({ isSaving: true });

      try {
        await updateDashboard(dashboard.id, { 
          layout: dashboard.layout,
          widgets: dashboard.widgets,
        });
        set({ isSaving: false, saveError: null });
      } catch {
        set({ isSaving: false, saveError: '儲存失敗' });
      }
    }, 500);
  },
}));
