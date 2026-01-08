export interface DataSourceField {
  name: string;
  type: 'string' | 'number' | 'date';
  label: string;
}

export type DemoDataRow = Record<string, string | number>;

export interface DataSource {
  id: string;
  name: string;
  fields: DataSourceField[];
  demoData: {
    rows: DemoDataRow[];
  };
}

export interface ChartConfigFormData {
  chartType: 'line' | 'bar';
  title: string;
  dataSourceId: string;
  xAxisField: string;
  yAxisFields: string[];
}
