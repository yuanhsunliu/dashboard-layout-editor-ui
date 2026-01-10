import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ChartRendererProps } from '../../types';
import type { KpiCardConfig } from './schema';

const DEMO_VALUE = 12345;
const DEMO_COMPARE_VALUE = 11000;

const fontSizeClasses = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-7xl',
} as const;

const trendFontSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
} as const;

const trendIconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
} as const;

function formatValue(
  value: number,
  options: {
    thousandSeparator?: boolean;
    decimalPlaces?: number;
    isPercentage?: boolean;
    suffix?: string;
  } = {}
): string {
  const {
    thousandSeparator = true,
    decimalPlaces = 0,
    isPercentage = false,
    suffix = '',
  } = options;

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

function calculateTrend(current: number, compare: number): number {
  if (compare === 0) return 0;
  return ((current - compare) / Math.abs(compare)) * 100;
}

export function KpiCardRenderer({
  config,
}: ChartRendererProps<KpiCardConfig>) {
  const fontSize = config.fontSize || 'md';
  const format = config.format || {};

  const { value, compareValue, isDemo } = useMemo(() => {
    const hasValue = config.value !== undefined && config.value !== null;
    
    if (!hasValue) {
      return {
        value: DEMO_VALUE,
        compareValue: DEMO_COMPARE_VALUE,
        isDemo: true,
      };
    }

    return {
      value: config.value,
      compareValue: config.compareValue,
      isDemo: false,
    };
  }, [config.value, config.compareValue]);

  const trend = useMemo(() => {
    if (compareValue === undefined) return undefined;
    return calculateTrend(value, compareValue);
  }, [value, compareValue]);

  const formattedValue = formatValue(value, format);

  const TrendIcon = trend === undefined
    ? null
    : trend > 0
      ? TrendingUp
      : trend < 0
        ? TrendingDown
        : Minus;

  const trendColor = trend === undefined
    ? ''
    : trend > 0
      ? 'text-green-600'
      : trend < 0
        ? 'text-red-600'
        : 'text-gray-500';

  return (
    <Card className="h-full relative" data-testid="kpi-card">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <div
          className={cn(
            fontSizeClasses[fontSize],
            'font-bold tabular-nums',
            isDemo && 'opacity-60'
          )}
          data-testid="kpi-value"
        >
          {formattedValue}
        </div>

        {trend !== undefined && TrendIcon && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1',
              trendFontSizeClasses[fontSize],
              trendColor,
              isDemo && 'opacity-60'
            )}
            data-testid="kpi-trend"
          >
            <TrendIcon className={trendIconSizeClasses[fontSize]} />
            <span className="font-semibold">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
            </span>
          </div>
        )}

        {isDemo && (
          <Badge
            variant="outline"
            className="absolute bottom-2 right-2 bg-amber-50 text-amber-700 border-amber-200 text-xs"
            data-testid="kpi-demo-badge"
          >
            示範資料
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
