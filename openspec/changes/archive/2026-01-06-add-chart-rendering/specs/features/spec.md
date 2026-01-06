# F03: Chart Rendering

## ADDED Requirements

### Requirement: Chart Rendering
Widget 有設定 chartConfig 時 SHALL 渲染對應 ECharts 圖表，圖表 SHALL 填滿 Widget 內容區域。

#### Scenario: Widget 有 chartConfig 時渲染圖表
- **WHEN** Widget 設定了 chartConfig
- **THEN** 系統根據 chartConfig.chartType 渲染對應圖表
- **AND** 圖表填滿 Widget 內容區域（height: 100%, width: 100%）
- **AND** 圖表使用 hardcoded demo data（MVP）

#### Scenario: Widget 無 chartConfig 時顯示空白狀態
- **WHEN** Widget 未設定 chartConfig
- **THEN** 顯示引導設定提示（ChartEmpty）

### Requirement: Supported Chart Types (MVP)
系統 SHALL 支援 Line Chart 和 Bar Chart 兩種圖表類型。

#### Scenario: 渲染 Line Chart
- **GIVEN** chartConfig.chartType 為 'line'
- **WHEN** 圖表渲染
- **THEN** 使用 ECharts line series 渲染折線圖
- **AND** 顯示 ECharts 預設 Tooltip

#### Scenario: 渲染 Bar Chart
- **GIVEN** chartConfig.chartType 為 'bar'
- **WHEN** 圖表渲染
- **THEN** 使用 ECharts bar series 渲染長條圖
- **AND** 顯示 ECharts 預設 Tooltip

### Requirement: Responsive Chart Resize
當 Widget 大小變化時，圖表 SHALL 自動調整尺寸以適應新容器大小。

#### Scenario: Widget resize 時圖表自動調整
- **WHEN** 使用者拖曳調整 Widget 大小
- **THEN** 圖表在 200ms debounce 後自動 resize 以填滿新的容器尺寸
- **AND** 圖表內容（軸、標籤、圖例）正確重新佈局

#### Scenario: 使用 ResizeObserver 監聽容器變化
- **WHEN** Widget 容器尺寸變化
- **THEN** 系統透過 ResizeObserver 偵測變化
- **AND** 以 200ms debounce 觸發 ECharts resize() 方法

### Requirement: Empty State
尚未設定 chartConfig 時 SHALL 顯示引導設定提示。

#### Scenario: 未設定 chartConfig 顯示引導
- **WHEN** Widget 的 chartConfig 為 undefined 或 null
- **THEN** 顯示「點擊設定選擇圖表類型」引導訊息
- **AND** 提供可點擊的設定入口

#### Scenario: 點擊設定入口觸發 callback
- **GIVEN** Widget 處於 Empty 狀態
- **WHEN** 使用者點擊設定入口
- **THEN** 觸發 onConfigClick callback
- **AND** 由父層元件決定後續行為
