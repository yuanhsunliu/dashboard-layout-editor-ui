export interface DemoDataSeries {
  name: string;
  data: number[];
}

export interface DemoData {
  xAxis: string[];
  series: DemoDataSeries[];
}

export const DEMO_DATA: Record<'line' | 'bar', DemoData> = {
  line: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    series: [{ name: '銷售額', data: [120, 200, 150, 80, 170, 210] }],
  },
  bar: {
    xAxis: ['產品A', '產品B', '產品C', '產品D'],
    series: [{ name: '銷量', data: [43, 85, 62, 93] }],
  },
};
