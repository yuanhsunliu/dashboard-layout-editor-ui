import { test, expect } from '@playwright/test';

test.describe('Widget Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByTestId('create-first-dashboard').click();
    await expect(page).toHaveURL(/\/dashboard\/.+/);
  });

  test.describe('Given an empty dashboard', () => {
    test.describe('When viewing the editor page', () => {
      test('Then the empty state should be displayed with guidance', async ({ page }) => {
        await expect(page.getByTestId('widget-empty-state')).toBeVisible();
        await expect(page.getByText('尚無 Widget')).toBeVisible();
        await expect(page.getByTestId('add-first-widget-button')).toBeVisible();
        await expect(page.getByText('新增第一個 Widget')).toBeVisible();
      });
    });

    test.describe('When clicking "新增第一個 Widget" button', () => {
      test('Then a new widget should be added to the dashboard', async ({ page }) => {
        await page.getByTestId('add-first-widget-button').click();
        await expect(page.getByTestId('widget-empty-state')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-grid')).toBeVisible();
        await expect(page.getByTestId('widget-title')).toHaveText('未設定');
      });
    });
  });

  test.describe('Given a dashboard with one widget', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('add-first-widget-button').click();
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When viewing an unconfigured widget', () => {
      test('Then the widget should show "未設定" title', async ({ page }) => {
        await expect(page.getByTestId('widget-title')).toHaveText('未設定');
      });

      test('Then the widget should show empty state with setup hint', async ({ page }) => {
        await expect(page.getByTestId('chart-empty')).toBeVisible();
        await expect(page.getByText('點擊設定')).toBeVisible();
      });
    });

    test.describe('When clicking "新增 Widget" button', () => {
      test('Then another widget should be added', async ({ page }) => {
        await page.getByTestId('add-widget-button').click();
        const widgets = page.locator('[data-testid^="widget-widget-"]');
        await expect(widgets).toHaveCount(2);
      });
    });

    test.describe('When clicking the widget delete button', () => {
      test('Then the widget should be removed immediately', async ({ page }) => {
        await page.getByTestId('widget-delete-button').click();
        await expect(page.getByTestId('widget-empty-state')).toBeVisible();
      });
    });

    test.describe('When adding multiple widgets and deleting one', () => {
      test('Then only the deleted widget should be removed', async ({ page }) => {
        await page.getByTestId('add-widget-button').click();
        const widgets = page.locator('[data-testid^="widget-widget-"]');
        await expect(widgets).toHaveCount(2);
        
        const firstDeleteButton = page.getByTestId('widget-delete-button').first();
        await firstDeleteButton.click();
        await expect(widgets).toHaveCount(1);
      });
    });
  });

  test.describe('Given widget layout changes', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('add-first-widget-button').click();
      await expect(page.getByTestId('dashboard-grid')).toBeVisible();
    });

    test.describe('When a widget is added', () => {
      test('Then changes should be auto-saved', async ({ page }) => {
        await page.getByTestId('add-widget-button').click();
        await page.waitForTimeout(600);
        
        await page.reload();
        const widgets = page.locator('[data-testid^="widget-widget-"]');
        await expect(widgets).toHaveCount(2);
      });
    });

    test.describe('When a widget is deleted', () => {
      test('Then changes should be persisted after reload', async ({ page }) => {
        await page.getByTestId('widget-delete-button').click();
        await page.waitForTimeout(100);
        
        await page.reload();
        await expect(page.getByTestId('widget-empty-state')).toBeVisible();
      });
    });
  });

  test.describe('Widget ID format', () => {
    test('When a widget is added, Then it should have correct ID format', async ({ page }) => {
      await page.getByTestId('add-first-widget-button').click();
      
      const widget = page.locator('[data-testid^="widget-widget-"]');
      await expect(widget).toBeVisible();
      const testId = await widget.getAttribute('data-testid');
      expect(testId).toMatch(/^widget-widget-\d+-[a-z0-9]+$/);
    });
  });
});
