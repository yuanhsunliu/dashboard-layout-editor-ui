# Change: Add Dashboard CRUD Operations

## Why
使用者需要建立、檢視、編輯、刪除 Dashboard 的基本功能，作為 Dashboard Layout Editor 的核心操作入口。

## What Changes
- 新增 Dashboard 列表頁面，顯示所有 Dashboard
- 新增建立 Dashboard 功能
- 新增重新命名 Dashboard 功能（列表 + 編輯頁 Header）
- 新增刪除 Dashboard 功能（含確認 Dialog）
- 新增點擊進入 Dashboard 編輯頁功能
- 實作 API Routes + JSON 檔案儲存

## Impact
- Affected specs: `features/F01-dashboard-crud`
- Affected code:
  - 新增首頁列表頁面 (`/`)
  - 新增 Dashboard 編輯頁面 (`/dashboard/:id`)
  - 新增 API routes (`/api/dashboards`)
  - 新增 Dashboard 相關 components
  - 新增 `./data/dashboard-setting.json` 儲存檔案

## Decisions

| 問題 | 決策 |
|------|------|
| 資料儲存方式 | API Routes + JSON 檔案，未來可無縫替換為資料庫 |
| 編輯頁內容 | 空白框架（Header + 空白區域），Widget 功能待 F02 |
| 重新命名位置 | 列表 inline edit + 編輯頁 Header 都可修改 |
| 名稱驗證規則 | 非空白 + 最大 50 字元 |
| 刪除邊界情況 | 暫不處理（Out of Scope） |
| 列表排序 | 固定 `updatedAt` 降序（最近更新在前） |
| API 錯誤處理 | 依 `project.md` 通用 Error Handling Strategy |
| 單一 Dashboard API | 新增 `GET /api/dashboards/:id` 端點 |
| 卡片操作按鈕 | 選單模式（⋮ 按鈕展開 DropdownMenu） |
| 時間格式 | 混合模式（7 天內相對時間，超過顯示絕對時間） |

## Status
✅ **Archived** - 2026-01-05
