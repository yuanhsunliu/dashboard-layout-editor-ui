# features Specification

## Purpose
TBD - created by archiving change add-chart-rendering. Update Purpose after archive.
## Requirements
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

### Requirement: Open Config Panel
使用者 SHALL 能夠透過點擊開啟圖表設定面板。

#### Scenario: 點擊空白 Widget 開啟設定面板
- **GIVEN** Widget 尚未設定 chartConfig（顯示 ChartEmpty）
- **WHEN** 使用者點擊 ChartEmpty 區域
- **THEN** 開啟圖表設定 Sheet 面板
- **AND** 面板預設選擇「折線圖」類型

#### Scenario: 點擊已設定 Widget 的設定按鈕開啟設定面板
- **GIVEN** Widget 已設定 chartConfig（顯示圖表）
- **WHEN** 使用者點擊 Widget header 的設定按鈕
- **THEN** 開啟圖表設定 Sheet 面板
- **AND** 面板顯示目前的設定值

### Requirement: Chart Type Selection
使用者 SHALL 能夠從下拉選單選擇圖表類型。

#### Scenario: 選擇圖表類型
- **WHEN** 使用者從圖表類型下拉選單選擇類型
- **THEN** 顯示所選類型的圖示與名稱
- **AND** 動態顯示該類型對應的設定欄位

#### Scenario: 切換圖表類型時重置欄位
- **GIVEN** 使用者已選擇資料來源和欄位對應
- **WHEN** 使用者切換圖表類型
- **THEN** 清空欄位對應設定（xAxisField, yAxisFields）
- **AND** 保留資料來源選擇

### Requirement: Data Source Selection
使用者 SHALL 能夠從下拉選單選擇資料來源。

#### Scenario: 選擇資料來源
- **WHEN** 使用者從資料來源下拉選單選擇資料來源
- **THEN** 載入該資料來源的欄位列表
- **AND** X 軸和 Y 軸欄位選項更新為該資料來源的欄位

#### Scenario: 切換資料來源時重置欄位對應
- **GIVEN** 使用者已選擇欄位對應
- **WHEN** 使用者切換資料來源
- **THEN** 清空欄位對應設定

### Requirement: Field Mapping
使用者 SHALL 能夠設定 X 軸和 Y 軸對應欄位。

#### Scenario: Line/Bar Chart 欄位對應
- **GIVEN** 圖表類型為 Line 或 Bar
- **WHEN** 使用者設定欄位對應
- **THEN** 可從下拉選單選擇一個 X 軸欄位
- **AND** 可透過 Checkbox 多選 Y 軸欄位

#### Scenario: 欄位驗證
- **WHEN** 使用者未選擇必要欄位就點擊儲存
- **THEN** 顯示欄位驗證錯誤訊息
- **AND** 阻止儲存操作

### Requirement: Live Preview
設定變更時 SHALL 即時更新預覽圖表。

#### Scenario: 即時預覽圖表
- **GIVEN** 使用者已選擇圖表類型、資料來源和欄位對應
- **WHEN** 任何設定欄位變更
- **THEN** 預覽區域即時更新顯示對應圖表
- **AND** 預覽使用該資料來源的 demo data

### Requirement: Save and Cancel
使用者 SHALL 能夠儲存或取消設定變更。

#### Scenario: 儲存設定
- **GIVEN** 使用者已完成所有必要設定
- **WHEN** 使用者點擊「儲存」按鈕
- **THEN** 更新 Widget 的 chartConfig
- **AND** 關閉設定面板
- **AND** Widget 顯示設定的圖表
- **AND** 變更自動儲存至 localStorage

#### Scenario: 取消設定
- **WHEN** 使用者點擊「取消」按鈕
- **THEN** 放棄所有變更
- **AND** 關閉設定面板
- **AND** Widget 保持原狀態

