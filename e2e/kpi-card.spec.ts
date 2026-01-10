import { test, expect } from '@playwright/test';

test.describe('KPI Card Widget', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-${Date.now()}`;
      const widgetId = `widget-kpi-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'KPI Card Test Dashboard',
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
      await page.getByText('KPI Card Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When selecting KPI Card chart type', () => {
      test('Then it should show KPI Card option in chart type selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();

        await expect(page.getByTestId('chart-type-option-kpi-card')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-chart-type-option.png' });
      });

      test('Then it should display KPI Card config fields immediately (no data source required)', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('chart-type-select')).toBeVisible();
        
        await expect(page.getByTestId('kpi-config-form')).toBeVisible();
        await expect(page.getByTestId('kpi-title-input')).toBeVisible();
        await expect(page.getByTestId('kpi-value-input')).toBeVisible();
        await expect(page.getByTestId('kpi-compare-input')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-config-fields.png' });
      });
    });

    test.describe('When configuring KPI Card', () => {
      test('Then it should display demo mode when no value is entered', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('kpi-card')).toBeVisible();
        await expect(page.getByTestId('kpi-demo-badge')).toBeVisible();
        await expect(page.getByTestId('kpi-demo-badge')).toHaveText('示範資料');

        await page.screenshot({ path: 'test-results/kpi-card-demo-mode.png' });
      });

      test('Then it should display entered value in preview', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await page.getByTestId('kpi-title-input').fill('月營收');
        await page.getByTestId('kpi-value-input').fill('12345');

        await expect(page.getByTestId('kpi-card')).toBeVisible();
        await expect(page.getByTestId('kpi-value')).toBeVisible();
        await expect(page.getByTestId('kpi-demo-badge')).not.toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-configured.png' });
      });

      test('Then it should display trend when compare value is entered', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await page.getByTestId('kpi-value-input').fill('12000');
        await page.getByTestId('kpi-compare-input').fill('10000');

        await expect(page.getByTestId('kpi-trend')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-with-trend.png' });
      });
    });

    test.describe('When saving KPI Card configuration', () => {
      test('Then the widget should display the saved KPI Card', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await page.getByTestId('kpi-title-input').fill('銷售總額');
        await page.getByTestId('kpi-value-input').fill('99999');

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('kpi-card')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('銷售總額');

        await page.screenshot({ path: 'test-results/kpi-card-saved.png' });
      });
    });

    test.describe('When changing font size', () => {
      test('Then the value should display in different sizes', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await page.getByTestId('kpi-value-input').fill('12345');

        await page.getByTestId('font-size-select').click();
        await page.getByRole('option', { name: '大' }).click();

        const kpiValue = page.getByTestId('kpi-value');
        await expect(kpiValue).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-font-size-lg.png' });

        await page.getByTestId('font-size-select').click();
        await page.getByRole('option', { name: '小' }).click();

        await page.screenshot({ path: 'test-results/kpi-card-font-size-sm.png' });
      });
    });

    test.describe('When formatting options are applied', () => {
      test('Then the value should display with suffix', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card').click();

        await expect(page.getByTestId('kpi-config-form')).toBeVisible();

        await page.getByTestId('kpi-value-input').fill('12345');
        await page.getByTestId('suffix-input').fill('件');

        await expect(page.getByTestId('kpi-value')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-formatting.png' });
      });
    });
  });

  test.describe('Given a dashboard with an existing KPI Card widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-existing-${Date.now()}`;
      const widgetId = `widget-kpi-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing KPI Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 4, h: 3 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'kpi-card',
              title: '現有 KPI',
              value: 88888,
              compareValue: 77777,
              fontSize: 'md',
              format: {
                thousandSeparator: true,
                decimalPlaces: 0,
                isPercentage: false,
                suffix: '元',
              }
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Existing KPI Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the existing KPI Card', () => {
      test('Then it should display the configured KPI Card', async ({ page }) => {
        await expect(page.getByTestId('kpi-card')).toBeVisible();
        await expect(page.getByTestId('kpi-value')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('現有 KPI');

        await page.screenshot({ path: 'test-results/kpi-card-existing.png' });
      });
    });

    test.describe('When opening config panel for existing KPI Card', () => {
      test('Then it should display the existing configuration', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await expect(page.getByTestId('kpi-title-input')).toHaveValue('現有 KPI');
        await expect(page.getByTestId('kpi-value-input')).toHaveValue('88888');
        await expect(page.getByTestId('suffix-input')).toHaveValue('元');

        await page.screenshot({ path: 'test-results/kpi-card-existing-config.png' });
      });
    });
  });
});
