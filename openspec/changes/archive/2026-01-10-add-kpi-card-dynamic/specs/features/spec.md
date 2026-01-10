## ADDED Requirements

### Requirement: KPI Card Dynamic Widget
系統 **SHALL** 提供 KPI Card Dynamic Widget 類型，用於從資料來源動態顯示單一關鍵績效指標數值。

#### Scenario: 顯示資料來源的 KPI 數值
- **GIVEN** 使用者已新增一個 KPI Card Dynamic Widget 並綁定資料來源和欄位
- **WHEN** Widget 載入完成
- **THEN** 應從資料來源最後一筆記錄取得欄位值並顯示（最新資料）

#### Scenario: 設定 KPI Card Dynamic 資料綁定
- **GIVEN** 使用者正在設定 KPI Card Dynamic Widget
- **WHEN** 使用者選擇資料來源
- **THEN** 系統應顯示該資料來源的可用數值欄位供選擇

#### Scenario: 選擇數值欄位
- **GIVEN** 使用者已選擇資料來源
- **WHEN** 使用者選擇 valueField
- **THEN** 系統應取得該資料來源最後一筆記錄的欄位值並在預覽中顯示

#### Scenario: 啟用趨勢顯示
- **GIVEN** 使用者已選擇資料來源和 valueField，且資料有多筆記錄
- **WHEN** 使用者啟用 showTrend
- **THEN** 系統應自動計算最後一筆與前一筆的變化百分比並顯示趨勢箭頭

#### Scenario: 單筆資料不顯示趨勢
- **GIVEN** 資料來源只有一筆記錄
- **WHEN** 使用者啟用 showTrend
- **THEN** 系統不顯示趨勢（因無前一筆可比較）

#### Scenario: 格式化數值顯示
- **GIVEN** 使用者已設定數值格式化選項（千分位、小數位數、百分比、單位後綴）
- **WHEN** Widget 呈現數值
- **THEN** 應按照設定的格式顯示數值

#### Scenario: Demo 模式顯示
- **GIVEN** 使用者尚未選擇資料來源或欄位
- **WHEN** Widget 呈現
- **THEN** 應顯示淡色 Demo 數值 (12,345) 並在右下角顯示「示範資料」標籤
