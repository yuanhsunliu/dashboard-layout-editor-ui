# Tasks: KPI Card 條件式顏色規則

## 1. Schema 更新

- [x] 1.1 建立共用 `colorConditionSchema` 定義（運算子、門檻值、顏色）
- [x] 1.2 建立共用 `conditionalColorSchema` 定義（enabled, rules, defaultColor）
- [x] 1.3 更新 `kpiCardConfigSchema` 加入 `conditionalColor` 欄位
- [x] 1.4 更新 `kpiCardDynamicConfigSchema` 加入 `conditionalColor` 欄位

## 2. 條件評估邏輯

- [x] 2.1 建立共用 `evaluateColorCondition(value, rules, defaultColor)` 函式
- [x] 2.2 實作運算子比較邏輯（`>`, `>=`, `<`, `<=`, `==`）
- [x] 2.3 實作規則順序檢查（第一個符合即回傳）

## 3. Renderer 更新

- [x] 3.1 更新 `KpiCardRenderer` 套用條件式顏色至數值文字
- [x] 3.2 更新 `KpiCardDynamicRenderer` 套用條件式顏色至數值文字

## 4. ConfigFields UI

- [x] 4.1 建立共用 `ConditionalColorConfig` 元件
  - [x] 4.1.1 啟用/停用開關
  - [x] 4.1.2 規則列表（最多 5 條）
  - [x] 4.1.3 新增/刪除規則按鈕
  - [x] 4.1.4 每條規則：運算子選擇、門檻值輸入、HEX 色碼輸入
  - [x] 4.1.5 預設顏色設定（defaultColor）
- [x] 4.2 整合至 KPI Card ConfigFields
- [x] 4.3 整合至 KPI Card Dynamic ConfigFields

## 5. 測試

- [x] 5.1 建立專屬 E2E 測試 `kpi-conditional-color.spec.ts`（10 個測試案例）

## 6. 驗證

- [x] 6.1 執行 Playwright 測試確認 10/10 通過
