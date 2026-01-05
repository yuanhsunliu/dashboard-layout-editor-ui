import type { DashboardListItem } from '@/types/dashboard';
import { DashboardCard } from './DashboardCard';

interface DashboardListProps {
  dashboards: DashboardListItem[];
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function DashboardList({ dashboards, onRename, onDelete }: DashboardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="dashboard-list">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          dashboard={dashboard}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
