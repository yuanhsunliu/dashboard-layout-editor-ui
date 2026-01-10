# tool-timeline Specification

## Purpose
TBD - created by archiving change 2026-01-10-add-tool-timeline-widget. Update Purpose after archive.
## Requirements
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

