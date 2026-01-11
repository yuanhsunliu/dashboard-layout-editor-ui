## MODIFIED Requirements

### Requirement: KPI Card Plugin

KPI Card Plugin 系統 SHALL 支援條件式顏色規則，讓使用者可以根據數值自動變更顯示顏色。

#### Scenario: 條件式顏色規則設定

- **GIVEN** 使用者正在設定 KPI Card（靜態或動態）
- **WHEN** 使用者啟用條件式顏色功能
- **THEN** 系統 SHALL 顯示規則設定介面
- **AND** 使用者可新增最多 5 條規則
- **AND** 每條規則包含：運算子（`>`, `>=`, `<`, `<=`, `==`）、門檻值、HEX 色碼
- **AND** 使用者可設定預設顏色（defaultColor）

#### Scenario: 條件式顏色規則套用

- **GIVEN** KPI Card 已設定條件式顏色規則
- **WHEN** 系統渲染 KPI Card 數值
- **THEN** 系統 SHALL 依序檢查規則
- **AND** 第一個符合條件的規則所指定的顏色 SHALL 套用至數值文字
- **AND** 若無規則符合，系統 SHALL 使用 defaultColor（若有設定）
- **AND** 若未設定 defaultColor，系統 SHALL 維持原本預設顏色

#### Scenario: 條件式顏色規則 - 靜態 KPI Card

- **GIVEN** 使用者建立靜態 KPI Card，value = 95
- **AND** 設定規則：`value > 90` 顯示 `#22c55e`（綠色）
- **WHEN** 系統渲染 KPI Card
- **THEN** 數值文字 SHALL 顯示為 `#22c55e`

#### Scenario: 條件式顏色規則 - 動態 KPI Card

- **GIVEN** 使用者建立動態 KPI Card，資料來源回傳 value = 55
- **AND** 設定規則：`value < 60` 顯示 `#ef4444`（紅色）
- **WHEN** 系統渲染 KPI Card
- **THEN** 數值文字 SHALL 顯示為 `#ef4444`

#### Scenario: 多條規則順序檢查

- **GIVEN** 使用者設定以下規則（依序）：
  1. `value > 90` → `#22c55e`（綠色）
  2. `value < 60` → `#ef4444`（紅色）
  3. defaultColor → `#eab308`（黃色）
- **WHEN** value = 75
- **THEN** 數值文字 SHALL 顯示為 `#eab308`（因前兩條規則不符合）

#### Scenario: 顏色只套用於數值文字

- **GIVEN** KPI Card 已設定條件式顏色規則
- **WHEN** 系統渲染 KPI Card
- **THEN** 條件式顏色 SHALL 只套用於數值文字
- **AND** 其他元素（標題、趨勢指標、背景）SHALL 維持原本樣式

#### Scenario: Demo 模式不套用條件式顏色

- **GIVEN** KPI Card 處於 Demo 模式（尚未輸入值或無資料來源）
- **AND** 使用者已設定條件式顏色規則
- **WHEN** 系統渲染 KPI Card
- **THEN** 系統 SHALL 不套用條件式顏色
- **AND** 數值 SHALL 維持原本 Demo 樣式（透明度降低）

#### Scenario: HEX 色碼格式驗證

- **GIVEN** 使用者正在輸入條件式顏色規則的色碼
- **WHEN** 使用者輸入無效的 HEX 格式（非 `#RGB` 或 `#RRGGBB`）
- **THEN** 系統 SHALL 顯示驗證錯誤訊息
- **AND** 系統 SHALL 不允許儲存該規則

#### Scenario: 色碼輸入 UI

- **GIVEN** 使用者正在設定條件式顏色規則
- **WHEN** 使用者需要輸入顏色
- **THEN** 系統 SHALL 提供文字輸入框供手動輸入 HEX 色碼
- **AND** 系統 SHALL 提供 Color Picker 按鈕供視覺化選擇顏色

#### Scenario: 規則順序固定

- **GIVEN** 使用者已新增多條條件式顏色規則
- **WHEN** 使用者想調整規則順序
- **THEN** 使用者 SHALL 刪除並重新新增規則以調整順序
- **AND** 系統不提供拖曳排序功能
