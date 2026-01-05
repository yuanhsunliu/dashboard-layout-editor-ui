# Project Context

## Purpose
Dashboard Layout Editor UI - 一個網頁應用程式，讓使用者可以：
- 建立和管理多個 Dashboard
- 在 Dashboard 中使用拖放方式擺放多個 ECharts 圖表
- 每個圖表獨立呈現在可調整大小的方格（Grid Cell）中
- 自由移動和調整方格位置與大小來客製化佈局
- 為每個圖表設定：資料源、圖表類型（圓餅圖、折線圖等）、X/Y 軸對應欄位
- 套用主題（預設：Light / Dark）到整個 Dashboard
- 快速完成資料視覺化報表

## Tech Stack
- **語言**: TypeScript
- **前端框架**: React 18+
- **構建工具**: Vite
- **樣式**: Tailwind CSS
- **UI 元件庫**: shadcn/ui（MUST 使用，需要時 MUST 安裝，禁止重寫基本 UI 元件）
- **圖表庫**: ECharts (apache-echarts) + echarts-for-react
- **拖放佈局**: react-grid-layout
- **狀態管理**: Zustand
- **表單處理**: React Hook Form + Zod
- **HTTP 請求**: Axios / TanStack Query
- **測試**: Vitest + React Testing Library + Playwright

## Development Setup

### 系統需求
- Node.js 20+
- pnpm 8+ (建議) 或 npm 9+

### 快速開始
```bash
pnpm install
pnpm dev
```

### 可用指令
| 指令 | 說明 |
|------|------|
| `pnpm dev` | 啟動開發伺服器 |
| `pnpm build` | 建置生產版本 |
| `pnpm test` | 執行單元測試 |
| `pnpm test:e2e` | 執行 E2E 測試 |
| `pnpm lint` | 執行 ESLint 檢查 |

## Project Conventions

### Code Style
- 使用 ESLint + Prettier 進行程式碼格式化
- 變數/函數：camelCase（例：`chartConfig`, `handleDragEnd`）
- 元件/類別/型別：PascalCase（例：`DashboardGrid`, `ChartWidget`）
- 常數：UPPER_SNAKE_CASE（例：`DEFAULT_THEME`, `MAX_COLUMNS`）
- 檔案命名：
  - 元件：PascalCase（`ChartWidget.tsx`）
  - Hooks：camelCase 帶 use 前綴（`useDashboard.ts`）
  - 工具函數：camelCase（`formatChartData.ts`）

### Architecture Patterns
```
src/
├── components/          # 可重用 UI 元件
│   ├── common/          # 通用元件（Button, Modal, etc.）
│   ├── dashboard/       # Dashboard 相關元件
│   └── chart/           # 圖表相關元件
├── features/            # 功能模組（按功能分類）
│   ├── dashboard/       # Dashboard 管理功能
│   ├── chart-config/    # 圖表設定功能
│   └── theme/           # 主題切換功能
├── hooks/               # 自訂 Hooks
├── stores/              # Zustand stores
├── types/               # TypeScript 型別定義
├── utils/               # 工具函數
├── services/            # API 服務層
└── styles/              # 全域樣式與主題
```

### Component Design Principles
> 遵循 React Best Practices

- **元件分層**:
  - `components/ui/`: shadcn/ui 元件，禁止修改
  - `components/common/`: 基於 shadcn/ui 組合的通用元件
  - `features/*/components/`: 功能專屬元件
- **Props 設計**: 使用 TypeScript interface，使用 `ComponentProps<typeof X>` 繼承 shadcn/ui 元件 props
- **單一職責**: 每個元件只負責一件事
- **組合優於繼承**: 透過 children 和 render props 組合元件

### State Management Guidelines
> 遵循 Zustand Best Practices

- **Store 設計**:
  - 每個 feature 一個獨立 store
  - Store 檔案命名：`use[Feature]Store.ts`
  - 避免在 store 中放 UI 狀態（如 modal 開關，使用 local state）
- **資料流**:
  ```
  API → TanStack Query (Server State) → Component
  User Action → Zustand (Client State) → Component
  ```
- **Server State vs Client State**: API 資料用 TanStack Query，本地狀態用 Zustand

### Testing Strategy
- **單元測試**: Vitest + React Testing Library（元件邏輯、Hooks、工具函數）
- **整合測試**: 測試元件間互動與狀態管理
- **E2E 測試**: Playwright（關鍵使用者流程：建立 Dashboard、新增圖表、調整佈局）
- 測試檔案放置於對應元件/功能旁（`*.test.ts` / `*.spec.ts`）

#### 測試原則
- **MUST** 使用 BDD 風格撰寫 Playwright E2E 測試案例描述
- 測試重點在於確保元件行為符合預期，涵蓋主要使用情境即可
- 不需要覆蓋所有邊界情況
- E2E 測試重點在於模擬使用者操作流程
- 開發完成後 must 進行 playwright BDD test, 結果給我看 html 格式 report.
- 測試要留畫面截圖, 要確認截圖可以在 test report 上正確的看到.
- 有問題 must 修正到好. 

#### BDD 測試範例
```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard Management', () => {
  test.describe('Given a user on the dashboard list page', () => {
    test('When clicking "Create Dashboard" button, Then a new dashboard should be created', async ({ page }) => {
      // ...
    });

    test('When dragging a chart widget, Then the layout should update', async ({ page }) => {
      // ...
    });
  });
});
```

### Git Workflow
- **分支策略**: GitHub Flow
  - `main`: 穩定版本，隨時可部署
  - `feature/*`: 新功能開發
  - `fix/*`: Bug 修復
  - `refactor/*`: 重構
- **Commit 格式**: Conventional Commits
  - `feat:` 新功能
  - `fix:` Bug 修復
  - `docs:` 文件更新
  - `refactor:` 重構
  - `test:` 測試相關
  - `chore:` 維護性工作

## Domain Context

### 核心概念
- **Dashboard**: 一個報表頁面，包含多個圖表方格
- **Grid Cell / Widget**: 單一圖表的容器，可調整大小與位置
- **Chart Config**: 圖表設定，包含資料源、圖表類型、軸線對應
- **Data Source**: 資料來源，提供圖表所需的數據
- **Theme**: 視覺主題，影響整個 Dashboard 的配色

### 圖表類型
- 圓餅圖 (Pie Chart)
- 折線圖 (Line Chart)
- 長條圖 (Bar Chart)
- 面積圖 (Area Chart)
- 散點圖 (Scatter Chart)
- 更多 ECharts 支援的類型...

### 佈局系統
- 基於 Grid 的佈局系統
- 支援拖放重新排列
- 支援調整方格大小
- 響應式設計

## Important Constraints
- 瀏覽器支援：Chrome, Firefox, Safari, Edge 最新兩個版本
- 需考慮大量圖表時的效能優化
- 圖表資料更新需支援即時刷新
- Dashboard 配置需可持久化儲存
- 不需要使用者登入/權限管理
- **DO NOT** 自己寫 UI 元件，**MUST** 使用 shadcn/ui 提供的元件來組合出所需的介面
- 安裝需要使用的 shadcn/ui 元件庫，並參考官方文件來使用這些元件
- shadcn/ui 官方文件：https://ui.shadcn.com/docs
- **MUST** 使用 ECharts 作為圖表庫，**DO NOT** 使用其他圖表庫（如 Chart.js、Recharts、Highcharts 等）
- ECharts 官方文件：https://echarts.apache.org/
- 初期不考慮效能優化（懶載入、虛擬化）
- 不需要考慮無障礙規範 (a11y)
- 不需要版本控制/Undo-Redo 功能

## Internationalization (i18n)

### 支援語系
- 繁體中文 (zh-TW) - 預設
- 英文 (en)

### 技術方案
- **套件**: react-i18next + i18next
- **語系檔位置**: `src/locales/`

### 目錄結構
```
src/
├── locales/
│   ├── zh-TW/
│   │   ├── common.json      # 通用翻譯
│   │   ├── dashboard.json   # Dashboard 相關
│   │   └── chart.json       # 圖表相關
│   ├── en/
│   │   ├── common.json
│   │   ├── dashboard.json
│   │   └── chart.json
│   └── index.ts             # i18n 設定
```

### 使用方式
```typescript
import { useTranslation } from 'react-i18next';

function DashboardHeader() {
  const { t } = useTranslation('dashboard');
  return <h1>{t('title')}</h1>;
}
```

## Error Handling Strategy

### 設計原則
針對 Dashboard 編輯器的使用情境，採用**非阻斷式錯誤處理**，讓使用者操作流程不被中斷：

### 錯誤類型與處理方式

| 錯誤類型 | 處理方式 | UI 呈現 |
|----------|----------|---------|
| **API 請求失敗** | 自動重試 + Toast 通知 | 右下角 Toast，可手動重試 |
| **資料載入失敗** | 顯示錯誤狀態 + 重試按鈕 | Widget 內顯示錯誤訊息與重試按鈕 |
| **表單驗證錯誤** | 即時欄位驗證 | 欄位下方紅字提示 |
| **儲存失敗** | Toast 通知 + 保留編輯狀態 | Toast 提示，資料不遺失 |
| **未預期錯誤** | Error Boundary 捕捉 | 顯示友善錯誤頁面，可回首頁 |

### 技術實作
```typescript
// Toast 通知（使用 shadcn/ui 的 Toast 元件）
import { toast } from 'sonner'; // shadcn/ui 推薦的 toast 套件

// API 錯誤處理範例
try {
  await saveDashboard(data);
  toast.success(t('dashboard.saveSuccess'));
} catch (error) {
  toast.error(t('dashboard.saveFailed'), {
    action: {
      label: t('common.retry'),
      onClick: () => saveDashboard(data),
    },
  });
}
```

### Error Boundary
```typescript
// src/components/common/ErrorBoundary.tsx
// 用於捕捉 React 元件未預期錯誤，顯示友善錯誤畫面
```

### 使用者體驗重點
- ✅ 操作失敗時不清除使用者已編輯的內容
- ✅ 提供明確的錯誤訊息與解決方案
- ✅ 支援一鍵重試
- ✅ 非關鍵錯誤不阻斷主流程

## Storage Strategy

### Dashboard 設定儲存
- **儲存方式**: 本地 JSON 檔案
- **檔案路徑**: `./data/dashboard-setting.json`
- **格式**: JSON

### 檔案結構範例
```json
{
  "dashboards": [
    {
      "id": "dashboard-1",
      "name": "銷售報表",
      "theme": "light",
      "layout": [
        {
          "i": "widget-1",
          "x": 0, "y": 0, "w": 6, "h": 4
        }
      ],
      "widgets": [
        {
          "id": "widget-1",
          "chartType": "line",
          "dataSource": "sales-api",
          "xAxis": "date",
          "yAxis": "revenue"
        }
      ]
    }
  ]
}
```

### 注意事項
- 開發階段透過 Mock API 讀寫此檔案
- 未來可替換為後端 API 儲存，服務層抽象確保無痛切換

## External Dependencies
- **ECharts**: Apache ECharts 圖表庫
- **資料源 API**: 使用已存在的 API 後端
- **後端 API**: Dashboard 儲存與管理（待定義）

## API 整合策略

### Mock-First 開發模式
開發測試階段採用 Mock 優先策略，確保無痛切換至實際 API：

1. **服務抽象層**: 所有 API 呼叫透過 Service 層封裝
2. **Mock 實作**: 使用 MSW (Mock Service Worker) 進行 API Mock
3. **環境切換**: 透過環境變數切換 Mock / 實際 API
4. **型別共用**: Mock 與實際 API 共用相同的 TypeScript 型別定義

### 目錄結構
```
src/
├── services/
│   ├── api/
│   │   ├── client.ts           # Axios 實例設定
│   │   ├── dashboardApi.ts     # Dashboard API
│   │   └── dataSourceApi.ts    # 資料源 API
│   └── types/
│       └── api.types.ts        # API 型別定義
├── mocks/
│   ├── handlers/               # MSW request handlers
│   │   ├── dashboardHandlers.ts
│   │   └── dataSourceHandlers.ts
│   ├── data/                   # Mock 資料
│   │   ├── dashboards.ts
│   │   └── dataSources.ts
│   ├── browser.ts              # 瀏覽器 MSW 設定
│   └── server.ts               # 測試用 MSW 設定
```

### 環境變數
```env
VITE_API_BASE_URL=http://localhost:3000/api   # API 基礎路徑
VITE_ENABLE_MOCKS=true                         # 啟用 Mock（開發時 true）
```
