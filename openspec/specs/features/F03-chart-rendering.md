# F03: Chart Rendering

## Overview
Widget 可以渲染 ECharts 圖表，支援多種圖表類型，並響應 Widget 大小變化自動調整。

## User Stories
- 作為使用者，我可以在 Widget 中看到圖表，以便視覺化資料
- 作為使用者，當我調整 Widget 大小時，圖表會自動適應新尺寸

## Acceptance Criteria

### 圖表渲染
- [ ] Widget 有設定 chartConfig 時渲染對應圖表
- [ ] 圖表填滿 Widget 內容區域
- [ ] 支援 Line Chart 和 Bar Chart（MVP）

### 響應式調整
- [ ] Widget resize 時圖表自動 resize
- [ ] 使用 ResizeObserver 或 react-grid-layout 回調

### Loading 與 Error 狀態
- [ ] 資料載入中顯示 Skeleton / Spinner
- [ ] 資料載入失敗顯示錯誤訊息與重試按鈕

### 空白狀態
- [ ] 尚未設定 chartConfig 顯示引導設定提示

## UI/UX Spec

### 圖表渲染狀態

**正常渲染**
```
┌─────────────────┐
│ 銷售趨勢     [x]│
│   📈            │
│  (ECharts 圖表) │
│              ◢  │
└─────────────────┘
```

**Loading 狀態**
```
┌─────────────────┐
│ 銷售趨勢     [x]│
│                 │
│   ⏳ 載入中...  │
│              ◢  │
└─────────────────┘
```

**Error 狀態**
```
┌─────────────────┐
│ 銷售趨勢     [x]│
│                 │
│   ❌ 載入失敗   │
│   [重試]        │
│              ◢  │
└─────────────────┘
```

**未設定狀態**
```
┌─────────────────┐
│ 新增 Widget  [x]│
│                 │
│   📊 點擊設定   │
│   選擇圖表類型  │
│              ◢  │
└─────────────────┘
```

## Supported Chart Types

### MVP (P0)
| 類型 | 名稱 | ECharts type |
|------|------|--------------|
| line | 折線圖 | `line` |
| bar | 長條圖 | `bar` |

### Phase 2 (P1)
| 類型 | 名稱 | ECharts type |
|------|------|--------------|
| pie | 圓餅圖 | `pie` |
| area | 面積圖 | `line` + areaStyle |

### Phase 3 (P2)
| 類型 | 名稱 | ECharts type |
|------|------|--------------|
| scatter | 散點圖 | `scatter` |
| gauge | 儀表板 | `gauge` |

## Data Model

```typescript
type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'gauge';

// 通用圖表設定介面
interface BaseChartConfig {
  id: string;
  chartType: ChartType;
  title?: string;
  dataSourceId: string;
}

// Line Chart
interface LineChartConfig extends BaseChartConfig {
  chartType: 'line';
  xAxisField: string;
  yAxisFields: string[];
  smooth?: boolean;
  showArea?: boolean;
}

// Bar Chart
interface BarChartConfig extends BaseChartConfig {
  chartType: 'bar';
  xAxisField: string;
  yAxisFields: string[];
  stacked?: boolean;
  horizontal?: boolean;
}

// Pie Chart (Phase 2)
interface PieChartConfig extends BaseChartConfig {
  chartType: 'pie';
  valueField: string;
  labelField: string;
  showLegend?: boolean;
}

// Union Type
type ChartConfig = LineChartConfig | BarChartConfig | PieChartConfig;
```

## Component Structure

```
src/components/chart/
├── ChartWidget.tsx        # Widget 容器，處理狀態
├── ChartRenderer.tsx      # 根據 chartType 渲染對應圖表
├── charts/
│   ├── LineChart.tsx      # Line Chart 實作
│   ├── BarChart.tsx       # Bar Chart 實作
│   └── PieChart.tsx       # Pie Chart 實作 (Phase 2)
├── ChartSkeleton.tsx      # Loading 狀態
├── ChartError.tsx         # Error 狀態
└── ChartEmpty.tsx         # 未設定狀態
```

## ECharts Integration

```typescript
// 使用 echarts-for-react
import ReactECharts from 'echarts-for-react';

// 圖表需響應容器大小
<ReactECharts
  option={chartOption}
  style={{ height: '100%', width: '100%' }}
  opts={{ renderer: 'canvas' }}
  notMerge={true}
/>
```

## Dependencies
- T01: Project Setup（ECharts 安裝）
- F02: Widget Layout（Widget 容器）

## Out of Scope
- 圖表互動功能（tooltip 除外）
- 圖表動畫自訂
- 圖表匯出為圖片
- 自訂 ECharts option
