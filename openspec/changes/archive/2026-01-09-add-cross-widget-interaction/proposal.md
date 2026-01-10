# Change: Add Cross-Widget Interaction

## Why

目前 Dashboard 中的 Widget 各自獨立，無法互相連動。使用者需要「故事性」的資料探索體驗 — 從總覽圖表點擊後，連動影響其他圖表顯示更細節的資料，支援連鎖下鑽 (Cascading Drill-down)。

## What Changes

### 新增功能
- **欄位驅動連動機制**: 共用相同資料欄位的圖表自動連動，無需手動設定
- **點擊互動**: 支援點擊資料點觸發連動（框選 Phase 2）
- **連鎖下鑽**: 支援多層級連動（A → B → C），每層可同時為上層的 Detail 和下層的 Master
- **高亮顯示**: 連動時預設高亮符合條件的資料，淡化其他（特定圖表類型如 Table 採用過濾）
- **全域篩選列**: 浮動在頂部，有篩選時才出現（sticky 固定），支援一鍵清除
- **Widget 篩選標籤**: 被連動的 Widget 顯示篩選條件，多值時顯示數量

### 技術架構
- 新增 `useDashboardFilterStore` 管理全域篩選狀態
- 擴展 `ChartRendererProps` 支援篩選與高亮
- 前端處理篩選邏輯，架構預留後端模式切換

## 設計決策

| 項目 | 決定 |
|------|------|
| 篩選值資料類型 | `string \| string[] \| [number, number]` |
| 同欄位多次點擊 | 累加 + 支援 Toggle（再次點擊取消） |
| 篩選列位置 | 浮動在頂部（有篩選時才出現，sticky 固定） |
| 空狀態處理 | 全部淡化顯示 |
| Widget 標籤顯示 | 多值時顯示數量（如 `Asia, Europe` 或 `+2`） |
| 來源 Widget 行為 | 自己也受影響（與其他 Widget 一致） |
| 框選優先級 | Phase 2（Phase 1 先專注點擊） |
| 下鑽返回機制 | 只需清除功能（透過篩選列 ✕） |
| Embed Widget | 不參與連動 |
| 未設定的 Widget | 忽略，不參與連動 |

## Impact

- **Affected specs**: 
  - 新增 `F11-cross-widget-interaction.md`
  - 可能影響 `F03-chart-rendering.md`（圖表需支援高亮/淡化）
  - 可能影響 `F09-chart-plugin.md`（Plugin 介面擴展）

- **Affected code**:
  - `src/stores/` - 新增 Filter Store
  - `src/features/chart-plugins/` - Renderer 支援篩選
  - `src/components/dashboard/` - 新增篩選列元件
  - `src/types/` - 擴展型別定義
