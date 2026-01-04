# F07: Persistence

## Overview
Dashboard 配置可以儲存與載入，確保使用者的設定不會遺失。

## User Stories
- 作為使用者，我編輯的 Dashboard 會自動儲存，不用擔心遺失
- 作為使用者，我下次開啟時可以看到上次的編輯結果
- 作為使用者，儲存失敗時會收到通知並可重試

## Acceptance Criteria

### 自動儲存
- [ ] 佈局變更後自動儲存（debounce 1 秒）
- [ ] 圖表設定變更後自動儲存
- [ ] 儲存時顯示儲存狀態指示器

### 載入
- [ ] 進入 Dashboard 編輯頁時載入完整配置
- [ ] 載入中顯示 Loading 狀態
- [ ] 載入失敗顯示錯誤與重試按鈕

### 儲存狀態指示
- [ ] 已儲存: 顯示「已儲存」或 ✓
- [ ] 儲存中: 顯示「儲存中...」或 Spinner
- [ ] 儲存失敗: 顯示「儲存失敗」與重試按鈕

### 錯誤處理
- [ ] 儲存失敗顯示 Toast 通知
- [ ] 儲存失敗不清除本地編輯狀態
- [ ] 提供手動重試按鈕

## UI/UX Spec

### 儲存狀態指示器
```
Header:
┌─────────────────────────────────────────────────┐
│  ← 返回    Dashboard 名稱    [✓ 已儲存]  [☀️]  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ← 返回    Dashboard 名稱    [⏳ 儲存中...]     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ← 返回    Dashboard 名稱    [❌ 儲存失敗 重試] │
└─────────────────────────────────────────────────┘
```

### 儲存失敗 Toast
```
┌──────────────────────────────────┐
│ ❌ 儲存失敗                      │
│    請檢查網路連線後重試          │
│                        [重試]    │
└──────────────────────────────────┘
```

## Data Model

```typescript
// 完整 Dashboard 儲存格式
interface DashboardData {
  id: string;
  name: string;
  theme: 'light' | 'dark';
  layout: LayoutItem[];
  widgets: Widget[];
  createdAt: string;
  updatedAt: string;
}

interface Widget {
  id: string;
  chartConfig?: ChartConfig;
}
```

## API Contract

### GET /api/dashboards/:id
取得完整 Dashboard 配置

**Response:**
```json
{
  "id": "dashboard-1",
  "name": "銷售報表",
  "theme": "light",
  "layout": [
    { "i": "widget-1", "x": 0, "y": 0, "w": 6, "h": 4 }
  ],
  "widgets": [
    {
      "id": "widget-1",
      "chartConfig": {
        "chartType": "line",
        "dataSourceId": "sales-monthly",
        "xAxisField": "month",
        "yAxisFields": ["revenue"]
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-02T00:00:00Z"
}
```

### PUT /api/dashboards/:id
儲存 Dashboard 配置

**Request:**
```json
{
  "name": "銷售報表",
  "theme": "light",
  "layout": [...],
  "widgets": [...]
}
```

**Response:**
```json
{
  "id": "dashboard-1",
  "updatedAt": "2024-01-03T00:00:00Z"
}
```

## State Management

```typescript
// stores/useDashboardStore.ts
interface DashboardState {
  // Data
  dashboard: DashboardData | null;
  layout: LayoutItem[];
  widgets: Widget[];
  
  // Save status
  saveStatus: 'saved' | 'saving' | 'error' | 'dirty';
  
  // Actions
  loadDashboard: (id: string) => Promise<void>;
  saveDashboard: () => Promise<void>;
  updateLayout: (layout: LayoutItem[]) => void;
  updateWidget: (id: string, config: ChartConfig) => void;
}
```

## Auto-Save Implementation

```typescript
// hooks/useAutoSave.ts
export function useAutoSave() {
  const { saveStatus, saveDashboard } = useDashboardStore();
  
  const debouncedSave = useMemo(
    () => debounce(() => saveDashboard(), 1000),
    [saveDashboard]
  );
  
  // 監聽變更觸發自動儲存
  useEffect(() => {
    if (saveStatus === 'dirty') {
      debouncedSave();
    }
  }, [saveStatus, debouncedSave]);
}
```

## Dependencies
- T01: Project Setup
- F01: Dashboard CRUD（Dashboard 資料結構）
- F02: Widget Layout（佈局資料）
- F04: Chart Configuration（Widget 設定）

## Out of Scope
- 版本歷史 / Undo-Redo
- 衝突解決（多人同時編輯）
- 離線編輯
- 匯出/匯入 JSON 檔案
