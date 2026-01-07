# Tasks: Add Chart Plugin System

## 1. Setup
- [x] 1.1 建立 `src/features/chart-plugins/` 目錄結構
- [x] 1.2 定義 ChartPlugin Interface (`types.ts`)
- [x] 1.3 建立 chartRegistry (`registry.ts`)

## 2. Refactor Line Chart to Plugin
- [x] 2.1 建立 `plugins/line/` 目錄
- [x] 2.2 遷移 LineChart Renderer
- [x] 2.3 遷移 Line Chart Schema
- [x] 2.4 建立 LineChartConfigFields 元件
- [x] 2.5 建立 LineChartPlugin export
- [x] 2.6 註冊至 Registry

## 3. Refactor Bar Chart to Plugin
- [x] 3.1 建立 `plugins/bar/` 目錄
- [x] 3.2 遷移 BarChart Renderer
- [x] 3.3 遷移 Bar Chart Schema
- [x] 3.4 建立 BarChartConfigFields 元件
- [x] 3.5 建立 BarChartPlugin export
- [x] 3.6 註冊至 Registry

## 4. Update ChartTypeSelector
- [x] 4.1 修改為從 chartRegistry 取得圖表類型列表
- [x] 4.2 動態渲染圖表圖示與名稱
- [x] 4.3 確保選擇行為不變

## 5. Update ChartRenderer
- [x] 5.1 修改為從 chartRegistry 取得 Renderer
- [x] 5.2 處理 Unknown chart type 錯誤
- [x] 5.3 移除舊的 switch/case 邏輯
- [x] 5.4 新增 ChartErrorBoundary 元件

## 6. Update ChartConfigPanel
- [x] 6.1 修改為從 chartRegistry 取得 ConfigFields
- [x] 6.2 動態渲染設定欄位
- [x] 6.3 整合 Plugin Schema 驗證

## 7. Cleanup
- [x] 7.1 保留舊的 chart components（維持向後相容）
- [x] 7.2 更新 import paths
- [x] 7.3 移除未使用的程式碼

## 8. Documentation
- [x] 8.1 撰寫 PLUGIN_DEVELOPMENT.md
- [x] 8.2 包含 Plugin Interface 說明
- [x] 8.3 包含新增 Plugin 步驟
- [x] 8.4 包含範例程式碼

## 9. Testing
- [x] 9.1 執行現有 E2E 測試（49 個測試全部通過）
- [x] 9.2 驗證 ChartTypeSelector 顯示正確
- [x] 9.3 驗證圖表渲染正確
- [x] 9.4 驗證設定面板欄位正確
