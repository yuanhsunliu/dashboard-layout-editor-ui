import { LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
      <LayoutDashboard className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">尚無 Dashboard</h2>
      <p className="text-muted-foreground mb-6">建立您的第一個 Dashboard 開始設計報表</p>
      <Button onClick={onCreateClick} data-testid="create-first-dashboard">
        建立第一個 Dashboard
      </Button>
    </div>
  );
}
