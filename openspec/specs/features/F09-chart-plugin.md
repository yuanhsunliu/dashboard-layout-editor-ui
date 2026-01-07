# F09: Chart Plugin System

## Status
✅ **Completed** - Implemented 2026-01-07

## Overview
提供 Chart Plugin 架構，讓開發人員可以按照規範實作新的圖表類型，透過 build-time 註冊後供使用者在 Widget 中選用。

## User Stories
- 作為開發人員，我可以按照 Plugin Interface 規範實作新的圖表類型，以便擴展系統支援的圖表
- 作為開發人員，我可以將實作好的 Plugin 註冊至 Registry，重新 build 後使用者即可選用
- 作為使用者，我可以在 Widget 設定中看到所有已註冊的圖表類型

## Acceptance Criteria

### Plugin Interface
- [x] 定義 ChartPlugin Interface，包含 type、name、icon、configSchema、ConfigFields、Renderer

### Plugin Registry
- [x] 提供 chartRegistry 集中管理已註冊 Plugin
- [x] 支援 getAll() 取得所有 Plugin
- [x] 支援 getByType(type) 根據類型取得 Plugin

### 現有圖表重構
- [x] 將 Line Chart 重構為 Plugin 結構
- [x] 將 Bar Chart 重構為 Plugin 結構

### 動態整合
- [x] ChartTypeSelector 從 Registry 動態讀取圖表類型
- [x] ChartRenderer 根據 Plugin 動態渲染
- [x] ChartConfigPanel 根據 Plugin 動態顯示設定欄位

### 錯誤處理
- [x] ChartErrorBoundary 捕捉 Renderer 錯誤
- [x] 處理未知圖表類型錯誤

### 開發文件
- [x] 提供 PLUGIN_DEVELOPMENT.md 說明 Plugin 開發流程

### 額外完成
- [x] 新增 Area Chart Plugin（驗證 Plugin 架構可擴展性）

## UI/UX Spec

無額外 UI 變更，現有介面行為維持不變。

## Data Model

```typescript
interface BaseChartConfig {
  chartType: string;
  dataSourceId: string;
}

interface ChartRendererProps<TConfig extends BaseChartConfig> {
  config: TConfig;
  data?: DemoData;
}

interface ConfigFieldsProps<TConfig extends BaseChartConfig> {
  value: Partial<TConfig>;
  onChange: (value: Partial<TConfig>) => void;
  fields: DataSourceField[];
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

## Component Structure

```
src/features/chart-plugins/
├── index.ts                    # Public exports
├── types.ts                    # ChartPlugin interfaces
├── registry.ts                 # chartRegistry
├── PLUGIN_DEVELOPMENT.md       # 開發指南
├── components/
│   └── ChartErrorBoundary.tsx  # 錯誤邊界元件
└── plugins/
    ├── index.ts                # Re-export all plugins
    ├── line/
    │   ├── index.ts            # LineChartPlugin
    │   ├── schema.ts           # lineChartConfigSchema
    │   ├── LineChartRenderer.tsx
    │   └── ConfigFields.tsx
    ├── bar/
    │   ├── index.ts            # BarChartPlugin
    │   ├── schema.ts           # barChartConfigSchema
    │   ├── BarChartRenderer.tsx
    │   └── ConfigFields.tsx
    └── area/
        ├── index.ts            # AreaChartPlugin
        ├── schema.ts           # areaChartConfigSchema
        ├── AreaChartRenderer.tsx
        └── ConfigFields.tsx
```

## Dependencies
- F03: Chart Rendering（現有圖表渲染）
- F04: Chart Configuration（現有設定面板）

## Out of Scope
- Runtime 動態載入 Plugin
- Plugin 版本管理
- Plugin 啟用/停用機制
- 新增 Pie Chart（可作為後續驗證）
