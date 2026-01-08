import { Link } from 'lucide-react';
import type { ChartPlugin } from '../../types';
import { embedConfigSchema, type EmbedConfigType } from './schema';
import { EmbedRenderer } from './EmbedRenderer';
import { EmbedConfigFields } from './ConfigFields';

export const EmbedPlugin: ChartPlugin<EmbedConfigType> = {
  type: 'embed',
  name: '嵌入報表',
  description: '透過 URL 嵌入外部報表',
  icon: Link,
  configSchema: embedConfigSchema,
  ConfigFields: EmbedConfigFields,
  Renderer: EmbedRenderer,
};

export type { EmbedConfigType };
