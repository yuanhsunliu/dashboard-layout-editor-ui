# Change: Add Combo Chart Plugin

## Why

使用者需要在單一圖表中比較不同量綱的指標（如：銷售額 vs 成長率），現有 Line Chart 和 Bar Chart 各自獨立，無法在同一圖表中同時呈現 Bar 和 Line series 並使用左右 Y 軸顯示不同單位。

## What Changes

- 新增 `combo` chart plugin，支援左右軸不同量綱
- 左軸固定使用 Bar series
- 右軸固定使用 Line series
- 支援 Line 平滑曲線選項（smooth）
- 支援自訂左/右 Y 軸標籤名稱
- 新增對應的 ConfigFields UI
- 新增對應的 Renderer 實作

### MVP 功能範圍（P0）

| 功能 | 狀態 |
|------|------|
| 左右軸不同量綱（左=Bar、右=Line） | ✅ 包含 |
| 自訂左/右 Y 軸標籤 | ✅ 包含 |
| Line 平滑曲線選項 | ✅ 包含 |
| 階層式 X 軸 | ❌ P1 後續擴展 |
| Series 分群 | ❌ P2 後續擴展 |
| Bar 堆疊 | ❌ P2 後續擴展 |
| Line 面積填充 | ❌ P2 後續擴展 |

## Impact

- Affected specs: `features` (F09-chart-plugin)
- Affected code:
  - `src/features/chart-plugins/plugins/combo/` (新增)
  - `src/types/chart.ts` (新增 ComboChartConfig)
  - `src/features/chart-plugins/plugins/index.ts` (註冊 combo plugin)
