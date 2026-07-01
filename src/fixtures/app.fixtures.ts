// src/fixtures/app.fixtures.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

// Define the types for your custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

// Extend base test with our new pages
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

export { expect } from '@playwright/test';

