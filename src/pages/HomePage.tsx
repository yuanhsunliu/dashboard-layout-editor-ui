import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import { DashboardList, DeleteConfirmDialog, EmptyState } from '@/features/dashboard/components';
import { getDashboards, createDashboard, updateDashboard, deleteDashboard } from '@/services/dashboardApi';
import type { DashboardListItem } from '@/types/dashboard';

export function HomePage() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState<DashboardListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const loadDashboards = useCallback(async () => {
    try {
      const data = await getDashboards();
      setDashboards(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  const handleCreate = async () => {
    const dashboard = await createDashboard('未命名 Dashboard');
    navigate(`/dashboard/${dashboard.id}`);
  };

  const handleRename = async (id: string, newName: string) => {
    await updateDashboard(id, { name: newName });
    await loadDashboards();
    toast.success('名稱已更新');
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await deleteDashboard(deleteTarget.id);
    await loadDashboards();
    setDeleteTarget(null);
    toast.success('Dashboard 已刪除');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="bottom-right" />
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Dashboard Layout Editor</h1>
          {dashboards.length > 0 && (
            <Button onClick={handleCreate} data-testid="create-dashboard">
              <Plus className="mr-2 h-4 w-4" />
              新增 Dashboard
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {dashboards.length === 0 ? (
          <EmptyState onCreateClick={handleCreate} />
        ) : (
          <DashboardList
            dashboards={dashboards}
            onRename={handleRename}
            onDelete={handleDeleteClick}
          />
        )}
      </main>
      <DeleteConfirmDialog
        open={!!deleteTarget}
        dashboardName={deleteTarget?.name || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
