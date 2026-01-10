# Proposal: Add Tool Timeline Widget

## Why

製造業場景需要視覺化監控多台機台（Tool）的運作狀態，以 24 小時為單位呈現每台機台在各時段的狀態（運作、異常、閒置、維護等），並搭配 OEE 指標（如 A%、U%）快速掌握稼動率。同時支援點擊互動，讓使用者點擊特定時段後在另一個 Widget 中顯示該時段的事件記錄。

## What Changes

### 新增 Tool Timeline Widget Plugin

建立 `src/features/chart-plugins/plugins/tool-timeline/` 目錄，包含：

| 檔案 | 說明 |
|------|------|
| `index.ts` | Plugin 匯出 |
| `schema.ts` | Zod 驗證 schema |
| `ToolTimelineRenderer.tsx` | 主要渲染元件（ECharts + KPI 表格） |
| `ConfigFields.tsx` | 設定表單 |
| `locales.ts` | 多語系資源 |

### 功能規格

1. **時間軸圖表**
   - X 軸：24 小時（每格 1 小時），使用者可設定日期，預設當天
   - Y 軸：機台（Tool）ID，依資料順序排列
   - 每個區間依狀態顯示對應顏色
   - 無資料時段顯示空白

2. **狀態顏色對應（可配置）**
   - 提供預設值（running=綠, error=紅, idle=米色）
   - 未指定顏色的狀態由 Plugin 自動分配預設顏色
   - 使用者可新增、刪除、修改

3. **OEE 指標表格**
   - 顯示在圖表右側
   - 寬度依 KPI 欄位數量自動調整
   - 每台機台顯示設定的 KPI 欄位（如 A%、U%）

4. **Tooltip（可配置）**
   - 使用者可設定顯示欄位和格式
   - 預設顯示：機台 ID、狀態、時間區間、持續時間

5. **圖例 (Legend)**
   - 顯示狀態顏色對應，固定於下方

6. **Cross-Widget 互動**
   - 點擊某機台的某時段區間
   - 發送 `ChartInteractionEvent`，包含完整資料（toolId、startTime、endTime、status 等）
   - 其他 Widget 可接收篩選條件顯示對應資料

## Impact

- **新增檔案**：`src/features/chart-plugins/plugins/tool-timeline/` (6 檔案)
- **修改檔案**：
  - `src/features/chart-plugins/registry.ts` - 註冊 Plugin
  - `src/types/chart.ts` - 新增 'tool-timeline' 到 ChartType
- **測試**：新增 `e2e/tool-timeline.spec.ts`

## Out of Scope

- OEE 指標計算邏輯（由資料源提供，Widget 只負責顯示）
- 機台排序/篩選功能（依資料順序）
- 多日時間範圍（固定 24 小時）
