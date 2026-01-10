import type { z } from 'zod';
import type { ComponentType } from 'react';
import type { DemoData } from '@/components/chart/demoData';
import type { DataSourceField } from '@/features/chart-config/types';
import type { DashboardFilter, ChartInteractionEvent } from '@/types/filter';

export interface BaseChartConfig {
  chartType: string;
  dataSourceId?: string;
}

export interface ChartRendererProps<TConfig extends BaseChartConfig = BaseChartConfig> {
  config: TConfig;
  data?: DemoData;
  filters?: DashboardFilter[];
  widgetId?: string;
  onInteraction?: (event: ChartInteractionEvent) => void;
}

export interface ConfigFieldsProps<TConfig extends BaseChartConfig = BaseChartConfig> {
  value: Partial<TConfig>;
  onChange: (value: Partial<TConfig>) => void;
  fields?: DataSourceField[];
  errors?: Record<string, string>;
}

/**
 * Plugin 多語系資源定義
 * 每個語系對應一組 key-value 翻譯
 */
export type PluginLocales = {
  'zh-TW': Record<string, string>;
  'en': Record<string, string>;
};

export interface ChartPlugin<TConfig extends BaseChartConfig = BaseChartConfig> {
  type: string;
  name: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  configSchema: z.ZodSchema<TConfig>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ConfigFields: ComponentType<ConfigFieldsProps<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Renderer: ComponentType<ChartRendererProps<any>>;
  supportedInteractions?: ('click' | 'brush' | 'drilldown')[];
  /**
   * Plugin 自包含的多語系資源
   * 平台會在載入 Plugin 時自動註冊為獨立的 i18n namespace
   * 使用方式: useTranslation(plugin.type)
   */
  locales?: PluginLocales;
}
