# Change: Plugin Config Behavior 重構

## Why

目前 `ChartConfigPanel.tsx` 和 `ChartPreview.tsx` 中存在大量 hardcode 的 chart type 判斷：

```typescript
const isEmbedType = chartType === 'embed';
const isKpiCardType = chartType === 'kpi-card';
const isKpiCardDynamicType = chartType === 'kpi-card-dynamic';
const isAiCommentType = chartType === 'ai-comment';
const isToolTimelineType = chartType === 'tool-timeline';
```

這違反了 **開放封閉原則 (OCP)**：每新增一個 Plugin，開發者必須修改核心的 `ChartConfigPanel` 和 `ChartPreview` 元件，涉及 5+ 個程式碼位置。

## What Changes

### Phase 1: Plugin Interface 擴展
- 在 `ChartPlugin` 介面新增 `configBehavior` 屬性，讓每個 Plugin 自描述其 UI 需求

### Phase 2: ChartConfigPanel 重構
- 移除所有 `isXxxType` hardcode 判斷
- 改為讀取 Plugin 的 `configBehavior` metadata 來決定 UI 顯示

### Phase 3: ChartPreview 部分重構
- 移除 `isComplete` 的 hardcode 判斷
- Preview config 建構邏輯暫時保留（複雜度高，後續再處理）

### 新增的 `configBehavior` 結構

```typescript
configBehavior: {
  // 靜態設定
  requiresDataSource: boolean;   // 是否需要 DataSource selector
  showTitleInput: boolean;       // 是否在 Panel 顯示 Title 輸入框
  previewHeight: 'sm' | 'md' | 'lg';  // 預覽區域高度
  
  // 方法
  getInitialPluginConfig: () => Record<string, unknown>;  // DataSource 變更時的初始值
  isPreviewReady: (params: {
    pluginConfig: Record<string, unknown>;
    dataSource?: DataSource;
  }) => boolean;  // 判斷預覽是否可顯示
}
```

### 設計決策

| 問題 | 決策 | 理由 |
|------|------|------|
| `availableWidgets` 參數 | 維持 ai-comment 特例 | 目前只有一個 plugin 需要，過早抽象增加複雜度 |
| DataSource 變更重置邏輯 | 新增 `getInitialPluginConfig()` | Plugin 專屬邏輯應由 plugin 定義 |
| 預覽完整判斷 | 新增 `isPreviewReady()` | 消除 ChartPreview 中的 hardcode |

## Impact

- **Affected specs**: `features/spec.md` (F05 Chart Plugin System)
- **Affected code**:
  - `src/features/chart-plugins/types.ts`
  - `src/features/chart-plugins/plugins/*/index.ts` (所有 plugin)
  - `src/features/chart-config/components/ChartConfigPanel.tsx`
  - `src/features/chart-config/components/ChartPreview.tsx`

## 預期效益

| 面向 | 重構前 | 重構後 |
|------|--------|--------|
| 新增 Plugin | 改 5+ 個檔案 | 只改 Plugin 定義 |
| OCP 合規 | ❌ 違反 | ✅ 符合 |
| 維護性 | 低 | 高 |

## 風險與緩解

| 風險 | 緩解措施 |
|------|----------|
| 現有測試失敗 | 先確保所有現有測試通過後再開始 |
| Preview 邏輯複雜 | 暫不重構 preview config 建構，僅處理 UI 判斷 |
| 遺漏 plugin | 逐一檢查所有 plugin 並更新 |
