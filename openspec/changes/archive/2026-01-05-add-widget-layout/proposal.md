# Change: Add Widget Layout

## Why
使用者需要在 Dashboard 編輯頁中新增 Widget，並透過拖放調整位置與大小，以便自訂報表佈局。

## What Changes
- 新增「新增 Widget」按鈕至 Dashboard 編輯頁 Header
- 實作 Widget 元件（標題列、內容區、刪除按鈕、resize handle）
- 整合 react-grid-layout 實現拖放與調整大小功能
- 實作 Zustand store 管理 layout 與 widgets 狀態
- 更新 Dashboard API 以儲存 layout 與 widgets

## Impact
- Affected specs: `features/F02-widget-layout`
- Affected code:
  - 修改 Dashboard 編輯頁 (`/dashboard/:id`)
  - 新增 Widget 元件
  - 新增 GridLayout 元件
  - 新增 useDashboardEditorStore
  - 更新 dashboardApi 服務

## Decisions

| 問題 | 決策 |
|------|------|
| Widget 標題顯示 | 顯示圖表類型，未設定時顯示「未設定」 |
| 佈局儲存時機 | 自動儲存（debounce 500ms） |
| 空白 Widget 點擊 | 無行為，僅顯示「尚未設定圖表」提示 |
| Widget 數量上限 | 無限制 |
| 新增 Widget 位置 | 放置在最下方（y: Infinity） |
| 刪除確認機制 | 一律不確認，點擊即刪除 |
| 儲存失敗處理 | 依 `project.md` 通用 Error Handling Strategy |
| Widget ID 格式 | `widget-{timestamp}-{random}` |
| 空 Dashboard 顯示 | 顯示引導提示「新增第一個 Widget」 |
| 最大尺寸限制 | maxW: 12（滿版），高度無限制 |
