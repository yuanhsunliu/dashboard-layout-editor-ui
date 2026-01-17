# Tasks: Add Time Series Chart Widget

## 1. Plugin 架構

- [ ] 1.1 建立 `src/features/chart-plugins/plugins/time-series/` 目錄結構
- [ ] 1.2 定義 `schema.ts` - TimeSeriesChartConfig Zod schema
- [ ] 1.3 實作 `ConfigFields.tsx` - 設定表單元件
- [ ] 1.4 實作 `TimeSeriesChartRenderer.tsx` - ECharts 渲染元件
- [ ] 1.5 建立 `index.ts` - Plugin 匯出與註冊

## 2. 核心功能

- [ ] 2.1 實作時間軸 (`type: 'time'`) 基本渲染
- [ ] 2.2 實作多層時間標籤格式化（時:分 / 日 / 月）
- [ ] 2.3 實作跨週期對比邏輯（對齊不同年份資料）
- [ ] 2.4 實作 Series 自動著色（按週期分組）

## 3. 進階功能

- [ ] 3.1 實作 dataZoom 時間範圍選擇器
- [ ] 3.2 實作時間粒度切換（小時/日/週/月）
- [ ] 3.3 實作 tooltip 跨週期對比顯示

## 4. 整合與註冊

- [ ] 4.1 在 `chartRegistry` 註冊 time-series plugin
- [ ] 4.2 新增 demo 資料 (`DEMO_DATA.timeSeries`)
- [ ] 4.3 確認與 Cross-Widget Interaction 相容

## 5. 測試

- [ ] 5.1 撰寫 Playwright E2E 測試
- [ ] 5.2 驗證跨週期對齊正確性
- [ ] 5.3 驗證 dataZoom 互動行為
