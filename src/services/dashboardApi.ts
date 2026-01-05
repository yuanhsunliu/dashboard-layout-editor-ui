import type { Dashboard, DashboardListItem } from '@/types/dashboard';

const STORAGE_KEY = 'dashboard-setting';

function getStore(): { dashboards: Dashboard[] } {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    return JSON.parse(data);
  }
  return { dashboards: [] };
}

function saveStore(store: { dashboards: Dashboard[] }): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function generateId(): string {
  return `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getDashboards(): Promise<DashboardListItem[]> {
  const store = getStore();
  return store.dashboards
    .map(({ id, name, createdAt, updatedAt }) => ({ id, name, createdAt, updatedAt }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function getDashboard(id: string): Promise<Dashboard | null> {
  const store = getStore();
  return store.dashboards.find(d => d.id === id) || null;
}

export async function createDashboard(name: string): Promise<Dashboard> {
  const store = getStore();
  const now = new Date().toISOString();
  const dashboard: Dashboard = {
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now,
    layout: [],
    widgets: [],
    theme: 'light',
  };
  store.dashboards.push(dashboard);
  saveStore(store);
  return dashboard;
}

export async function updateDashboard(id: string, updates: Partial<Pick<Dashboard, 'name' | 'layout' | 'widgets' | 'theme'>>): Promise<Dashboard | null> {
  const store = getStore();
  const index = store.dashboards.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  store.dashboards[index] = {
    ...store.dashboards[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStore(store);
  return store.dashboards[index];
}

export async function deleteDashboard(id: string): Promise<boolean> {
  const store = getStore();
  const index = store.dashboards.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  store.dashboards.splice(index, 1);
  saveStore(store);
  return true;
}
