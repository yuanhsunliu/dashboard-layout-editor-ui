# F01: Dashboard CRUD

## ADDED Requirements

### Requirement: Dashboard List Display
系統 SHALL 在首頁顯示所有 Dashboard 列表，包含名稱與建立/更新時間，按 updatedAt 降序排列。

#### Scenario: Display dashboard list
- **WHEN** 使用者進入首頁
- **THEN** 顯示所有 Dashboard 卡片列表
- **AND** 每個卡片顯示 Dashboard 名稱
- **AND** 每個卡片顯示更新時間（7 天內顯示相對時間，超過顯示絕對時間）
- **AND** 每個卡片顯示選單按鈕（⋮）
- **AND** 列表按 updatedAt 降序排列（最近更新在前）

#### Scenario: Card menu actions
- **WHEN** 使用者點擊卡片選單按鈕（⋮）
- **THEN** 顯示下拉選單
- **AND** 選單包含「重新命名」與「刪除」選項

#### Scenario: Empty state
- **WHEN** 使用者進入首頁且無任何 Dashboard
- **THEN** 顯示空狀態畫面
- **AND** 顯示「建立第一個 Dashboard」按鈕

### Requirement: Create Dashboard
系統 SHALL 允許使用者建立新的 Dashboard。

#### Scenario: Create new dashboard
- **WHEN** 使用者點擊「新增 Dashboard」按鈕
- **THEN** 建立一個預設名稱為「未命名 Dashboard」的新 Dashboard
- **AND** 自動導向該 Dashboard 編輯頁

### Requirement: Rename Dashboard
系統 SHALL 允許使用者在列表或編輯頁 Header 重新命名 Dashboard，名稱須非空白且不超過 50 字元。

#### Scenario: Inline rename in list
- **WHEN** 使用者在卡片選單中點擊「重新命名」
- **THEN** 顯示 inline edit 輸入框
- **AND** 使用者可修改名稱後儲存

#### Scenario: Rename in editor header
- **WHEN** 使用者在編輯頁 Header 點擊 Dashboard 名稱
- **THEN** 顯示 inline edit 輸入框
- **AND** 使用者可修改名稱後儲存

#### Scenario: Rename validation - empty
- **WHEN** 使用者嘗試將名稱設為空白
- **THEN** 顯示錯誤提示
- **AND** 不允許儲存

#### Scenario: Rename validation - too long
- **WHEN** 使用者輸入超過 50 字元的名稱
- **THEN** 顯示錯誤提示
- **AND** 不允許儲存

### Requirement: Delete Dashboard
系統 SHALL 允許使用者刪除 Dashboard，並提供確認機制。

#### Scenario: Delete with confirmation
- **WHEN** 使用者在卡片選單中點擊「刪除」
- **THEN** 顯示確認 Dialog
- **AND** Dialog 顯示「確定要刪除「{name}」嗎？此操作無法復原。」

#### Scenario: Confirm delete
- **WHEN** 使用者在確認 Dialog 點擊「刪除」
- **THEN** 刪除該 Dashboard
- **AND** 更新列表移除該項目
- **AND** 顯示成功 Toast 通知

#### Scenario: Cancel delete
- **WHEN** 使用者在確認 Dialog 點擊「取消」
- **THEN** 關閉 Dialog
- **AND** Dashboard 保持不變

### Requirement: Navigate to Dashboard Editor
系統 SHALL 允許使用者從列表點擊進入 Dashboard 編輯頁。

#### Scenario: Enter editor
- **WHEN** 使用者點擊 Dashboard 卡片
- **THEN** 導航至 `/dashboard/:id` 編輯頁
- **AND** URL 更新為對應的 Dashboard ID

### Requirement: Dashboard Editor Page
系統 SHALL 顯示 Dashboard 編輯頁，包含 Header 與空白佈局區域。

#### Scenario: Display editor page
- **WHEN** 使用者進入 Dashboard 編輯頁
- **THEN** 透過 `GET /api/dashboards/:id` 取得 Dashboard 資料
- **AND** 顯示 Header 區域（含返回按鈕、Dashboard 名稱）
- **AND** 顯示空白佈局區域（預留給 Widget 功能）

#### Scenario: Navigate back to list
- **WHEN** 使用者點擊返回按鈕
- **THEN** 導航回首頁 Dashboard 列表

### Requirement: Get Single Dashboard API
系統 SHALL 提供 API 端點取得單一 Dashboard 完整資料。

#### Scenario: Get dashboard by ID
- **WHEN** 呼叫 `GET /api/dashboards/:id`
- **THEN** 回傳該 Dashboard 完整資料（含 id, name, createdAt, updatedAt, layout, widgets, theme）

#### Scenario: Dashboard not found
- **WHEN** 呼叫 `GET /api/dashboards/:id` 但 ID 不存在
- **THEN** 回傳 404 Not Found
