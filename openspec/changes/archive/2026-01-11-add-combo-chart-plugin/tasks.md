# Tasks: Add Combo Chart Plugin

## 1. Type Definitions

- [x] 1.1 新增 `ComboChartConfig` interface 至 `src/types/chart.ts`
- [x] 1.2 更新 `ChartConfig` union type 包含 `ComboChartConfig`
- [x] 1.3 更新 `ChartType` 包含 `'combo'`

## 2. Plugin Implementation

- [x] 2.1 建立 `src/features/chart-plugins/plugins/combo/` 目錄結構
- [x] 2.2 實作 `schema.ts` - Zod schema 定義與驗證
- [x] 2.3 實作 `ConfigFields.tsx` - 設定欄位 UI
  - [x] X 軸欄位選擇
  - [x] 左 Y 軸欄位選擇（Bar series）
  - [x] 右 Y 軸欄位選擇（Line series）
  - [x] 左 Y 軸標籤輸入
  - [x] 右 Y 軸標籤輸入
  - [x] Line 平滑曲線開關
- [x] 2.4 實作 `ComboChartRenderer.tsx` - ECharts 渲染邏輯
  - [x] 雙 Y 軸配置（yAxis 陣列）
  - [x] Bar series 指定 yAxisIndex: 0
  - [x] Line series 指定 yAxisIndex: 1
  - [x] 軸標籤顯示
  - [x] 平滑曲線選項
- [x] 2.5 實作 `index.ts` - ComboChartPlugin 匯出
- [x] 2.6 定義 `configBehavior` 設定

## 3. Plugin Registration

- [x] 3.1 在 `src/features/chart-plugins/plugins/index.ts` 註冊 ComboChartPlugin
- [x] 3.2 確認 ChartTypeSelector 可顯示 Combo Chart 選項

## 4. Testing

- [x] 4.1 撰寫 Playwright E2E 測試 (10 個測試案例)
  - [x] Then Combo Chart option should be available in chart type selector
  - [x] Then selecting Combo Chart should show combo-specific config fields
  - [x] Then selecting X-axis, left Y-axis (Bar), and right Y-axis (Line) should show preview
  - [x] Then entering custom Y-axis labels should be possible
  - [x] Then enabling smooth line option should be possible
  - [x] Then the widget should display the configured combo chart
  - [x] Then saving without left Y-axis fields should show error
  - [x] Then saving without right Y-axis fields should show error
  - [x] Then the widget should display the existing combo chart
  - [x] Then opening config panel should show existing values

## 5. Additional Fixes

- [x] 5.1 修復 ChartWidget.tsx 中 dataSourceId 的 TypeScript 錯誤
- [x] 5.2 新增 Combo Chart 至 ChartConfigPanel 的 initialConfig 處理
