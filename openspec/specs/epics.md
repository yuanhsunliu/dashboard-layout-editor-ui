# Epic Planning

本文件定義專案的 Spec-Driven Development 結構與開發順序。

## Spec 結構

```
openspec/specs/
├── epics.md                    # 本文件 - Epic 總覽與開發順序
├── features/                   # 功能規格（使用者視角）
│   ├── F01-dashboard-crud.md
│   ├── F02-widget-layout.md
│   ├── F03-chart-rendering.md
│   ├── F04-chart-config.md
│   ├── F05-theme.md
│   ├── F06-data-source.md
│   ├── F07-persistence.md
│   ├── F08-i18n.md
│   ├── F09-chart-plugin.md
│   └── F10-embed-widget.md
└── technical/                  # 技術規格（非功能需求）
    └── T01-project-setup.md
```

---

## Feature Spec 總覽

| Feature | 名稱 | 描述 | 優先順序 | 狀態 |
|---------|------|------|----------|------|
| **F01** | Dashboard CRUD | Dashboard 建立、編輯、刪除、列表 | P0 | ✅ 完成 |
| **F02** | Widget Layout | Widget 拖放佈局、調整大小 | P0 | ✅ 完成 |
| **F03** | Chart Rendering | ECharts 圖表渲染、基本圖表類型 | P0 | ✅ 完成 |
| **F04** | Chart Configuration | 圖表設定面板、動態表單 | P0 | ✅ 完成 |
| **F05** | Theme System | Light/Dark 主題切換 | P1 | 待開發 |
| **F06** | Data Source | 資料源整合與管理 | P1 | 待開發 |
| **F07** | Persistence | Dashboard 儲存與載入 | P1 | ✅ 完成 |
| **F08** | i18n | 多語系支援 (zh-TW / en) | P2 | 待開發 |
| **F09** | Chart Plugin System | 圖表插件架構，支援擴展新圖表類型 | P1 | ✅ 完成 |
| **F10** | Embed Widget | 嵌入外部報表 URL 至 Dashboard | P1 | ✅ 完成 |

## Technical Spec 總覽

| Technical | 名稱 | 描述 | 優先順序 |
|-----------|------|------|----------|
| **T01** | Project Setup | 專案初始化、開發環境、基礎架構 | P0 |

---

## 開發順序

```
T01 → F01 → F02 → F03 → F04 → F07 → F09 → F10 → F06 → F05 → F08
      └─────────────┬─────────────┘      └──┬──┘
               MVP 核心功能              已完成
```

### 順序說明
1. **T01**: 技術基礎設施必須先完成 ✅
2. **F01-F04**: MVP 核心功能，使用者可建立 Dashboard 並設定圖表 ✅
3. **F07**: 儲存功能讓 MVP 完整可用 ✅
4. **F09**: Chart Plugin 架構重構，為擴展圖表類型鋪路 ✅
5. **F10**: Embed Widget，嵌入外部報表（基於 Plugin 架構）✅
6. **F06**: 資料源整合（可先用 Mock 資料）
7. **F05**: 主題系統（錦上添花）
8. **F08**: 多語系（最後處理）

---

## MVP 定義

**MVP 包含**: T01 + F01 ~ F04 + F07

### MVP 完成後使用者可以：
1. ✅ 建立 / 刪除 / 重新命名 Dashboard
2. ✅ 在 Dashboard 中新增 Widget
3. ✅ 拖放調整 Widget 位置與大小
4. ✅ 設定 Widget 顯示的圖表（Line / Bar Chart）
5. ✅ 儲存 Dashboard 配置

### MVP 不包含：
- ❌ 主題切換
- ❌ 外部資料源整合（使用 Mock 資料）
- ❌ 多語系

---

## Feature Spec 模板

每個 Feature Spec 應包含以下區塊：

```markdown
# F0X: Feature Name

## Overview
簡述功能目的與範圍

## User Stories
- 作為 [角色]，我可以 [行為]，以便 [目的]

## Acceptance Criteria
- [ ] 驗收條件 1
- [ ] 驗收條件 2

## UI/UX Spec
- 頁面/元件描述
- 互動行為

## Data Model
相關資料結構定義

## API Contract
相關 API 規格（如適用）

## Dependencies
- 相依的其他 Feature/Technical Spec

## Out of Scope
明確排除的功能
```

---

## 圖表類型擴展策略

F03 (Chart Rendering) 搭配 **F09 (Chart Plugin System)** 採用漸進式設計：

| 階段 | 圖表類型 | 優先順序 |
|------|----------|----------|
| MVP | Line Chart, Bar Chart | P0 |
| Phase 2 | Pie Chart, Area Chart | P1 |
| Phase 3 | Scatter, Gauge, 其他 | P2 |

透過 Plugin System 新增圖表類型：
1. 實作 `ChartPlugin` Interface
2. 註冊至 `chartRegistry`
3. 重新 Build 即可使用

---

## 擴展計畫

MVP 完成後可按優先順序擴展：

### Phase 2 (P1)
- ~~Chart Plugin System (F09)~~ ✅ 已完成
- 更多圖表類型 (Pie, Area) - 透過 Plugin 新增（Area 已完成）
- 主題系統 (F05)
- 外部資料源整合 (F06)

### Phase 3 (P2)
- 多語系 (F08)
- 進階圖表類型
- Dashboard 複製
- Widget 複製
- 匯出 Dashboard 為 JSON
