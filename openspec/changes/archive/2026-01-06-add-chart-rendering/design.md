# Design: Chart Rendering

## Context
Dashboard 需要在 Widget 中渲染 ECharts 圖表，支援多種圖表類型，並響應容器大小變化自動調整。此功能依賴 F02 Widget Layout 提供的容器結構。

## Goals / Non-Goals

### Goals (MVP)
- 使用 ECharts 渲染 Line Chart 和 Bar Chart
- 圖表自動填滿 Widget 內容區域
- 響應式調整（Widget resize 時圖表跟隨 resize，200ms debounce）
- 處理 Empty 狀態（含 `onConfigClick` callback）
- 使用 hardcoded demo data 展示圖表
- 使用 ECharts 預設 Tooltip

### Non-Goals (MVP)
- Loading 狀態（延後至 F06 整合）
- Error 狀態（延後至 F06 整合）
- 圖表互動功能（tooltip 除外）
- 圖表動畫自訂
- 圖表匯出為圖片
- 自訂 ECharts option（使用預設配置）

## Decisions

### Decision 1: 使用 echarts-for-react
- **Why**: 提供 React 封裝，簡化 ECharts 整合，自動處理生命週期
- **Alternatives**: 直接使用 echarts（需手動處理 dispose）、其他圖表庫（如 recharts）

### Decision 2: 使用 ResizeObserver 監聽容器變化
- **Why**: 精確監聽容器尺寸變化，觸發圖表 resize
- **Alternatives**: 依賴 react-grid-layout 回調（可能延遲）、window resize（不精確）

### Decision 3: 元件分層架構
```
ChartWidget (狀態管理)
  ├── ChartSkeleton (loading)
  ├── ChartError (error)
  ├── ChartEmpty (未設定)
  └── ChartRenderer (正常)
        ├── LineChart
        └── BarChart
```

## Component Structure

```
src/components/chart/
├── ChartWidget.tsx        # Widget 容器，處理狀態
├── ChartRenderer.tsx      # 根據 chartType 渲染對應圖表
├── charts/
│   ├── LineChart.tsx      # Line Chart 實作
│   └── BarChart.tsx       # Bar Chart 實作
├── ChartEmpty.tsx         # 未設定狀態（含 onConfigClick callback）
└── demoData.ts            # Hardcoded demo data
```

注意：MVP 不實作 ChartSkeleton（Loading）和 ChartError（Error），延後至 F06 整合。

## Data Model

```typescript
type ChartType = 'line' | 'bar';

// 注意：移除 id 欄位，使用 Widget.id 識別
interface BaseChartConfig {
  chartType: ChartType;
  title?: string;
  dataSourceId: string;      // MVP 忽略，未來 F06 使用
}

interface LineChartConfig extends BaseChartConfig {
  chartType: 'line';
  xAxisField: string;        // MVP 忽略
  yAxisFields: string[];     // MVP 忽略
  smooth?: boolean;
  showArea?: boolean;
}

interface BarChartConfig extends BaseChartConfig {
  chartType: 'bar';
  xAxisField: string;        // MVP 忽略
  yAxisFields: string[];     // MVP 忽略
  stacked?: boolean;
  horizontal?: boolean;
}

type ChartConfig = LineChartConfig | BarChartConfig;
```

## Demo Data (MVP)

```typescript
// MVP 使用 hardcoded demo data，每個圖表類型一組固定資料
const DEMO_DATA = {
  line: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [
      { name: '銷售額', data: [120, 200, 150, 80, 170, 210] }
    ]
  },
  bar: {
    xAxis: ['產品A', '產品B', '產品C', '產品D'],
    series: [
      { name: '銷量', data: [43, 85, 62, 93] }
    ]
  }
};
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| ECharts bundle 大小 | 使用 tree-shaking，只 import 需要的圖表類型 |
| 頻繁 resize 造成效能問題 | 使用 200ms debounce 限制 resize 頻率 |
| 圖表渲染阻塞 UI | 使用 Canvas renderer（ECharts 預設）|

## Migration Plan
- 此為新功能，無需遷移
- 現有 Widget 不受影響，只有設定 chartConfig 的 Widget 才會渲染圖表

## Resolved Questions
- ✅ MVP 資料來源：使用 hardcoded demo data
- ✅ Loading/Error 狀態：MVP 不實作，延後至 F06
- ✅ ChartConfig.id：移除，使用 Widget.id
- ✅ Resize debounce：200ms
- ✅ Tooltip：使用 ECharts 預設

## Open Questions
- Phase 2 時是否需要支援自訂 ECharts theme？
