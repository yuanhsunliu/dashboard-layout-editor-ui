# Tasks: AI Comment Widget

## Phase 1: 基礎建設

- [ ] 安裝套件 `html2canvas` 和 `react-markdown`
- [ ] 建立 Widget 截圖工具函式 `captureWidget(widgetId)`
- [ ] 建立 Mock AI API service

## Phase 2: Plugin 結構

- [ ] 建立 `src/features/chart-plugins/plugins/ai-comment/schema.ts`
- [ ] 建立 `src/features/chart-plugins/plugins/ai-comment/ConfigFields.tsx`
- [ ] 建立 `src/features/chart-plugins/plugins/ai-comment/AiCommentRenderer.tsx`
- [ ] 建立 `src/features/chart-plugins/plugins/ai-comment/index.ts`
- [ ] 註冊 Plugin 到 registry

## Phase 3: 整合

- [ ] 更新 ChartConfigPanel 支援 AI Comment
- [ ] 更新 ChartPreview 支援 AI Comment
- [ ] 更新 ChartWidget 支援 AI Comment
- [ ] 實作資料變更自動重新分析（含 debounce）

## Phase 4: 測試

- [ ] 建立 E2E 測試 `e2e/ai-comment.spec.ts`
- [ ] 測試: 選擇目標 Widget
- [ ] 測試: 點擊分析按鈕
- [ ] 測試: 顯示洞察結果（Markdown）
- [ ] 測試: 重新分析功能
- [ ] 測試: 顯示分析時間

## Phase 5: 驗證

- [ ] TypeScript 編譯通過
- [ ] 所有 E2E 測試通過
- [ ] 產生 HTML 報告
