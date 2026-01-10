## ADDED Requirements

### Requirement: KPI Card Widget
系統 **SHALL** 提供 KPI Card Widget 類型，用於顯示單一關鍵績效指標數值。

#### Scenario: 顯示 KPI 數值
- **GIVEN** 使用者已新增一個 KPI Card Widget 並輸入數值
- **WHEN** Widget 載入完成
- **THEN** 應顯示標題、主要數值、單位後綴

#### Scenario: 設定 KPI Card 數值
- **GIVEN** 使用者正在設定 KPI Card Widget
- **WHEN** 使用者輸入 KPI 數值
- **THEN** 系統應即時在預覽中顯示該數值

#### Scenario: 格式化數值顯示
- **GIVEN** 使用者已設定數值格式化選項（千分位、小數位數、百分比、單位後綴）
- **WHEN** Widget 呈現數值
- **THEN** 應按照設定的格式顯示數值

#### Scenario: 顯示變化趨勢
- **GIVEN** 使用者已輸入主要數值和比較數值
- **WHEN** Widget 呈現
- **THEN** 應計算變化百分比並顯示趨勢箭頭（上升綠色、下降紅色、持平灰色）

#### Scenario: 調整字體大小
- **GIVEN** 使用者設定字體大小為 sm/md/lg
- **WHEN** Widget 呈現
- **THEN** 數值應以對應的字體大小顯示（sm: text-3xl, md: text-5xl, lg: text-7xl）

#### Scenario: Demo 模式顯示
- **GIVEN** 使用者尚未輸入數值
- **WHEN** Widget 呈現
- **THEN** 應顯示淡色 Demo 數值 (12,345) 並在右下角顯示「示範資料」標籤
