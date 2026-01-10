import type { AiAnalyzeRequest, AiAnalyzeResponse } from './schema';

const MOCK_INSIGHTS = [
  `## 數據洞察摘要

### 趨勢分析
- 整體數據呈現**穩定上升**趨勢
- 近期成長率約為 **12.5%**

### 關鍵發現
1. 最高值出現在資料末段
2. 波動幅度在合理範圍內
3. 無明顯異常數據點

### 建議行動
- 持續監控此趨勢
- 可考慮加大資源投入`,

  `## 分析結果

### 數據概況
- 資料筆數: **多筆記錄**
- 數值範圍: 穩定區間

### 重點觀察
1. 數據分布均勻
2. 成長動能持續
3. 短期內預期維持現狀

### 下一步
- 建議定期追蹤變化
- 可與歷史同期比較`,
];

function getRandomInsight(): string {
  return MOCK_INSIGHTS[Math.floor(Math.random() * MOCK_INSIGHTS.length)];
}

export async function analyzeWidget(
  _request: AiAnalyzeRequest
): Promise<AiAnalyzeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

  return {
    insight: getRandomInsight(),
    analyzedAt: new Date().toISOString(),
  };
}

export async function analyzeWidgetWithError(): Promise<never> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  throw new Error('AI 服務暫時無法使用，請稍後再試');
}
