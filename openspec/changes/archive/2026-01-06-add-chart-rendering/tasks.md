# Tasks: Add Chart Rendering

## 1. Setup
- [x] 1.1 安裝 echarts 和 echarts-for-react 依賴
- [x] 1.2 建立 `src/components/chart/` 目錄結構

## 2. Data Model
- [x] 2.1 定義 ChartType 和 ChartConfig TypeScript 類型（移除 id 欄位）
- [x] 2.2 定義 LineChartConfig 和 BarChartConfig 介面
- [x] 2.3 建立 demoData.ts（hardcoded demo data）

## 3. Core Components
- [x] 3.1 實作 ChartWidget 容器元件（處理狀態邏輯）
- [x] 3.2 實作 ChartRenderer 元件（根據 chartType 渲染）
- [x] 3.3 實作 LineChart 元件（含 ECharts 預設 Tooltip）
- [x] 3.4 實作 BarChart 元件（含 ECharts 預設 Tooltip）

## 4. State Components
- [x] 4.1 實作 ChartEmpty（未設定狀態 + onConfigClick callback）

## 5. Responsive
- [x] 5.1 整合 ResizeObserver 監聽容器變化
- [x] 5.2 實作 200ms debounce resize 邏輯
- [x] 5.3 確保圖表在 Widget resize 時自動調整

## 6. Integration
- [x] 6.1 整合 ChartWidget 至現有 Widget 元件
- [x] 6.2 根據 widget.chartConfig 決定渲染圖表或 Empty 狀態

## 7. Testing
- [x] 7.1 撰寫 E2E 測試驗證圖表渲染（10 BDD-style tests）
- [x] 7.2 所有 35 個 E2E 測試通過

## 8. Bug Fixes (during implementation)
- [x] 8.1 修正 Button onClick 事件傳遞導致 addWidget 收到 event object
- [x] 8.2 修正 localStorage 無法儲存的 JSON circular reference 錯誤

## Implementation Notes
- 實作時間：約 2 小時
- 額外發現並修正了一個 UI 呼叫 store action 的 bug（event object 被當作 chartConfig）
- HTML 測試報告位於：`playwright-report/index.html`
