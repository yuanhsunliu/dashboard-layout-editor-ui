# Tasks: Tool Timeline Widget

## Implementation Tasks

- [ ] **1. 建立 Plugin 目錄結構**
  - 建立 `src/features/chart-plugins/plugins/tool-timeline/`

- [ ] **2. 定義 Schema (schema.ts)**
  - `chartType: 'tool-timeline'`
  - 日期設定：date（預設當天）
  - 時間軸欄位：toolIdField, startTimeField, endTimeField, statusField
  - 狀態顏色對應：statusColors array（含預設值）
  - KPI 欄位：kpiFields array（可選）
  - Tooltip 設定：tooltip.enabled, tooltip.fields, tooltip.format

- [ ] **3. 建立 Renderer (ToolTimelineRenderer.tsx)**
  - 使用 ECharts Custom Series 繪製時間軸
  - X 軸：24 小時，每格 1 小時
  - Y 軸：機台 ID（依資料順序）
  - 右側 KPI 表格（寬度自動調整）
  - 下方圖例
  - Tooltip（依設定顯示）
  - 無資料時段顯示空白
  - 實作點擊事件，呼叫 `onInteraction`（包含完整資料）

- [ ] **4. 建立 ConfigFields (ConfigFields.tsx)**
  - 日期選擇器（預設當天）
  - 欄位對應選擇器（toolId, startTime, endTime, status）
  - 狀態顏色對應編輯器（可新增/刪除/修改，含預設值）
  - KPI 欄位設定
  - Tooltip 欄位設定

- [ ] **5. 建立多語系 (locales.ts)**
  - zh-TW 和 en 翻譯

- [ ] **6. 匯出 Plugin (index.ts)**
  - 實作 ChartPlugin interface
  - 設定 `supportedInteractions: ['click']`
  - 提供預設狀態顏色

- [ ] **7. 註冊 Plugin**
  - 更新 `registry.ts`
  - 更新 `chart.ts` ChartType

- [ ] **8. 撰寫 E2E 測試**
  - 建立 `e2e/tool-timeline.spec.ts`
  - 測試新增 Widget
  - 測試設定狀態顏色
  - 測試時間軸渲染
  - 測試 Tooltip 顯示
  - 測試點擊互動

## Validation

- [ ] `pnpm build` 成功
- [ ] `pnpm lint` 無錯誤
- [ ] E2E 測試全部通過
- [ ] 手動測試點擊互動功能
