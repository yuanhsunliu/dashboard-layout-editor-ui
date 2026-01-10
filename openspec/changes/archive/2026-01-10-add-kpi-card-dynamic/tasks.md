# Tasks: 新增 KPI Card Dynamic Widget Plugin

## 1. Implementation

- [x] 1.1 建立 `src/features/chart-plugins/plugins/kpi-card-dynamic/` 目錄
- [x] 1.2 建立 `schema.ts` - KPI Card Dynamic 設定 Schema (含 dataSourceId, valueField)
- [x] 1.3 建立 `KpiCardDynamicRenderer.tsx` - 從資料來源取值的渲染元件
- [x] 1.4 建立 `ConfigFields.tsx` - 資料來源和欄位選擇 UI
- [x] 1.5 建立 `index.ts` - Plugin export
- [x] 1.6 更新 `registry.ts` - 註冊 KPI Card Dynamic Plugin
- [x] 1.7 更新 `plugins/index.ts` - 匯出 KPI Card Dynamic Plugin
- [x] 1.8 更新 `types/chart.ts` - 新增 KpiCardDynamicConfig 型別
- [x] 1.9 更新 `ChartConfigPanel.tsx` - 支援 KPI Card Dynamic 設定
- [x] 1.10 更新 `ChartPreview.tsx` - 支援 KPI Card Dynamic 預覽
- [x] 1.11 更新 `ChartWidget.tsx` - 支援 KPI Card Dynamic 資料載入
- [x] 1.12 更新 `demoData.ts` - 擴展 DemoData 型別支援 rows

## 2. Testing

- [x] 2.1 撰寫 E2E 測試 - 新增 KPI Card Dynamic Widget (11 測試案例)
- [x] 2.2 執行測試確認功能正常 - **11/11 PASSED**

## 實作時間
- 開始: 2026-01-10T05:49:16 UTC
- 完成: 2026-01-10T05:58:00 UTC
- 耗時: 約 9 分鐘
