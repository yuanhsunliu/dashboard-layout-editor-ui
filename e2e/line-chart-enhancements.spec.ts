import { test, expect } from '@playwright/test';

test.describe('Line Chart Enhancements', () => {
  test.describe('Feature: Advanced Settings UI', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-line-chart-${Date.now()}`;
      const widgetId = `widget-line-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Line Chart Test Dashboard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 6 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Line Chart Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('Scenario: Advanced settings are collapsed by default', () => {
      test('Given I open the config panel for a Line Chart, Then advanced settings should be collapsed', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('advanced-settings-trigger')).toBeVisible();
        await expect(page.getByTestId('advanced-settings-content')).not.toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('advanced-settings-collapsed', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });

    test.describe('Scenario: Expanding advanced settings', () => {
      test('When I click on advanced settings trigger, Then the advanced options should be visible', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('advanced-settings-trigger').click();
        
        await expect(page.getByTestId('advanced-settings-content')).toBeVisible();
        await expect(page.getByTestId('enable-hierarchical-x-switch')).toBeVisible();
        await expect(page.getByTestId('enable-dual-y-switch')).toBeVisible();
        await expect(page.getByTestId('enable-group-by-switch')).toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('advanced-settings-expanded', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('Feature: Dual Y-Axis', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-dual-y-${Date.now()}`;
      const widgetId = `widget-dual-y-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Dual Y-Axis Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 6 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Dual Y-Axis Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('Scenario: Enabling dual Y-axis shows left/right axis options', () => {
      test('When I enable dual Y-axis, Then left and right axis field selectors should appear', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('advanced-settings-trigger').click();
        await expect(page.getByTestId('advanced-settings-content')).toBeVisible();

        await expect(page.getByTestId('y-axis-checkboxes')).toBeVisible();

        await page.getByTestId('enable-dual-y-switch').click();

        await expect(page.getByTestId('y-axis-checkboxes')).not.toBeVisible();
        await expect(page.getByTestId('left-y-axis-checkboxes')).toBeVisible();
        await expect(page.getByTestId('right-y-axis-checkboxes')).toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('dual-y-axis-enabled', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });

    test.describe('Scenario: Creating a chart with dual Y-axis', () => {
      test('When I configure and save a dual Y-axis chart, Then the chart should render correctly', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('標題').fill('雙軸圖表測試');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('advanced-settings-trigger').click();
        await page.getByTestId('enable-dual-y-switch').click();

        await page.getByTestId('left-y-axis-checkbox-revenue').click();
        await page.getByTestId('right-y-axis-checkbox-profit').click();

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('line-chart')).toBeVisible();

        const previewScreenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('dual-y-axis-preview', {
          body: previewScreenshot,
          contentType: 'image/png',
        });

        await page.getByTestId('config-save-button').click();
        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('line-chart')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('雙軸圖表測試');

        const savedScreenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('dual-y-axis-saved', {
          body: savedScreenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('Feature: Hierarchical X-Axis', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-hierarchical-${Date.now()}`;
      const widgetId = `widget-hierarchical-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Hierarchical X-Axis Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 10, h: 6 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Hierarchical X-Axis Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('Scenario: Enabling hierarchical X-axis shows outer/inner options', () => {
      test('When I enable hierarchical X-axis, Then outer and inner X-axis selectors should appear', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-production-performance').click();

        await expect(page.getByTestId('x-axis-select')).toBeVisible();

        await page.getByTestId('advanced-settings-trigger').click();
        await page.getByTestId('enable-hierarchical-x-switch').click();

        await expect(page.getByTestId('x-axis-select')).not.toBeVisible();
        await expect(page.getByTestId('outer-x-axis-select')).toBeVisible();
        await expect(page.getByTestId('inner-x-axis-select')).toBeVisible();
        await expect(page.getByTestId('outer-x-axis-sort-select')).toBeVisible();
        await expect(page.getByTestId('inner-x-axis-sort-select')).toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('hierarchical-x-axis-enabled', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });

    test.describe('Scenario: Creating a chart with hierarchical X-axis and groupBy', () => {
      test('When I configure hierarchical X-axis with groupBy, Then the chart should show multiple series with layered X-axis', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('標題').fill('產線績效圖表');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-production-performance').click();

        await page.getByTestId('advanced-settings-trigger').click();
        
        await page.getByTestId('enable-hierarchical-x-switch').click();
        
        await page.getByTestId('outer-x-axis-select').click();
        await page.getByRole('option', { name: '年度' }).click();
        
        await page.getByTestId('inner-x-axis-select').click();
        await page.getByRole('option', { name: '季度' }).click();

        await page.getByTestId('enable-group-by-switch').click();
        
        await page.getByTestId('group-by-field-select').click();
        await page.getByRole('option', { name: '產品線' }).click();

        await page.getByTestId('y-axis-field-checkbox').first().click();

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('line-chart')).toBeVisible();

        const previewScreenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('hierarchical-groupby-preview', {
          body: previewScreenshot,
          contentType: 'image/png',
        });

        await page.getByTestId('config-save-button').click();
        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('line-chart')).toBeVisible();

        const savedScreenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('hierarchical-groupby-saved', {
          body: savedScreenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('Feature: Series GroupBy', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-groupby-${Date.now()}`;
      const widgetId = `widget-groupby-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'GroupBy Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 6 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('GroupBy Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('Scenario: Enabling groupBy shows groupBy field selector', () => {
      test('When I enable Series groupBy, Then groupBy field and sort selectors should appear', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-production-performance').click();

        await page.getByTestId('advanced-settings-trigger').click();
        
        await page.getByTestId('enable-group-by-switch').click();

        await expect(page.getByTestId('group-by-field-select')).toBeVisible();
        await expect(page.getByTestId('group-by-sort-select')).toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('groupby-enabled', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('Feature: Backward Compatibility', () => {
    test.describe('Scenario: Existing line chart config still works', () => {
      test('Given an existing line chart without advanced settings, Then it should render correctly', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        const dashboardId = `test-backward-${Date.now()}`;
        const widgetId = `widget-backward-${Date.now()}`;

        const testData = {
          dashboards: [{
            id: dashboardId,
            name: 'Backward Compatibility Test',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            theme: 'light',
            layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
            widgets: [{
              id: widgetId,
              chartConfig: {
                chartType: 'line',
                title: '既有圖表',
                dataSourceId: 'sales-data',
                xAxisField: 'date',
                yAxisFields: ['revenue', 'profit'],
              }
            }]
          }]
        };

        await page.evaluate((data) => {
          localStorage.setItem('dashboard-setting', JSON.stringify(data));
        }, testData);

        await page.reload();
        await page.getByText('Backward Compatibility Test').click();
        await expect(page).toHaveURL(/\/dashboard\/.+/);

        await expect(page.getByTestId('line-chart')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('既有圖表');

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('backward-compatible', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  });

  test.describe('Feature: Config Persistence', () => {
    test.describe('Scenario: Advanced settings are restored after saving', () => {
      test('Given I save a dual Y-axis config, When I reopen the config panel, Then the settings should be restored', async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());

        const dashboardId = `test-persistence-${Date.now()}`;
        const widgetId = `widget-persistence-${Date.now()}`;

        const testData = {
          dashboards: [{
            id: dashboardId,
            name: 'Config Persistence Test',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            theme: 'light',
            layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 6 }],
            widgets: [{ id: widgetId }]
          }]
        };

        await page.evaluate((data) => {
          localStorage.setItem('dashboard-setting', JSON.stringify(data));
        }, testData);

        await page.reload();
        await page.getByText('Config Persistence Test').click();
        await expect(page).toHaveURL(/\/dashboard\/.+/);

        // Configure and save
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByLabel('標題').fill('持久化測試');
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-line').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('x-axis-select').click();
        await page.getByTestId('x-axis-option-date').click();

        await page.getByTestId('advanced-settings-trigger').click();
        await expect(page.getByTestId('advanced-settings-content')).toBeVisible();
        await page.getByTestId('enable-dual-y-switch').click();

        await page.getByTestId('left-y-axis-checkbox-revenue').click();
        await page.getByTestId('right-y-axis-checkbox-profit').click();

        await page.getByTestId('config-save-button').click();
        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();

        // Reopen config panel
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        // Verify settings are restored
        await expect(page.getByLabel('標題')).toHaveValue('持久化測試');
        
        // Advanced settings should auto-expand when enableDualYAxis is true
        // First check if content is already visible (auto-expanded by useEffect)
        const content = page.getByTestId('advanced-settings-content');
        const isVisible = await content.isVisible();
        
        if (!isVisible) {
          // If not visible, click to expand
          const trigger = page.getByTestId('advanced-settings-trigger');
          await trigger.scrollIntoViewIfNeeded();
          await trigger.click();
        }
        
        await expect(content).toBeVisible();
        await expect(page.getByTestId('enable-dual-y-switch')).toHaveAttribute('data-state', 'checked');
        await expect(page.getByTestId('left-y-axis-checkboxes')).toBeVisible();
        await expect(page.getByTestId('right-y-axis-checkboxes')).toBeVisible();

        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('config-persistence-restored', {
          body: screenshot,
          contentType: 'image/png',
        });
      });
    });
  });
});
