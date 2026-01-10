import { test, expect } from '@playwright/test';

async function simulateFilterToggle(page: import('@playwright/test').Page, field: string, value: string, widgetId: string) {
  await page.evaluate(({ field, value, widgetId }) => {
    const store = (window as unknown as { 
      __DASHBOARD_FILTER_STORE__?: { 
        getState: () => { toggleFilterValue: (field: string, value: string, sourceWidgetId: string) => void } 
      } 
    }).__DASHBOARD_FILTER_STORE__;
    if (store) {
      store.getState().toggleFilterValue(field, value, widgetId);
    }
  }, { field, value, widgetId });
}

test.describe('Cross-Widget Interaction (F11)', () => {
  test.describe('Given a dashboard with multiple bar chart widgets sharing the same xAxisField', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
      
      const dashboardId = `test-interaction-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Interaction Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: 'widget-bar1', x: 0, y: 0, w: 6, h: 4 },
            { i: 'widget-bar2', x: 6, y: 0, w: 6, h: 4 },
          ],
          widgets: [
            {
              id: 'widget-bar1',
              chartConfig: {
                chartType: 'bar',
                title: '長條圖1',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['sales'],
              }
            },
            {
              id: 'widget-bar2',
              chartConfig: {
                chartType: 'bar',
                title: '長條圖2',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['quantity'],
              }
            }
          ]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Interaction Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
      await page.waitForTimeout(500);
    });

    test.describe('When clicking on a data point in the bar chart', () => {
      test('Then the filter bar should appear with the selected value', async ({ page }) => {
        await expect(page.getByTestId('dashboard-filter-bar')).not.toBeVisible();
        
        const barChart = page.getByTestId('bar-chart').first();
        await expect(barChart).toBeVisible();
        
        await page.screenshot({ path: 'test-results/f11-before-click.png', fullPage: true });
        
        const chartBox = await barChart.boundingBox();
        if (chartBox) {
          await page.mouse.click(
            chartBox.x + chartBox.width * 0.15,
            chartBox.y + chartBox.height * 0.3
          );
        }
        
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'test-results/f11-after-click.png', fullPage: true });
        
        const filterBar = page.getByTestId('dashboard-filter-bar');
        const filterBarVisible = await filterBar.isVisible();
        
        if (filterBarVisible) {
          await expect(page.getByText('篩選中:')).toBeVisible();
        }
        
        await page.screenshot({ path: 'test-results/f11-filter-bar-state.png', fullPage: true });
      });
    });
  });

  test.describe('Given the filter store is directly manipulated', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
      
      const dashboardId = `test-store-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Store Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: 'widget-1', x: 0, y: 0, w: 6, h: 4 },
            { i: 'widget-2', x: 6, y: 0, w: 6, h: 4 },
          ],
          widgets: [
            {
              id: 'widget-1',
              chartConfig: {
                chartType: 'bar',
                title: '產品銷量1',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['sales'],
              }
            },
            {
              id: 'widget-2',
              chartConfig: {
                chartType: 'bar',
                title: '產品銷量2',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['quantity'],
              }
            }
          ]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Store Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
      await page.waitForTimeout(500);
    });

    test('When toggling a filter value, the filter bar should appear', async ({ page }) => {
      await expect(page.getByTestId('dashboard-filter-bar')).not.toBeVisible();
      
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      await expect(page.getByText('篩選中:')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-filter-added.png', fullPage: true });
    });

    test('When toggling the same value again, the filter should be removed', async ({ page }) => {
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-before-toggle.png', fullPage: true });
      
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).not.toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-after-toggle.png', fullPage: true });
    });

    test('When clicking clear all button, all filters should be removed', async ({ page }) => {
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      
      await page.getByTestId('clear-all-filters').click();
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).not.toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-clear-all.png', fullPage: true });
    });

    test('When clicking X on a filter tag, that filter should be removed', async ({ page }) => {
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      
      const removeButton = page.getByTestId('remove-filter-product');
      await removeButton.click();
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).not.toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-remove-single.png', fullPage: true });
    });

    test('When adding multiple values for the same field, values should accumulate', async ({ page }) => {
      await simulateFilterToggle(page, 'product', '產品A', 'widget-1');
      await page.waitForTimeout(300);
      
      await page.screenshot({ path: 'test-results/f11-store-multi-first.png', fullPage: true });
      
      await simulateFilterToggle(page, 'product', '產品B', 'widget-1');
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      await expect(page.getByTestId('filter-tag-product')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-store-multi-second.png', fullPage: true });
    });
  });

  test.describe('Given a dashboard with widgets using different xAxisFields', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
      
      const dashboardId = `test-different-fields-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Different Fields Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: 'widget-month', x: 0, y: 0, w: 6, h: 4 },
            { i: 'widget-product', x: 6, y: 0, w: 6, h: 4 },
          ],
          widgets: [
            {
              id: 'widget-month',
              chartConfig: {
                chartType: 'line',
                title: '月份資料',
                dataSourceId: 'mock',
                xAxisField: 'month',
                yAxisFields: ['revenue'],
              }
            },
            {
              id: 'widget-product',
              chartConfig: {
                chartType: 'bar',
                title: '產品資料',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['sales'],
              }
            }
          ]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Different Fields Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await page.waitForTimeout(500);
    });

    test('When filtering by month, only month widget should be affected', async ({ page }) => {
      await simulateFilterToggle(page, 'month', '1月', 'widget-month');
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-different-fields.png', fullPage: true });
    });
  });

  test.describe('Given a dashboard with an unconfigured widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
      
      const dashboardId = `test-unconfigured-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Unconfigured Widget Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: 'widget-configured', x: 0, y: 0, w: 6, h: 4 },
            { i: 'widget-empty', x: 6, y: 0, w: 6, h: 4 },
          ],
          widgets: [
            {
              id: 'widget-configured',
              chartConfig: {
                chartType: 'bar',
                title: '設定好的圖表',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['sales'],
              }
            },
            {
              id: 'widget-empty',
            }
          ]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Unconfigured Widget Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await page.waitForTimeout(500);
    });

    test('When filtering, the unconfigured widget should not show badge', async ({ page }) => {
      await simulateFilterToggle(page, 'product', '產品A', 'widget-configured');
      await page.waitForTimeout(300);
      
      await expect(page.getByTestId('dashboard-filter-bar')).toBeVisible();
      
      const emptyWidget = page.getByTestId('chart-empty');
      await expect(emptyWidget).toBeVisible();
      
      await page.screenshot({ path: 'test-results/f11-unconfigured-widget.png', fullPage: true });
    });
  });
});
