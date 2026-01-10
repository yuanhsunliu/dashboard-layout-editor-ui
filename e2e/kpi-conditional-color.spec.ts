import { test, expect } from '@playwright/test';

test.describe('KPI Card Conditional Color', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-color-${Date.now()}`;
      const widgetId = `widget-kpi-color-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'KPI Conditional Color Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 4, h: 3 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('KPI Conditional Color Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When enabling conditional color feature', () => {
      test('Then it should show conditional color config section', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await expect(page.getByTestId('chart-config-panel')).toBeVisible();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Verify conditional color config is visible', async () => {
          const conditionalColorConfig = page.getByTestId('conditional-color-config');
          await conditionalColorConfig.scrollIntoViewIfNeeded();
          await expect(conditionalColorConfig).toBeVisible();
          await expect(page.getByTestId('conditional-color-enabled')).toBeVisible();
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-config-disabled.png' });

        await test.step('Enable conditional color', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-config-enabled.png' });
      });
    });

    test.describe('When adding color rules', () => {
      test('Then it should allow adding up to 5 rules', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Enable conditional color and add rules', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          for (let i = 0; i < 5; i++) {
            await page.getByTestId('add-color-rule').click();
            await expect(page.getByTestId(`color-rule-${i}`)).toBeVisible();
          }
        });

        await test.step('Verify add button is hidden after 5 rules', async () => {
          await expect(page.getByTestId('add-color-rule')).not.toBeVisible();
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-max-rules.png' });
      });

      test('Then it should allow removing rules', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Add and remove a rule', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
          await expect(page.getByTestId('color-rule-0')).toBeVisible();
          
          await page.getByTestId('rule-remove-0').click();
          await expect(page.getByTestId('color-rule-0')).not.toBeVisible();
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-remove-rule.png' });
      });
    });

    test.describe('When configuring color rules', () => {
      test('Then it should apply green color when value > 90', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Enter value = 95', async () => {
          await page.getByTestId('kpi-value-input').fill('95');
        });

        await test.step('Configure conditional color rule: > 90 = green', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
          
          await page.getByTestId('rule-operator-0').click();
          await page.getByRole('option', { name: '大於 (>)' }).click();
          await page.getByTestId('rule-threshold-0').fill('90');
          await page.getByTestId('rule-color-input-0').fill('#22c55e');
        });

        await test.step('Verify value is displayed in green', async () => {
          const kpiValue = page.getByTestId('kpi-value');
          await expect(kpiValue).toBeVisible();
          const color = await kpiValue.evaluate((el) => getComputedStyle(el).color);
          expect(color).toBe('rgb(34, 197, 94)');
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-green.png' });
      });

      test('Then it should apply red color when value < 60', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Enter value = 55', async () => {
          await page.getByTestId('kpi-value-input').fill('55');
        });

        await test.step('Configure conditional color rule: < 60 = red', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
          
          await page.getByTestId('rule-operator-0').click();
          await page.getByRole('option', { name: '小於 (<)' }).click();
          await page.getByTestId('rule-threshold-0').fill('60');
          await page.getByTestId('rule-color-input-0').fill('#ef4444');
        });

        await test.step('Verify value is displayed in red', async () => {
          const kpiValue = page.getByTestId('kpi-value');
          await expect(kpiValue).toBeVisible();
          const color = await kpiValue.evaluate((el) => getComputedStyle(el).color);
          expect(color).toBe('rgb(239, 68, 68)');
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-red.png' });
      });

      test('Then it should apply default color when no rules match', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Enter value = 75 (between 60 and 90)', async () => {
          await page.getByTestId('kpi-value-input').fill('75');
        });

        await test.step('Configure rules and default color', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
          await page.getByTestId('rule-operator-0').click();
          await page.getByRole('option', { name: '大於 (>)' }).click();
          await page.getByTestId('rule-threshold-0').fill('90');
          await page.getByTestId('rule-color-input-0').fill('#22c55e');
          
          await page.getByTestId('add-color-rule').click();
          await page.getByTestId('rule-operator-1').click();
          await page.getByRole('option', { name: '小於 (<)' }).click();
          await page.getByTestId('rule-threshold-1').fill('60');
          await page.getByTestId('rule-color-input-1').fill('#ef4444');
          
          await page.getByTestId('default-color-input').scrollIntoViewIfNeeded();
          await page.getByTestId('default-color-input').fill('#eab308');
        });

        await test.step('Verify value is displayed in yellow (default)', async () => {
          const kpiValue = page.getByTestId('kpi-value');
          await expect(kpiValue).toBeVisible();
          const color = await kpiValue.evaluate((el) => getComputedStyle(el).color);
          expect(color).toBe('rgb(234, 179, 8)');
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-default-yellow.png' });
      });
    });

    test.describe('When in demo mode', () => {
      test('Then it should NOT apply conditional color', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Configure conditional color without entering value', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
          await page.getByTestId('rule-operator-0').click();
          await page.getByRole('option', { name: '大於 (>)' }).click();
          await page.getByTestId('rule-threshold-0').fill('0');
          await page.getByTestId('rule-color-input-0').fill('#22c55e');
        });

        await test.step('Verify demo badge is visible and color is not applied', async () => {
          await expect(page.getByTestId('kpi-demo-badge')).toBeVisible();
          const kpiValue = page.getByTestId('kpi-value');
          const color = await kpiValue.evaluate((el) => getComputedStyle(el).color);
          expect(color).not.toBe('rgb(34, 197, 94)');
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-demo-mode.png' });
      });
    });

    test.describe('When using color picker', () => {
      test('Then it should update color via color picker', async ({ page }) => {
        await test.step('Open config panel and select KPI Card', async () => {
          await page.getByTestId('widget-config-button').click();
          await page.getByTestId('chart-type-select').click();
          await page.getByTestId('chart-type-option-kpi-card').click();
        });

        await test.step('Enable conditional color and add rule', async () => {
          await page.getByTestId('kpi-value-input').fill('100');
          
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await switchElement.click();
          await expect(page.getByTestId('add-color-rule')).toBeVisible({ timeout: 10000 });
          
          await page.getByTestId('add-color-rule').click();
        });

        await test.step('Verify color picker is visible', async () => {
          await expect(page.getByTestId('rule-color-picker-0')).toBeVisible();
          await expect(page.getByTestId('rule-color-input-0')).toBeVisible();
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-picker-ui.png' });
      });
    });
  });

  test.describe('Given a dashboard with existing conditional color config', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-existing-color-${Date.now()}`;
      const widgetId = `widget-kpi-existing-color-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing Color Config Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 4, h: 3 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'kpi-card',
              title: '達成率',
              value: 95,
              fontSize: 'lg',
              conditionalColor: {
                enabled: true,
                rules: [
                  { operator: '>', threshold: 90, color: '#22c55e' },
                  { operator: '<', threshold: 60, color: '#ef4444' }
                ],
                defaultColor: '#eab308'
              }
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Existing Color Config Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing existing KPI Card with conditional color', () => {
      test('Then it should display value in configured color', async ({ page }) => {
        await test.step('Verify KPI Card is visible with green color', async () => {
          const kpiCard = page.getByTestId('kpi-card');
          await expect(kpiCard).toBeVisible();
          
          const kpiValue = page.getByTestId('kpi-value');
          await expect(kpiValue).toBeVisible();
          
          const color = await kpiValue.evaluate((el) => getComputedStyle(el).color);
          expect(color).toBe('rgb(34, 197, 94)');
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-existing-green.png' });
      });
    });

    test.describe('When opening config panel', () => {
      test('Then it should show existing conditional color configuration', async ({ page }) => {
        await test.step('Open config panel', async () => {
          await page.getByTestId('widget-config-button').click();
          await expect(page.getByTestId('chart-config-panel')).toBeVisible();
        });

        await test.step('Verify conditional color is enabled with rules', async () => {
          const switchElement = page.getByTestId('conditional-color-enabled');
          await switchElement.scrollIntoViewIfNeeded();
          await expect(switchElement).toBeChecked();
          await expect(page.getByTestId('color-rule-0')).toBeVisible();
          await expect(page.getByTestId('color-rule-1')).toBeVisible();
        });

        await page.screenshot({ path: 'test-results/kpi-conditional-color-existing-config.png' });
      });
    });
  });
});
