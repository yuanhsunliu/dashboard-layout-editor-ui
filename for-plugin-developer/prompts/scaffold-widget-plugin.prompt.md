---
description: Scaffold a new widget plugin for Dashboard Layout Editor.
---

$ARGUMENTS

## Widget Plugin Scaffolding Prompt

**Goal**: Create a new widget plugin following the platform's plugin architecture standards.

**Platform Constraints** (from `openspec/project.md`):
- **MUST** use shadcn/ui for UI components - DO NOT create custom UI components
- **MUST** use ECharts (echarts-for-react) for charts - DO NOT use Chart.js, Recharts, etc.
- **MUST** use Zod for validation schemas
- **MUST** support i18n (zh-TW and en) using react-i18next
- **MUST** use Toast (sonner) for error notifications

**Before Starting**:
1. Review `src/features/chart-plugins/PLUGIN_DEVELOPMENT.md` for the complete development guide
2. Check existing plugins in `src/features/chart-plugins/plugins/` for reference patterns
3. Understand the `ChartPlugin` interface in `src/features/chart-plugins/types.ts`
4. Review `openspec/project.md` for platform constraints

**Required Information**:
- Plugin type (kebab-case identifier, e.g., `gauge-chart`)
- Display name (中文 or English, e.g., `儀表圖`)
- Description (brief explanation of the widget's purpose)
- Configuration fields (what settings does the user need to configure?)
- Data requirements (does it need a data source? what fields?)
- Rendering logic (how should the widget display data?)

**Steps**:

1. **Create plugin directory**:
   ```bash
   mkdir -p src/features/chart-plugins/plugins/<plugin-type>
   ```

2. **Create schema.ts** with Zod validation:
   - Define `chartType` as `z.literal('<plugin-type>')`
   - Add all configuration fields with proper validation
   - Include error messages in Chinese
   - Export the inferred type

3. **Create <Name>Renderer.tsx**:
   - Accept `ChartRendererProps<TConfig>`
   - Add `data-testid="<plugin-type>"` to root element
   - Handle loading, error, empty, and success states
   - Use `w-full h-full` for responsive sizing

4. **Create ConfigFields.tsx**:
   - Accept `ConfigFieldsProps<TConfig>`
   - Add `data-testid="<plugin-type>-config-form"` to root element
   - Use shadcn/ui components (Select, Input, Label, Switch, etc.)
   - Display validation errors
   - Handle empty states properly (no `SelectItem value=""`)

5. **Create index.ts**:
   - Import icon from `lucide-react`
   - Export `<Name>Plugin` implementing `ChartPlugin` interface
   - Export config type

6. **Register the plugin**:
   - Add import and entry in `src/features/chart-plugins/registry.ts`
   - Add type to `ChartType` union in `src/types/chart.ts`

7. **Add i18n translations** (自包含式，不修改平台檔案):
   - Create `locales.ts` in plugin directory with `PluginLocales` type
   - Include both `zh-TW` and `en` translations
   - Add `locales` property to plugin export in `index.ts`
   - Use `useTranslation('<plugin-type>')` in components (plugin type as namespace)

8. **Create E2E test**:
   - Create `e2e/<plugin-type>.spec.ts`
   - Test adding, configuring, and rendering the widget

**Validation Checklist**:
- [ ] All files follow naming conventions
- [ ] Schema uses proper Zod validators with Chinese error messages
- [ ] Renderer has `data-testid` attribute
- [ ] Renderer uses ECharts (if chart type) via echarts-for-react
- [ ] ConfigFields uses only shadcn/ui components
- [ ] ConfigFields handles empty select states correctly (no `SelectItem value=""`)
- [ ] Plugin is registered in registry.ts
- [ ] ChartType is updated in chart.ts
- [ ] `locales.ts` created with zh-TW and en translations
- [ ] Plugin exports include `locales` property
- [ ] Components use `useTranslation('<plugin-type>')` for i18n
- [ ] Toast notifications for errors (using sonner)
- [ ] E2E tests pass

**Reference Files**:
- Simple plugin: `src/features/chart-plugins/plugins/kpi-card/`
- Complex plugin: `src/features/chart-plugins/plugins/ai-comment/`
- Types (with PluginLocales): `src/features/chart-plugins/types.ts`
- Registry: `src/features/chart-plugins/registry.ts`
