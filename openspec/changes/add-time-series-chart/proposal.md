# Change: Add Time Series Chart Widget

## Why
現有 Line Chart Widget 設計用於類別分組比較（Hierarchical X Axis），無法滿足時間序列跨週期比較的需求。使用者需要在同一圖表上對比不同年份/月份/週的資料趨勢（如：2015 vs 2016 同期降水量），這需要專用的時間軸處理邏輯。

新建獨立的 Time Series Chart Widget 可以：
- 保持 Line Chart 職責單純
- 提供專為時間序列設計的 UX
- 支援跨週期對齊、多層時間軸標籤等進階功能

## What Changes

### New Features
- 新增 `time-series` Chart Plugin
- 支援 ECharts `type: 'time'` 時間軸
- 多層時間軸標籤（時:分 → 日 → 月）
- 跨週期對比（將不同年份對齊到相同相對時間點）
- 時間範圍選擇器（dataZoom）
- 時間粒度切換（小時/日/週/月聚合）

### Plugin Structure
```
src/features/chart-plugins/plugins/time-series/
├── index.ts
├── schema.ts
├── TimeSeriesChartRenderer.tsx
└── ConfigFields.tsx
```

## Impact
- Affected specs: `features/spec.md` (F03 新增 Time Series 圖表類型)
- Affected code: 
  - `src/features/chart-plugins/plugins/` (新增 time-series 目錄)
  - `src/features/chart-plugins/registry.ts` (註冊新 plugin)
- New dependencies: 無（使用現有 ECharts）

## Differentiation from Line Chart

| 特性 | Line Chart (現有) | Time Series Chart (新增) |
|-----|------------------|------------------------|
| X 軸類型 | `type: 'category'` | `type: 'time'` |
| 用途 | 類別分組比較 | 時間序列跨週期對比 |
| X 軸層級 | 2 層（外層/內層） | 自動多層時間格式 |
| 對齊邏輯 | 按索引順序 | 按相對時間對齊 |
| dataZoom | 無 | 支援時間範圍選擇 |
| 粒度切換 | 無 | 支援小時/日/週/月 |
