# Design: Cross-Widget Interaction

## Context

Dashboard 編輯器需要支援「故事性」的資料探索體驗。使用者從總覽圖表開始，逐步點擊下鑽至細節，形成連鎖探索路徑。此功能需與現有 Chart Plugin 架構整合，且不破壞現有功能。

### Stakeholders
- 終端使用者：需要直覺的連動操作體驗
- 開發者：需要清晰的 Plugin 擴展機制

## Goals / Non-Goals

### Goals
- 實現欄位驅動的自動連動機制
- 支援點擊互動（Phase 1），框選互動（Phase 2）
- 提供視覺化的篩選狀態呈現（浮動篩選列 + Widget 標籤）
- 預設使用高亮顯示，保留資料全貌
- 支援 Toggle 行為（再次點擊已選值會取消）

### Non-Goals
- 不實作連動群組（全 Dashboard 連動）
- 不實作後端篩選（先前端處理，架構預留）
- 不實作複雜的連線 UI（不需使用者手動畫連線）
- 不實作框選 (Brush) 互動（Phase 2）
- Embed Widget 不參與連動

## Decisions

### Decision 1: 欄位驅動連動

**What**: 依據資料欄位自動判斷連動關係，共用欄位的 Widget 自動連動。

**Why**: 
- 零設定，使用者不需手動配置連動關係
- 符合直覺：選了什麼欄位，就決定連動行為
- 自動支援連鎖下鑽

**How**:
```typescript
interface DashboardFilter {
  id: string;
  field: string;           // e.g., "region", "country"
  operator: 'eq' | 'in' | 'range';
  value: string | string[] | [number, number];
  sourceWidgetId: string;  // 觸發篩選的 Widget
  timestamp: number;       // 用於排序/清除
}

// Widget 判斷是否受影響
function isAffectedByFilter(config: ChartConfig, filter: DashboardFilter): boolean {
  const fields = getConfigFields(config); // 取得 xAxisField, yAxisFields, dimension 等
  return fields.includes(filter.field);
}
```

### Decision 2: 篩選累加（連鎖下鑽）+ Toggle 支援

**What**: 每次點擊新增篩選條件，形成累加效果。同欄位多次點擊會累加成 IN 條件，再次點擊已選值會取消（Toggle）。

**Example - 不同欄位**:
```
初始: filters = []
點擊 Pie「Asia」: filters = [{ field: "region", value: "Asia" }]
點擊 Bar「Japan」: filters = [
  { field: "region", value: "Asia" },
  { field: "country", value: "Japan" }
]
```

**Example - 同欄位累加 + Toggle**:
```
初始: filters = []
點擊「Asia」: filters = [{ field: "region", value: ["Asia"] }]
點擊「Europe」: filters = [{ field: "region", value: ["Asia", "Europe"] }]
再點「Asia」: filters = [{ field: "region", value: ["Europe"] }]  // Toggle 取消
```

**清除策略**:
- 點擊篩選標籤的 ✕ → 清除該筆及其後的篩選（保持層級一致性）
- 點擊「清除全部」→ 清除所有篩選

### Decision 3: 高亮 vs 過濾

**What**: 預設使用高亮顯示，特定圖表類型使用過濾。

| 圖表類型 | 連動行為 |
|---------|---------|
| Line, Bar, Area, Pie | 高亮符合條件的資料，淡化其他 |
| Table, List | 過濾只顯示符合條件的資料 |

**ECharts 高亮實作**:
```typescript
// 使用 emphasis + downplay
series: data.map((item, index) => ({
  ...item,
  itemStyle: {
    opacity: isHighlighted(index, filters) ? 1 : 0.2,
  },
}))
```

### Decision 4: Filter Store 設計

**What**: 使用獨立的 Zustand store 管理篩選狀態。

```typescript
// src/stores/useDashboardFilterStore.ts
interface DashboardFilterState {
  filters: DashboardFilter[];
  
  // Actions
  addFilter: (filter: Omit<DashboardFilter, 'id' | 'timestamp'>) => void;
  toggleFilterValue: (field: string, value: string, sourceWidgetId: string) => void; // Toggle 支援
  removeFilter: (filterId: string) => void;
  removeFiltersAfter: (filterId: string) => void; // 連鎖清除
  clearAllFilters: () => void;
  
  // Selectors
  getFiltersForWidget: (widgetId: string, config: ChartConfig) => DashboardFilter[];
}
```

**Why**: 
- 與 `useDashboardEditorStore` 分離，職責清晰
- 可獨立測試
- 未來可持久化至 Dashboard 配置

### Decision 5: UI 細節

| 項目 | 決定 |
|------|------|
| 篩選列位置 | 浮動在頂部，有篩選時才出現，sticky 固定 |
| 空狀態處理 | 全部淡化顯示（無符合項目時） |
| Widget 標籤 | 多值時顯示數量（如 `Asia, Europe` 或 `+2`） |
| 來源 Widget | 自己也受影響，與其他 Widget 行為一致 |

### Decision 6: 排除項目

| 項目 | 處理方式 |
|------|---------|
| Embed Widget | 不參與連動（iframe 獨立） |
| 未設定的 Widget | 忽略，不參與連動 |
| 框選 (Brush) | Phase 2 實作 |

### Decision 5: Plugin Interface 擴展

**What**: 擴展 ChartPlugin 介面支援互動。

```typescript
interface ChartPlugin<TConfig> {
  // 現有屬性...
  
  // 新增
  supportedInteractions?: ('click' | 'brush' | 'drilldown')[];
  getFilterableFields?: (config: TConfig) => string[];
}

interface ChartRendererProps<TConfig> {
  config: TConfig;
  data?: DemoData;
  
  // 新增
  filters?: DashboardFilter[];
  onInteraction?: (event: ChartInteractionEvent) => void;
}

interface ChartInteractionEvent {
  type: 'click' | 'brush' | 'drilldown';
  field: string;
  value: string | string[] | [number, number];
}
```

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| 效能：大量 Widget 同時更新 | 中 | 使用 useMemo 優化篩選計算 |
| 複雜度：連鎖邏輯難 debug | 中 | 在 DevTools 顯示 filter 狀態 |
| UX：不清楚為何某些 Widget 變化 | 低 | Widget 標籤清楚顯示篩選來源 |

## Migration Plan

此為新功能，無需遷移。

### Rollout Steps
1. 實作 Filter Store（無 UI 影響）
2. 擴展 Plugin Interface（向下相容）
3. 逐一更新現有 Chart Renderer
4. 新增 UI 元件

### Rollback
移除 Filter Store 訂閱即可恢復原狀，各 Renderer 的擴展為 optional props。

## Open Questions

1. **篩選持久化**: 是否將篩選狀態儲存至 Dashboard 配置？（建議暫不實作）
2. **URL 同步**: 是否將篩選條件同步至 URL Query String？（建議 Phase 2）
3. **動畫**: 連動時是否需要過渡動畫？（建議先不加，後續優化）
