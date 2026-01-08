# Change: Add Embed Widget

## Why
使用者已有現成的外部報表（Power BI、Tableau、Grafana、Metabase 等），希望能透過 URL 嵌入到 Dashboard 中，與自建的 Chart Widget 並存使用，提供更完整的 Dashboard 體驗。

## What Changes
- 將「圖表類型」選擇器改為「Widget 類型」選擇器
- 新增 `embed` 作為新的 Widget 類型
- 新增 Embed Widget 設定面板（URL 輸入、標題設定）
- 使用 iframe 嵌入外部 URL（不設 sandbox 限制）
- 支援 HTTP 和 HTTPS URL
- 即時預覽嵌入內容
- 顯示 loading skeleton 載入狀態
- 沿用現有 Chart Widget 的空白狀態樣式

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

## Impact
- Affected specs: F10-embed-widget.md (新增)
- Affected code:
  - `src/types/chart.ts` - 新增 embed 類型
  - `src/features/chart-config/` - 修改 UI 文字、新增 Embed 設定元件
  - `src/components/chart/` - 新增 EmbedWidget 元件
  - Chart Plugin Registry - 新增 embed plugin
