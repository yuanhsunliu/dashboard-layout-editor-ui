# Change: 新增 KPI Card Dynamic Widget Plugin

## Why
現有的 `kpi-card` Widget 使用靜態輸入值，適合手動輸入 KPI。但使用者也需要從資料來源動態取值的 KPI Card，可自動從 DataSource 取得第一筆記錄的欄位值，無需手動輸入。

## What Changes
- 新增 `kpi-card-dynamic` Widget Plugin，包含：
  - `KpiCardDynamicRenderer`: 從資料來源取值並呈現
  - `KpiCardDynamicConfigFields`: 設定資料來源、欄位綁定
  - `kpiCardDynamicConfigSchema`: Zod 驗證 Schema
- 將 KPI Card Dynamic Plugin 註冊至 chartRegistry

## 確認的規格

### 資料來源
- 綁定 DataSource，取得**最後一筆記錄**的指定欄位值（最新資料）
- 趨勢計算：自動與**前一筆記錄**的同欄位比較

### 設定欄位
| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| `title` | string | 否 | 標題文字 |
| `dataSourceId` | string | 是 | 資料來源 |
| `valueField` | string | 是 | 數值欄位（取最後一筆） |
| `showTrend` | boolean | 否 | 顯示趨勢（自動與前一筆比較），預設 false |
| `fontSize` | 'sm' \| 'md' \| 'lg' | 否 | 字體大小，預設 'md' |
| `format.thousandSeparator` | boolean | 否 | 千分位，預設 true |
| `format.decimalPlaces` | 0-2 | 否 | 小數位數，預設 0 |
| `format.isPercentage` | boolean | 否 | 百分比顯示，預設 false |
| `format.suffix` | string | 否 | 單位後綴（如「元」） |

### 變化趨勢
- 若啟用 `showTrend`，自動計算 `(最後一筆 - 前一筆) / |前一筆| × 100%`
- 上升：綠色 + TrendingUp 圖示
- 下降：紅色 + TrendingDown 圖示
- 持平：灰色 + Minus 圖示
- 若資料只有一筆，不顯示趨勢

### 欄位篩選
- `valueField` 下拉選單只顯示數值類型欄位（number）

### 資料為空處理
- 若資料來源沒有任何記錄（空陣列），顯示 Demo 模式（同未設定狀態）

### Demo 模式
- 未綁定資料來源時顯示 Demo 數值 (12,345 + 12.2%)
- 數值淡色 (opacity-60)
- 右下角顯示 Amber 色「示範資料」Badge

### 視覺設計
- 使用 shadcn/ui Card 元件
- 字體大小：sm (text-3xl) / md (text-5xl) / lg (text-7xl)
- 趨勢顯示在數值下方
- 與靜態 `kpi-card` 共用相同的視覺呈現

## Impact
- Affected specs: `features` (Widget Types)
- Affected code:
  - `src/features/chart-plugins/plugins/kpi-card-dynamic/` (新增)
  - `src/features/chart-plugins/registry.ts` (修改)
  - `src/features/chart-plugins/plugins/index.ts` (修改)
  - `src/types/chart.ts` (修改 - 新增 KpiCardDynamicConfig)
