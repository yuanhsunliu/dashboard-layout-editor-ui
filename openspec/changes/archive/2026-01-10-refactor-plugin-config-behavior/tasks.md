# Tasks: Plugin Config Behavior 重構

## 1. 準備工作
- [x] 1.1 確認所有現有測試通過 (`pnpm test && pnpm test:e2e`)
- [x] 1.2 列出所有現有 plugin 及其 UI 需求

## 2. Plugin Interface 擴展
- [x] 2.1 在 `types.ts` 新增 `PluginConfigBehavior` 介面（含靜態設定與方法）
- [x] 2.2 在 `ChartPlugin` 介面新增 `configBehavior` 屬性

## 3. 更新所有 Plugin
- [x] 3.1 更新 `line` plugin - 設定 configBehavior
- [x] 3.2 更新 `bar` plugin - 設定 configBehavior
- [x] 3.3 更新 `area` plugin - 設定 configBehavior
- [x] 3.4 更新 `embed` plugin - 設定 configBehavior
- [x] 3.5 更新 `kpi-card` plugin - 設定 configBehavior
- [x] 3.6 更新 `kpi-card-dynamic` plugin - 設定 configBehavior
- [x] 3.7 更新 `ai-comment` plugin - 設定 configBehavior
- [x] 3.8 更新 `tool-timeline` plugin - 設定 configBehavior

## 4. ChartConfigPanel 重構
- [x] 4.1 移除 `isXxxType` 變數宣告
- [x] 4.2 從 `currentPlugin.configBehavior` 讀取 UI 設定
- [x] 4.3 重構 Title 輸入框顯示邏輯（使用 `showTitleInput`）
- [x] 4.4 重構 DataSourceSelector 顯示邏輯（使用 `requiresDataSource`）
- [x] 4.5 重構 DataSource 變更時的 reset 邏輯（使用 `getInitialPluginConfig()`）
- [x] 4.6 簡化 JSX 渲染邏輯，移除 type-specific 分支

## 5. ChartPreview 重構
- [x] 5.1 移除 `isXxxType` 變數宣告
- [x] 5.2 使用 `isPreviewReady()` 取代 `isComplete` 判斷
- [x] 5.3 從 plugin 讀取 `previewHeight` 設定
- [x] 5.4 保留 `previewConfig` 和 `previewData` 建構邏輯（暫不重構）

## 6. 驗證
- [x] 6.1 執行單元測試 (`pnpm test`)
- [x] 6.2 執行 E2E 測試 (`pnpm test:e2e`)
- [x] 6.3 手動測試所有 plugin 的設定流程
- [x] 6.4 確認新增 plugin 時不需要修改 ChartConfigPanel

## 7. 文件更新
- [x] 7.1 更新 `PLUGIN_DEVELOPMENT.md` 文件
