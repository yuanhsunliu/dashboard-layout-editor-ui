# Proposal: Add Chart Plugin System

## Summary
建立 Chart Plugin 架構，讓開發人員可以按照規範實作新的圖表類型，透過 build-time 註冊後供使用者在 Widget 中選用。

## Motivation
目前圖表類型（Line、Bar）是硬編碼在系統中，新增圖表類型需要修改多處程式碼：
- ChartTypeSelector 選項
- ChartRenderer switch/case
- ChartConfigPanel 欄位邏輯
- Zod Schema 定義

這造成：
- 擴展困難，容易遺漏
- 程式碼耦合度高
- 不利於團隊協作開發

## Scope

### In Scope
- 定義 ChartPlugin Interface
- 建立 Chart Registry 機制
- 重構現有 Line/Bar Chart 為 Plugin 結構
- ChartTypeSelector 從 Registry 動態讀取
- ChartRenderer 根據 Plugin 動態渲染
- ChartConfigPanel 根據 Plugin 動態顯示設定欄位
- 撰寫 Plugin 開發文件

### Out of Scope
- Runtime 動態載入（採用 build-time 註冊）
- Plugin 版本管理
- Plugin 啟用/停用機制
- 新增 Pie Chart（可作為後續驗證）

## Design

### ChartPlugin Interface

```typescript
interface BaseChartConfig {
  chartType: string;
  dataSourceId: string;
}

interface ChartRendererProps<TConfig> {
  config: TConfig;
  data: DataRecord[];
  width?: number;
  height?: number;
}

interface ConfigFieldsProps<TConfig> {
  value: Partial<TConfig>;
  onChange: (value: Partial<TConfig>) => void;
  fields: FieldDefinition[];
  errors?: Record<string, string>;
}

interface ChartPlugin<TConfig extends BaseChartConfig = BaseChartConfig> {
  // Meta
  type: string;
  name: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  
  // Config
  configSchema: z.ZodSchema<TConfig>;
  ConfigFields: React.ComponentType<ConfigFieldsProps<TConfig>>;
  
  // Rendering
  Renderer: React.ComponentType<ChartRendererProps<TConfig>>;
}
```

### Registry

```typescript
// src/features/chart-plugins/registry.ts
import { LineChartPlugin } from './plugins/line';
import { BarChartPlugin } from './plugins/bar';

const plugins = [LineChartPlugin, BarChartPlugin];

export const chartRegistry = {
  getAll: () => plugins,
  getByType: (type: string) => plugins.find(p => p.type === type),
  getTypes: () => plugins.map(p => p.type),
};
```

### 目錄結構

```
src/features/chart-plugins/
├── types.ts                 # ChartPlugin Interface
├── registry.ts              # Plugin 註冊中心
├── plugins/
│   ├── line/
│   │   ├── index.ts         # LineChartPlugin export
│   │   ├── schema.ts        # Zod schema
│   │   ├── LineChart.tsx    # Renderer
│   │   └── ConfigFields.tsx # 設定欄位 UI
│   └── bar/
│       ├── index.ts
│       ├── schema.ts
│       ├── BarChart.tsx
│       └── ConfigFields.tsx
└── docs/
    └── PLUGIN_DEVELOPMENT.md  # 開發指南
```

## Dependencies
- F03: Chart Rendering（現有圖表渲染）
- F04: Chart Configuration（現有設定面板）

## Risks
- 重構範圍較大，需確保現有功能不受影響
- Plugin Interface 設計需考慮未來擴展性

## Affected Specs
- features/F03-chart-rendering.md
- features/F04-chart-config.md
- 新增 features/F09-chart-plugin.md

## Migration
1. 建立 Plugin 架構與 Interface
2. 將現有 Line/Bar Chart 重構為 Plugin
3. 修改 ChartTypeSelector、ChartRenderer、ChartConfigPanel 使用 Registry
4. 驗證所有現有 E2E 測試通過
5. 撰寫 Plugin 開發文件
