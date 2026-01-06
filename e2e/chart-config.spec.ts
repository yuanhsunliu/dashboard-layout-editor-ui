import { test, expect } from '@playwright/test';

test.describe('Chart Configuration', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-config-${Date.now()}`;
      const widgetId = `widget-config-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Config Test Dashboard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Config Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When clicking the settings button on a widget', () => {
      test('Then the config panel should slide out from the right', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();

        await expect(page.getByTestId('chart-config-panel')).toBeVisible();
        await expect(page.getByText('圖表設定')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-panel-open.png' });
      });
    });

    test.describe('When opening the config panel', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();
      });

      test('Then it should display all form fields', async ({ page }) => {
        await expect(page.getByLabel('圖表標題')).toBeVisible();
        await expect(page.getByTestId('chart-type-select')).toBeVisible();
        await expect(page.getByTestId('data-source-select')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-panel-fields.png' });
      });

      test('Then field mapping should be hidden until data source is selected', async ({ page }) => {
        await expect(page.getByTestId('field-mapping-form')).not.toBeVisible();
      });
    });

    test.describe('When selecting a data source', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();
      });

      test('Then field mapping options should appear', async ({ page }) => {
        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('field-mapping-form')).toBeVisible();
        await expect(page.getByTestId('x-axis-select')).toBeVisible();
        await expect(page.getByText('Y 軸欄位')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-field-mapping.png' });
      });

      test('Then Y-axis should only show number type fields', async ({ page }) => {
        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        const yAxisCheckboxes = page.getByTestId('y-axis-field-checkbox');
        await expect(yAxisCheckboxes).toHaveCount(3);

        await page.screenshot({ path: 'test-results/config-y-axis-fields.png' });
      });
    });

    test.describe('When all required fields are selected', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();
      });

      test('Then the preview should be displayed', async ({ page }) => {
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('y-axis-field-checkbox').first().click();

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('line-chart')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-preview-visible.png' });
      });

      test('Then switching chart type should update the preview', async ({ page }) => {
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('y-axis-field-checkbox').first().click();

        await expect(page.getByTestId('line-chart')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-bar').click();

        await expect(page.getByTestId('bar-chart')).toBeVisible();
        await expect(page.getByTestId('line-chart')).not.toBeVisible();

        await page.screenshot({ path: 'test-results/config-preview-type-switch.png' });
      });
    });

    test.describe('When saving the configuration', () => {
      test('Then the widget should display the configured chart', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('圖表標題').fill('測試圖表');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('y-axis-field-checkbox').first().click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('測試圖表');
        await expect(page.getByTestId('line-chart')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-saved.png' });
      });
    });

    test.describe('When canceling the configuration', () => {
      test('Then the panel should close without saving changes', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('圖表標題').fill('不應該保存');

        await page.getByTestId('config-cancel-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('chart-empty')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-canceled.png' });
      });
    });

    test.describe('When clicking outside the panel', () => {
      test('Then the panel should NOT close (prevent accidental close)', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.mouse.click(100, 100);

        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-click-outside.png' });
      });
    });
  });

  test.describe('Given a widget with existing chart configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-existing-${Date.now()}`;
      const widgetId = `widget-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing Config Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'line',
              title: '現有圖表',
              dataSourceId: 'sales-data',
              xAxisField: 'date',
              yAxisFields: ['revenue'],
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Existing Config Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When opening the config panel', () => {
      test('Then it should display the existing configuration', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await expect(page.getByLabel('圖表標題')).toHaveValue('現有圖表');

        await page.screenshot({ path: 'test-results/config-existing-values.png' });
      });
    });

    test.describe('When modifying and saving the configuration', () => {
      test('Then the widget should reflect the updated configuration', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('圖表標題').clear();
        await page.getByLabel('圖表標題').fill('更新後的圖表');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-bar').click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('更新後的圖表');
        await expect(page.getByTestId('bar-chart')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-updated.png' });
      });
    });
  });

  test.describe('Given form validation requirements', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-validation-${Date.now()}`;
      const widgetId = `widget-validation-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Validation Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Validation Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When trying to save without selecting data source', () => {
      test('Then validation error should be shown', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByText('請選擇資料來源')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-validation-error.png' });
      });
    });

    test.describe('When trying to save without selecting Y-axis fields', () => {
      test('Then validation error should be shown', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByText('請至少選擇一個 Y 軸欄位')).toBeVisible();

        await page.screenshot({ path: 'test-results/config-validation-y-axis.png' });
      });
    });
  });
});
