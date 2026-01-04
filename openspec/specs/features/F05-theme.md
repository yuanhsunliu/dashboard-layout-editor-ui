# F05: Theme System

## Overview
使用者可以切換 Dashboard 的主題（Light / Dark），影響整體 UI 與 ECharts 圖表樣式。

## User Stories
- 作為使用者，我可以切換 Light/Dark 主題，以便在不同環境下舒適使用
- 作為使用者，主題偏好會被記住，下次開啟時自動套用

## Acceptance Criteria

### 主題切換
- [ ] 在 Header 提供主題切換按鈕/開關
- [ ] 支援 Light 和 Dark 兩種主題
- [ ] 切換時整體 UI 立即更新

### UI 主題
- [ ] 使用 Tailwind CSS dark mode
- [ ] shadcn/ui 元件自動適應主題
- [ ] 背景色、文字色、邊框色正確切換

### ECharts 主題
- [ ] 圖表配色隨主題切換
- [ ] Light: 淺色背景、深色文字
- [ ] Dark: 深色背景、淺色文字

### 主題持久化
- [ ] 主題偏好儲存在 localStorage
- [ ] 頁面載入時讀取並套用偏好
- [ ] 預設跟隨系統偏好 (prefers-color-scheme)

## UI/UX Spec

### 主題切換按鈕
```
Header:
┌─────────────────────────────────────────┐
│  ← 返回    Dashboard 名稱    [☀️/🌙]   │
└─────────────────────────────────────────┘
```

- 使用 Toggle 按鈕或 Icon Button
- Light: 顯示太陽 ☀️
- Dark: 顯示月亮 🌙

### Light Theme
- 背景: `bg-white` / `bg-gray-50`
- 文字: `text-gray-900`
- 卡片: `bg-white border-gray-200`

### Dark Theme
- 背景: `bg-gray-900` / `bg-gray-950`
- 文字: `text-gray-100`
- 卡片: `bg-gray-800 border-gray-700`

## ECharts Theme Integration

```typescript
// 定義 ECharts 主題
const lightTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#374151' },
  // ... 其他配置
};

const darkTheme = {
  backgroundColor: 'transparent',
  textStyle: { color: '#f3f4f6' },
  // ... 其他配置
};

// 使用
<ReactECharts
  option={chartOption}
  theme={isDark ? 'dark' : 'light'}
/>
```

## State Management

```typescript
// stores/useThemeStore.ts
interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}
```

## Implementation

```typescript
// hooks/useTheme.ts
export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return { theme, setTheme };
}
```

## Dependencies
- T01: Project Setup（Tailwind dark mode 設定）
- F03: Chart Rendering（ECharts 主題整合）

## Out of Scope
- 自訂主題色彩
- 多種預設主題
- 個別 Dashboard 獨立主題設定
