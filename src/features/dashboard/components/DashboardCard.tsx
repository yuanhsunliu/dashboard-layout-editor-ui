import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InlineEditName } from './InlineEditName';
import { formatRelativeTime } from '@/lib/dateUtils';
import type { DashboardListItem } from '@/types/dashboard';

interface DashboardCardProps {
  dashboard: DashboardListItem;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string, name: string) => void;
}

export function DashboardCard({ dashboard, onRename, onDelete }: DashboardCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleCardClick = () => {
    if (!isEditing) {
      navigate(`/dashboard/${dashboard.id}`);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(dashboard.id, dashboard.name);
  };

  const handleSave = (newName: string) => {
    onRename(dashboard.id, newName);
    setIsEditing(false);
  };

  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={handleCardClick}
      data-testid={`dashboard-card-${dashboard.id}`}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditName
                value={dashboard.name}
                onSave={handleSave}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <h3 className="font-semibold truncate" data-testid="dashboard-name">{dashboard.name}</h3>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="card-menu-trigger">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRenameClick} data-testid="rename-menu-item">
              <Pencil className="mr-2 h-4 w-4" />
              重新命名
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive" data-testid="delete-menu-item">
              <Trash2 className="mr-2 h-4 w-4" />
              刪除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground" data-testid="dashboard-time">
          {formatRelativeTime(dashboard.updatedAt)}
        </p>
      </CardContent>
    </Card>
  );
}
