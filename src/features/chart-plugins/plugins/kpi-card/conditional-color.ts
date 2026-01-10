import { z } from 'zod';

export const colorOperators = ['>', '>=', '<', '<=', '=='] as const;
export type ColorOperator = (typeof colorOperators)[number];

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const colorConditionSchema = z.object({
  operator: z.enum(colorOperators),
  threshold: z.number(),
  color: z.string().regex(hexColorRegex, '請輸入有效的 HEX 色碼（如 #ff0000）'),
});

export const conditionalColorSchema = z.object({
  enabled: z.boolean().default(false),
  rules: z.array(colorConditionSchema).max(5, '最多只能設定 5 條規則').default([]),
  defaultColor: z.string().regex(hexColorRegex, '請輸入有效的 HEX 色碼').optional(),
});

export type ColorCondition = z.infer<typeof colorConditionSchema>;
export type ConditionalColor = z.infer<typeof conditionalColorSchema>;

export function evaluateColorCondition(
  value: number,
  config?: ConditionalColor
): string | undefined {
  if (!config?.enabled || !config.rules || config.rules.length === 0) {
    return undefined;
  }

  for (const rule of config.rules) {
    const matches = evaluateOperator(value, rule.operator, rule.threshold);
    if (matches) {
      return rule.color;
    }
  }

  return config.defaultColor;
}

function evaluateOperator(
  value: number,
  operator: ColorOperator,
  threshold: number
): boolean {
  switch (operator) {
    case '>':
      return value > threshold;
    case '>=':
      return value >= threshold;
    case '<':
      return value < threshold;
    case '<=':
      return value <= threshold;
    case '==':
      return value === threshold;
    default:
      return false;
  }
}
