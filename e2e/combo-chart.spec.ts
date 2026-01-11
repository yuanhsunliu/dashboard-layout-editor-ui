import { test, expect } from '@playwright/test';

test.describe('Combo Chart Plugin', () => {
  test.describe('Given a dashboard with an empty widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-combo-${Date.now()}`;
      const widgetId = `widget-combo-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Combo Chart Test Dashboard',
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
      await page.getByText('Combo Chart Test Dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When selecting Combo Chart type', () => {
      test('Then Combo Chart option should be available in chart type selector', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        
        await expect(page.getByTestId('chart-type-option-combo')).toBeVisible();
        await page.screenshot({ path: 'test-results/combo-chart-type-option.png' });
      });

      test('Then selecting Combo Chart should show combo-specific config fields', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-combo').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('combo-chart-config-fields')).toBeVisible();
        await expect(page.getByTestId('combo-x-axis-select')).toBeVisible();
        await expect(page.getByTestId('combo-left-y-axis-checkboxes')).toBeVisible();
        await expect(page.getByTestId('combo-right-y-axis-checkboxes')).toBeVisible();
        await expect(page.getByTestId('combo-left-y-label-input')).toBeVisible();
        await expect(page.getByTestId('combo-right-y-label-input')).toBeVisible();
        await expect(page.getByTestId('combo-smooth-switch')).toBeVisible();

        await page.screenshot({ path: 'test-results/combo-chart-config-fields.png' });
      });
    });

    test.describe('When configuring Combo Chart fields', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-combo').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await expect(page.getByTestId('combo-chart-config-fields')).toBeVisible();
      });

      test('Then selecting X-axis, left Y-axis (Bar), and right Y-axis (Line) should show preview', async ({ page }) => {
        // Select X-axis
        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        // Select left Y-axis (Bar) - first number field
        await page.getByTestId('combo-left-y-field-revenue').click();

        // Select right Y-axis (Line) - second number field
        await page.getByTestId('combo-right-y-field-profit').click();

        // Verify preview is visible
        await expect(page.getByTestId('chart-preview')).toBeVisible();
        await expect(page.getByTestId('combo-chart')).toBeVisible();

        await page.screenshot({ path: 'test-results/combo-chart-preview.png' });
      });

      test('Then entering custom Y-axis labels should be possible', async ({ page }) => {
        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        await page.getByTestId('combo-left-y-field-revenue').click();
        
        // Scroll to right Y-axis section
        const rightYAxisSection = page.getByTestId('combo-right-y-axis-checkboxes');
        await rightYAxisSection.scrollIntoViewIfNeeded();
        await page.getByTestId('combo-right-y-field-profit').click();

        // Enter custom labels - scroll to inputs
        const leftLabelInput = page.getByTestId('combo-left-y-label-input');
        await leftLabelInput.scrollIntoViewIfNeeded();
        await leftLabelInput.fill('銷售額（萬）');
        
        const rightLabelInput = page.getByTestId('combo-right-y-label-input');
        await rightLabelInput.scrollIntoViewIfNeeded();
        await rightLabelInput.fill('利潤率（%）');

        await expect(leftLabelInput).toHaveValue('銷售額（萬）');
        await expect(rightLabelInput).toHaveValue('利潤率（%）');

        await page.screenshot({ path: 'test-results/combo-chart-custom-labels.png' });
      });

      test('Then enabling smooth line option should be possible', async ({ page }) => {
        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        await page.getByTestId('combo-left-y-field-revenue').click();
        
        // Scroll to right Y-axis section
        const rightYAxisSection = page.getByTestId('combo-right-y-axis-checkboxes');
        await rightYAxisSection.scrollIntoViewIfNeeded();
        await page.getByTestId('combo-right-y-field-profit').click();

        // Enable smooth line - scroll to switch
        const smoothSwitch = page.getByTestId('combo-smooth-switch');
        await smoothSwitch.scrollIntoViewIfNeeded();
        await smoothSwitch.click();

        await expect(smoothSwitch).toBeChecked();

        await page.screenshot({ path: 'test-results/combo-chart-smooth-enabled.png' });
      });
    });

    test.describe('When saving Combo Chart configuration', () => {
      test('Then the widget should display the configured combo chart', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        // Set title
        await page.getByLabel('標題').fill('銷售與利潤分析');

        // Select combo chart type
        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-combo').click();

        // Select data source
        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        // Configure fields
        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        await page.getByTestId('combo-left-y-field-revenue').click();
        
        // Scroll to right Y-axis section
        const rightYAxisSection = page.getByTestId('combo-right-y-axis-checkboxes');
        await rightYAxisSection.scrollIntoViewIfNeeded();
        await page.getByTestId('combo-right-y-field-profit').click();

        // Set custom labels - scroll to inputs
        const leftLabelInput = page.getByTestId('combo-left-y-label-input');
        await leftLabelInput.scrollIntoViewIfNeeded();
        await leftLabelInput.fill('銷售額');
        
        const rightLabelInput = page.getByTestId('combo-right-y-label-input');
        await rightLabelInput.scrollIntoViewIfNeeded();
        await rightLabelInput.fill('利潤');

        // Save - scroll to button
        const saveButton = page.getByTestId('config-save-button');
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        // Verify
        await expect(page.getByTestId('chart-config-panel')).not.toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('銷售與利潤分析');
        await expect(page.getByTestId('combo-chart')).toBeVisible();

        await page.screenshot({ path: 'test-results/combo-chart-saved.png' });
      });
    });

    test.describe('When validation fails', () => {
      test('Then saving without left Y-axis fields should show error', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-combo').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        // Only select right Y-axis, skip left Y-axis - scroll to right section
        const rightYAxisSection = page.getByTestId('combo-right-y-axis-checkboxes');
        await rightYAxisSection.scrollIntoViewIfNeeded();
        await page.getByTestId('combo-right-y-field-profit').click();

        // Scroll to save button
        const saveButton = page.getByTestId('config-save-button');
        await saveButton.scrollIntoViewIfNeeded();
        await saveButton.click();

        await expect(page.getByText('請至少選擇一個左軸欄位（Bar）')).toBeVisible();

        await page.screenshot({ path: 'test-results/combo-chart-validation-left-y.png' });
      });

      test('Then saving without right Y-axis fields should show error', async ({ page }) => {
        await page.getByTestId('widget-config-button').click();
        await expect(page.getByTestId('chart-config-panel')).toBeVisible();

        await page.getByTestId('chart-type-select').click();
        await page.getByTestId('chart-type-option-combo').click();

        await page.getByTestId('data-source-select').click();
        await page.getByTestId('data-source-option-sales-data').click();

        await page.getByTestId('combo-x-axis-select').click();
        await page.getByTestId('combo-x-axis-option-date').click();

        // Only select left Y-axis, skip right Y-axis
        await page.getByTestId('combo-left-y-field-revenue').click();

        await page.getByTestId('config-save-button').click();

        await expect(page.getByText('請至少選擇一個右軸欄位（Line）')).toBeVisible();

        await page.screenshot({ path: 'test-results/combo-chart-validation-right-y.png' });
      });
    });
  });

  test.describe('Given a widget with existing Combo Chart configuration', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => localStorage.clear());

      const dashboardId = `test-combo-existing-${Date.now()}`;
      const widgetId = `widget-combo-existing-${Date.now()}`;

      const testData = {
        dashboards: [{
          id: dashboardId,
          name: 'Existing Combo Chart Test',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          theme: 'light',
          layout: [{ i: widgetId, x: 0, y: 0, w: 8, h: 5 }],
          widgets: [{
            id: widgetId,
            chartConfig: {
              chartType: 'combo',
              title: '現有組合圖',
              dataSourceId: 'sales-data',
              xAxisField: 'date',
              leftYAxisFields: ['revenue'],
              rightYAxisFields: ['profit'],
              leftYAxisLabel: '銷售額（萬）',
              rightYAxisLabel: '利潤率（%）',
              smooth: true,
            }
          }]
        }]
      };

      await page.evaluate((data) => {
        localStorage.setItem('dashboard-setting', JSON.stringify(data));
      }, testData);

      await page.reload();
      await page.getByText('Existing Combo Chart Test').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test('Then the widget should display the existing combo chart', async ({ page }) => {
      await expect(page.getByTestId('widget-title')).toHaveText('現有組合圖');
      await expect(page.getByTestId('combo-chart')).toBeVisible();

      await page.screenshot({ path: 'test-results/combo-chart-existing-display.png' });
    });

    test('Then opening config panel should show existing values', async ({ page }) => {
      await page.getByTestId('widget-config-button').click();
      await expect(page.getByTestId('chart-config-panel')).toBeVisible();

      await expect(page.getByLabel('標題')).toHaveValue('現有組合圖');
      await expect(page.getByTestId('combo-left-y-label-input')).toHaveValue('銷售額（萬）');
      await expect(page.getByTestId('combo-right-y-label-input')).toHaveValue('利潤率（%）');
      await expect(page.getByTestId('combo-smooth-switch')).toBeChecked();

      await page.screenshot({ path: 'test-results/combo-chart-existing-config.png' });
    });
  });
});
