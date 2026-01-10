# Change: 新增 KPI Card Widget Plugin

## Why
Dashboard 使用者需要一種簡潔的方式來顯示關鍵績效指標（KPI），例如營收、訂單數、轉換率等單一數值指標。KPI Card 提供了一個專注於單一數值呈現的 Widget 類型，適合用於 Dashboard 頂部或重要位置的快速資訊展示。

## What Changes
- 新增 KPI Card Widget Plugin，包含：
  - `KpiCardRenderer`: 呈現 KPI 數值、標題、變化趨勢
  - `KpiCardConfigFields`: 設定欄位（數值輸入、格式化、字體大小等）
  - `kpiCardConfigSchema`: Zod 驗證 Schema
- 將 KPI Card Plugin 註冊至 chartRegistry

## 確認的規格

### 資料來源
- **靜態數值輸入**：使用者直接輸入 KPI 數值，不需綁定資料來源
- 適用於手動輸入或從外部系統取得的 KPI 數據

### 設定欄位
| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | string | 否 | 標題文字 |
| `value` | number | 是 | 主要 KPI 數值（直接輸入） |
| `compareValue` | number | 否 | 比較數值（用於計算趨勢） |
| `fontSize` | 'sm' \| 'md' \| 'lg' | 否 | 字體大小，預設 'md' |
| `format.thousandSeparator` | boolean | 否 | 千分位，預設 true |
| `format.decimalPlaces` | 0-2 | 否 | 小數位數，預設 0 |
| `format.isPercentage` | boolean | 否 | 百分比顯示，預設 false |
| `format.suffix` | string | 否 | 單位後綴（如「元」） |

### 變化趨勢
- 若設定 `compareValue`，自動計算 `(當前 - 比較) / |比較| × 100%`
- 上升：綠色 + TrendingUp 圖示
- 下降：紅色 + TrendingDown 圖示
- 持平：灰色 + Minus 圖示

### Demo 模式
- 未輸入數值時顯示 Demo 數值 (12,345 + 12.2%)
- 數值淡色 (opacity-60)
- 右下角顯示 Amber 色「示範資料」Badge

### 視覺設計
- 使用 shadcn/ui Card 元件
- 字體大小：sm (text-3xl) / md (text-5xl) / lg (text-7xl)
- 趨勢顯示在數值下方

## Impact
- Affected specs: `features` (Widget Types)
- Affected code:
  - `src/features/chart-plugins/plugins/kpi-card/` (新增)
  - `src/features/chart-plugins/registry.ts` (修改)
  - `src/features/chart-plugins/plugins/index.ts` (修改)
  - `src/features/chart-config/components/ChartConfigPanel.tsx` (修改)
  - `src/features/chart-config/components/ChartPreview.tsx` (修改)
  - `src/types/chart.ts` (修改)
