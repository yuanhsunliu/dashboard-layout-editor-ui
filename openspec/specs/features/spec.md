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
系統 SHALL 從 Chart Registry 動態提供可選擇的圖表類型列表。

#### Scenario: 選擇圖表類型
- **WHEN** 使用者開啟圖表類型下拉選單
- **THEN** 顯示所有已註冊的圖表類型選項
- **AND** 每個選項顯示圖示與名稱

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

### Requirement: Widget Type Selector
系統 SHALL 將「圖表類型」選擇器改為「Widget 類型」選擇器，包含圖表類型與嵌入報表選項。

#### Scenario: 顯示 Widget 類型選項
- **WHEN** 使用者開啟設定面板
- **THEN** Widget 類型選擇器顯示所有可用類型（Line、Bar、Area、嵌入報表）

#### Scenario: 選擇不同類型顯示對應欄位
- **WHEN** 使用者選擇不同的 Widget 類型
- **THEN** 顯示該類型專屬的設定欄位

### Requirement: Embed Widget Type
系統 SHALL 支援 Embed Widget 類型，允許使用者透過 URL 嵌入外部報表。

#### Scenario: 選擇 Embed Widget 類型
- **WHEN** 使用者選擇「嵌入報表」類型
- **THEN** 顯示 URL 輸入欄位（必填）
- **AND** 顯示標題輸入欄位（選填，預設值為「嵌入報表」）

#### Scenario: Embed 設定欄位
- **WHEN** 使用者選擇「嵌入報表」類型
- **THEN** 隱藏資料來源、X軸、Y軸等圖表相關欄位
- **AND** 僅顯示 URL 和標題欄位

### Requirement: URL Validation
系統 SHALL 驗證使用者輸入的 URL 格式，允許 HTTP 和 HTTPS。

#### Scenario: 有效 URL 格式
- **WHEN** 使用者輸入有效的 URL（http:// 或 https://）
- **THEN** 通過驗證，可以儲存設定

#### Scenario: 無效 URL 格式
- **WHEN** 使用者輸入無效的 URL
- **THEN** 顯示驗證錯誤訊息
- **AND** 無法儲存設定

### Requirement: Iframe Embedding
系統 SHALL 使用 iframe 嵌入外部 URL 內容，不設 sandbox 限制。

#### Scenario: 成功載入嵌入內容
- **WHEN** Widget 顯示已設定的 Embed Widget
- **THEN** 使用 iframe 載入設定的 URL
- **AND** iframe 自動填滿 Widget 區域
- **AND** 不設置 sandbox 屬性限制

#### Scenario: 載入中狀態
- **WHEN** iframe 正在載入
- **THEN** 顯示 loading skeleton

#### Scenario: 嵌入失敗處理
- **WHEN** 嵌入內容無法正常顯示（如 X-Frame-Options 阻擋）
- **THEN** 系統不主動偵測錯誤
- **AND** 由使用者自行判斷是否正常顯示

### Requirement: Embed Widget Preview
系統 SHALL 在設定面板中提供即時嵌入預覽。

#### Scenario: 顯示嵌入預覽
- **WHEN** 使用者輸入有效 URL
- **THEN** 在設定面板中即時顯示 iframe 預覽

### Requirement: Embed Widget Empty State
系統 SHALL 在未設定 URL 時顯示空白狀態。

#### Scenario: 空白狀態顯示
- **WHEN** Embed Widget 尚未設定 URL
- **THEN** 沿用 Chart Widget 空白狀態樣式
- **AND** 顯示「點擊設定」引導

### Requirement: Embed Widget Title
系統 SHALL 在 Widget 標題列顯示設定的標題。

#### Scenario: 顯示自訂標題
- **WHEN** 使用者設定了標題
- **THEN** Widget 標題列顯示使用者設定的標題

#### Scenario: 顯示預設標題
- **WHEN** 使用者未設定標題或標題為空
- **THEN** Widget 標題列顯示「嵌入報表」

