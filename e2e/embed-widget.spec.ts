import { test, expect } from '@playwright/test';

test.describe('Embed Widget', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-embed-${Date.now()}`;
      const widgetId = `widget-embed-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Embed Test Dashboard',
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
      await page.getByText('Embed Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When opening the config panel', () => {
      test('Then it should show "Widget 類型" label with embed option', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        const typeLabel = page.locator('label:has-text("Widget 類型")');
        await expect(typeLabel).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        const embedOption = page.getByTestId('chart-type-option-embed');
        await expect(embedOption).toBeVisible();
        await expect(embedOption).toContainText('嵌入報表');

        await page.screenshot({ path: 'test-results/embed-type-option.png' });
      });
    });

    test.describe('When selecting embed type', () => {
      test('Then it should show URL input field and hide data source selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        await expect(page.getByTestId('embed-url-input')).toBeVisible();
        await expect(page.getByTestId('data-source-select')).not.toBeVisible();

        await page.screenshot({ path: 'test-results/embed-config-fields.png' });
      });

      test('Then title should default to "嵌入報表"', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        const titleInput = page.getByTestId('chart-title-input');
        await expect(titleInput).toHaveValue('嵌入報表');
      });
    });

    test.describe('When entering an invalid URL', () => {
      test('Then validation error should be shown', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        await page.getByTestId('embed-url-input').fill('not-a-valid-url');
        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('embed-url-error')).toBeVisible();
        await expect(page.getByTestId('embed-url-error')).toContainText('請輸入有效的網址');

        await page.screenshot({ path: 'test-results/embed-url-validation-error.png' });
      });
    });

    test.describe('When entering a valid URL', () => {
      test('Then preview should be displayed', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        await page.getByTestId('embed-url-input').fill('https://example.com');
        
        await expect(page.getByTestId('embed-preview')).toBeVisible();
        await expect(page.getByTestId('embed-preview-iframe')).toBeVisible();

        await page.screenshot({ path: 'test-results/embed-preview-visible.png' });
      });
    });

    test.describe('When saving embed configuration', () => {
      test('Then the widget should display the embedded content', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        await page.getByTestId('chart-title-input').clear();
        await page.getByTestId('chart-title-input').fill('我的報表');
        await page.getByTestId('embed-url-input').fill('https://example.com');

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('widget-title')).toContainText('我的報表');
        await expect(page.getByTestId('embed-widget')).toBeVisible();
        await expect(page.getByTestId('embed-iframe')).toBeVisible();

        await page.screenshot({ path: 'test-results/embed-widget-saved.png' });
      });

      test('Then empty title should show default "嵌入報表"', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await page.waitForSelector('[data-testid="chart-config-panel"]');

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-embed').click();

        await page.getByTestId('chart-title-input').clear();
        await page.getByTestId('embed-url-input').fill('https://example.com');

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('widget-title')).toContainText('嵌入報表');

        await page.screenshot({ path: 'test-results/embed-widget-default-title.png' });
      });
    });
  });

  test.describe('Given a widget with existing embed configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-embed-existing-${Date.now()}`;
      const widgetId = `widget-embed-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Embed Existing Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 6, h: 4 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'embed',
              title: '現有報表',
              url: 'https://example.com'
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Embed Existing Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test('When opening the config panel again, Then it should show the saved configuration', async ({ page }) => {
      await page.getByTestId('widget-config-button').click();
      await page.waitForSelector('[data-testid="chart-config-panel"]');

      await expect(page.getByTestId('chart-type-select')).toContainText('嵌入報表');
      await expect(page.getByTestId('embed-url-input')).toHaveValue('https://example.com');

      await page.screenshot({ path: 'test-results/embed-existing-config.png' });
    });

    test('When viewing the widget, Then it should display the embed widget', async ({ page }) => {
      await expect(page.getByTestId('widget-title')).toContainText('現有報表');
      await expect(page.getByTestId('embed-widget')).toBeVisible();

      await page.screenshot({ path: 'test-results/embed-widget-displayed.png' });
    });
  });
});
