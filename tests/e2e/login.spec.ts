import { test, expect } from '../../src/fixtures/app.fixtures';
import * as testData from '../../test-data/user-data.json';
import { env } from '../../config/env';

const SIGN_IN_URL = /\/users\/sign_in/;

test.describe('Authentication Flow', () => {
  // Each test starts from a fresh context and navigates itself — no shared session state.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(env.baseUrl);
  });

  test('login form is reachable from the navbar', async ({ page, loginPage }) => {
    // Click the `Login` link in the navbar
    await loginPage.openLoginForm();

    // The sign-in page is displayed with the fields required to authenticate
    await expect(page).toHaveURL(SIGN_IN_URL);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('password input masks the entered value', async ({ loginPage }) => {
    await loginPage.openLoginForm();

    // Type a value into the `Password` textbox
    await loginPage.passwordInput.fill(testData.auth.wrongPassword);

    // The textbox renders it as masked input rather than plain text
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    await expect(loginPage.passwordInput).toHaveValue(testData.auth.wrongPassword);
  });

  test('should log in successfully with valid credentials', async ({ loginPage, homePage }) => {
    // Submit the registered account email with the password from TEST_PASSWORD
    await loginPage.login(testData.auth.validUser.username, env.testPassword);

    // The success flash and the authenticated account area are shown
    await expect(homePage.successNotice).toHaveText(testData.auth.signinSuccessMessage);
    await expect(homePage.apiKeysTab).toBeVisible();
    await expect(homePage.myProfileTab).toBeVisible();
  });

  test('invalid password is rejected', async ({ loginPage, homePage }) => {
    // Submit the registered account email with an incorrect password
    await loginPage.login(testData.auth.validUser.username, testData.auth.wrongPassword);

    // The generic error is shown and the visitor is not signed in
    await expect(loginPage.errorMessage).toHaveText(testData.auth.signinErrorMessage);
    await expect(homePage.successNotice).toHaveCount(0);
  });

  test('unknown email is rejected', async ({ page, loginPage }) => {
    // Submit an unregistered email together with any password
    await loginPage.login(testData.auth.invalidUser.username, testData.auth.wrongPassword);

    // The generic error is shown and the visitor stays on the sign-in form
    await expect(loginPage.errorMessage).toHaveText(testData.auth.signinErrorMessage);
    await expect(page).toHaveURL(SIGN_IN_URL);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('empty credentials are rejected', async ({ page, loginPage }) => {
    // Submit the form with both fields left blank
    await loginPage.login('', '');

    // The generic error is shown and the visitor stays on the sign-in form
    await expect(loginPage.errorMessage).toHaveText(testData.auth.signinErrorMessage);
    await expect(page).toHaveURL(SIGN_IN_URL);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('failure message does not disclose which field was wrong', async ({ loginPage }) => {
    // Submit the registered email with a wrong password
    await loginPage.login(testData.auth.validUser.username, testData.auth.wrongPassword);
    await expect(loginPage.errorMessage).toBeVisible();
    const wrongPasswordMessage = await loginPage.errorMessage.innerText();

    // Reload the form first so the assertion cannot read the previous attempt's flash
    await loginPage.navigateTo(env.baseUrl);

    // Submit an unregistered email
    await loginPage.login(testData.auth.invalidUser.username, testData.auth.wrongPassword);
    await expect(loginPage.errorMessage).toBeVisible();
    const unknownEmailMessage = await loginPage.errorMessage.innerText();

    // Both attempts produce the identical message
    expect(wrongPasswordMessage).toBe(unknownEmailMessage);
    expect(wrongPasswordMessage).toBe(testData.auth.signinErrorMessage);
  });
});
