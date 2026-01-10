import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChartRendererProps } from '../../types';
import type { KpiCardDynamicConfig, KpiCardDynamicFormat } from './schema';

function formatValue(
  value: number,
  format: KpiCardDynamicFormat = {}
): string {
  const {
    thousandSeparator = true,
    decimalPlaces = 0,
    isPercentage = false,
    suffix = '',
  } = format;

  let formatted = value.toFixed(decimalPlaces);

  if (thousandSeparator) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formatted = parts.join('.');
  }

  if (isPercentage) {
    formatted += '%';
  }

  if (suffix) {
    formatted += ` ${suffix}`;
  }

  return formatted;
}

function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : current < 0 ? -100 : 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

const FONT_SIZE_CLASSES = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
} as const;

export function KpiCardDynamicRenderer({
  config,
  data,
}: ChartRendererProps<KpiCardDynamicConfig>) {
  const fontSize = config.fontSize || 'md';
  const fontSizeClass = FONT_SIZE_CLASSES[fontSize];

  const rows = data?.rows || [];
  const hasData = rows.length > 0 && config.valueField;
  
  const lastRow = rows[rows.length - 1];
  const prevRow = rows.length > 1 ? rows[rows.length - 2] : null;

  const currentValue = hasData ? Number(lastRow?.[config.valueField]) : undefined;
  const previousValue = prevRow && config.valueField ? Number(prevRow[config.valueField]) : undefined;

  const isDemo = !hasData || currentValue === undefined || isNaN(currentValue);
  const displayValue = isDemo ? 12345 : currentValue;

  const showTrendIndicator = config.showTrend && !isDemo && previousValue !== undefined && !isNaN(previousValue);
  const trendValue = showTrendIndicator ? calculateTrend(currentValue!, previousValue!) : null;

  const TrendIcon =
    trendValue === null
      ? null
      : trendValue > 0
        ? TrendingUp
        : trendValue < 0
          ? TrendingDown
          : Minus;

  const trendColor =
    trendValue === null
      ? ''
      : trendValue > 0
        ? 'text-green-600'
        : trendValue < 0
          ? 'text-red-600'
          : 'text-gray-500';

  return (
    <Card className="h-full relative" data-testid="kpi-card-dynamic">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <div
          className={`font-bold ${fontSizeClass} ${isDemo ? 'opacity-60' : ''}`}
          data-testid="kpi-dynamic-value"
        >
          {formatValue(displayValue, config.format)}
        </div>

        {showTrendIndicator && TrendIcon && trendValue !== null && (
          <div
            className={`flex items-center gap-1 mt-2 ${trendColor}`}
            data-testid="kpi-dynamic-trend"
          >
            <TrendIcon className="h-5 w-5" />
            <span className="text-sm font-medium">
              {trendValue > 0 ? '+' : ''}
              {trendValue.toFixed(1)}%
            </span>
          </div>
        )}

        {isDemo && (
          <Badge
            variant="outline"
            className="absolute bottom-2 right-2 bg-amber-50 text-amber-700 border-amber-200"
            data-testid="kpi-dynamic-demo-badge"
          >
            示範資料
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
