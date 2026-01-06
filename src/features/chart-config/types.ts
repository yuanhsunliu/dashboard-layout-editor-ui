export interface DataSourceField {
  name: string;
  type: 'string' | 'number' | 'date';
  label: string;
}

export interface DemoDataSeries {
  name: string;
  data: number[];
}

export interface DemoData {
  xAxis: string[];
  series: DemoDataSeries[];
}

export interface DataSource {
  id: string;
  name: string;
  fields: DataSourceField[];
  demoData: DemoData;
}

export interface ChartConfigFormData {
  chartType: 'line' | 'bar';
  title: string;
  dataSourceId: string;
  xAxisField: string;
  yAxisFields: string[];
}
