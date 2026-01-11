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
  {
    id: 'tool-status-data',
    name: '機台狀態資料',
    fields: [
      { name: 'toolId', type: 'string', label: '機台 ID' },
      { name: 'startTime', type: 'string', label: '開始時間' },
      { name: 'endTime', type: 'string', label: '結束時間' },
      { name: 'status', type: 'string', label: '狀態' },
      { name: 'availability', type: 'number', label: '可用率' },
      { name: 'utilization', type: 'number', label: '稼動率' },
    ],
    demoData: {
      rows: [
        { toolId: 'XCG10001', startTime: '00:00', endTime: '06:00', status: 'running', availability: 85, utilization: 92 },
        { toolId: 'XCG10001', startTime: '06:00', endTime: '08:00', status: 'idle', availability: 85, utilization: 92 },
        { toolId: 'XCG10001', startTime: '08:00', endTime: '09:00', status: 'error', availability: 85, utilization: 92 },
        { toolId: 'XCG10001', startTime: '09:00', endTime: '24:00', status: 'running', availability: 85, utilization: 92 },
        { toolId: 'XCG10002', startTime: '00:00', endTime: '04:00', status: 'idle', availability: 78, utilization: 88 },
        { toolId: 'XCG10002', startTime: '04:00', endTime: '20:00', status: 'running', availability: 78, utilization: 88 },
        { toolId: 'XCG10002', startTime: '20:00', endTime: '24:00', status: 'idle', availability: 78, utilization: 88 },
        { toolId: 'XCG10003', startTime: '00:00', endTime: '12:00', status: 'running', availability: 91, utilization: 95 },
        { toolId: 'XCG10003', startTime: '12:00', endTime: '14:00', status: 'error', availability: 91, utilization: 95 },
        { toolId: 'XCG10003', startTime: '14:00', endTime: '24:00', status: 'running', availability: 91, utilization: 95 },
      ],
    },
  },
  {
    id: 'production-performance',
    name: '產線績效',
    fields: [
      { name: 'year', type: 'string', label: '年度' },
      { name: 'quarter', type: 'string', label: '季度' },
      { name: 'product', type: 'string', label: '產品線' },
      { name: 'output', type: 'number', label: '產出數' },
      { name: 'cycleTime', type: 'number', label: 'Cycle Time (秒)' },
    ],
    demoData: {
      rows: [
        // 2023 TV產品
        { year: '2023', quarter: 'Q1', product: 'TV產品', output: 12500, cycleTime: 48.2 },
        { year: '2023', quarter: 'Q2', product: 'TV產品', output: 13200, cycleTime: 46.5 },
        { year: '2023', quarter: 'Q3', product: 'TV產品', output: 14100, cycleTime: 44.8 },
        { year: '2023', quarter: 'Q4', product: 'TV產品', output: 15800, cycleTime: 42.3 },
        // 2023 車用產品
        { year: '2023', quarter: 'Q1', product: '車用產品', output: 8200, cycleTime: 62.5 },
        { year: '2023', quarter: 'Q2', product: '車用產品', output: 8800, cycleTime: 58.2 },
        { year: '2023', quarter: 'Q3', product: '車用產品', output: 9500, cycleTime: 55.1 },
        { year: '2023', quarter: 'Q4', product: '車用產品', output: 10200, cycleTime: 52.8 },
        // 2024 TV產品
        { year: '2024', quarter: 'Q1', product: 'TV產品', output: 16200, cycleTime: 41.5 },
        { year: '2024', quarter: 'Q2', product: 'TV產品', output: 17500, cycleTime: 39.8 },
        { year: '2024', quarter: 'Q3', product: 'TV產品', output: 18800, cycleTime: 38.2 },
        { year: '2024', quarter: 'Q4', product: 'TV產品', output: 20100, cycleTime: 36.5 },
        // 2024 車用產品
        { year: '2024', quarter: 'Q1', product: '車用產品', output: 11000, cycleTime: 50.2 },
        { year: '2024', quarter: 'Q2', product: '車用產品', output: 12200, cycleTime: 47.5 },
        { year: '2024', quarter: 'Q3', product: '車用產品', output: 13500, cycleTime: 45.1 },
        { year: '2024', quarter: 'Q4', product: '車用產品', output: 14800, cycleTime: 42.8 },
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
