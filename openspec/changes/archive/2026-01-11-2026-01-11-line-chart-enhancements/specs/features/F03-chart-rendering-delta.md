# F03: Chart Rendering - Delta

## 變更摘要

擴展 Line Chart 支援雙 Y 軸、階層式 X 軸、Series 分群功能。

## Data Model 變更

### LineChartConfig 擴展

```typescript
// 現有欄位（保留向下相容）
interface LineChartConfig extends BaseChartConfig {
  chartType: 'line';
  xAxisField: string;           // 單層 X 軸（當未啟用階層式時使用）
  yAxisFields: string[];        // 已棄用，遷移至 leftYAxisFields
  smooth?: boolean;
  showArea?: boolean;
  
  // ===== 新增欄位 =====
  
  // 雙 Y 軸
  leftYAxisFields: string[];    // 左軸欄位（主軸）
  rightYAxisFields?: string[];  // 右軸欄位（次軸，選填）
  
  // 階層式 X 軸
  outerXAxisField?: string;     // 外層 X 軸欄位
  innerXAxisField?: string;     // 內層 X 軸欄位
  outerXAxisSort?: 'asc' | 'desc' | 'data';  // 預設 'data'
  innerXAxisSort?: 'asc' | 'desc' | 'data';  // 預設 'data'
  
  // Series 分群
  groupByField?: string;        // 分群欄位
  groupBySort?: 'asc' | 'desc' | 'data';     // 預設 'data'
}
```

### 驗證規則

```typescript
// 階層式 X 軸：外層/內層同時填或同時不填
z.refine((data) => {
  const hasOuter = !!data.outerXAxisField;
  const hasInner = !!data.innerXAxisField;
  return hasOuter === hasInner;
}, '外層與內層 X 軸欄位須同時設定或同時留空');

// groupByField 啟用時：只能有一個 Y 軸欄位
z.refine((data) => {
  if (!data.groupByField) return true;
  const totalYFields = 
    (data.leftYAxisFields?.length || 0) + 
    (data.rightYAxisFields?.length || 0);
  return totalYFields === 1;
}, '啟用分群時，只能選擇一個 Y 軸欄位');
```

## ECharts Option 變更

### 雙 Y 軸

```typescript
{
  yAxis: [
    { type: 'value', position: 'left', name: '銷售額' },
    { type: 'value', position: 'right', name: '成長率 %' },
  ],
  series: [
    { name: 'sales', type: 'line', yAxisIndex: 0, data: [...] },
    { name: 'growthRate', type: 'line', yAxisIndex: 1, data: [...] },
  ],
}
```

### 階層式 X 軸

```typescript
{
  xAxis: {
    type: 'category',
    data: [
      { value: 'R1', textStyle: { ... } },
      { value: 'R2', textStyle: { ... } },
      { value: 'R3', textStyle: { ... } },
      // ...
    ],
    axisLabel: {
      interval: 0,
      formatter: (value, index) => {
        // 顯示內層標籤
        return value;
      },
    },
  },
  // 使用 graphic 或自訂方式顯示外層標籤
}
```

## Acceptance Criteria 新增

### 雙 Y 軸
- [ ] 可設定左軸欄位（必填）
- [ ] 可設定右軸欄位（選填）
- [ ] 左右軸顯示獨立刻度
- [ ] Series 正確對應至左軸或右軸

### 階層式 X 軸
- [ ] 可設定外層 X 軸欄位
- [ ] 可設定內層 X 軸欄位
- [ ] X 軸顯示兩層標籤
- [ ] 各層可獨立設定排序方式

### Series 分群
- [ ] 可設定分群欄位
- [ ] 依據分群欄位值自動產生多條 series
- [ ] 可設定分群排序方式
- [ ] Legend 正確顯示各 series 名稱

### 組合使用
- [ ] 階層式 X 軸 + groupByField 可同時使用
- [ ] groupByField 啟用時，Y 軸限制為單一欄位

### 向下相容
- [ ] 現有 `yAxisFields` 設定自動對應至 `leftYAxisFields`
- [ ] 現有 `xAxisField` 設定繼續運作
