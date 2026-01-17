## ADDED Requirements

### Requirement: Time Series Chart Plugin
系統 SHALL 提供 Time Series Chart Plugin，支援時間序列資料的視覺化與跨週期比較。

#### Scenario: 基本時間軸渲染
- **GIVEN** 使用者選擇 Time Series Chart 類型
- **AND** 設定時間欄位與數值欄位
- **WHEN** 圖表渲染
- **THEN** X 軸使用 ECharts `type: 'time'` 時間軸
- **AND** 時間標籤自動根據資料範圍格式化（時:分 / 日 / 月）

#### Scenario: 跨週期對比
- **GIVEN** 使用者啟用「跨週期比較」功能
- **AND** 選擇比較維度（年/月/週）
- **WHEN** 圖表渲染
- **THEN** 不同週期的資料對齊到相同相對時間點
- **AND** 每個週期顯示為獨立 Series（如：2015 vs 2016）

#### Scenario: 多層時間軸標籤
- **GIVEN** 資料跨越多天或多月
- **WHEN** 圖表渲染
- **THEN** X 軸顯示多層標籤（第一層：時:分，第二層：日，第三層：月）
- **AND** 標籤層級根據資料範圍自動調整

#### Scenario: 時間範圍選擇
- **GIVEN** 使用者啟用 dataZoom
- **WHEN** 使用者拖動時間範圍選擇器
- **THEN** 圖表僅顯示選定時間範圍內的資料
- **AND** 時間軸標籤自動更新

#### Scenario: 時間粒度切換
- **GIVEN** 使用者設定時間粒度（小時/日/週/月）
- **WHEN** 圖表渲染
- **THEN** 資料按選定粒度聚合顯示
- **AND** 聚合方式預設為平均值

### Requirement: Time Series Chart Configuration
系統 SHALL 提供 Time Series Chart 的設定表單，讓使用者配置圖表參數。

#### Scenario: 基本設定
- **GIVEN** 使用者開啟 Time Series Chart 設定面板
- **WHEN** 使用者進行設定
- **THEN** 可設定以下參數：
  - 圖表標題
  - 資料來源
  - 時間欄位（X 軸）
  - 數值欄位（Y 軸，可多選）

#### Scenario: 跨週期比較設定
- **GIVEN** 使用者啟用「跨週期比較」
- **WHEN** 設定面板展開進階選項
- **THEN** 可設定：
  - 比較維度（年/月/週）
  - 週期標籤格式
  - 是否顯示圖例

#### Scenario: 進階設定
- **GIVEN** 使用者展開進階設定
- **WHEN** 使用者進行設定
- **THEN** 可設定：
  - 啟用/停用 dataZoom
  - 時間粒度（小時/日/週/月）
  - 聚合方式（平均/加總/最大/最小）
  - 是否顯示平滑曲線

### Requirement: Time Series Chart Data Model
系統 SHALL 支援 TimeSeriesChartConfig 資料結構，定義時間序列圖表的設定參數。

#### Scenario: Schema 定義
- **GIVEN** 開發人員實作 Time Series Chart
- **WHEN** 定義 Config Schema
- **THEN** Schema 包含以下欄位：
  ```typescript
  interface TimeSeriesChartConfig {
    chartType: 'time-series';
    title?: string;
    dataSourceId: string;
    
    // 時間軸設定
    timeField: string;
    valueFields: string[];
    
    // 跨週期比較
    enablePeriodComparison?: boolean;
    comparisonDimension?: 'year' | 'month' | 'week';
    periodField?: string;
    
    // 進階設定
    enableDataZoom?: boolean;
    timeGranularity?: 'hour' | 'day' | 'week' | 'month';
    aggregation?: 'avg' | 'sum' | 'max' | 'min';
    smooth?: boolean;
  }
  ```
