# Proposal: Add Chart Configuration

## Summary
實作圖表設定面板功能，讓使用者可以透過 UI 設定 Widget 的圖表類型、資料來源與欄位對應。

## Motivation
目前 Widget 只能透過 hardcoded chartConfig 顯示圖表，使用者無法透過 UI 進行設定。此功能讓使用者可以：
- 選擇圖表類型（Line、Bar）
- 選擇資料來源
- 設定 X/Y 軸對應欄位
- 即時預覽設定效果

## Scope

### In Scope
- 設定面板 UI（使用 Sheet 側邊欄）
- 圖表類型選擇器
- 資料來源選擇器（MVP 使用 Mock Data Sources）
- X/Y 軸欄位對應設定
- 即時圖表預覽
- 表單驗證（Zod）
- 儲存/取消功能

### Out of Scope
- 進階圖表設定（顏色、字型、動畫）
- 自訂 ECharts option
- 設定範本/預設值
- Pie Chart（Phase 2）
- 實際 API 資料來源整合（使用 Mock）

## Dependencies
- F02: Widget Layout（Widget 點擊事件）
- F03: Chart Rendering（圖表渲染元件）
- shadcn/ui: Sheet, Select, Button, Label, Checkbox

## Risks
- 資料來源 Mock 結構需與未來 F06 API 相容
- 表單狀態管理可能與 Zustand store 有交互

## Affected Specs
- `specs/features/spec.md`: 新增 Chart Configuration 相關需求
