import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { InlineEditName } from '@/features/dashboard/components';
import { DashboardGrid } from '@/features/widget/components';
import { updateDashboard } from '@/services/dashboardApi';
import { useDashboardEditorStore } from '@/stores/useDashboardEditorStore';

export function DashboardEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [isEditingName, setIsEditingName] = useState(false);

  const { dashboard, isSaving, saveError, initDashboard, addWidget, removeWidget, updateLayout } =
    useDashboardEditorStore();

  useEffect(() => {
    if (id) {
      initDashboard(id);
    }
  }, [id, initDashboard]);

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
      <main className="flex-1 container mx-auto px-4 py-8" ref={containerRef}>
        <DashboardGrid
          dashboard={dashboard}
          onAddWidget={addWidget}
          onRemoveWidget={removeWidget}
          onLayoutChange={updateLayout}
          containerWidth={containerWidth}
        />
      </main>
    </div>
  );
}
