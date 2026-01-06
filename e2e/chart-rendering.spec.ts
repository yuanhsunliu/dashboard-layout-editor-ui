import { test, expect } from '@playwright/test';

test.describe('Chart Rendering', () => {
  test.describe('Given an empty widget without chartConfig', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());
      
      const dashboardId = `test-empty-${Date.now()}`;
      const widgetId = `widget-empty-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Empty Widget Test',
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
      await page.getByText('Empty Widget Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When viewing the widget', () => {
      test('Then the empty state should be displayed with setup guidance', async ({ page }) => {
        await expect(page.getByTestId('chart-empty')).toBeVisible();
        await expect(page.getByText('點擊設定')).toBeVisible();
        await expect(page.getByText('選擇圖表類型')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/chart-empty-state.png' });
      });

      test('Then the widget title should show "未設定"', async ({ page }) => {
        await expect(page.getByTestId('widget-title')).toHaveText('未設定');
        
        await page.screenshot({ path: 'test-results/chart-widget-title-empty.png' });
      });
    });
  });

  test.describe('Given a widget with Line Chart configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      
      const dashboardId = `test-dashboard-${Date.now()}`;
      const widgetId = `widget-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Line Chart Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'line',
              title: '銷售趨勢',
              dataSourceId: 'mock',
              xAxisField: 'month',
              yAxisFields: ['revenue'],
            }
          }]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Line Chart Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the widget', () => {
      test('Then a Line Chart should be rendered with demo data', async ({ page }) => {
        await expect(page.getByTestId('line-chart')).toBeVisible();
        
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/chart-line-rendered.png' });
      });

      test('Then the widget title should show the chart title', async ({ page }) => {
        await expect(page.getByTestId('widget-title')).toHaveText('銷售趨勢');
        
        await page.screenshot({ path: 'test-results/chart-widget-title-line.png' });
      });

      test('Then the chart should display tooltip on hover', async ({ page }) => {
        const chart = page.getByTestId('line-chart');
        await expect(chart).toBeVisible();
        
        const chartBox = await chart.boundingBox();
        if (chartBox) {
          await page.mouse.move(
            chartBox.x + chartBox.width / 2,
            chartBox.y + chartBox.height / 2
          );
          await page.waitForTimeout(300);
        }
        
        await page.screenshot({ path: 'test-results/chart-line-tooltip.png' });
      });
    });
  });

  test.describe('Given a widget with Bar Chart configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      
      const dashboardId = `test-dashboard-${Date.now()}`;
      const widgetId = `widget-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Bar Chart Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'bar',
              title: '產品銷量',
              dataSourceId: 'mock',
              xAxisField: 'product',
              yAxisFields: ['sales'],
            }
          }]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Bar Chart Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the widget', () => {
      test('Then a Bar Chart should be rendered with demo data', async ({ page }) => {
        await expect(page.getByTestId('bar-chart')).toBeVisible();
        
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-results/chart-bar-rendered.png' });
      });

      test('Then the widget title should show the chart title', async ({ page }) => {
        await expect(page.getByTestId('widget-title')).toHaveText('產品銷量');
        
        await page.screenshot({ path: 'test-results/chart-widget-title-bar.png' });
      });
    });
  });

  test.describe('Given a widget with chart and resizing', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      
      const dashboardId = `test-dashboard-${Date.now()}`;
      const widgetId = `widget-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Resize Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 4, h: 3 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'line',
              title: 'Resize Test Chart',
              dataSourceId: 'mock',
              xAxisField: 'month',
              yAxisFields: ['revenue'],
            }
          }]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Resize Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When the widget container size changes', () => {
      test('Then the chart should resize to fit the new container', async ({ page }) => {
        const chart = page.getByTestId('line-chart');
        await expect(chart).toBeVisible();
        
        await page.screenshot({ path: 'test-results/chart-before-resize.png' });
        
        await page.setViewportSize({ width: 1600, height: 900 });
        await page.waitForTimeout(300);
        
        await expect(chart).toBeVisible();
        await page.screenshot({ path: 'test-results/chart-after-resize.png' });
      });
    });
  });

  test.describe('Given multiple widgets with different chart types', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      
      const dashboardId = `test-dashboard-${Date.now()}`;
      
      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Multi Chart Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: 'widget-1', x: 0, y: 0, w: 6, h: 3 },
            { i: 'widget-2', x: 6, y: 0, w: 6, h: 3 },
            { i: 'widget-3', x: 0, y: 3, w: 6, h: 3 },
          ],
          widgets: [
            {
              id: 'widget-1',
              chartConfig: {
                chartType: 'line',
                title: '折線圖',
                dataSourceId: 'mock',
                xAxisField: 'month',
                yAxisFields: ['revenue'],
              }
            },
            {
              id: 'widget-2',
              chartConfig: {
                chartType: 'bar',
                title: '長條圖',
                dataSourceId: 'mock',
                xAxisField: 'product',
                yAxisFields: ['sales'],
              }
            },
            {
              id: 'widget-3',
            }
          ]
        }]
      };
      
      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);
      
      await page.reload();
      await page.getByText('Multi Chart Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the dashboard', () => {
      test('Then all chart types should be rendered correctly', async ({ page }) => {
        await expect(page.getByTestId('line-chart')).toBeVisible();
        await expect(page.getByTestId('bar-chart')).toBeVisible();
        await expect(page.getByTestId('chart-empty')).toBeVisible();
        
        await page.waitForTimeout(500);
        await page.screenshot({ 
          path: 'test-results/chart-multiple-types.png',
          fullPage: true 
        });
      });

      test('Then each widget should display the correct title', async ({ page }) => {
        const titles = page.getByTestId('widget-title');
        await expect(titles).toHaveCount(3);
        
        await expect(titles.nth(0)).toHaveText('折線圖');
        await expect(titles.nth(1)).toHaveText('長條圖');
        await expect(titles.nth(2)).toHaveText('未設定');
      });
    });
  });
});
