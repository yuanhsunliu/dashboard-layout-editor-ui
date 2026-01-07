# Design: Chart Plugin System

## Context
Dashboard 需要支援多種圖表類型，且希望讓其他開發人員可以按照規範擴展新的圖表類型，而不需要修改核心程式碼。

## Goals
- 建立清晰的 Plugin Interface，讓開發人員知道需要實作什麼
- 最小化新增圖表類型所需的步驟
- 保持型別安全（TypeScript）
- 維持現有功能不變

## Non-Goals
- Runtime 動態載入 Plugin
- Plugin 熱更新
- Plugin 市集或下載機制

## Decisions

### 1. Build-time 註冊 vs Runtime 載入

**決定**: Build-time 註冊

**理由**:
- 更安全，所有 Plugin 都經過 build 驗證
- TypeScript 型別檢查完整
- Bundle 優化（tree-shaking）
- 較簡單，符合 MVP 原則

**Trade-off**: 新增 Plugin 需要重新 build 與部署

### 2. Plugin 結構設計

**決定**: 單一 Plugin Object Export

```typescript
export const PieChartPlugin: ChartPlugin<PieChartConfig> = {
  type: 'pie',
  name: '圓餅圖',
  icon: PieChartIcon,
  configSchema: pieChartSchema,
  ConfigFields: PieChartConfigFields,
  Renderer: PieChartRenderer,
};
```

**理由**:
- 所有相關內容集中管理
- 容易理解和維護
- 註冊時只需 import 一個物件

### 3. 欄位對應動態化

**決定**: 由 ConfigFields 元件完全處理欄位 UI

**理由**:
- MVP 簡化 - 減少 Interface 複雜度
- 彈性更高 - 每個 Plugin 完全控制自己的 ConfigFields UI
- 避免重複 - 不需要維護兩份欄位定義
- 驗證已有 Zod - configSchema 已處理驗證邏輯

### 4. Schema 驗證

**決定**: 每個 Plugin 提供自己的 Zod Schema

**理由**:
- 不同圖表有不同設定欄位
- Zod 提供 runtime 驗證與 TypeScript 型別推導
- 與現有 F04 實作一致

### 5. Error Boundary

**決定**: 使用 React Error Boundary 處理 Renderer 錯誤

**理由**:
- 防止整頁崩潰 - 一個 Widget 錯誤不應影響整個 Dashboard
- 標準做法 - React Error Boundary 實作成本低
- 使用者體驗 - 明確告知「這個圖表有問題」

## Component Integration

### ChartTypeSelector
```typescript
// Before: 硬編碼選項
const chartTypes = [{ type: 'line', name: '折線圖' }, ...]

// After: 從 Registry 取得
const chartTypes = chartRegistry.getAll().map(p => ({
  type: p.type,
  name: p.name,
  icon: p.icon,
}));
```

### ChartRenderer
```typescript
// Before: switch/case
switch (config.chartType) {
  case 'line': return <LineChart {...} />;
  case 'bar': return <BarChart {...} />;
}

// After: 從 Registry 取得 Renderer，包裹 Error Boundary
const plugin = chartRegistry.getByType(config.chartType);
if (!plugin) return <ChartError message="Unknown chart type" />;
return (
  <ChartErrorBoundary>
    <plugin.Renderer config={config} data={data} />
  </ChartErrorBoundary>
);
```

### ChartConfigPanel
```typescript
// Before: 硬編碼欄位判斷
{chartType === 'line' && <LineChartFields />}
{chartType === 'bar' && <BarChartFields />}

// After: 動態載入 ConfigFields
const plugin = chartRegistry.getByType(chartType);
return <plugin.ConfigFields {...} />;
```

## File Structure

```
src/features/chart-plugins/
├── index.ts                    # Public exports
├── types.ts                    # ChartPlugin, FieldRequirement interfaces
├── registry.ts                 # chartRegistry
├── plugins/
│   ├── index.ts                # Re-export all plugins
│   ├── line/
│   │   ├── index.ts            # LineChartPlugin
│   │   ├── schema.ts           # lineChartSchema
│   │   ├── LineChart.tsx       # Renderer component
│   │   ├── ConfigFields.tsx    # Config form fields
│   │   └── icon.tsx            # Chart icon (optional)
│   └── bar/
│       └── ...
└── components/
    ├── PluginRenderer.tsx      # Generic renderer wrapper
    └── PluginConfigFields.tsx  # Generic config fields wrapper
```

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| 重構破壞現有功能 | 保留現有 E2E 測試，重構後全部通過才算完成 |
| Plugin Interface 設計不足 | 先重構 Line/Bar，驗證 Interface 足夠後再開放 |
| 開發人員不知如何實作 | 撰寫詳細的 PLUGIN_DEVELOPMENT.md 文件 |

## Open Questions
1. ~~是否需要 Plugin 版本號？~~ → 不需要（build-time 整合）
2. 是否需要 Plugin 預覽圖？ → 可選，Phase 2 考慮
