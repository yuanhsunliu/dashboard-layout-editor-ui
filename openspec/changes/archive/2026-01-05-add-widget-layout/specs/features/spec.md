# F02: Widget Layout

## ADDED Requirements

### Requirement: Add Widget
系統 SHALL 允許使用者在 Dashboard 編輯頁中新增 Widget。

#### Scenario: Add new widget
- **WHEN** 使用者點擊「新增 Widget」按鈕
- **THEN** 新增一個空白 Widget 到 Dashboard
- **AND** Widget 放置在所有現有 Widget 下方
- **AND** Widget 使用預設大小（w: 4, h: 3）
- **AND** Widget ID 格式為 `widget-{timestamp}-{random}`

#### Scenario: Empty widget display
- **WHEN** Widget 尚未設定圖表
- **THEN** 標題列顯示「未設定」
- **AND** 內容區顯示「📊 尚未設定圖表」提示

#### Scenario: Empty dashboard display
- **WHEN** Dashboard 沒有任何 Widget
- **THEN** 顯示空狀態引導提示
- **AND** 顯示「新增第一個 Widget」按鈕

### Requirement: Drag and Drop Widget
系統 SHALL 允許使用者透過拖放調整 Widget 位置。

#### Scenario: Drag widget to new position
- **WHEN** 使用者拖曳 Widget 標題列
- **THEN** 顯示放置預覽
- **AND** 放開後 Widget 固定在新位置

#### Scenario: Prevent widget overlap
- **WHEN** 使用者拖曳 Widget 到已有 Widget 的位置
- **THEN** 其他 Widget 自動調整位置避免重疊

### Requirement: Resize Widget
系統 SHALL 允許使用者調整 Widget 的大小。

#### Scenario: Resize widget
- **WHEN** 使用者拖曳 Widget 右下角的 resize handle
- **THEN** Widget 寬度與高度隨之調整

#### Scenario: Minimum size constraint
- **WHEN** 使用者嘗試將 Widget 縮小到最小尺寸以下
- **THEN** Widget 維持最小尺寸（minW: 2, minH: 2）

#### Scenario: Maximum width constraint
- **WHEN** 使用者嘗試將 Widget 寬度擴大超過 12 欄
- **THEN** Widget 維持最大寬度（maxW: 12，滿版）

### Requirement: Delete Widget
系統 SHALL 允許使用者刪除 Widget，無需確認。

#### Scenario: Delete widget
- **WHEN** 使用者點擊 Widget 右上角的刪除按鈕
- **THEN** 該 Widget 立即從 Dashboard 移除
- **AND** 其他 Widget 不自動重排

### Requirement: Layout Auto Save
系統 SHALL 自動儲存佈局變更。

#### Scenario: Auto save on layout change
- **WHEN** 使用者移動或調整 Widget 大小
- **THEN** 佈局變更在 500ms debounce 後自動儲存到後端

#### Scenario: Auto save on widget add/remove
- **WHEN** 使用者新增或刪除 Widget
- **THEN** 變更立即儲存到後端

### Requirement: Grid Configuration
系統 SHALL 使用 12 欄 Grid 佈局系統。

#### Scenario: Grid layout
- **GIVEN** Dashboard 編輯頁使用 12 欄 Grid
- **AND** 每行高度為 80px
- **AND** Widget 間距為 16px
