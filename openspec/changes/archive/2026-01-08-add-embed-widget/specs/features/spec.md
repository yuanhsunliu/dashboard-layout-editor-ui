# F10: Embed Widget

## ADDED Requirements

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
