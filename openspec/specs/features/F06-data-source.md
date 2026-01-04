# F06: Data Source Integration

## Overview
整合外部資料來源，讓圖表可以讀取並顯示實際資料。

## User Stories
- 作為使用者，我可以選擇資料來源，以便圖表顯示正確資料
- 作為使用者，我可以看到資料來源提供的欄位列表，以便設定欄位對應

## Acceptance Criteria

### 資料來源列表
- [ ] 可取得可用的資料來源列表
- [ ] 每個資料來源顯示名稱與描述

### 資料來源欄位
- [ ] 選擇資料來源後可取得欄位列表
- [ ] 欄位包含名稱與資料類型

### 資料取得
- [ ] 可依資料來源 ID 取得資料
- [ ] 資料格式可轉換為 ECharts 需要的格式

### 錯誤處理
- [ ] 資料來源載入失敗顯示錯誤訊息
- [ ] 提供重試機制

## Data Model

```typescript
interface DataSource {
  id: string;
  name: string;
  description?: string;
}

interface DataField {
  name: string;
  type: 'string' | 'number' | 'date';
  label?: string;
}

interface DataSourceSchema {
  dataSourceId: string;
  fields: DataField[];
}

// 資料格式
type DataRecord = Record<string, string | number>;
type DataSet = DataRecord[];
```

## API Contract

### GET /api/data-sources
取得資料來源列表

**Response:**
```json
{
  "dataSources": [
    {
      "id": "sales-monthly",
      "name": "月銷售資料",
      "description": "每月銷售統計"
    },
    {
      "id": "user-stats",
      "name": "使用者統計",
      "description": "使用者行為分析"
    }
  ]
}
```

### GET /api/data-sources/:id/schema
取得資料來源欄位定義

**Response:**
```json
{
  "dataSourceId": "sales-monthly",
  "fields": [
    { "name": "month", "type": "string", "label": "月份" },
    { "name": "revenue", "type": "number", "label": "營收" },
    { "name": "profit", "type": "number", "label": "利潤" },
    { "name": "cost", "type": "number", "label": "成本" }
  ]
}
```

### GET /api/data-sources/:id/data
取得資料

**Response:**
```json
{
  "data": [
    { "month": "2024-01", "revenue": 100000, "profit": 30000, "cost": 70000 },
    { "month": "2024-02", "revenue": 120000, "profit": 40000, "cost": 80000 }
  ]
}
```

## Mock Data (MVP)

```typescript
// mocks/data/dataSources.ts
export const mockDataSources: DataSource[] = [
  { id: 'sales-monthly', name: '月銷售資料' },
  { id: 'user-stats', name: '使用者統計' },
];

export const mockSalesData = [
  { month: '1月', revenue: 100000, profit: 30000 },
  { month: '2月', revenue: 120000, profit: 40000 },
  // ...
];
```

## Service Layer

```typescript
// services/api/dataSourceApi.ts
export const dataSourceApi = {
  getDataSources: () => 
    axios.get<{ dataSources: DataSource[] }>('/api/data-sources'),
  
  getSchema: (id: string) =>
    axios.get<DataSourceSchema>(`/api/data-sources/${id}/schema`),
  
  getData: (id: string) =>
    axios.get<{ data: DataSet }>(`/api/data-sources/${id}/data`),
};
```

## TanStack Query Integration

```typescript
// hooks/useDataSource.ts
export function useDataSources() {
  return useQuery({
    queryKey: ['dataSources'],
    queryFn: () => dataSourceApi.getDataSources(),
  });
}

export function useDataSourceSchema(id: string) {
  return useQuery({
    queryKey: ['dataSource', id, 'schema'],
    queryFn: () => dataSourceApi.getSchema(id),
    enabled: !!id,
  });
}

export function useDataSourceData(id: string) {
  return useQuery({
    queryKey: ['dataSource', id, 'data'],
    queryFn: () => dataSourceApi.getData(id),
    enabled: !!id,
  });
}
```

## Dependencies
- T01: Project Setup（TanStack Query, Axios, MSW）

## Out of Scope
- 資料來源新增/編輯/刪除
- 資料篩選/排序
- 即時資料更新 (WebSocket)
- 資料快取策略自訂
