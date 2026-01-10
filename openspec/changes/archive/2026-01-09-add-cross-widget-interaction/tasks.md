# Tasks: Add Cross-Widget Interaction

## 1. Foundation - Filter Store

- [ ] 1.1 定義 `DashboardFilter` 型別（field, value, operator, source widget）
- [ ] 1.2 定義 `FilterState` 型別（filters 陣列、累加邏輯）
- [ ] 1.3 建立 `useDashboardFilterStore` Zustand store
- [ ] 1.4 實作 `addFilter`, `removeFilter`, `clearFilters` actions
- [ ] 1.5 實作 `toggleFilterValue` action（同欄位累加 + Toggle 取消）
- [ ] 1.6 實作篩選條件累加邏輯（連鎖下鑽）

## 2. Chart Plugin Enhancement

- [ ] 2.1 擴展 `ChartRendererProps` 加入 `filters`, `onDataClick`, `highlightMode`
- [ ] 2.2 更新 `ChartPlugin` interface 加入 `supportedInteractions` 定義
- [ ] 2.3 實作 `getFilterableFields(config)` 工具函數（從 config 取得可篩選欄位）
- [ ] 2.4 實作 `isAffectedByFilter(config, filter)` 判斷函數

## 3. Chart Renderer - Click Interaction (Phase 1)

- [ ] 3.1 Line Chart: 實作 click 事件觸發篩選
- [ ] 3.2 Line Chart: 實作高亮/淡化樣式
- [ ] 3.3 Bar Chart: 實作 click 事件觸發篩選
- [ ] 3.4 Bar Chart: 實作高亮/淡化樣式
- [ ] 3.5 Area Chart: 實作 click 事件觸發篩選
- [ ] 3.6 Area Chart: 實作高亮/淡化樣式

## 4. Filter Matching Logic

- [ ] 4.1 實作 `matchesFilter(data, filters)` 工具函數
- [ ] 4.2 實作 `getHighlightIndices(data, filters)` 工具函數
- [ ] 4.3 實作欄位比對邏輯（根據 chartConfig 判斷是否受影響）
- [ ] 4.4 實作空狀態處理（無符合時全部淡化）

## 5. UI Components

- [ ] 5.1 建立 `DashboardFilterBar` 元件（浮動篩選列，sticky 固定）
- [ ] 5.2 實作篩選標籤 (FilterTag) 元件，支援單一清除
- [ ] 5.3 實作「清除全部」按鈕
- [ ] 5.4 建立 `WidgetFilterBadge` 元件（Widget 角落標籤，多值顯示數量）
- [ ] 5.5 整合 `DashboardFilterBar` 至 Dashboard Editor 頁面（有篩選時才顯示）

## 6. Integration

- [ ] 6.1 整合 Filter Store 與 Chart Renderer
- [ ] 6.2 Widget 訂閱篩選狀態並傳遞至 Renderer
- [ ] 6.3 實作連鎖下鑽流程（點擊 → 累加篩選 → 連動更新）
- [ ] 6.4 確保來源 Widget 也受影響（與其他 Widget 行為一致）
- [ ] 6.5 排除 Embed Widget 與未設定的 Widget

## 7. Testing

- [ ] 7.1 單元測試: Filter Store actions（含 Toggle 邏輯）
- [ ] 7.2 單元測試: 篩選比對邏輯
- [ ] 7.3 整合測試: 點擊連動流程
- [ ] 7.4 E2E 測試: 使用者操作連動情境

## 8. Documentation

- [ ] 8.1 更新 Plugin 開發文件（新增互動支援說明）
- [ ] 8.2 更新 README 說明連動功能

## Phase 2 (後續迭代)

- [ ] P2.1 實作框選範圍 (brush) 互動
- [ ] P2.2 Pie Chart 連動支援
- [ ] P2.3 URL Query String 同步
