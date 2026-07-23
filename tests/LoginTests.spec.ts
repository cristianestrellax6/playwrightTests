import { test, expect } from '../src/fixtures/app.fixtures';
import * as testData from '../test-data/user-data.json';

test.describe('Authentication Flow', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(process.env.BASE_URL);
  });

  test('should be in the login page', async ({ loginPage, homePage }) => {
    loginPage.clickLoginLink();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
  
  test('should log in successfully with valid credentials', async ({ loginPage, homePage }) => {
    
    // Using environment variables (Secrets) and JSON data (Static strings)
    await loginPage.login(testData.auth.validUser.username, process.env.TEST_PASSWORD);

    await expect(homePage.successNotice).toBeVisible();
    expect(await homePage.getSuccessText()).toContain(testData.auth.signinSuccessMessage);
  });

  test('invalid password is rejected', async ({ loginPage }) => {
        // Using environment variables (Secrets) and JSON data (Static strings)
    await loginPage.login(testData.auth.validUser.username, 'wrong-password');

    await expect(loginPage.getErrorMessage()).toContainText(testData.auth.signinErrorMessage);
  });

  test('invalid username is rejected', async ({ loginPage }) => {
    await loginPage.login(testData.auth.invalidUser.username, process.env.TEST_PASSWORD);

    await expect(loginPage.getErrorMessage()).toContainText(testData.auth.signinErrorMessage);
  });

  test('empty credentials are rejected', async ({ loginPage }) => {
    await loginPage.login('','');

    await expect(loginPage.getErrorMessage()).toContainText(testData.auth.signinErrorMessage);
  });

});
