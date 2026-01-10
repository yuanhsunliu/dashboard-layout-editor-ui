# Widget Plugin Developer Guide

本目錄包含開發 Dashboard Layout Editor Widget Plugin 所需的資源與指引。

## 快速開始

### 1. 閱讀開發指南

完整的 Plugin 開發說明請參考：
- 📖 [PLUGIN_DEVELOPMENT.md](../src/features/chart-plugins/PLUGIN_DEVELOPMENT.md)

### 2. 參考現有 Plugin

| Plugin 類型 | 複雜度 | 路徑 | 特點 |
|-------------|--------|------|------|
| KPI Card | 簡單 | `src/features/chart-plugins/plugins/kpi-card/` | 靜態設定，無資料源 |
| Line Chart | 中等 | `src/features/chart-plugins/plugins/line/` | ECharts 圖表，需資料源 |
| AI Comment | 複雜 | `src/features/chart-plugins/plugins/ai-comment/` | 非同步 API、Widget 參照 |
| Embed | 簡單 | `src/features/chart-plugins/plugins/embed/` | iframe 嵌入外部內容 |

### 3. 使用 AI 輔助開發

本目錄提供 Copilot Agent 可用的資源：

| 資源 | 檔案 | 用途 |
|------|------|------|
| **Instruction** | `instructions/widget-plugin-development.instructions.md` | 自動套用的開發規範 |
| **Prompt** | `prompts/scaffold-widget-plugin.prompt.md` | 快速建立新 Plugin |
| **Agent** | `agents/widget-plugin-developer.agent.md` | 專門協助 Plugin 開發的 Agent |

## Plugin 目錄結構

```
src/features/chart-plugins/plugins/<plugin-name>/
├── index.ts              # Plugin 匯出（實作 ChartPlugin interface）
├── schema.ts             # Zod 驗證 schema
├── <Name>Renderer.tsx    # 主要渲染元件
├── ConfigFields.tsx      # 設定表單元件
└── locales.ts            # （可選）多語系資源
```

## 平台限制

開發 Plugin 時 **必須** 遵守以下限制：

### 必須使用

| 類別 | 套件 |
|------|------|
| UI 元件 | **shadcn/ui** |
| 圖表庫 | **ECharts** (echarts-for-react) |
| 表單驗證 | **Zod** |
| 狀態管理 | **Zustand** (client) / **TanStack Query** (server) |

### 禁止使用

- ❌ 自己實作基本 UI 元件（Button, Input, Select 等）
- ❌ 其他圖表庫（Chart.js, Recharts, Highcharts）
- ❌ 其他驗證庫（Yup, Joi）

### 多語系 (i18n)

Plugin 採用**自包含式 i18n**，翻譯資源定義在 Plugin 目錄內的 `locales.ts`：

```typescript
// locales.ts
import type { PluginLocales } from '../../types';

export const myWidgetLocales: PluginLocales = {
  'zh-TW': { title: '標題', analyze: '分析' },
  'en': { title: 'Title', analyze: 'Analyze' },
};
```

在元件中使用 plugin type 作為 namespace：

```typescript
const { t } = useTranslation('my-widget');
return <h3>{t('title')}</h3>;
```

## 開發流程

```
1. 建立 Plugin 目錄
   └── mkdir -p src/features/chart-plugins/plugins/<plugin-name>

2. 建立核心檔案
   ├── schema.ts          # 定義 Zod schema
   ├── <Name>Renderer.tsx # 實作渲染元件
   ├── ConfigFields.tsx   # 實作設定表單
   ├── locales.ts         # （可選）定義翻譯
   └── index.ts           # 匯出 Plugin

3. 註冊 Plugin
   ├── src/features/chart-plugins/registry.ts  # 加入 import 和註冊
   └── src/types/chart.ts                      # 更新 ChartType union

4. 撰寫測試
   └── e2e/<plugin-name>.spec.ts

5. 驗證
   ├── pnpm build         # 確認建置成功
   └── pnpm test:e2e      # 確認測試通過
```

## 常見問題

### Q: Select 元件空選項導致 React 崩潰？

**A**: 不要使用 `<SelectItem value="">`，改用 plain div：

```typescript
// ❌ 錯誤
<SelectItem value="" disabled>無可用選項</SelectItem>

// ✅ 正確
{items.length === 0 ? (
  <div className="px-2 py-1.5 text-sm text-muted-foreground">
    無可用選項
  </div>
) : (
  items.map(item => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)
)}
```

### Q: 如何讓 Plugin 參照其他 Widget？

**A**: 使用 `ConfigFieldsProps` 中的 `availableWidgets` prop，參考 `ai-comment` Plugin 的實作。

### Q: 需要呼叫外部 API？

**A**: 
- 使用 `useState` 管理 loading/error/success 狀態
- 在 `useEffect` 中實作 cleanup 防止 memory leak
- 使用 Toast (sonner) 顯示錯誤通知
- 參考 `ai-comment` Plugin 的 `aiService.ts`

## 相關文件

- [PLUGIN_DEVELOPMENT.md](../src/features/chart-plugins/PLUGIN_DEVELOPMENT.md) - 完整開發指南
- [types.ts](../src/features/chart-plugins/types.ts) - ChartPlugin Interface 定義
- [openspec/project.md](../openspec/project.md) - 平台整體規範
