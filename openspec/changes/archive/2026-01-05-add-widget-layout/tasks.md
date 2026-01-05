# Tasks: Add Widget Layout

## 1. Dependencies
- [ ] 1.1 安裝 react-grid-layout 套件

## 2. State Management
- [ ] 2.1 建立 useDashboardEditorStore（管理 layout 與 widgets）
- [ ] 2.2 實作 addWidget action
- [ ] 2.3 實作 removeWidget action
- [ ] 2.4 實作 updateLayout action

## 3. UI Components
- [ ] 3.1 建立 WidgetContainer 元件（標題列、刪除按鈕、resize handle）
- [ ] 3.2 建立 EmptyWidgetContent 元件（空白 Widget 提示）
- [ ] 3.3 建立 DashboardGrid 元件（整合 react-grid-layout）

## 4. Pages Integration
- [ ] 4.1 修改 DashboardEditorPage 加入「新增 Widget」按鈕
- [ ] 4.2 整合 DashboardGrid 取代空白區域
- [ ] 4.3 連接 store 與 API 同步佈局變更

## 5. API Integration
- [ ] 5.1 載入 Dashboard 時初始化 layout 與 widgets
- [ ] 5.2 佈局變更時更新 Dashboard

## 6. Testing
- [ ] 6.1 撰寫 Widget 新增/刪除 E2E 測試
- [ ] 6.2 撰寫拖放移動 E2E 測試
- [ ] 6.3 撰寫調整大小 E2E 測試
