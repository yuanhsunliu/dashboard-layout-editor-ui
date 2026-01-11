## MODIFIED Requirements

### Requirement: F05 Chart Plugin System
系統 **MUST** 提供 Plugin 機制讓開發人員擴展圖表類型。

**Plugin Interface 定義**:
每個 Plugin **MUST** 實作 `ChartPlugin` 介面，包含以下必要屬性：
- `type`: Plugin 唯一識別碼
- `name`: 顯示名稱
- `icon`: 圖示元件
- `configSchema`: Zod schema 用於驗證設定
- `ConfigFields`: 設定表單元件
- `Renderer`: 圖表渲染元件
- `configBehavior`: UI 行為描述（**新增**）

**configBehavior 結構**:
每個 Plugin **MUST** 定義 `configBehavior` 屬性，描述其在設定面板中的 UI 行為：

靜態設定：
- `requiresDataSource`: boolean - 是否需要 DataSource 選擇器
- `showTitleInput`: boolean - 是否在設定面板顯示 Title 輸入框
- `previewHeight`: 'sm' | 'md' | 'lg' - 預覽區域高度

方法：
- `getInitialPluginConfig()`: 回傳 DataSource 變更時的初始 pluginConfig 值
- `isPreviewReady(params)`: 判斷預覽區是否可顯示，參數包含 `pluginConfig` 和 `dataSource`

**設定面板整合**:
`ChartConfigPanel` **MUST** 根據 Plugin 的 `configBehavior` 動態決定 UI 顯示，**MUST NOT** hardcode 特定 chart type 判斷邏輯。

**Plugin 開發流程**:
1. 實作 `ChartPlugin` Interface（包含 `configBehavior`）
2. 註冊至 Registry
3. 重新 Build

#### Scenario: Plugin 定義 configBehavior
- **GIVEN** 開發者建立新的 chart plugin
- **WHEN** 定義 plugin 時
- **THEN** 必須包含 `configBehavior` 屬性描述 UI 需求

#### Scenario: ChartConfigPanel 根據 configBehavior 顯示 UI
- **GIVEN** 使用者開啟 Widget 設定面板
- **WHEN** 選擇不同的 chart type
- **THEN** 面板根據該 plugin 的 `configBehavior.requiresDataSource` 決定是否顯示 DataSource 選擇器
- **AND** 根據 `configBehavior.showTitleInput` 決定是否顯示 Title 輸入框
- **AND** 根據 `configBehavior.previewHeight` 決定預覽區域高度

#### Scenario: DataSource 變更時重置 pluginConfig
- **GIVEN** 使用者在設定面板中選擇了 DataSource
- **WHEN** 使用者變更 DataSource 選擇
- **THEN** 系統呼叫該 plugin 的 `configBehavior.getInitialPluginConfig()` 取得初始值
- **AND** 將 pluginConfig 重置為該初始值

#### Scenario: ChartPreview 根據 isPreviewReady 顯示預覽
- **GIVEN** 使用者在設定面板中設定圖表
- **WHEN** pluginConfig 或 dataSource 變更
- **THEN** 系統呼叫該 plugin 的 `configBehavior.isPreviewReady()` 判斷是否可預覽
- **AND** 若回傳 true 則顯示圖表預覽
- **AND** 若回傳 false 則顯示「請完成所有設定以預覽圖表」提示

#### Scenario: 新增 Plugin 無需修改 ChartConfigPanel
- **GIVEN** 開發者新增一個符合 `ChartPlugin` 介面的 plugin
- **WHEN** 將 plugin 註冊至 Registry
- **THEN** ChartConfigPanel 自動支援該 plugin 的設定流程
- **AND** 開發者無需修改 `ChartConfigPanel.tsx` 或 `ChartPreview.tsx`
