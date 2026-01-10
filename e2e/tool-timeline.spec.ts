import { test, expect } from '@playwright/test';

test.describe('Tool Timeline Widget', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-tool-timeline-${Date.now()}`;
      const widgetId = `widget-tool-timeline-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Tool Timeline Test Dashboard',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 5 }],
          widgets: [{ id: widgetId }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Tool Timeline Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When selecting Tool Timeline chart type', () => {
      test('Then it should show Tool Timeline option in chart type selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();

        await expect(page.getByTestId('chart-type-option-tool-timeline')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-chart-type-option.png' });
      });

      test('Then it should display data source selector after selection', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await expect(page.getByTestId('chart-type-select')).toBeVisible();
        await expect(page.getByTestId('data-source-select')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-datasource-selector.png' });
      });
    });

    test.describe('When configuring Tool Timeline', () => {
      test('Then it should display config fields after selecting data source', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('tool-timeline-config-form')).toBeVisible();
        await expect(page.getByTestId('tool-id-field-select')).toBeVisible();
        await expect(page.getByTestId('start-time-field-select')).toBeVisible();
        await expect(page.getByTestId('end-time-field-select')).toBeVisible();
        await expect(page.getByTestId('status-field-select')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-config-fields.png' });
      });

      test('Then it should render timeline chart after configuring fields', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('tool-timeline-config-form')).toBeVisible();

        await page.getByTestId('tool-id-field-select').click();
        await page.getByRole('option', { name: '機台 ID' }).click();
        await expect(page.getByTestId('tool-id-field-select')).toHaveAttribute('data-state', 'closed');

        await page.getByTestId('start-time-field-select').click();
        await page.getByRole('option', { name: '開始時間' }).click();
        await expect(page.getByTestId('start-time-field-select')).toHaveAttribute('data-state', 'closed');

        await page.getByTestId('end-time-field-select').click();
        await page.getByRole('option', { name: '結束時間' }).click();
        await expect(page.getByTestId('end-time-field-select')).toHaveAttribute('data-state', 'closed');

        await page.getByTestId('status-field-select').click();
        await page.getByRole('option', { name: '狀態' }).click();
        await expect(page.getByTestId('status-field-select')).toHaveAttribute('data-state', 'closed');

        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('tool-timeline')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-chart')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-legend')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-configured.png' });
      });
    });

    test.describe('When configuring status colors', () => {
      test('Then it should display default status colors', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('status-value-input-0')).toHaveValue('running');
        await expect(page.getByTestId('status-label-input-0')).toHaveValue('運作中');
        await expect(page.getByTestId('status-value-input-1')).toHaveValue('error');
        await expect(page.getByTestId('status-label-input-1')).toHaveValue('異常');
        await expect(page.getByTestId('status-value-input-2')).toHaveValue('idle');
        await expect(page.getByTestId('status-label-input-2')).toHaveValue('閒置');

        await page.screenshot({ path: 'test-results/tool-timeline-default-status-colors.png' });
      });

      test('Then it should allow adding new status color', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('add-status-color-button')).toBeVisible();
        await page.getByTestId('add-status-color-button').click();

        await expect(page.getByTestId('status-value-input-3')).toBeVisible();
        await page.getByTestId('status-value-input-3').fill('maintenance');
        await page.getByTestId('status-label-input-3').fill('維護中');

        await page.screenshot({ path: 'test-results/tool-timeline-add-status-color.png' });
      });
    });

    test.describe('When configuring KPI fields', () => {
      test('Then it should allow adding KPI fields', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('add-kpi-field-button')).toBeVisible();
        await page.getByTestId('add-kpi-field-button').click();

        await expect(page.getByTestId('kpi-field-select-0')).toBeVisible();
        await page.getByTestId('kpi-field-select-0').click();
        await page.getByRole('option', { name: '可用率' }).click();

        await page.getByTestId('kpi-label-input-0').fill('A');

        await page.getByTestId('kpi-format-select-0').click();
        await page.getByRole('option', { name: '百分比' }).click();

        await page.screenshot({ path: 'test-results/tool-timeline-add-kpi-field.png' });
      });

      test('Then it should display KPI table after adding KPI fields and configuring', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await page.getByTestId('tool-id-field-select').click();
        await page.getByRole('option', { name: '機台 ID' }).click();

        await page.getByTestId('start-time-field-select').click();
        await page.getByRole('option', { name: '開始時間' }).click();

        await page.getByTestId('end-time-field-select').click();
        await page.getByRole('option', { name: '結束時間' }).click();

        await page.getByTestId('status-field-select').click();
        await page.getByRole('option', { name: '狀態' }).click();

        await page.getByTestId('add-kpi-field-button').click();
        await page.getByTestId('kpi-field-select-0').click();
        await page.getByRole('option', { name: '可用率' }).click();
        await page.getByTestId('kpi-label-input-0').fill('A');
        await page.getByTestId('kpi-format-select-0').click();
        await page.getByRole('option', { name: '百分比' }).click();

        await page.getByTestId('add-kpi-field-button').click();
        await page.getByTestId('kpi-field-select-1').click();
        await page.getByRole('option', { name: '稼動率' }).click();
        await page.getByTestId('kpi-label-input-1').fill('U');
        await page.getByTestId('kpi-label-input-1').blur();
        await page.getByTestId('kpi-format-select-1').click();
        await page.getByRole('option', { name: '百分比' }).click();

        await expect(page.getByTestId('tool-timeline-kpi-table')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-with-kpi-table.png' });
      });
    });

    test.describe('When saving Tool Timeline configuration', () => {
      test('Then the widget should display the saved Tool Timeline', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await expect(page.getByTestId('tool-timeline-config-form')).toBeVisible();

        await page.getByTestId('tool-timeline-title-input').fill('機台狀態監控');

        await page.getByTestId('tool-id-field-select').click();
        await page.getByRole('option', { name: '機台 ID' }).click();

        await page.getByTestId('start-time-field-select').click();
        await page.getByRole('option', { name: '開始時間' }).click();

        await page.getByTestId('end-time-field-select').click();
        await page.getByRole('option', { name: '結束時間' }).click();

        await page.getByTestId('status-field-select').click();
        await page.getByRole('option', { name: '狀態' }).click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('tool-timeline')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('機台狀態監控');

        await page.screenshot({ path: 'test-results/tool-timeline-saved.png' });
      });
    });

    test.describe('When viewing legend', () => {
      test('Then it should display status color legend after configuring', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-tool-timeline').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-tool-status-data').click();

        await page.getByTestId('tool-id-field-select').click();
        await page.getByRole('option', { name: '機台 ID' }).click();

        await page.getByTestId('start-time-field-select').click();
        await page.getByRole('option', { name: '開始時間' }).click();

        await page.getByTestId('end-time-field-select').click();
        await page.getByRole('option', { name: '結束時間' }).click();

        await page.getByTestId('status-field-select').click();
        await page.getByRole('option', { name: '狀態' }).click();

        await expect(page.getByTestId('tool-timeline-legend')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-legend')).toContainText('運作中');
        await expect(page.getByTestId('tool-timeline-legend')).toContainText('異常');
        await expect(page.getByTestId('tool-timeline-legend')).toContainText('閒置');

        await page.screenshot({ path: 'test-results/tool-timeline-legend.png' });
      });
    });
  });

  test.describe('Given a dashboard with an existing Tool Timeline widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-tool-timeline-existing-${Date.now()}`;
      const widgetId = `widget-tool-timeline-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing Tool Timeline Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 5 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'tool-timeline',
              title: '現有機台時間軸',
              dataSourceId: 'tool-status-data',
              toolIdField: 'toolId',
              startTimeField: 'startTime',
              endTimeField: 'endTime',
              statusField: 'status',
              statusColors: [
                { status: 'running', color: '#4CAF50', label: '運作中' },
                { status: 'error', color: '#F44336', label: '異常' },
                { status: 'idle', color: '#D7CCC8', label: '閒置' },
              ],
              kpiFields: [
                { field: 'availability', label: 'A', format: 'percent' },
                { field: 'utilization', label: 'U', format: 'percent' },
              ],
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Existing Tool Timeline Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When viewing the existing Tool Timeline', () => {
      test('Then it should display the configured Tool Timeline with all elements', async ({ page }) => {
        await expect(page.getByTestId('tool-timeline')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-chart')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-kpi-table')).toBeVisible();
        await expect(page.getByTestId('tool-timeline-legend')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('現有機台時間軸');

        await page.screenshot({ path: 'test-results/tool-timeline-existing.png' });
      });
    });

    test.describe('When opening config panel for existing Tool Timeline', () => {
      test('Then it should display the existing configuration', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await expect(page.getByTestId('tool-timeline-config-form')).toBeVisible();

        await page.screenshot({ path: 'test-results/tool-timeline-existing-config.png' });
      });
    });
  });
});
