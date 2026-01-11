# Tasks: Line Chart 增強功能

## Phase 1: Schema 擴展

- [x] 更新 `lineChartConfigSchema`
  - [x] 新增 `leftYAxisFields: string[]`
  - [x] 新增 `rightYAxisFields: string[]`（選填）
  - [x] 新增 `outerXAxisField: string`（選填）
  - [x] 新增 `innerXAxisField: string`（選填）
  - [x] 新增 `outerXAxisSort: 'asc' | 'desc' | 'data'`（預設 'data'）
  - [x] 新增 `innerXAxisSort: 'asc' | 'desc' | 'data'`（預設 'data'）
  - [x] 新增 `groupByField: string`（選填）
  - [x] 新增 `groupBySort: 'asc' | 'desc' | 'data'`（預設 'data'）
  - [x] 新增自訂驗證：outerXAxisField/innerXAxisField 同時填或同時不填
  - [x] 新增自訂驗證：groupByField 啟用時，leftYAxisFields + rightYAxisFields 只能有一個欄位

## Phase 2: 設定 UI

- [x] 更新 `ConfigFields.tsx`
  - [x] 新增「進階設定」收合區塊
  - [x] 新增「啟用階層式 X 軸」開關
    - [x] 啟用時：顯示外層/內層 X 軸欄位選擇 + 排序
    - [x] 啟用時：隱藏原本的 X 軸欄位
  - [x] 新增「啟用雙 Y 軸」開關
    - [x] 啟用時：顯示左軸/右軸欄位選擇
    - [x] 啟用時：隱藏原本的 Y 軸欄位
  - [x] 新增「啟用 Series 分群」開關
    - [x] 啟用時：顯示分群欄位選擇 + 排序
    - [x] 啟用時：Y 軸欄位限制為單選

## Phase 3: Renderer 實作

- [x] 更新 `LineChartRenderer.tsx`
  - [x] 支援雙 Y 軸
    - [x] 設定 yAxis 為陣列
    - [x] 每個 series 指定 yAxisIndex
    - [x] 左右軸顯示欄位中文標籤
  - [x] 支援階層式 X 軸
    - [x] 處理資料轉換（長表格 → 階層式）
    - [x] 設定 xAxis 為階層式標籤
    - [x] 實作排序邏輯
  - [x] 支援 groupByField
    - [x] 依據 groupByField 動態產生 series
    - [x] 實作排序邏輯
    - [x] 更新 legend 顯示
  - [x] 支援階層式 X 軸 + 不分群 + 多 Y 欄位分配左右軸

## Phase 4: 資料轉換

- [x] 新增資料轉換工具函式
  - [x] `transformToHierarchicalData(data, outerField, innerField, yFields, groupByField, sortOptions)`
  - [x] 支援多 Y 欄位（不分群時）
  - [x] 支援單 Y 欄位 + 分群

## Phase 5: 向下相容

- [x] 遷移邏輯
  - [x] 現有 `yAxisFields` 自動對應至 `leftYAxisFields`
  - [x] 現有 `xAxisField` 保持運作

## Phase 6: 測試

- [x] E2E 測試
  - [x] 基本 Line Chart（向下相容）
  - [x] 雙 Y 軸 Line Chart
  - [x] 階層式 X 軸 Line Chart
  - [x] groupByField Line Chart
  - [x] 完整組合（階層式 X 軸 + groupBy）

## Phase 7: Bug 修復

- [x] 修復 Dashboard 雙 Y 軸無法正確顯示問題
  - [x] `ChartWidget.tsx` 新增 `fieldName` 到 series
  - [x] `DemoDataSeries` 型別新增 `fieldName?: string`
- [x] 修復階層式 X 軸 + 雙 Y 軸問題
  - [x] 不分群時：支援多 Y 欄位分配左右軸
  - [x] 分群時：保持單一 Y 欄位限制
- [x] 新增 Y 軸標籤顯示
  - [x] 傳入 `fields` 到 Renderer
  - [x] 使用欄位 label 顯示軸標籤
