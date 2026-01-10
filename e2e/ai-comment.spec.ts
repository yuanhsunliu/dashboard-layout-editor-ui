import { test, expect } from '@playwright/test';

test.describe('AI Comment Widget', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-ai-${Date.now()}`;
      const widgetId = `widget-ai-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'AI Comment Test Dashboard',
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
      await page.getByText('AI Comment Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When selecting AI Comment chart type', () => {
      test('Then it should show AI 洞察 option in chart type selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        
        await expect(page.getByTestId('chart-type-option-ai-comment')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-chart-type-option.png' });
      });

      test('Then it should display AI Comment config fields', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();
        
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-ai-comment').click();

        await expect(page.getByTestId('ai-comment-config-form')).toBeVisible();
        await expect(page.getByTestId('target-widget-select')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-config-fields.png' });
      });
    });

    test.describe('When saving AI Comment without target widget', () => {
      test('Then it should show validation error', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-ai-comment').click();
        
        await page.getByTestId('config-save-button').click();
        
        // Check for validation error message in the config form
        await expect(page.getByTestId('ai-comment-config-form').getByText('請選擇要分析的 Widget')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-validation-error.png' });
      });
    });
  });

  test.describe('Given an existing AI Comment widget with target', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-ai-existing-${Date.now()}`;
      const lineWidgetId = `widget-line-${Date.now()}`;
      const aiWidgetId = `widget-ai-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'AI Comment Existing Dashboard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [
            { i: lineWidgetId, x: 0, y: 0, w: 6, h: 4 },
            { i: aiWidgetId, x: 6, y: 0, w: 6, h: 4 }
          ],
          widgets: [
            { 
              id: lineWidgetId,
              chartConfig: {
                chartType: 'line',
                title: '銷售趨勢',
                dataSourceId: 'ds-sales',
                xAxisField: 'month',
                yAxisFields: ['revenue']
              }
            },
            { 
              id: aiWidgetId,
              chartConfig: {
                chartType: 'ai-comment',
                title: '測試洞察',
                targetWidgetId: lineWidgetId
              }
            }
          ]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('AI Comment Existing Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When viewing the existing AI Comment', () => {
      test('Then it should display the AI Comment with analyze button', async ({ page }) => {
        await expect(page.getByTestId('ai-comment')).toBeVisible();
        await expect(page.getByTestId('ai-analyze-button')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-existing.png' });
      });
    });

    test.describe('When clicking analyze button', () => {
      test('Then it should show loading state and then display insight', async ({ page }) => {
        await page.getByTestId('ai-analyze-button').click();
        
        await expect(page.getByTestId('ai-loading')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-loading.png' });
        
        await expect(page.getByTestId('ai-insight-content')).toBeVisible({ timeout: 5000 });
        await expect(page.getByTestId('ai-analyzed-at')).toBeVisible();
        await expect(page.getByTestId('ai-reanalyze-button')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/ai-comment-insight.png' });
      });
    });

    test.describe('When clicking reanalyze button', () => {
      test('Then it should trigger new analysis', async ({ page }) => {
        await page.getByTestId('ai-analyze-button').click();
        await expect(page.getByTestId('ai-insight-content')).toBeVisible({ timeout: 5000 });
        
        const firstTime = await page.getByTestId('ai-analyzed-at').textContent();
        
        await page.waitForTimeout(1000);
        await page.getByTestId('ai-reanalyze-button').click();
        
        await expect(page.getByTestId('ai-loading')).toBeVisible();
        await expect(page.getByTestId('ai-insight-content')).toBeVisible({ timeout: 5000 });
        
        const secondTime = await page.getByTestId('ai-analyzed-at').textContent();
        expect(secondTime).not.toEqual(firstTime);
        
        await page.screenshot({ path: 'test-results/ai-comment-reanalyzed.png' });
      });
    });

    test.describe('When opening config panel for existing AI Comment', () => {
      test('Then it should display the existing configuration', async ({ page }) => {
        // Click config button - use nth to get second widget (AI Comment is second widget)
        await page.getByTestId('widget-config-button').nth(1).click();

        await expect(page.getByTestId('ai-comment-title-input')).toHaveValue('測試洞察');
        
        await page.screenshot({ path: 'test-results/ai-comment-existing-config.png' });
      });
    });
  });
});
