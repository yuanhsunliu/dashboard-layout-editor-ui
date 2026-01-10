## ADDED Requirements

### Requirement: Field-Driven Interaction
系統 SHALL 依據資料欄位自動判斷 Widget 連動關係，共用相同欄位的 Widget 自動連動。

#### Scenario: Auto-link by shared field
- **WHEN** 使用者點擊 Pie Chart 的「Asia」區塊（dimension: region）
- **THEN** 所有包含 `region` 欄位的 Widget 自動連動
- **AND** 不包含 `region` 欄位的 Widget 不受影響

#### Scenario: No configuration required
- **WHEN** 使用者設定 Widget 的圖表欄位（xAxisField, dimension 等）
- **THEN** 系統自動根據欄位建立連動關係
- **AND** 使用者不需手動設定連動

#### Scenario: Embed widget excluded
- **WHEN** Dashboard 包含 Embed Widget（iframe 嵌入）
- **THEN** Embed Widget 不參與連動
- **AND** 篩選條件不影響 Embed Widget

#### Scenario: Unconfigured widget excluded
- **WHEN** Widget 尚未設定 chartConfig
- **THEN** 該 Widget 不參與連動
- **AND** 系統不顯示錯誤訊息

### Requirement: Click Interaction
系統 SHALL 支援點擊資料點觸發連動。

#### Scenario: Click on data point
- **WHEN** 使用者點擊圖表上的資料點（如柱狀圖的一個柱子）
- **THEN** 系統新增一筆篩選條件
- **AND** 相關 Widget 連動更新顯示

#### Scenario: Click on legend
- **WHEN** 使用者點擊圖表 Legend 項目
- **THEN** 系統新增對應的篩選條件
- **AND** 相關 Widget 連動更新顯示

#### Scenario: Source widget also affected
- **WHEN** 使用者點擊某 Widget 的資料點
- **THEN** 來源 Widget 本身也會高亮/淡化
- **AND** 來源 Widget 行為與其他 Widget 一致

### Requirement: Toggle Filter Value
系統 SHALL 支援 Toggle 行為，再次點擊已選值會取消該篩選。

#### Scenario: Toggle to add value
- **GIVEN** 篩選條件為 `[{ field: "region", value: ["Asia"] }]`
- **WHEN** 使用者點擊「Europe」
- **THEN** 篩選條件變為 `[{ field: "region", value: ["Asia", "Europe"] }]`

#### Scenario: Toggle to remove value
- **GIVEN** 篩選條件為 `[{ field: "region", value: ["Asia", "Europe"] }]`
- **WHEN** 使用者再次點擊「Asia」
- **THEN** 篩選條件變為 `[{ field: "region", value: ["Europe"] }]`

### Requirement: Cascading Drill-down
系統 SHALL 支援連鎖下鑽，每層 Widget 可同時為上層的 Detail 和下層的 Master。

#### Scenario: Multi-level drill-down
- **GIVEN** 篩選條件為空
- **WHEN** 使用者點擊 Pie Chart「Asia」
- **THEN** 篩選條件為 `[{ field: "region", value: ["Asia"] }]`
- **WHEN** 使用者再點擊 Bar Chart「Japan」
- **THEN** 篩選條件累加為 `[{ field: "region", value: ["Asia"] }, { field: "country", value: ["Japan"] }]`
- **AND** 所有相關 Widget 根據累加條件連動

### Requirement: Highlight Display Mode
系統 SHALL 預設使用高亮顯示模式，保留資料全貌。

#### Scenario: Highlight matching data
- **WHEN** 連動觸發且圖表類型為 Line/Bar/Area/Pie
- **THEN** 符合篩選條件的資料高亮顯示（opacity: 1）
- **AND** 不符合條件的資料淡化顯示（opacity: 0.2）

#### Scenario: Filter mode for table
- **WHEN** 連動觸發且圖表類型為 Table/List
- **THEN** 僅顯示符合篩選條件的資料列

#### Scenario: Empty state handling
- **WHEN** 篩選後某 Widget 完全沒有符合的資料
- **THEN** 該 Widget 全部資料淡化顯示
- **AND** 保留資料全貌供使用者參考

### Requirement: Global Filter Bar
系統 SHALL 在 Dashboard 頂部顯示浮動篩選列。

#### Scenario: Display active filters
- **WHEN** 有任何篩選條件存在
- **THEN** Dashboard 頂部顯示浮動篩選列（sticky 固定）
- **AND** 每個篩選條件顯示為標籤（如「區域 = Asia」）
- **AND** 每個標籤有獨立的清除按鈕

#### Scenario: Hide when no filters
- **WHEN** 沒有任何篩選條件
- **THEN** 篩選列不顯示，不佔用空間

#### Scenario: Clear single filter
- **WHEN** 使用者點擊某個篩選標籤的 ✕ 按鈕
- **THEN** 該篩選條件及其後的所有條件被清除（保持層級一致性）
- **AND** 相關 Widget 連動更新

#### Scenario: Clear all filters
- **WHEN** 使用者點擊「清除全部」按鈕
- **THEN** 所有篩選條件被清除
- **AND** 所有 Widget 恢復原始顯示

### Requirement: Widget Filter Badge
系統 SHALL 在被連動的 Widget 上顯示篩選標籤。

#### Scenario: Show filter badge on widget
- **WHEN** Widget 受到篩選條件影響
- **THEN** Widget 右上角顯示篩選標籤
- **AND** 單一值顯示值本身（如「Asia」）

#### Scenario: Show count for multiple values
- **WHEN** Widget 受到多個篩選值影響
- **THEN** Widget 標籤顯示數量（如「Asia, Europe」或「+2」）

#### Scenario: No badge when not affected
- **WHEN** Widget 不包含任何被篩選的欄位
- **THEN** Widget 不顯示篩選標籤
