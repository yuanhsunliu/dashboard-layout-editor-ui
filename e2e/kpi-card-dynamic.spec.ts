import { test, expect } from '@playwright/test';

test.describe('KPI Card Dynamic Widget', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-dynamic-${Date.now()}`;
      const widgetId = `widget-kpi-dynamic-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'KPI Dynamic Test Dashboard',
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
      await page.getByText('KPI Dynamic Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When selecting KPI Card Dynamic chart type', () => {
      test('Then it should show KPI Card Dynamic option in chart type selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();

        await expect(page.getByTestId('chart-type-option-kpi-card-dynamic')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-chart-type-option.png' });
      });

      test('Then it should display data source selector after selection', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await expect(page.getByTestId('chart-type-select')).toBeVisible();
        await expect(page.getByTestId('data-source-select')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-datasource-selector.png' });
      });
    });

    test.describe('When configuring KPI Card Dynamic', () => {
      test('Then it should display demo mode when no data source selected', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('kpi-card-dynamic')).toBeVisible();
        await expect(page.getByTestId('kpi-dynamic-demo-badge')).toBeVisible();
        await expect(page.getByTestId('kpi-dynamic-demo-badge')).toHaveText('示範資料');

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-demo-mode.png' });
      });

      test('Then it should display config fields after selecting data source', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();
        await expect(page.getByTestId('value-field-select')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-config-fields.png' });
      });

      test('Then it should display value from last row after selecting field', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();

        await page.getByTestId('value-field-select').click();
        await page.getByRole('option').first().click();

        await expect(page.getByTestId('kpi-card-dynamic')).toBeVisible();
        await expect(page.getByTestId('kpi-dynamic-value')).toBeVisible();
        await expect(page.getByTestId('kpi-dynamic-demo-badge')).not.toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-value-selected.png' });
      });

      test('Then it should display trend when showTrend is enabled', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();

        await page.getByTestId('value-field-select').click();
        await page.getByRole('option').first().click();

        await page.getByTestId('show-trend-checkbox').click();

        await expect(page.getByTestId('kpi-dynamic-trend')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-with-trend.png' });
      });
    });

    test.describe('When saving KPI Card Dynamic configuration', () => {
      test('Then the widget should display the saved KPI Card Dynamic', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();

        await page.getByTestId('kpi-dynamic-title-input').fill('動態營收');
        await page.getByTestId('value-field-select').click();
        await page.getByRole('option').first().click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('kpi-card-dynamic')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('動態營收');

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-saved.png' });
      });
    });

    test.describe('When changing font size', () => {
      test('Then the value should display in different sizes', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();

        await page.getByTestId('value-field-select').click();
        await page.getByRole('option').first().click();

        await page.getByTestId('font-size-select').click();
        await page.getByRole('option', { name: '大' }).click();

        const kpiValue = page.getByTestId('kpi-dynamic-value');
        await expect(kpiValue).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-font-size-lg.png' });

        await page.getByTestId('font-size-select').click();
        await page.getByRole('option', { name: '小' }).click();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-font-size-sm.png' });
      });
    });

    test.describe('When formatting options are applied', () => {
      test('Then the value should display with suffix', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-kpi-card-dynamic').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('kpi-dynamic-config-form')).toBeVisible();

        await page.getByTestId('value-field-select').click();
        await page.getByRole('option').first().click();

        await page.getByTestId('suffix-input').fill('元');

        await expect(page.getByTestId('kpi-dynamic-value')).toBeVisible();

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-formatting.png' });
      });
    });
  });

  test.describe('Given a dashboard with an existing KPI Card Dynamic widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-kpi-dynamic-existing-${Date.now()}`;
      const widgetId = `widget-kpi-dynamic-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing KPI Dynamic Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 4, h: 3 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'kpi-card-dynamic',
              title: '現有動態 KPI',
              dataSourceId: 'sales-data',
              valueField: 'revenue',
              showTrend: true,
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
      await page.getByText('Existing KPI Dynamic Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the existing KPI Card Dynamic', () => {
      test('Then it should display the configured KPI Card Dynamic', async ({ page }) => {
        await expect(page.getByTestId('kpi-card-dynamic')).toBeVisible();
        await expect(page.getByTestId('kpi-dynamic-value')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('現有動態 KPI');

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-existing.png' });
      });
    });

    test.describe('When opening config panel for existing KPI Card Dynamic', () => {
      test('Then it should display the existing configuration', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await expect(page.getByTestId('kpi-dynamic-title-input')).toHaveValue('現有動態 KPI');
        await expect(page.getByTestId('suffix-input')).toHaveValue('元');

        await page.screenshot({ path: 'test-results/kpi-card-dynamic-existing-config.png' });
      });
    });
  });
});
