## ADDED Requirements

### Requirement: Chart Plugin Interface
系統 SHALL 提供 ChartPlugin Interface，定義圖表插件需實作的內容。

#### Scenario: Plugin Interface 定義
- **WHEN** 開發人員要建立新的圖表類型
- **THEN** 需實作 ChartPlugin Interface，包含：
  - `type`: 圖表類型識別碼
  - `name`: 圖表顯示名稱
  - `icon`: 圖表圖示元件
  - `configSchema`: Zod 驗證 Schema
  - `ConfigFields`: 設定欄位 UI 元件
  - `Renderer`: 圖表渲染元件

### Requirement: Chart Plugin Registry
系統 SHALL 提供 Chart Registry 機制，集中管理所有已註冊的圖表插件。

#### Scenario: 註冊新圖表類型
- **GIVEN** 開發人員已實作符合 ChartPlugin Interface 的插件
- **WHEN** 將插件加入 Registry 並重新 build
- **THEN** 該圖表類型可在 Widget 設定中選用

#### Scenario: 取得所有圖表類型
- **WHEN** ChartTypeSelector 需要顯示可用圖表類型
- **THEN** 從 chartRegistry.getAll() 取得所有已註冊插件

#### Scenario: 根據類型取得插件
- **WHEN** 系統需要渲染特定類型的圖表
- **THEN** 從 chartRegistry.getByType(type) 取得對應插件

### Requirement: Dynamic Chart Type Selection
ChartTypeSelector SHALL 從 Registry 動態讀取可用的圖表類型。

#### Scenario: 顯示已註冊圖表類型
- **GIVEN** Registry 中有 Line、Bar 兩種圖表插件
- **WHEN** 使用者開啟圖表類型選擇器
- **THEN** 顯示 Line 與 Bar 兩個選項，包含圖示與名稱

### Requirement: Dynamic Chart Rendering
ChartRenderer SHALL 根據 chartType 從 Registry 取得對應的 Renderer 元件。

#### Scenario: 渲染已註冊圖表
- **GIVEN** Widget 設定 chartType 為 'line'
- **WHEN** 渲染該 Widget
- **THEN** 使用 LineChartPlugin.Renderer 渲染圖表

#### Scenario: 處理未知圖表類型
- **GIVEN** Widget 設定 chartType 為未註冊的類型
- **WHEN** 渲染該 Widget
- **THEN** 顯示錯誤訊息

#### Scenario: Renderer 元件錯誤處理
- **GIVEN** Plugin Renderer 發生 runtime error
- **WHEN** 渲染該 Widget
- **THEN** 顯示「圖表載入失敗」錯誤訊息
- **AND** 不影響其他 Widget 運作

### Requirement: Dynamic Config Fields
ChartConfigPanel SHALL 根據選擇的圖表類型，動態顯示對應的設定欄位。

#### Scenario: 顯示 Line Chart 設定欄位
- **GIVEN** 使用者選擇 Line Chart
- **WHEN** 設定面板渲染欄位
- **THEN** 使用 LineChartPlugin.ConfigFields 渲染 X/Y 軸欄位

#### Scenario: 切換圖表類型更新欄位
- **GIVEN** 使用者已選擇 Line Chart 並設定欄位
- **WHEN** 切換為 Bar Chart
- **THEN** 設定欄位更新為 BarChartPlugin.ConfigFields

### Requirement: Plugin Development Documentation
系統 SHALL 提供 Plugin 開發文件，說明如何建立新的圖表插件。

#### Scenario: 開發人員查閱文件
- **WHEN** 開發人員要建立新的圖表類型
- **THEN** 可參考 PLUGIN_DEVELOPMENT.md 了解：
  - ChartPlugin Interface 定義
  - 必要檔案結構
  - 註冊步驟
  - 範例程式碼

## MODIFIED Requirements

### Requirement: Chart Type Selection
系統 SHALL 從 Chart Registry 動態提供可選擇的圖表類型列表。

#### Scenario: 選擇圖表類型
- **WHEN** 使用者開啟圖表類型下拉選單
- **THEN** 顯示所有已註冊的圖表類型選項
- **AND** 每個選項顯示圖示與名稱
