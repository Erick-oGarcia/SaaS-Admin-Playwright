import { test as setup, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// Define the path where the session JSON will be stored
const adminStoragePath = 'playwright/fixtures/adminStorageState.json';

setup('authenticate as admin', async ({ page }) => {
  // Ensure the directory exists
  const dir = path.dirname(adminStoragePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 1. Navigate to the login page
  // Since we set baseURL in playwright.config.ts, we use a relative path
  await page.goto('/');

  // 2. Perform Login (Using SauceDemo credentials)
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // 3. Verify Login Success
  // We check for an element that only exists on the internal Dashboard
  await expect(page.locator('.app_logo')).toBeVisible();
  await expect(page).toHaveURL(/.*inventory.html/);

  // 4. Save the storage state (Cookies + LocalStorage) to a JSON file
  await page.context().storageState({ path: adminStoragePath });
  
  console.log('✅ Authentication successful. Session saved to:', adminStoragePath);
});