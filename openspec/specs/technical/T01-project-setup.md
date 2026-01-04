# T01: Project Setup

## Overview
專案技術基礎設施初始化，建立開發環境與基礎架構。

## Scope
- 專案初始化與套件安裝
- 開發工具設定
- 專案結構建立
- Mock 環境設定

## Technical Requirements

### 專案初始化
- [ ] 使用 Vite 建立 React + TypeScript 專案
- [ ] 設定 TypeScript strict mode
- [ ] 設定 path alias (`@/` → `src/`)

### 樣式與 UI
- [ ] 安裝並設定 Tailwind CSS
- [ ] 初始化 shadcn/ui
- [ ] 安裝基礎 shadcn/ui 元件 (Button, Card, Dialog, Input, Label, Toast)

### 開發工具
- [ ] 設定 ESLint (React + TypeScript recommended)
- [ ] 設定 Prettier
- [ ] 設定 EditorConfig

### 核心套件安裝
- [ ] echarts + echarts-for-react
- [ ] react-grid-layout + @types/react-grid-layout
- [ ] zustand
- [ ] react-hook-form + zod + @hookform/resolvers
- [ ] @tanstack/react-query
- [ ] axios
- [ ] react-router-dom

### 測試環境
- [ ] 安裝 Vitest + @testing-library/react
- [ ] 安裝 Playwright
- [ ] 設定測試腳本 (test, test:e2e)

### Mock 環境
- [ ] 安裝 MSW (Mock Service Worker)
- [ ] 建立 mocks/ 目錄結構
- [ ] 設定環境變數 (VITE_ENABLE_MOCKS)

### 專案結構
依 project.md 建立以下目錄：
```
src/
├── components/
│   ├── ui/            # shadcn/ui 元件
│   ├── common/        # 通用元件
│   ├── dashboard/     # Dashboard 相關元件
│   └── chart/         # 圖表相關元件
├── features/
│   ├── dashboard/
│   ├── chart-config/
│   └── theme/
├── hooks/
├── stores/
├── types/
├── utils/
├── services/
│   ├── api/
│   └── types/
├── mocks/
│   ├── handlers/
│   └── data/
├── locales/
│   ├── zh-TW/
│   └── en/
└── styles/
```

### 路由設定
- [ ] 設定 React Router
- [ ] 建立基礎路由結構：
  - `/` - Dashboard 列表頁
  - `/dashboard/:id` - Dashboard 編輯頁

## Acceptance Criteria
- [ ] `pnpm dev` 可正常啟動開發伺服器
- [ ] `pnpm build` 可正常建置
- [ ] `pnpm lint` 無錯誤
- [ ] `pnpm test` 可執行（即使無測試案例）
- [ ] shadcn/ui 元件可正常使用
- [ ] 路由切換正常運作

## Dependencies
- 無（第一個 spec）

## Out of Scope
- 實際功能開發
- 頁面 UI 設計
- 業務邏輯
