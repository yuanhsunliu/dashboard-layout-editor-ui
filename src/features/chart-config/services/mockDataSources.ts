import type { DataSource } from '../types';

export const mockDataSources: DataSource[] = [
  {
    id: 'sales-data',
    name: '銷售資料',
    fields: [
      { name: 'date', type: 'date', label: '日期' },
      { name: 'revenue', type: 'number', label: '營收' },
      { name: 'profit', type: 'number', label: '利潤' },
      { name: 'cost', type: 'number', label: '成本' },
    ],
    demoData: {
      rows: [
        { date: '1月', revenue: 120, profit: 80, cost: 40 },
        { date: '2月', revenue: 200, profit: 140, cost: 60 },
        { date: '3月', revenue: 150, profit: 100, cost: 50 },
        { date: '4月', revenue: 80, profit: 50, cost: 30 },
        { date: '5月', revenue: 170, profit: 120, cost: 50 },
        { date: '6月', revenue: 210, profit: 160, cost: 50 },
      ],
    },
  },
  {
    id: 'user-stats',
    name: '使用者統計',
    fields: [
      { name: 'month', type: 'string', label: '月份' },
      { name: 'activeUsers', type: 'number', label: '活躍使用者' },
      { name: 'newUsers', type: 'number', label: '新使用者' },
    ],
    demoData: {
      rows: [
        { month: 'Jan', activeUsers: 1200, newUsers: 200 },
        { month: 'Feb', activeUsers: 1350, newUsers: 180 },
        { month: 'Mar', activeUsers: 1100, newUsers: 220 },
        { month: 'Apr', activeUsers: 1450, newUsers: 250 },
        { month: 'May', activeUsers: 1600, newUsers: 300 },
        { month: 'Jun', activeUsers: 1800, newUsers: 350 },
      ],
    },
  },
  {
    id: 'product-inventory',
    name: '產品庫存',
    fields: [
      { name: 'product', type: 'string', label: '產品' },
      { name: 'stock', type: 'number', label: '庫存' },
      { name: 'sold', type: 'number', label: '已售' },
    ],
    demoData: {
      rows: [
        { product: '產品A', stock: 150, sold: 80 },
        { product: '產品B', stock: 230, sold: 150 },
        { product: '產品C', stock: 180, sold: 120 },
        { product: '產品D', stock: 90, sold: 70 },
        { product: '產品E', stock: 120, sold: 95 },
      ],
    },
  },
];

export function getDataSources(): DataSource[] {
  return mockDataSources;
}

export function getDataSourceById(id: string): DataSource | undefined {
  return mockDataSources.find(ds => ds.id === id);
}
