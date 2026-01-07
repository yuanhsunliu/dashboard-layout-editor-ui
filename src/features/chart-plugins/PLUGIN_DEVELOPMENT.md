# Chart Plugin Development Guide

本文件說明如何為 Dashboard Layout Editor 建立新的圖表插件。

## 概述

Chart Plugin 系統允許開發人員透過實作 `ChartPlugin` Interface 來新增圖表類型，無需修改核心程式碼。

## 目錄結構

```
src/features/chart-plugins/
├── types.ts                    # ChartPlugin Interface 定義
├── registry.ts                 # Plugin 註冊中心
├── index.ts                    # Public exports
├── components/
│   └── ChartErrorBoundary.tsx  # 錯誤邊界元件
└── plugins/
    ├── index.ts                # 所有 plugins 的 re-export
    ├── line/                   # Line Chart Plugin
    │   ├── index.ts
    │   ├── schema.ts
    │   ├── LineChartRenderer.tsx
    │   └── ConfigFields.tsx
    └── bar/                    # Bar Chart Plugin
        ├── index.ts
        ├── schema.ts
        ├── BarChartRenderer.tsx
        └── ConfigFields.tsx
```

## ChartPlugin Interface

```typescript
interface ChartPlugin<TConfig extends BaseChartConfig = BaseChartConfig> {
  // 識別資訊
  type: string;                    // 唯一識別碼（如 'line', 'bar', 'pie'）
  name: string;                    // 顯示名稱（如 '折線圖'）
  description?: string;            // 說明文字
  icon: ComponentType<{ className?: string }>;  // 圖示元件

  // 設定相關
  configSchema: z.ZodSchema<TConfig>;           // Zod 驗證 Schema
  ConfigFields: ComponentType<ConfigFieldsProps<TConfig>>;  // 設定欄位 UI

  // 渲染
  Renderer: ComponentType<ChartRendererProps<TConfig>>;     // 圖表渲染元件
}

interface BaseChartConfig {
  chartType: string;
  dataSourceId: string;
}
```

## 建立新 Plugin 步驟

### 1. 建立 Plugin 目錄

```bash
mkdir -p src/features/chart-plugins/plugins/pie
```

### 2. 定義 Config Schema

```typescript
// src/features/chart-plugins/plugins/pie/schema.ts
import { z } from 'zod';

export const pieChartConfigSchema = z.object({
  chartType: z.literal('pie'),
  title: z.string().max(50).optional().default(''),
  dataSourceId: z.string().min(1, '請選擇資料來源'),
  labelField: z.string().min(1, '請選擇標籤欄位'),
  valueField: z.string().min(1, '請選擇數值欄位'),
  showLegend: z.boolean().optional().default(true),
});

export type PieChartConfig = z.infer<typeof pieChartConfigSchema>;
```

### 3. 建立 Renderer 元件

```typescript
// src/features/chart-plugins/plugins/pie/PieChartRenderer.tsx
import ReactECharts from 'echarts-for-react';
import type { ChartRendererProps } from '../../types';
import type { PieChartConfig } from './schema';

export function PieChartRenderer({ config, data }: ChartRendererProps<PieChartConfig>) {
  // 實作圖表渲染邏輯
  const option = {
    title: config.title ? { text: config.title } : undefined,
    series: [{
      type: 'pie',
      data: data?.series.map(s => ({ name: s.name, value: s.data[0] })) || [],
    }],
  };

  return (
    <div className="w-full h-full" data-testid="pie-chart">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
```

### 4. 建立 ConfigFields 元件

```typescript
// src/features/chart-plugins/plugins/pie/ConfigFields.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { ConfigFieldsProps } from '../../types';
import type { PieChartConfig } from './schema';

export function PieChartConfigFields({
  value,
  onChange,
  fields,
  errors,
}: ConfigFieldsProps<PieChartConfig>) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>標籤欄位</Label>
        <Select 
          value={value.labelField || ''} 
          onValueChange={(v) => onChange({ ...value, labelField: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇標籤欄位..." />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.name} value={field.name}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.labelField && <p className="text-sm text-destructive">{errors.labelField}</p>}
      </div>

      <div className="space-y-2">
        <Label>數值欄位</Label>
        <Select 
          value={value.valueField || ''} 
          onValueChange={(v) => onChange({ ...value, valueField: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇數值欄位..." />
          </SelectTrigger>
          <SelectContent>
            {fields.filter(f => f.type === 'number').map((field) => (
              <SelectItem key={field.name} value={field.name}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.valueField && <p className="text-sm text-destructive">{errors.valueField}</p>}
      </div>
    </div>
  );
}
```

### 5. 建立 Plugin Export

```typescript
// src/features/chart-plugins/plugins/pie/index.ts
import { PieChart } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { pieChartConfigSchema, type PieChartConfig } from './schema';
import { PieChartRenderer } from './PieChartRenderer';
import { PieChartConfigFields } from './ConfigFields';

export const PieChartPlugin: ChartPlugin<PieChartConfig> = {
  type: 'pie',
  name: '圓餅圖',
  description: '用於顯示比例分佈的圖表',
  icon: PieChart,
  configSchema: pieChartConfigSchema,
  ConfigFields: PieChartConfigFields,
  Renderer: PieChartRenderer,
};
```

### 6. 註冊至 Registry

```typescript
// src/features/chart-plugins/plugins/index.ts
export { LineChartPlugin } from './line';
export { BarChartPlugin } from './bar';
export { PieChartPlugin } from './pie';  // 新增
```

```typescript
// src/features/chart-plugins/registry.ts
import { LineChartPlugin } from './plugins/line';
import { BarChartPlugin } from './plugins/bar';
import { PieChartPlugin } from './plugins/pie';  // 新增

const plugins = [
  LineChartPlugin,
  BarChartPlugin,
  PieChartPlugin,  // 新增
];
```

### 7. 更新 ChartType 類型（如需要）

```typescript
// src/types/chart.ts
export type ChartType = 'line' | 'bar' | 'pie';  // 新增 'pie'
```

## 測試新 Plugin

1. 重新 build 專案：`pnpm build`
2. 執行 E2E 測試：`pnpm exec playwright test`
3. 手動測試新圖表類型

## 注意事項

- **型別安全**：確保 `configSchema` 的型別與 `TConfig` 一致
- **Error Boundary**：Renderer 的錯誤會被 `ChartErrorBoundary` 捕捉
- **data-testid**：建議在 Renderer 根元素加入 `data-testid` 以便測試
- **響應式**：使用 ResizeObserver 處理容器尺寸變化
