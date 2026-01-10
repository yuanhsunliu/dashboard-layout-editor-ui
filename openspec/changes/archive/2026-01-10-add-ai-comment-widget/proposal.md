# Change Proposal: AI Comment Widget

## Overview

新增 AI Comment Widget Plugin，可分析指定 Widget 的圖表與資料，透過 AI Agent 產生洞察結果。

## Why

- 使用者需要快速理解圖表數據的意義
- AI 輔助分析可降低數據解讀門檻
- 提升 Dashboard 的智能化程度

## What Changes

### 新增套件
- `html2canvas` - 擷取 Widget 截圖（純 JS，跨平台支援 Linux/Windows）
- `react-markdown` - 渲染 AI 回覆的 Markdown 內容

### 新增 Plugin: `ai-comment`
- **chartType**: `ai-comment`
- **功能**: 分析指定 Widget 的圖表與資料

### Config 欄位
| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| title | string | 否 | Widget 標題 |
| targetWidgetId | string | 是 | 要分析的目標 Widget ID |

### UI 元件
1. **ConfigFields**: 下拉選單選擇目標 Widget
2. **AiCommentRenderer**: 顯示洞察結果
   - Markdown 格式呈現
   - 「分析」/「重新分析」按鈕
   - 上次分析時間顯示
   - Loading 狀態

### 觸發時機
1. 使用者點擊「分析」按鈕
2. 目標 Widget 資料變更時自動重新分析（含 debounce）

### AI Agent API（Mock）
```typescript
POST /api/ai/analyze
Request: {
  widgetId: string,
  imageBase64: string,  // 圖表截圖
  data: Record<string, unknown>[]  // 原始資料
}
Response: {
  insight: string,  // Markdown 格式洞察結果
  analyzedAt: string  // ISO 時間戳
}
```

## Clarified Requirements

| 問題 | 決定 |
|------|------|
| Q1: Widget 選擇方式 | 下拉選單選擇同 Dashboard 內的 Widget |
| Q2: 傳送資料 | 圖表截圖 (image) + 原始資料 (JSON) |
| Q3: 觸發時機 | 按鈕觸發 + 資料變更時自動重新分析 |
| Q4: 呈現方式 | Markdown 格式 + 重新分析按鈕 + 顯示分析時間 |
| Q5: API 策略 | Mock API 先行開發 |
| Q6: 截圖套件 | html2canvas（純 JS，跨平台） |
| Q7: 未設定目標 Widget | 顯示提示文字「請選擇要分析的 Widget」 |
| Q8: 目標 Widget 被刪除 | 顯示錯誤訊息「目標 Widget 已不存在」 |
| Q9: AI 分析失敗 | 顯示錯誤訊息 + 重試按鈕 |
| Q10: 結果持久化 | 否，每次載入頁面重新分析 |

## Impact

- **新檔案**: 約 6 個（schema, renderer, config, mock API, utils）
- **修改檔案**: registry.ts, index.ts, chart.ts
- **套件依賴**: +2 (html2canvas, react-markdown)

## Technical Notes

### 截圖機制
- 使用 `html2canvas` 擷取目標 Widget 的 DOM 元素
- 需要透過 `data-widget-id` 屬性定位 Widget
- ECharts canvas 圖表可正確擷取

### 跨 Widget 存取
- 需要取得同 Dashboard 內所有 Widget 列表
- 下拉選單排除自己（AI Comment Widget）
- 排除其他 AI Comment Widget（避免循環）

### 資料變更偵測
- 監聽目標 Widget 的 DataSource 資料變更
- 使用 debounce（建議 1-2 秒）避免頻繁呼叫
