# Design: Add Chart Configuration

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    DashboardEditorPage                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   DashboardGrid                       │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │              WidgetContainer                     │ │   │
│  │  │  ┌─────────────────────────────────────────────┐│ │   │
│  │  │  │  ChartWidget                                ││ │   │
│  │  │  │  - ChartEmpty (onClick → openConfig)        ││ │   │
│  │  │  │  - ChartRenderer (with config button)       ││ │   │
│  │  │  └─────────────────────────────────────────────┘│ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ChartConfigPanel (Sheet)                 │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ ChartTypeSelector                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ DataSourceSelector                             │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ FieldMappingForm (dynamic by chartType)        │  │   │
│  │  │ - LineChartFields                              │  │   │
│  │  │ - BarChartFields                               │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │ ChartPreview                                   │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  │  [取消]                                    [儲存]    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

```
src/features/chart-config/
├── components/
│   ├── ChartConfigPanel.tsx      # Sheet 容器，管理開關狀態
│   ├── ChartTypeSelector.tsx     # 圖表類型選擇 (Select)
│   ├── DataSourceSelector.tsx    # 資料來源選擇 (Select)
│   ├── FieldMappingForm.tsx      # 動態欄位表單容器
│   ├── fields/
│   │   ├── LineChartFields.tsx   # Line Chart 專屬欄位
│   │   ├── BarChartFields.tsx    # Bar Chart 專屬欄位
│   │   └── index.ts
│   └── ChartPreview.tsx          # 即時預覽區域
├── hooks/
│   ├── useChartConfigForm.ts     # React Hook Form + Zod
│   └── useDataSourceFields.ts    # 載入資料來源欄位
├── services/
│   └── mockDataSources.ts        # Mock 資料來源服務
├── types.ts                      # 型別定義
└── index.ts                      # 模組 exports
```

## Data Flow

```
User Action                    State Changes                   Side Effects
─────────────                  ─────────────                   ────────────
Click ChartEmpty        →      openConfigPanel(widgetId)  →    Sheet opens
                                                               
Select Chart Type       →      form.chartType = 'line'    →    Reset field mapping
                               form.xAxisField = ''
                               form.yAxisFields = []

Select Data Source      →      form.dataSourceId = 'ds1'  →    Load fields list
                                                               fetchDataSourceFields()

Select X/Y Fields       →      form.xAxisField = 'date'   →    Update preview
                               form.yAxisFields = ['val']

Click Save              →      updateWidgetConfig()       →    Close panel
                               saveLayoutDebounced()           Update localStorage
                                                               Re-render chart

Click Cancel            →      closeConfigPanel()         →    Discard changes
                                                               Close panel
```

## State Management

### Local State (ChartConfigPanel)
```typescript
interface ConfigPanelState {
  isOpen: boolean;
  targetWidgetId: string | null;
}
```

### Form State (React Hook Form)
```typescript
interface ChartConfigFormData {
  chartType: 'line' | 'bar';
  title?: string;
  dataSourceId: string;
  xAxisField: string;
  yAxisFields: string[];
  // Line specific
  smooth?: boolean;
  // Bar specific
  stacked?: boolean;
  horizontal?: boolean;
}
```

### Store Action (useDashboardEditorStore)
```typescript
// 新增 action
updateWidgetConfig: (widgetId: string, chartConfig: ChartConfig) => Promise<void>
```

## Mock Data Sources

```typescript
// src/features/chart-config/services/mockDataSources.ts

interface DataSource {
  id: string;
  name: string;
  fields: DataSourceField[];
  demoData: DemoData;
}

interface DataSourceField {
  name: string;
  type: 'string' | 'number' | 'date';
  label: string;
}

interface DemoData {
  xAxis: string[];
  series: { name: string; data: number[] }[];
}

const mockDataSources: DataSource[] = [
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
```

## Form Validation (Zod)

```typescript
import { z } from 'zod';

const baseChartSchema = z.object({
  title: z.string().max(50).optional(),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  xAxisField: z.string().min(1, '請選擇 X 軸欄位'),
  yAxisFields: z.array(z.string()).min(1, '請至少選擇一個 Y 軸欄位'),
});

const lineChartSchema = baseChartSchema.extend({
  chartType: z.literal('line'),
  smooth: z.boolean().optional(),
});

const barChartSchema = baseChartSchema.extend({
  chartType: z.literal('bar'),
  stacked: z.boolean().optional(),
  horizontal: z.boolean().optional(),
});

const chartConfigSchema = z.discriminatedUnion('chartType', [
  lineChartSchema,
  barChartSchema,
]);
```

## UI Components (shadcn/ui)

| Component | shadcn/ui | Usage |
|-----------|-----------|-------|
| 設定面板 | Sheet | 側邊滑出面板 |
| 圖表類型 | Select | 下拉選單 |
| 資料來源 | Select | 下拉選單 |
| X 軸欄位 | Select | 單選下拉 |
| Y 軸欄位 | Checkbox | 多選列表 |
| 標題輸入 | Input | 文字輸入 |
| 選項開關 | Switch | 布林選項 (smooth, stacked) |
| 按鈕 | Button | 儲存/取消 |
| 標籤 | Label | 欄位標籤 |

## Integration Points

### 1. ChartEmpty onClick
```tsx
// src/components/chart/ChartEmpty.tsx
<ChartEmpty onConfigClick={() => openConfigPanel(widgetId)} />
```

### 2. WidgetContainer Config Button
```tsx
// src/features/widget/components/WidgetContainer.tsx
// 新增設定按鈕到 header
<Button onClick={() => openConfigPanel(widget.id)}>
  <Settings className="h-4 w-4" />
</Button>
```

### 3. Store Update
```typescript
// src/stores/useDashboardEditorStore.ts
updateWidgetConfig: async (widgetId: string, chartConfig: ChartConfig) => {
  const { dashboard } = get();
  if (!dashboard) return;
  
  const updatedWidgets = dashboard.widgets.map(w =>
    w.id === widgetId ? { ...w, chartConfig } : w
  );
  
  set({ dashboard: { ...dashboard, widgets: updatedWidgets }, isSaving: true });
  
  await updateDashboard(dashboard.id, { widgets: updatedWidgets });
  set({ isSaving: false });
}
```

## Key Decisions

1. **Sheet vs Dialog**: 使用 Sheet 側邊欄（從右側滑出），因為需要同時看到 Dashboard 和設定面板
2. **Mock Data Sources**: 提供 3 個 Mock Data Sources，每個有對應的 demo data
3. **React Hook Form**: 表單狀態獨立管理，不放入 Zustand store
4. **即時預覽**: 使用現有 ChartRenderer + Mock Data Source 的 demo data 進行預覽
5. **Y 軸多選**: 使用 Checkbox 列表而非 MultiSelect，更直觀
6. **標題欄位**: 加入標題輸入欄位，讓使用者自訂 Widget 標題
7. **進階選項**: MVP 不實作 smooth, showArea, stacked, horizontal（留待後續）
8. **面板標題**: 統一使用「圖表設定」，不區分新增/編輯模式
9. **儲存提示**: 靜默儲存，僅失敗時顯示錯誤 Toast
10. **新增 Widget**: 維持現狀，需手動點擊開啟設定面板
11. **X 軸欄位**: 不限類型，所有欄位都可選作 X 軸
12. **Y 軸欄位**: 只能選擇 `number` 類型欄位
13. **預覽時機**: 選完所有必要欄位（chartType + dataSource + xAxis + yAxis）才顯示預覽
14. **關閉方式**: 點「取消」或右上角 X 可關閉，點外部遮罩不關閉（防止誤操作）
15. **放棄變更**: 不顯示確認對話框，直接放棄變更關閉
16. **設定按鈕**: Widget header 與刪除按鈕並排，使用齒輪 icon
