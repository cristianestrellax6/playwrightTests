import { test, expect } from '../src/fixtures/app.fixtures';

const userData = require('../test-data/user-data.json');

async function openLoginForm(loginPage: any) {
  await loginPage.navigateTo(process.env.BASE_URL ?? 'https://openweathermap.org/');
  await loginPage.openLoginPageFromHeader();

  await expect(loginPage.emailInput).toBeVisible();
  await expect(loginPage.passwordInput).toBeVisible();
  await expect(loginPage.submitButton).toBeVisible();
}

test.describe('Login combinations', () => {
  test('valid credentials login succeeds', async ({ loginPage }) => {
    test.skip(!process.env.TEST_PASSWORD, 'TEST_PASSWORD must be set for the successful login scenario.');

    await openLoginForm(loginPage);
    await loginPage.enterEmail(userData.validUser.username);
    await loginPage.enterPassword(process.env.TEST_PASSWORD!);
    await loginPage.submit();

    await expect(loginPage.page.locator('body')).toContainText(/my profile|log out|logout|signed in/i, { timeout: 15000 });
  });

  test('invalid password is rejected', async ({ loginPage }) => {
    await openLoginForm(loginPage);
    await loginPage.enterEmail(userData.validUser.username);
    await loginPage.enterPassword('wrong-password');
    await loginPage.submit();

    await expect(loginPage.page.locator('body')).toContainText(/invalid|incorrect|error|required/i, { timeout: 15000 });
  });

  test('invalid username is rejected', async ({ loginPage }) => {
    await openLoginForm(loginPage);
    await loginPage.enterEmail(userData.invalidUser.username);
    await loginPage.enterPassword(process.env.TEST_PASSWORD ?? 'wrong-password');
    await loginPage.submit();

    await expect(loginPage.page.locator('body')).toContainText(/invalid|incorrect|error|required/i, { timeout: 15000 });
  });

  test('empty username and password are blocked', async ({ loginPage }) => {
    await openLoginForm(loginPage);
    await loginPage.submit();

    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.page.locator('body')).toContainText(/sign in|login|required/i, { timeout: 15000 });
  });

  test('empty password with valid username is blocked', async ({ loginPage }) => {
    await openLoginForm(loginPage);
    await loginPage.enterEmail(userData.validUser.username);
    await loginPage.submit();

    await expect(loginPage.emailInput).toHaveValue(userData.validUser.username);
    await expect(loginPage.passwordInput).toHaveValue('');
    await expect(loginPage.page.locator('body')).toContainText(/required|password/i, { timeout: 15000 });
  });

  test('empty username with valid password is blocked', async ({ loginPage }) => {
    await openLoginForm(loginPage);
    await loginPage.enterPassword(process.env.TEST_PASSWORD ?? 'password');
    await loginPage.submit();

    await expect(loginPage.emailInput).toHaveValue('');
    await expect(loginPage.passwordInput).toHaveValue("");
    await expect(loginPage.page.locator('body')).toContainText(/invalid|email|password/i, { timeout: 15000 });
  });
});
