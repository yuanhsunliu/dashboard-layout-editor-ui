# F10: Embed Widget

## Status
- [ ] Not Started

## Overview
使用者可以透過 URL 嵌入外部報表（如 Power BI、Tableau、Grafana、Metabase 等）至 Dashboard 中，與自建的 Chart Widget 並存使用。

## User Stories
- 作為使用者，我可以選擇「嵌入報表」作為 Widget 類型，以便嵌入外部報表
- 作為使用者，我可以輸入報表 URL，以便在 Dashboard 中顯示外部報表
- 作為使用者，我可以設定 Widget 標題，以便識別嵌入的內容
- 作為使用者，我可以即時預覽嵌入效果，以便確認 URL 正確

## Acceptance Criteria

### Widget 類型選擇
- [ ] 將「圖表類型」選擇器改為「Widget 類型」選擇器
- [ ] 可選擇「嵌入報表」作為 Widget 類型
- [ ] 選擇後顯示 Embed 專屬設定欄位

### 設定欄位
- [ ] 顯示 URL 輸入欄位（必填）
- [ ] 顯示標題輸入欄位（選填，預設「嵌入報表」）
- [ ] 隱藏資料來源、X軸、Y軸等圖表相關欄位

### URL 驗證
- [ ] 允許 HTTP 和 HTTPS URL
- [ ] 無效 URL 格式顯示驗證錯誤
- [ ] 無效時無法儲存設定

### iframe 嵌入
- [ ] 使用 iframe 載入設定的 URL
- [ ] iframe 自動填滿 Widget 區域
- [ ] 不設置 sandbox 屬性限制
- [ ] 顯示 loading skeleton 載入狀態
- [ ] 不主動偵測嵌入失敗

### 預覽
- [ ] 輸入有效 URL 後即時顯示預覽

### 空白狀態
- [ ] 未設定 URL 時沿用 Chart Widget 空白狀態樣式

### 標題顯示
- [ ] Widget 標題列顯示使用者設定的標題
- [ ] 標題為空時顯示「嵌入報表」

## UI/UX Spec

### 設定面板
```
┌────────────────────────────────────┐
│  Widget 設定                  [X]  │
├────────────────────────────────────┤
│                                    │
│  Widget 類型                       │
│  ┌──────────────────────────────┐  │
│  │ 🔗 嵌入報表              ▼  │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────────────────────────     │
│                                    │
│  標題                              │
│  ┌──────────────────────────────┐  │
│  │ 嵌入報表                     │  │
│  └──────────────────────────────┘  │
│                                    │
│  嵌入網址 *                        │
│  ┌──────────────────────────────┐  │
│  │ https://...                  │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────────────────────────     │
│                                    │
│  預覽                              │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │      [iframe 預覽]           │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
│         [取消]    [儲存]           │
│                                    │
└────────────────────────────────────┘
```

## Design Decisions

| 項目 | 決定 |
|------|------|
| URL 安全性 | 允許 HTTP 和 HTTPS |
| iframe 權限 | 不設 sandbox 限制 |
| 預覽行為 | 即時預覽 |
| 載入狀態 | 顯示 loading skeleton |
| 錯誤偵測 | 不主動偵測 |
| 空白狀態 | 沿用 Chart Widget 樣式 |
| UX 流程 | 將「圖表類型」改為「Widget 類型」 |
| 標題預設值 | 預設為「嵌入報表」 |
| 標題列顯示 | 顯示設定標題，空白則顯示「嵌入報表」 |

## Component Structure

```
src/features/chart-plugins/plugins/embed/
├── index.ts              # Plugin 定義
├── EmbedRenderer.tsx     # iframe 嵌入元件
├── ConfigFields.tsx      # URL + 標題設定欄位
└── schema.ts             # Zod validation
```

## Form Validation (Zod)

```typescript
const embedSchema = z.object({
  chartType: z.literal('embed'),
  title: z.string().optional().default('嵌入報表'),
  url: z.string().url('請輸入有效的網址'),
});
```

## Dependencies
- F09: Chart Plugin System（Plugin 架構）
- F04: Chart Configuration（設定面板）

## Out of Scope
- URL 白名單限制
- 主動偵測 X-Frame-Options 錯誤
- iframe sandbox 安全限制
- 嵌入內容的互動控制
