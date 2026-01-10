# Tool Timeline Widget Spec

## Overview

機台狀態時間軸 Widget，用於顯示多台機台（Tool）在 24 小時內的運作狀態，並在右側顯示 OEE 指標。

## ADDED Requirements

### Requirement: 時間軸圖表渲染

Widget 應使用 ECharts 繪製機台狀態時間軸：

- X 軸為 24 小時時間軸，每格代表 1 小時
- 使用者可設定日期，預設當天
- Y 軸為機台（Tool）ID 列表，依資料順序排列
- 每個時間區間依據狀態值顯示對應顏色
- 無資料的時段顯示空白

#### Scenario: 正確渲染時間軸

**Given** 資料包含多台機台的狀態區間記錄  
**When** Widget 載入並渲染  
**Then** 應顯示每台機台的 24 小時狀態時間軸，顏色對應設定的狀態顏色

#### Scenario: 無資料時段顯示空白

**Given** 某台機台在 10:00-12:00 沒有狀態記錄  
**When** Widget 渲染完成  
**Then** 該時段應顯示空白（無色）

---

### Requirement: 狀態顏色可配置

使用者應可自訂狀態值與顏色的對應關係：

- 每個狀態包含：status（狀態值）、color（顏色）、label（顯示名稱）
- 提供預設值（running=綠, error=紅, idle=米色）
- 未指定顏色的狀態由 Plugin 自動分配預設顏色
- 支援新增、刪除、修改狀態顏色對應

#### Scenario: 使用預設狀態顏色

**Given** 使用者未設定狀態顏色對應  
**When** 資料中有 status='running' 的區間  
**Then** 該區間應顯示預設綠色

#### Scenario: 自動分配未知狀態顏色

**Given** 資料中有 status='maintenance' 但未設定對應顏色  
**When** Widget 渲染完成  
**Then** 該狀態應自動分配一個預設顏色

---

### Requirement: OEE 指標表格

Widget 右側應顯示每台機台的 OEE 指標：

- KPI 欄位可配置（如 A%、U%、OEE%）
- 每個 KPI 顯示欄位名稱和數值
- 支援百分比和數值格式
- 表格寬度依 KPI 欄位數量自動調整

#### Scenario: 顯示 OEE 指標

**Given** 設定了 KPI 欄位 [{ field: 'availability', label: 'A' }, { field: 'utilization', label: 'U' }]  
**When** Widget 渲染完成  
**Then** 右側應顯示每台機台的 A% 和 U% 數值

---

### Requirement: Tooltip 可配置

滑鼠 hover 在區間時應顯示 tooltip，使用者可設定顯示欄位和格式：

- 預設顯示：機台 ID、狀態、開始時間、結束時間、持續時間
- 使用者可設定顯示欄位
- 支援格式：text、time、duration、percent、number

#### Scenario: 顯示預設 Tooltip

**Given** 未設定 Tooltip 欄位  
**When** 滑鼠 hover 在 XCG10001 的 08:00-09:00 區間  
**Then** 應顯示 Tooltip 包含機台 ID、狀態、時間區間、持續時間

---

### Requirement: 圖例顯示

Widget 下方應顯示狀態顏色圖例：

- 顯示所有已設定的狀態顏色對應
- 固定於圖表下方

#### Scenario: 顯示圖例

**Given** 設定了 running、error、idle 三種狀態顏色  
**When** Widget 渲染完成  
**Then** 下方應顯示包含三種狀態的圖例

---

### Requirement: Cross-Widget 點擊互動

使用者點擊特定機台的時間區間時，應發送互動事件：

- 點擊區間觸發 `onInteraction` callback
- 事件包含完整資料：toolId、startTime、endTime、status 等
- 其他 Widget 可接收篩選條件

#### Scenario: 點擊區間發送互動事件

**Given** Dashboard 中有 Tool Timeline Widget 和 Event Table Widget  
**When** 使用者點擊 XCG10001 機台 08:00-09:00 的紅色區間  
**Then** 應發送 `ChartInteractionEvent`，payload 包含 `{ toolId: 'XCG10001', startTime: '08:00', endTime: '09:00', status: 'error', ... }`

---

## Data Model

### Config Schema

```typescript
interface ToolTimelineConfig {
  chartType: 'tool-timeline';
  title?: string;
  dataSourceId: string;
  
  // 日期設定
  date?: string;                   // ISO date，預設當天
  
  // 時間軸欄位對應
  toolIdField: string;             // 機台 ID 欄位
  startTimeField: string;          // 區間開始時間欄位
  endTimeField: string;            // 區間結束時間欄位
  statusField: string;             // 狀態欄位
  
  // 狀態顏色對應（可配置，含預設值）
  statusColors: Array<{
    status: string;                // 狀態值
    color: string;                 // 顏色（hex）
    label: string;                 // 顯示名稱
  }>;
  
  // OEE 指標欄位（可選）
  kpiFields?: Array<{
    field: string;                 // 資料欄位名
    label: string;                 // 顯示名稱
    format?: 'percent' | 'number';
  }>;
  
  // Tooltip 設定（可選）
  tooltip?: {
    enabled: boolean;
    fields: Array<{
      field: string;               // 資料欄位
      label: string;               // 顯示標籤
      format?: 'text' | 'time' | 'duration' | 'percent' | 'number';
    }>;
  };
}
```

### Default Status Colors

```typescript
const DEFAULT_STATUS_COLORS = [
  { status: 'running', color: '#4CAF50', label: '運作中' },
  { status: 'error', color: '#F44336', label: '異常' },
  { status: 'idle', color: '#D7CCC8', label: '閒置' },
];
```

### Data Format

```typescript
// 資料源格式（同一個資料源包含 timeline 和 KPI）
interface ToolTimelineData {
  toolId: string;
  startTime: string;               // ISO 8601
  endTime: string;
  status: string;
  // KPI 欄位
  availability?: number;
  utilization?: number;
  [key: string]: unknown;
}
```

## UI Layout

```
┌────────────────────────────────────────────────────┬──────────────┐
│                    ECharts 時間軸                   │   KPI 表格   │
│                                                    │              │
│ XCG10007 ██████░░░████████████████████████████░░░  │ A:85%  U:92% │
│ XCG10006 ████████████░░░░████████████████████████  │ A:91%  U:88% │
│ XCG10005 ░░░░████████████████████░░░░░░░░████████  │ A:78%  U:95% │
│ XCG10004 ████████████████████████████████████████  │ A:82%  U:90% │
│                                                    │              │
│       00:00      08:00      16:00      24:00       │              │
├────────────────────────────────────────────────────┴──────────────┤
│  ● 運作中   ● 異常   ● 閒置                        （圖例）        │
└───────────────────────────────────────────────────────────────────┘
```

## Testing

### data-testid 規範

| 元素 | data-testid |
|------|-------------|
| Widget 容器 | `tool-timeline` |
| 設定表單 | `tool-timeline-config-form` |
| 時間軸圖表 | `tool-timeline-chart` |
| KPI 表格 | `tool-timeline-kpi-table` |
| 圖例 | `tool-timeline-legend` |

### E2E 測試案例

1. 新增 Tool Timeline Widget
2. 設定日期
3. 設定狀態顏色對應
4. 驗證時間軸正確渲染
5. 驗證 Tooltip 顯示
6. 點擊區間驗證互動事件
