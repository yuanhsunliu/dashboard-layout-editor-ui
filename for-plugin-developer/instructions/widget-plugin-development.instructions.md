---
description: 'Dashboard Widget Plugin Development Standards'
applyTo: 'src/features/chart-plugins/**'
---

# Dashboard Widget Plugin Development Standards

This instruction defines the standards for developing widget plugins for the Dashboard Layout Editor platform.

## Platform Constraints

> 以下限制來自 `openspec/project.md`，開發 Plugin 時 **MUST** 遵守

### Tech Stack Requirements

| 類別 | 必須使用 | 禁止使用 |
|------|----------|----------|
| UI 元件 | **shadcn/ui** | 自己實作基本 UI 元件 |
| 圖表庫 | **ECharts** (apache-echarts + echarts-for-react) | Chart.js, Recharts, Highcharts 等 |
| 表單驗證 | **Zod** | Yup, Joi 等 |
| 狀態管理 | **Zustand** (client state), **TanStack Query** (server state) | Redux, MobX 等 |

### Important Constraints

- **DO NOT** 自己寫 UI 元件，**MUST** 使用 shadcn/ui 提供的元件來組合
- **MUST** 使用 ECharts 作為圖表庫
- 初期不考慮效能優化（懶載入、虛擬化）
- 不需要考慮無障礙規範 (a11y)
- 瀏覽器支援：Chrome, Firefox, Safari, Edge 最新兩個版本

### Internationalization (i18n)

Plugin 採用**自包含式 i18n**，翻譯資源定義在 Plugin 目錄內，**不需修改平台的 `src/locales/` 檔案**。

**支援語系**:
- 繁體中文 (zh-TW) - 預設
- 英文 (en)

**目錄結構**:
```
src/features/chart-plugins/plugins/my-widget/
├── index.ts
├── schema.ts
├── MyWidgetRenderer.tsx
├── ConfigFields.tsx
└── locales.ts              # Plugin 專屬翻譯資源
```

**定義翻譯資源** (`locales.ts`):
```typescript
import type { PluginLocales } from '../../types';

export const myWidgetLocales: PluginLocales = {
  'zh-TW': {
    title: '標題',
    analyze: '分析',
    loading: '載入中...',
  },
  'en': {
    title: 'Title',
    analyze: 'Analyze',
    loading: 'Loading...',
  },
};
```

**匯出 Plugin 時包含 locales** (`index.ts`):
```typescript
import { myWidgetLocales } from './locales';

export const MyWidgetPlugin: ChartPlugin<MyWidgetConfig> = {
  type: 'my-widget',
  // ... 其他屬性
  locales: myWidgetLocales,  // 加入翻譯資源
};
```

**在元件中使用** (使用 plugin type 作為 namespace):
```typescript
import { useTranslation } from 'react-i18next';

function MyWidgetRenderer({ config }: ChartRendererProps<MyWidgetConfig>) {
  const { t } = useTranslation('my-widget');  // plugin type 作為 namespace
  
  return (
    <div>
      <h3>{t('title')}</h3>
      <button>{t('analyze')}</button>
    </div>
  );
}
```

**注意事項**:
- 平台會自動將 `locales` 註冊為 i18n namespace
- namespace 名稱 = `plugin.type`
- 必須同時提供 `zh-TW` 和 `en` 兩種語系

### Naming Conventions

| 類型 | 命名規則 | 範例 |
|------|----------|------|
| 變數/函數 | camelCase | `chartConfig`, `handleDragEnd` |
| 元件/類別/型別 | PascalCase | `DashboardGrid`, `ChartWidget` |
| 常數 | UPPER_SNAKE_CASE | `DEFAULT_THEME`, `MAX_COLUMNS` |
| 元件檔案 | PascalCase | `ChartWidget.tsx` |
| Hooks 檔案 | camelCase + use 前綴 | `useDashboard.ts` |
| Plugin type | kebab-case | `kpi-card`, `ai-comment` |

### Error Handling

採用**非阻斷式錯誤處理**，讓使用者操作流程不被中斷：

| 錯誤類型 | 處理方式 | UI 呈現 |
|----------|----------|---------|
| API 請求失敗 | 自動重試 + Toast 通知 | 右下角 Toast |
| 資料載入失敗 | 顯示錯誤狀態 + 重試按鈕 | Widget 內顯示錯誤訊息 |
| 表單驗證錯誤 | 即時欄位驗證 | 欄位下方紅字提示 |

**Toast 使用**:
```typescript
import { toast } from 'sonner';

// 成功
toast.success(t('widget.analyzeSuccess'));

// 錯誤，帶重試
toast.error(t('widget.analyzeFailed'), {
  action: {
    label: t('common.retry'),
    onClick: () => retryAction(),
  },
});
```

## Plugin Architecture

### Directory Structure

Each plugin must follow this structure:

```
src/features/chart-plugins/plugins/<plugin-name>/
├── index.ts              # Plugin export (ChartPlugin interface)
├── schema.ts             # Zod validation schema
├── <Name>Renderer.tsx    # Main rendering component
├── ConfigFields.tsx      # Configuration form component
└── [optional files]      # Additional utilities, services, etc.
```

### ChartPlugin Interface

Every plugin must implement the `ChartPlugin` interface:

```typescript
interface ChartPlugin<TConfig extends BaseChartConfig = BaseChartConfig> {
  type: string;                    // Unique identifier (kebab-case)
  name: string;                    // Display name (中文 or English)
  description?: string;            // Brief description
  icon: ComponentType<{ className?: string }>;  // Lucide icon
  configSchema: z.ZodSchema<TConfig>;           // Zod schema
  ConfigFields: ComponentType<ConfigFieldsProps<TConfig>>;
  Renderer: ComponentType<ChartRendererProps<TConfig>>;
  supportedInteractions?: ('click' | 'brush' | 'drilldown')[];
  locales?: PluginLocales;         // 自包含式 i18n 資源
}

interface BaseChartConfig {
  chartType: string;
  dataSourceId?: string;           // Optional, some widgets don't need data source
}

type PluginLocales = {
  'zh-TW': Record<string, string>;
  'en': Record<string, string>;
};
```

## Schema Definition (schema.ts)

### Rules

1. Use Zod for all validation
2. `chartType` must be `z.literal('<plugin-type>')`
3. Provide meaningful error messages in Chinese
4. Use sensible defaults with `.default()`
5. Export both schema and inferred type

### Example

```typescript
import { z } from 'zod';

export const myWidgetConfigSchema = z.object({
  chartType: z.literal('my-widget'),
  title: z.string().max(50, '標題不能超過 50 字元').optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  // Add widget-specific fields...
});

export type MyWidgetConfig = z.infer<typeof myWidgetConfigSchema>;
```

## Renderer Component (<Name>Renderer.tsx)

### Rules

1. Accept `ChartRendererProps<TConfig>` as props
2. Add `data-testid="<plugin-type>"` to root element
3. Handle all states: loading, error, empty, success
4. Use `w-full h-full` for responsive sizing
5. Clean up resources in useEffect cleanup functions

### Props Interface

```typescript
interface ChartRendererProps<TConfig> {
  config: TConfig;
  data?: DemoData;
  filters?: DashboardFilter[];
  widgetId?: string;
  onInteraction?: (event: ChartInteractionEvent) => void;
}
```

### Example Structure

```typescript
import type { ChartRendererProps } from '../../types';
import type { MyWidgetConfig } from './schema';

export function MyWidgetRenderer({ 
  config, 
  data, 
  filters,
  widgetId,
  onInteraction 
}: ChartRendererProps<MyWidgetConfig>) {
  // State management
  // Data processing
  // Event handlers

  return (
    <div className="w-full h-full" data-testid="my-widget">
      {/* Widget content */}
    </div>
  );
}
```

## ConfigFields Component (ConfigFields.tsx)

### Rules

1. Accept `ConfigFieldsProps<TConfig>` as props
2. Add `data-testid="<plugin-type>-config-form"` to root element
3. Use shadcn/ui form components (Select, Input, Label, Switch, etc.)
4. Display validation errors from `errors` prop
5. Call `onChange` with updated config on every field change
6. Handle empty states gracefully (no `SelectItem value=""`)

### Props Interface

```typescript
interface ConfigFieldsProps<TConfig> {
  value: Partial<TConfig>;
  onChange: (value: Partial<TConfig>) => void;
  fields?: DataSourceField[];
  errors?: Record<string, string>;
  availableWidgets?: Array<{ id: string; title: string }>;  // For widget references
}
```

### Example Structure

```typescript
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ConfigFieldsProps } from '../../types';
import type { MyWidgetConfig } from './schema';

export function MyWidgetConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<MyWidgetConfig>) {
  return (
    <div className="space-y-4" data-testid="my-widget-config-form">
      <div className="space-y-2">
        <Label>欄位名稱</Label>
        <Input
          value={value.someField || ''}
          onChange={(e) => onChange({ ...value, someField: e.target.value })}
        />
        {errors?.someField && (
          <p className="text-sm text-destructive">{errors.someField}</p>
        )}
      </div>
    </div>
  );
}
```

### Empty State Handling

**IMPORTANT:** Never use `<SelectItem value="">` - it causes React crashes.

```typescript
// ❌ BAD - will crash
<SelectContent>
  {items.length === 0 && (
    <SelectItem value="" disabled>無可用選項</SelectItem>
  )}
</SelectContent>

// ✅ GOOD - use plain div
<SelectContent>
  {items.length === 0 ? (
    <div className="px-2 py-1.5 text-sm text-muted-foreground">
      無可用選項
    </div>
  ) : (
    items.map((item) => (
      <SelectItem key={item.id} value={item.id}>
        {item.name}
      </SelectItem>
    ))
  )}
</SelectContent>
```

## Plugin Export (index.ts)

### Rules

1. Import icon from `lucide-react`
2. Export plugin as named export `<Name>Plugin`
3. Export config type for external use
4. Include `locales` if plugin has translatable text

### Example

```typescript
import { LayoutGrid } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { myWidgetConfigSchema, type MyWidgetConfig } from './schema';
import { MyWidgetRenderer } from './MyWidgetRenderer';
import { MyWidgetConfigFields } from './ConfigFields';
import { myWidgetLocales } from './locales';

export const MyWidgetPlugin: ChartPlugin<MyWidgetConfig> = {
  type: 'my-widget',
  name: '我的 Widget',
  description: '自訂 Widget 描述',
  icon: LayoutGrid,
  configSchema: myWidgetConfigSchema,
  ConfigFields: MyWidgetConfigFields,
  Renderer: MyWidgetRenderer,
  locales: myWidgetLocales,  // 自包含式 i18n
};

export type { MyWidgetConfig };
```

## Registration

### 1. Update Registry

```typescript
// src/features/chart-plugins/registry.ts
import { MyWidgetPlugin } from './plugins/my-widget';

const plugins: ChartPlugin<BaseChartConfig>[] = [
  // ... existing plugins
  MyWidgetPlugin,
];
```

### 2. Update ChartType (if needed)

```typescript
// src/types/chart.ts
export type ChartType = 'line' | 'bar' | /* ... */ | 'my-widget';
```

## Testing Requirements

### data-testid Conventions

| Element | Pattern |
|---------|---------|
| Renderer root | `data-testid="<plugin-type>"` |
| Config form | `data-testid="<plugin-type>-config-form"` |
| Action buttons | `data-testid="<plugin-type>-<action>-button"` |
| Status indicators | `data-testid="<plugin-type>-<status>"` |

### E2E Test File

Create `e2e/<plugin-type>.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('My Widget Plugin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should add widget to dashboard', async ({ page }) => {
    // Test implementation
  });

  test('should configure widget', async ({ page }) => {
    // Test implementation
  });

  test('should render correctly', async ({ page }) => {
    // Test implementation
  });
});
```

## Best Practices

### Performance

- Use `useMemo` for expensive computations
- Use `useCallback` for event handlers passed to children
- Implement cleanup in `useEffect` to prevent memory leaks
- Consider virtualization for large data sets

### Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast

### Error Handling

- Wrap async operations in try-catch
- Provide user-friendly error messages
- Use Alert component for error states
- Log errors for debugging

### Styling

- Use Tailwind CSS classes
- Follow existing design patterns
- Support dark mode if applicable
- Use `cn()` utility for conditional classes

## Common Patterns

### Async Data Fetching

```typescript
const [data, setData] = useState<Data | null>(null);
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

useEffect(() => {
  let cancelled = false;

  async function fetchData() {
    setStatus('loading');
    try {
      const result = await apiCall();
      if (!cancelled) {
        setData(result);
        setStatus('success');
      }
    } catch (error) {
      if (!cancelled) {
        setStatus('error');
      }
    }
  }

  fetchData();
  return () => { cancelled = true; };
}, [dependency]);
```

### Widget References

For plugins that reference other widgets (like AI Comment):

```typescript
// In ConfigFields
interface ConfigFieldsProps {
  availableWidgets?: Array<{ id: string; title: string }>;
}

// Filter out self and same-type widgets
const filteredWidgets = availableWidgets?.filter(
  w => w.id !== currentWidgetId && w.type !== 'my-widget'
) || [];
```
