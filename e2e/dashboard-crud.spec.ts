import { test, expect } from '@playwright/test';

test.describe('Dashboard CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Given a user on the dashboard list page', () => {
    test.describe('When there are no dashboards', () => {
      test('Then the empty state should be displayed', async ({ page }) => {
        await expect(page.getByTestId('empty-state')).toBeVisible();
        await expect(page.getByText('尚無 Dashboard')).toBeVisible();
        await expect(page.getByTestId('create-first-dashboard')).toBeVisible();
      });
    });

    test.describe('When clicking "建立第一個 Dashboard" button', () => {
      test('Then a new dashboard should be created and navigate to editor', async ({ page }) => {
        await page.getByTestId('create-first-dashboard').click();
        await expect(page).toHaveURL(/\/dashboard\/.+/);
        await expect(page.getByTestId('dashboard-title')).toHaveText('未命名 Dashboard');
      });
    });
  });

  test.describe('Given a user with existing dashboards', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('create-first-dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
      await page.getByTestId('back-button').click();
      await expect(page).toHaveURL('/');
    });

    test.describe('When viewing the dashboard list', () => {
      test('Then dashboards should be displayed as cards', async ({ page }) => {
        await expect(page.getByTestId('dashboard-list')).toBeVisible();
        await expect(page.getByTestId('dashboard-name')).toHaveText('未命名 Dashboard');
      });
    });

    test.describe('When clicking the "新增 Dashboard" button', () => {
      test('Then a new dashboard should be created', async ({ page }) => {
        await page.getByTestId('create-dashboard').click();
        await expect(page).toHaveURL(/\/dashboard\/.+/);
      });
    });

    test.describe('When clicking on a dashboard card', () => {
      test('Then it should navigate to the editor page', async ({ page }) => {
        await page.getByTestId('dashboard-name').click();
        await expect(page).toHaveURL(/\/dashboard\/.+/);
        await expect(page.getByTestId('widget-empty-state')).toBeVisible();
      });
    });

    test.describe('When opening the card menu and clicking "重新命名"', () => {
      test('Then the inline edit input should appear', async ({ page }) => {
        await page.getByTestId('card-menu-trigger').click();
        await page.getByTestId('rename-menu-item').click();
        await expect(page.getByTestId('inline-edit-input')).toBeVisible();
      });

      test('Then the name should be updated after saving', async ({ page }) => {
        await page.getByTestId('card-menu-trigger').click();
        await page.getByTestId('rename-menu-item').click();
        const input = page.getByTestId('inline-edit-input');
        await input.fill('銷售報表');
        await page.locator('body').click({ position: { x: 10, y: 10 } });
        await expect(page.getByTestId('dashboard-name')).toHaveText('銷售報表');
      });
    });

    test.describe('When opening the card menu and clicking "刪除"', () => {
      test('Then the delete confirmation dialog should appear', async ({ page }) => {
        await page.getByTestId('card-menu-trigger').click();
        await page.getByTestId('delete-menu-item').click();
        await expect(page.getByTestId('delete-confirm-dialog')).toBeVisible();
        await expect(page.getByText('確定要刪除「未命名 Dashboard」嗎？')).toBeVisible();
      });

      test('Then clicking "取消" should close the dialog', async ({ page }) => {
        await page.getByTestId('card-menu-trigger').click();
        await page.getByTestId('delete-menu-item').click();
        await page.getByTestId('cancel-delete').click();
        await expect(page.getByTestId('delete-confirm-dialog')).not.toBeVisible();
        await expect(page.getByTestId('dashboard-name')).toBeVisible();
      });

      test('Then clicking "刪除" should remove the dashboard', async ({ page }) => {
        await page.getByTestId('card-menu-trigger').click();
        await page.getByTestId('delete-menu-item').click();
        await page.getByTestId('confirm-delete').click();
        await expect(page.getByTestId('empty-state')).toBeVisible();
      });
    });
  });

  test.describe('Given a user on the dashboard editor page', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('create-first-dashboard').click();
      await expect(page).toHaveURL(/\/dashboard\/.+/);
    });

    test.describe('When clicking on the dashboard title', () => {
      test('Then the inline edit input should appear', async ({ page }) => {
        await page.getByTestId('dashboard-title').click();
        await expect(page.getByTestId('inline-edit-input')).toBeVisible();
      });

      test('Then the name should be updated after saving', async ({ page }) => {
        await page.getByTestId('dashboard-title').click();
        const input = page.getByTestId('inline-edit-input');
        await input.fill('行銷分析');
        await input.press('Enter');
        await expect(page.getByTestId('dashboard-title')).toHaveText('行銷分析');
      });
    });

    test.describe('When clicking the back button', () => {
      test('Then it should navigate back to the list page', async ({ page }) => {
        await page.getByTestId('back-button').click();
        await expect(page).toHaveURL('/');
        await expect(page.getByTestId('dashboard-list')).toBeVisible();
      });
    });
  });

  test.describe('Rename validation', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByTestId('create-first-dashboard').click();
      await page.getByTestId('back-button').click();
    });

    test('When entering an empty name, Then an error should be displayed', async ({ page }) => {
      await page.getByTestId('card-menu-trigger').click();
      await page.getByTestId('rename-menu-item').click();
      const input = page.getByTestId('inline-edit-input');
      await input.fill('   ');
      await input.press('Enter');
      await expect(page.getByText('名稱不可為空')).toBeVisible();
    });

    test('When entering a name over 50 characters, Then an error should be displayed', async ({ page }) => {
      await page.getByTestId('card-menu-trigger').click();
      await page.getByTestId('rename-menu-item').click();
      const input = page.getByTestId('inline-edit-input');
      await input.fill('a'.repeat(51));
      await input.press('Enter');
      await expect(page.getByText('名稱不可超過 50 字元')).toBeVisible();
    });
  });
});
