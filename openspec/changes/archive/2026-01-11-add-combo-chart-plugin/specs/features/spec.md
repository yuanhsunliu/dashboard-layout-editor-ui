# F09: Chart Plugin System - Combo Chart Delta

## ADDED Requirements

### Requirement: Combo Chart Plugin

系統 SHALL 提供 Combo Chart Plugin，讓使用者可以在單一圖表中同時呈現 Bar 和 Line series，並使用左右 Y 軸顯示不同量綱的指標。

#### Scenario: 選擇 Combo Chart 類型

- **GIVEN** 使用者在圖表設定面板
- **WHEN** 使用者從圖表類型選擇器選擇 "Combo Chart"
- **THEN** 系統顯示 Combo Chart 專屬的設定欄位

#### Scenario: 設定 Combo Chart 欄位

- **GIVEN** 使用者已選擇 Combo Chart 類型並選擇資料來源
- **WHEN** 使用者設定 X 軸欄位、左 Y 軸欄位（Bar）、右 Y 軸欄位（Line）
- **THEN** 系統驗證設定完整性並啟用預覽

#### Scenario: 自訂 Y 軸標籤

- **GIVEN** 使用者已完成 Combo Chart 基本設定
- **WHEN** 使用者輸入左 Y 軸標籤為「銷售額（萬）」、右 Y 軸標籤為「成長率（%）」
- **THEN** 圖表左右 Y 軸顯示對應的自訂標籤

#### Scenario: 啟用 Line 平滑曲線

- **GIVEN** 使用者已完成 Combo Chart 基本設定
- **WHEN** 使用者啟用「平滑曲線」選項
- **THEN** 右軸 Line series 以平滑曲線呈現

#### Scenario: 渲染 Combo Chart

- **GIVEN** 使用者已完成 Combo Chart 設定並有資料
- **WHEN** 系統渲染圖表
- **THEN** 左軸顯示 Bar series，右軸顯示 Line series，兩軸使用獨立的刻度

### Requirement: Combo Chart Config Schema

系統 SHALL 定義 ComboChartConfig schema，包含以下欄位：

- `chartType`: 固定為 `'combo'`
- `dataSourceId`: 資料來源 ID（必填）
- `title`: 圖表標題（選填，最多 50 字元）
- `xAxisField`: X 軸欄位（必填）
- `leftYAxisFields`: 左 Y 軸欄位陣列，使用 Bar series（至少 1 個）
- `rightYAxisFields`: 右 Y 軸欄位陣列，使用 Line series（至少 1 個）
- `leftYAxisLabel`: 左 Y 軸自訂標籤（選填）
- `rightYAxisLabel`: 右 Y 軸自訂標籤（選填）
- `smooth`: Line series 是否使用平滑曲線（預設 false）

#### Scenario: 驗證必填欄位

- **GIVEN** 使用者正在設定 Combo Chart
- **WHEN** 使用者未選擇 X 軸欄位或 Y 軸欄位
- **THEN** 系統顯示驗證錯誤訊息

#### Scenario: 驗證 Y 軸欄位數量

- **GIVEN** 使用者正在設定 Combo Chart
- **WHEN** 左 Y 軸欄位或右 Y 軸欄位為空
- **THEN** 系統顯示「請至少選擇一個欄位」錯誤

### Requirement: Combo Chart Plugin Registration

ComboChartPlugin SHALL 遵循 ChartPlugin interface 並註冊至 chartRegistry，包含：

- `type`: `'combo'`
- `name`: 'Combo Chart' / '組合圖'
- `icon`: 適當的圖示元件
- `configSchema`: comboChartConfigSchema
- `ConfigFields`: Combo Chart 專屬設定欄位元件
- `Renderer`: ComboChartRenderer 元件
- `configBehavior`: 定義 UI 行為（requiresDataSource: true, showTitleInput: true）

#### Scenario: Plugin 註冊至 Registry

- **GIVEN** 系統啟動
- **WHEN** chartRegistry 初始化
- **THEN** Combo Chart Plugin 可透過 `chartRegistry.getByType('combo')` 取得

#### Scenario: ChartTypeSelector 顯示 Combo Chart

- **GIVEN** 使用者開啟圖表類型選擇器
- **WHEN** 選擇器從 Registry 讀取可用類型
- **THEN** Combo Chart 出現在選項列表中
