// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://openweathermap.org/');
//   await page.getByRole('link', { name: 'Login' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).click();
//   await page.getByRole('textbox', { name: 'Email' }).fill('cristianestrella.86@gmail.com');
//   await page.getByRole('textbox', { name: 'Password' }).click();
//   await page.getByRole('textbox', { name: 'Password' }).fill('');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   
// });


// tests/auth.spec.ts
import { test, expect } from '../src/fixtures/app.fixtures';
import * as testData from '../test-data/user-data.json';

test.describe('Authentication Flow', () => {
  
  test('should log in successfully with valid credentials', async ({ loginPage, homePage }) => {

    await loginPage.navigateTo(process.env.BASE_URL);
    
    // Using environment variables (Secrets) and JSON data (Static strings)
    await loginPage.login(
      testData.validUser.username, 
      process.env.TEST_PASSWORD 
    );

    await expect(homePage.successVisible()).resolves.toBe(true);
    await expect(homePage.getSuccessText()).resolves.toContain('Signed in successfully.');
  });
});
