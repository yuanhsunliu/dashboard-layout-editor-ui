import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { InlineEditName } from '@/features/dashboard/components';
import { DashboardGrid } from '@/features/widget/components';
import { ChartConfigPanel } from '@/features/chart-config';
import { DashboardFilterBar } from '@/components/dashboard';
import { updateDashboard } from '@/services/dashboardApi';
import { useDashboardEditorStore } from '@/stores/useDashboardEditorStore';
import { useDashboardFilterStore } from '@/stores/useDashboardFilterStore';
import type { ChartConfig } from '@/types/chart';

export function DashboardEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isEditingName, setIsEditingName] = useState(false);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [configWidgetId, setConfigWidgetId] = useState<string | null>(null);

  const { dashboard, isSaving, saveError, initDashboard, addWidget, removeWidget, updateWidgetConfig, updateLayout } =
    useDashboardEditorStore();
  
  const clearAllFilters = useDashboardFilterStore(state => state.clearAllFilters);

  useEffect(() => {
    if (id) {
      initDashboard(id);
      clearAllFilters();
    }
  }, [id, initDashboard, clearAllFilters]);

  useEffect(() => {
    if (saveError) {
      toast.error(saveError);
    }
  }, [saveError]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleRename = useCallback(async (newName: string) => {
    if (!id) return;
    await updateDashboard(id, { name: newName });
    await initDashboard(id);
    setIsEditingName(false);
    toast.success('名稱已更新');
  }, [id, initDashboard]);

  const handleConfigWidget = useCallback((widgetId: string) => {
    setConfigWidgetId(widgetId);
    setConfigPanelOpen(true);
  }, []);

  const handleCloseConfigPanel = useCallback(() => {
    setConfigPanelOpen(false);
    setConfigWidgetId(null);
  }, []);

  const handleSaveConfig = useCallback(async (config: ChartConfig) => {
    if (!configWidgetId) return;
    try {
      await updateWidgetConfig(configWidgetId, config);
      handleCloseConfigPanel();
    } catch {
      toast.error('儲存設定失敗');
    }
  }, [configWidgetId, updateWidgetConfig, handleCloseConfigPanel]);

  const configWidgetData = configWidgetId
    ? dashboard?.widgets.find((w) => w.id === configWidgetId)
    : null;

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster position="bottom-right" />
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} data-testid="back-button">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {isEditingName ? (
            <div className="flex-1 max-w-md">
              <InlineEditName
                value={dashboard.name}
                onSave={handleRename}
                onCancel={() => setIsEditingName(false)}
              />
            </div>
          ) : (
            <h1
              className="text-xl font-bold cursor-pointer hover:text-primary"
              onClick={() => setIsEditingName(true)}
              data-testid="dashboard-title"
            >
              {dashboard.name}
            </h1>
          )}
          {isSaving && (
            <span className="text-sm text-muted-foreground ml-auto" data-testid="saving-indicator">
              儲存中...
            </span>
          )}
        </div>
      </header>
      <DashboardFilterBar />
      <main className="flex-1 container mx-auto px-4 py-8" ref={containerRef}>
        <DashboardGrid
          dashboard={dashboard}
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
          onConfigWidget={handleConfigWidget}
          onLayoutChange={updateLayout}
          containerWidth={containerWidth}
        />
      </main>
      <ChartConfigPanel
        isOpen={configPanelOpen}
        onClose={handleCloseConfigPanel}
        onSave={handleSaveConfig}
        initialConfig={configWidgetData?.chartConfig}
      />
    </div>
  );
}
