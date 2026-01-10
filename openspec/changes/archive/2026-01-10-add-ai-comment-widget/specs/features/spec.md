# Feature Spec: AI Comment Widget

## ADDED Requirements

### Requirement: AI Comment Widget Plugin

The system SHALL provide an AI Comment Widget that captures a specified Widget's chart image and data, then generates insight analysis through an AI Agent.

#### Scenario: 選擇 AI Comment 圖表類型
- Given 使用者開啟 Widget 設定面板
- When 使用者點擊圖表類型下拉選單
- Then 應顯示「AI 洞察」選項

#### Scenario: 選擇目標 Widget
- Given 使用者選擇 AI Comment 類型
- When 設定面板顯示
- Then 應顯示目標 Widget 下拉選單
- And 下拉選單列出同 Dashboard 的其他 Widget
- And 排除自己和其他 AI Comment Widget

#### Scenario: 觸發 AI 分析
- Given AI Comment Widget 已設定目標 Widget
- When 使用者點擊「分析」按鈕
- Then 應顯示 Loading 狀態
- And 擷取目標 Widget 截圖與資料
- And 呼叫 AI Agent API

#### Scenario: 顯示洞察結果
- Given AI 分析完成
- When 收到 AI 回應
- Then 應以 Markdown 格式顯示洞察結果
- And 顯示上次分析時間
- And 顯示「重新分析」按鈕

#### Scenario: 資料變更自動重新分析
- Given AI Comment 已有分析結果
- When 目標 Widget 的資料來源更新
- Then 應自動重新觸發 AI 分析
- And 更新洞察結果

#### Scenario: 未設定目標 Widget
- Given AI Comment Widget 尚未選擇目標 Widget
- When Widget 載入顯示
- Then 應顯示提示文字「請選擇要分析的 Widget」

#### Scenario: 目標 Widget 被刪除
- Given AI Comment Widget 已設定目標 Widget
- When 目標 Widget 被使用者刪除
- Then 應顯示錯誤訊息「目標 Widget 已不存在」

#### Scenario: AI 分析失敗
- Given 使用者點擊分析按鈕
- When AI API 回傳錯誤或逾時
- Then 應顯示錯誤訊息
- And 顯示重試按鈕

## Data Model

### AiCommentConfig

```typescript
interface AiCommentConfig {
  chartType: 'ai-comment';
  title?: string;
  targetWidgetId: string;  // 目標 Widget ID
}
```

### AiAnalyzeRequest

```typescript
interface AiAnalyzeRequest {
  widgetId: string;
  imageBase64: string;  // 圖表截圖
  data: Record<string, unknown>[];  // 原始資料
}
```

### AiAnalyzeResponse

```typescript
interface AiAnalyzeResponse {
  insight: string;  // Markdown 格式
  analyzedAt: string;  // ISO 8601 timestamp
}
```

## Component Structure

```
src/features/chart-plugins/plugins/ai-comment/
├── schema.ts              # Zod schema
├── ConfigFields.tsx       # 設定表單（目標 Widget 選擇）
├── AiCommentRenderer.tsx  # 洞察結果呈現
└── index.ts               # Plugin 匯出

src/features/chart-plugins/utils/
├── captureWidget.ts       # Widget 截圖工具
└── aiService.ts           # Mock AI API service
```

## UI Design

### ConfigFields
- 標題輸入框（選填）
- 目標 Widget 下拉選單
  - 顯示格式: `[Widget 標題] (圖表類型)`
  - 排除自己
  - 排除其他 AI Comment Widget

### AiCommentRenderer
```
┌─────────────────────────────────────┐
│  [分析] 按鈕                        │
├─────────────────────────────────────┤
│                                     │
│  ## 洞察摘要                        │
│  - 銷售額呈上升趨勢                 │
│  - 第三季成長率達 15%               │
│  - 建議關注...                      │
│                                     │
├─────────────────────────────────────┤
│  上次分析: 2026-01-10 09:00:00      │
└─────────────────────────────────────┘
```

### 狀態
1. **未設定**: 顯示提示文字「請選擇要分析的 Widget」
2. **未分析**: 顯示「分析」按鈕
3. **分析中**: 顯示 Loading spinner
4. **已分析**: 顯示洞察結果 + 「重新分析」按鈕 + 時間戳
5. **分析失敗**: 顯示錯誤訊息 + 重試按鈕
6. **目標不存在**: 顯示錯誤訊息「目標 Widget 已不存在」

## Acceptance Criteria

- [ ] 可在圖表類型選擇器中選擇 AI Comment
- [ ] 設定面板顯示目標 Widget 下拉選單
- [ ] 下拉選單正確列出同 Dashboard 的其他 Widget
- [ ] 未設定目標時顯示提示文字
- [ ] 點擊分析按鈕後顯示 Loading 狀態
- [ ] 分析完成後顯示 Markdown 格式洞察結果
- [ ] 顯示上次分析時間
- [ ] 可點擊重新分析按鈕
- [ ] 目標 Widget 資料變更時自動重新分析
- [ ] 目標 Widget 被刪除時顯示錯誤訊息
- [ ] AI 分析失敗時顯示錯誤訊息 + 重試按鈕
- [ ] 儲存設定後重新載入可正確顯示

## Technical Dependencies

- `html2canvas` - Widget 截圖
- `react-markdown` - Markdown 渲染

## Test IDs

| 元素 | data-testid |
|------|-------------|
| AI Comment 容器 | `ai-comment` |
| 分析按鈕 | `ai-analyze-button` |
| 洞察結果區 | `ai-insight-content` |
| 分析時間 | `ai-analyzed-at` |
| Loading 狀態 | `ai-loading` |
| 目標 Widget 選擇器 | `target-widget-select` |
