# Tasks: Add Chart Configuration

## 1. Setup
- [x] 1.1 安裝需要的 shadcn/ui 元件（Sheet, Select, Checkbox, Label）
- [x] 1.2 建立 `src/features/chart-config/` 目錄結構
- [x] 1.3 建立 Mock Data Sources 資料

## 2. Data Model
- [x] 2.1 定義 DataSource 和 DataSourceField TypeScript 類型
- [x] 2.2 建立 Mock Data Sources 服務（3 個資料來源：銷售資料、使用者統計、產品庫存）
- [x] 2.3 定義表單驗證 Schema（Zod）

## 3. Core Components
- [x] 3.1 實作 ChartConfigPanel（Sheet 容器，從右側滑出）
- [x] 3.2 實作 ChartTypeSelector（圖表類型選擇：折線圖/長條圖）
- [x] 3.3 實作 DataSourceSelector（資料來源下拉選單）
- [x] 3.4 實作 FieldMappingForm（欄位對應表單）

## 4. Field Mapping
- [x] 4.1 實作 X 軸欄位下拉選單（所有欄位類型可選）
- [x] 4.2 實作 Y 軸欄位多選 Checkbox（僅顯示 number 類型欄位）

## 5. Preview
- [x] 5.1 實作 ChartPreview 元件
- [x] 5.2 整合現有 ChartRenderer 進行即時預覽
- [x] 5.3 僅在所有必填欄位選取後顯示預覽

## 6. Form Logic
- [x] 6.1 實作表單狀態管理（useState）
- [x] 6.2 實作 Zod 驗證與錯誤訊息顯示
- [x] 6.3 實作資料來源切換時重置欄位邏輯

## 7. Integration
- [x] 7.1 整合設定面板至 DashboardEditorPage
- [x] 7.2 WidgetContainer 新增設定按鈕（齒輪圖示）
- [x] 7.3 點擊設定按鈕開啟設定面板
- [x] 7.4 儲存設定更新 Widget chartConfig（updateWidgetConfig action）
- [x] 7.5 儲存後自動持久化至 localStorage
- [x] 7.6 點擊 overlay 不關閉面板（防止意外關閉）

## 8. Testing
- [x] 8.1 撰寫 E2E 測試：開啟設定面板
- [x] 8.2 撰寫 E2E 測試：選擇圖表類型
- [x] 8.3 撰寫 E2E 測試：選擇資料來源與欄位
- [x] 8.4 撰寫 E2E 測試：即時預覽
- [x] 8.5 撰寫 E2E 測試：儲存與取消
- [x] 8.6 撰寫 E2E 測試：表單驗證
- [x] 8.7 撰寫 E2E 測試：編輯現有設定
- [x] 8.8 全部 49 個 E2E 測試通過

## Implementation Summary
- **Start Time**: 2026-01-06T13:41:57Z
- **End Time**: 2026-01-06T14:05:00Z
- **Duration**: ~23 minutes
- **Files Created**: 13
- **Files Modified**: 8
- **E2E Tests Added**: 14 new tests (49 total)
- **Screenshots Generated**: 23
