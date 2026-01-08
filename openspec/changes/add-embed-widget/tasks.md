# Tasks: Add Embed Widget

## 1. Type Definitions
- [ ] 1.1 新增 `embed` 到 ChartType union type
- [ ] 1.2 定義 EmbedConfig interface (url, title)

## 2. UI 文字修改
- [ ] 2.1 將「圖表類型」改為「Widget 類型」
- [ ] 2.2 新增「嵌入報表」選項到類型選擇器

## 3. Embed Plugin
- [ ] 3.1 建立 `src/features/chart-plugins/plugins/embed/` 目錄
- [ ] 3.2 實作 EmbedRenderer.tsx (iframe 嵌入 + loading skeleton)
- [ ] 3.3 實作 ConfigFields.tsx (URL + 標題輸入欄位)
- [ ] 3.4 實作 schema.ts (Zod validation - URL 格式驗證)
- [ ] 3.5 實作 index.ts (Plugin 定義)
- [ ] 3.6 註冊 embed plugin 到 chartRegistry

## 4. 預覽功能
- [ ] 4.1 實作 Embed 即時預覽 (iframe)
- [ ] 4.2 顯示 loading skeleton 載入狀態

## 5. 空白狀態
- [ ] 5.1 沿用 ChartEmpty 元件處理未設定狀態

## 6. Testing
- [ ] 6.1 E2E 測試：選擇嵌入報表類型
- [ ] 6.2 E2E 測試：輸入有效 URL 並儲存
- [ ] 6.3 E2E 測試：URL 格式驗證錯誤
- [ ] 6.4 E2E 測試：顯示嵌入內容

## 7. Documentation
- [ ] 7.1 更新 epics.md 新增 F10
- [ ] 7.2 建立 F10-embed-widget.md spec
