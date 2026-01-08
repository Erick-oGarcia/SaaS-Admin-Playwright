import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel - Essential for speed */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only to catch flaky tests */
  retries: process.env.CI ? 2 : 0,
  /* Limit workers on CI to avoid resource congestion */
  workers: process.env.CI ? 1 : undefined,
  
  /* Reporter configuration: HTML for humans, Allure for the team */
  reporter: [
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL for the SaaS Admin Panel */
    baseURL: 'https://www.saucedemo.com', // We will start with this demo site

    /* Collect trace when retrying the failed test for deep debugging */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers and Setup dependencies */
  projects: [
    // --- STEP 1: Global Authentication Setup ---
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // --- STEP 2: Main Browser Tests ---
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // This tells Playwright where to look for the saved session
        storageState: 'playwright/fixtures/adminStorageState.json',
      },
      dependencies: ['setup'], // Ensures login happens BEFORE tests
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: 'playwright/fixtures/adminStorageState.json',
      },
      dependencies: ['setup'],
    },
  ],
});