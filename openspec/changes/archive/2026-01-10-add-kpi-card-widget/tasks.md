# Tasks: 新增 KPI Card Widget Plugin

## 1. Implementation

- [x] 1.1 建立 `src/features/chart-plugins/plugins/kpi-card/` 目錄
- [x] 1.2 建立 `schema.ts` - KPI Card 設定 Schema (靜態數值輸入)
- [x] 1.3 建立 `KpiCardRenderer.tsx` - KPI Card 渲染元件
- [x] 1.4 建立 `ConfigFields.tsx` - KPI Card 設定欄位 UI
- [x] 1.5 建立 `index.ts` - Plugin export
- [x] 1.6 更新 `registry.ts` - 註冊 KPI Card Plugin
- [x] 1.7 更新 `plugins/index.ts` - 匯出 KPI Card Plugin
- [x] 1.8 更新 `ChartConfigPanel.tsx` - 支援靜態 KPI Card（無資料來源）
- [x] 1.9 更新 `ChartPreview.tsx` - 支援 KPI Card 預覽
- [x] 1.10 更新 `types/chart.ts` - 新增 KpiCardConfig 型別

## 2. Testing

- [x] 2.1 撰寫 E2E 測試 - 新增 KPI Card Widget (10 測試案例)
- [x] 2.2 執行測試確認功能正常 - **10/10 PASSED**
