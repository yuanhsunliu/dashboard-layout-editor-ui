# Tasks: Add Dashboard CRUD

## 1. Data Layer
- [x] 1.1 定義 Dashboard TypeScript 類型 (`Dashboard`, `DashboardListItem`)
- [x] 1.2 實作 Dashboard 資料存儲（localStorage）

## 2. API Routes (Service Layer)
- [x] 2.1 實作 `GET /api/dashboards` - 列出所有 Dashboard
- [x] 2.2 實作 `GET /api/dashboards/:id` - 取得單一 Dashboard
- [x] 2.3 實作 `POST /api/dashboards` - 建立新 Dashboard
- [x] 2.4 實作 `PATCH /api/dashboards/:id` - 更新 Dashboard（重新命名）
- [x] 2.5 實作 `DELETE /api/dashboards/:id` - 刪除 Dashboard

## 3. UI Components
- [x] 3.1 建立 DashboardCard 元件
- [x] 3.2 建立 DashboardList 元件
- [x] 3.3 建立 EmptyState 元件
- [x] 3.4 建立 DeleteConfirmDialog 元件
- [x] 3.5 建立 InlineEditName 元件

## 4. Pages
- [x] 4.1 實作首頁 Dashboard 列表頁 (`/`)
- [x] 4.2 實作 Dashboard 編輯頁框架 (`/dashboard/:id`)

## 5. Integration
- [x] 5.1 整合新增 Dashboard 按鈕與 API
- [x] 5.2 整合重新命名功能
- [x] 5.3 整合刪除功能與確認 Dialog
- [x] 5.4 整合點擊進入編輯頁導航
- [x] 5.5 新增 Toast 通知

## 6. Testing
- [x] 6.1 撰寫 Playwright BDD E2E 測試（15 tests passed）
- [x] 6.2 產生 HTML 報告（含截圖）
