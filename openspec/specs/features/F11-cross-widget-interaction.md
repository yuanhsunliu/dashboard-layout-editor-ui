# F11: Cross-Widget Interaction

## Status
- [x] Completed

## Status History
| Date | Status | Notes |
|------|--------|-------|
| 2026-01-09 | ✅ Completed | Implemented and tested, archived as 2026-01-09-add-cross-widget-interaction |
| 2026-01-09 | 🔄 In Progress | Implementation started |
| 2026-01-09 | 📝 Planned | Initial spec created |

## Overview

提供 Dashboard 內 Widget 之間的連動互動功能，讓使用者可以透過點擊操作，連動影響其他圖表的顯示內容，實現「故事性」的資料探索體驗。採用欄位驅動機制，共用相同資料欄位的 Widget 自動連動，無需手動設定。

## User Stories

- 作為 Dashboard 使用者，我可以點擊一張圖表的資料點，讓其他相關圖表自動高亮對應資料，以便快速探索資料關聯
- 作為 Dashboard 使用者，我可以從總覽圖表逐層下鑽到細節圖表，形成連鎖探索路徑
- 作為 Dashboard 使用者，我可以看到目前套用的篩選條件，並一鍵清除
- 作為 Dashboard 使用者，我可以再次點擊已選取的資料來取消篩選（Toggle）

## Acceptance Criteria

- [x] 點擊圖表資料點可觸發其他 Widget 連動
- [x] 連動機制依據共用欄位自動判斷，無需手動設定
- [x] 支援連鎖下鑽，篩選條件可累加
- [x] 支援 Toggle，再次點擊已選值會取消
- [x] 連動時預設使用高亮顯示（非過濾），淡化不符合的資料
- [x] 無符合資料時全部淡化顯示
- [x] Dashboard 頂部顯示浮動篩選列（有篩選時才出現）
- [x] Widget 顯示目前套用的篩選標籤（多值顯示數量）
- [x] 可單獨清除或一鍵清除所有篩選
- [x] 來源 Widget 也受篩選影響（與其他 Widget 一致）
- [x] Embed Widget 不參與連動
- [x] 未設定的 Widget 不參與連動

## UI/UX Spec

### 篩選列 (Filter Bar)
- 位置：浮動在 Dashboard 頂部，sticky 固定
- 顯示時機：有任何篩選條件時才出現
- 內容：篩選標籤列表 + 「清除全部」按鈕
- 標籤格式：`欄位 = 值` 或 `欄位 = 值1, 值2`

### Widget 篩選標籤 (Filter Badge)
- 位置：Widget 右上角
- 顯示時機：Widget 受到篩選條件影響時
- 內容：單一值顯示值本身，多值顯示 `值1, 值2` 或 `+N`

### 高亮/淡化效果
- 符合條件：opacity 1.0（正常顯示）
- 不符合條件：opacity 0.2（淡化顯示）
- 無符合資料：全部淡化

## Data Model

```typescript
interface DashboardFilter {
  id: string;
  field: string;
  operator: 'eq' | 'in' | 'range';
  value: string | string[] | [number, number];
  sourceWidgetId: string;
  timestamp: number;
}

interface ChartInteractionEvent {
  type: 'click' | 'brush' | 'drilldown';
  field: string;
  value: string | string[] | [number, number];
}
```

## Component Structure

```
src/
├── stores/
│   └── useDashboardFilterStore.ts     # 篩選狀態管理
├── components/
│   └── dashboard/
│       ├── DashboardFilterBar.tsx     # 浮動篩選列
│       ├── FilterTag.tsx              # 單一篩選標籤
│       └── WidgetFilterBadge.tsx      # Widget 角落標籤
├── features/
│   └── chart-plugins/
│       ├── types.ts                   # 擴展 ChartRendererProps
│       └── utils/
│           └── filterUtils.ts         # 篩選工具函數
```

## Dependencies

- **Depends on**: F03 (Chart Rendering), F09 (Chart Plugin System)
- **Extends**: ChartPlugin interface, ChartRendererProps

## Out of Scope

- 框選 (Brush) 互動（Phase 2）
- 連動群組設定（全 Dashboard 連動）
- 後端篩選 API 呼叫（前端處理）
- 篩選條件持久化儲存
- URL Query String 同步
- Embed Widget 連動
