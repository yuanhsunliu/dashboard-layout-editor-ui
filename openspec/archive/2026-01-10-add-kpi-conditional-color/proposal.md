# Change: KPI Card 條件式顏色規則

## Why

使用者希望 KPI Card 的數值能根據條件自動變色，例如：
- `value > 90` 顯示綠色
- `value < 60` 顯示紅色
- 其餘顯示黃色

這能讓使用者快速識別指標狀態，提升 Dashboard 的資訊傳遞效率。

## What Changes

- 在 KPI Card（靜態）與 KPI Card Dynamic（動態）的 schema 中新增 `conditionalColor` 設定
- 新增條件式顏色規則資料結構，支援：
  - 運算子：`>`, `>=`, `<`, `<=`, `==`
  - 最多 5 條規則
  - 使用者自選 HEX 色碼（需驗證格式：`#RGB` 或 `#RRGGBB`）
  - 規則按順序檢查，第一個符合即套用
  - 若都不符合，使用 `defaultColor`（若未設定則維持原本預設色）
- 顏色只套用在數值文字本身
- 在 ConfigFields 新增條件式顏色規則設定 UI
  - 輸入框 + Color Picker 按鈕
  - 規則順序固定（不支援拖曳排序）

## Design Decisions

| 決策項目 | 決定 | 理由 |
|----------|------|------|
| 顏色套用範圍 | 僅數值文字 | 視覺清晰、與現有 trend 顏色一致 |
| 顏色選擇方式 | HEX 色碼 | 使用者完全自由 |
| 規則數量上限 | 5 條 | 涵蓋常見分級場景、避免過度複雜 |
| 運算子選項 | `>`, `>=`, `<`, `<=`, `==` | 不含 between，可用多條規則組合 |
| Demo 模式 | 不套用條件式顏色 | 維持 Demo 視覺一致性 |
| HEX 格式驗證 | 需驗證 | 避免無效色碼導致顏色不顯示 |
| 色碼輸入 UI | 輸入框 + Color Picker | 彈性最高、使用者體驗佳 |
| 規則排序 | 固定順序（不支援拖曳） | MVP 原則、實作成本考量 |

## Impact

- Affected specs: `features/F09-chart-plugin.md`
- Affected code:
  - `src/features/chart-plugins/plugins/kpi-card/schema.ts`
  - `src/features/chart-plugins/plugins/kpi-card/KpiCardRenderer.tsx`
  - `src/features/chart-plugins/plugins/kpi-card/ConfigFields.tsx`
  - `src/features/chart-plugins/plugins/kpi-card-dynamic/schema.ts`
  - `src/features/chart-plugins/plugins/kpi-card-dynamic/KpiCardDynamicRenderer.tsx`
  - `src/features/chart-plugins/plugins/kpi-card-dynamic/ConfigFields.tsx`
