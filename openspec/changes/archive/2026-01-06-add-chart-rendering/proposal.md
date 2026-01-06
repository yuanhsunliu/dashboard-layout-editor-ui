# Change: Add Chart Rendering to Widget

## Why
使用者需要在 Widget 中視覺化資料，透過 ECharts 圖表呈現，並在調整 Widget 大小時自動適應。

## What Changes
- 新增 ECharts 圖表渲染功能至 Widget
- 支援 Line Chart 和 Bar Chart（MVP）
- 實作響應式圖表調整（ResizeObserver + 200ms debounce）
- 新增 Empty 狀態處理（含 `onConfigClick` callback）
- 新增 ChartConfig 資料模型（移除獨立 id，使用 Widget.id）
- 使用 hardcoded demo data（MVP 不依賴 F06 Data Source）
- 使用 ECharts 預設 Tooltip

## MVP Scope Decisions
| 項目 | 決定 |
|------|------|
| 資料來源 | Hardcoded mock data |
| Loading 狀態 | 不實作（延後至 F06） |
| Error 狀態 | 不實作（延後至 F06） |
| ChartConfig.id | 移除，使用 Widget.id |
| Resize debounce | 200ms |
| Tooltip | 使用 ECharts 預設 |

## Impact
- Affected specs: features (F03-chart-rendering)
- Affected code: `src/components/chart/`, Widget 元件
- Dependencies: echarts-for-react, F02 Widget Layout
