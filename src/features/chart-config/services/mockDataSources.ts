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
      xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
      series: [
        { name: '營收', data: [120, 200, 150, 80, 170, 210] },
        { name: '利潤', data: [80, 140, 100, 50, 120, 160] },
        { name: '成本', data: [40, 60, 50, 30, 50, 50] },
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
      xAxis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      series: [
        { name: '活躍使用者', data: [1200, 1350, 1100, 1450, 1600, 1800] },
        { name: '新使用者', data: [200, 180, 220, 250, 300, 350] },
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
      xAxis: ['產品A', '產品B', '產品C', '產品D', '產品E'],
      series: [
        { name: '庫存', data: [150, 230, 180, 90, 120] },
        { name: '已售', data: [80, 150, 120, 70, 95] },
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
