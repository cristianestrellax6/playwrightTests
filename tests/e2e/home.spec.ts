import { test, expect } from '../../src/fixtures/app.fixtures';
import * as testData from '../../test-data/user-data.json';
import { env } from '../../config/env';

test.describe('Home Page', () => {
  // Each test signs in fresh via the fixtures rather than reusing session state.
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo(env.baseUrl);
    await loginPage.login(testData.auth.validUser.username, env.testPassword);
  });

  test('all account tabs are visible after sign-in', async ({ homePage }) => {
    // The home page is displayed with all nine navigation tabs
    await expect(homePage.newProductsTab).toBeVisible();
    await expect(homePage.servicesTab).toBeVisible();
    await expect(homePage.apiKeysTab).toBeVisible();
    await expect(homePage.billingPlansTab).toBeVisible();
    await expect(homePage.paymentsTab).toBeVisible();
    await expect(homePage.blockLogsTab).toBeVisible();
    await expect(homePage.myOrdersTab).toBeVisible();
    await expect(homePage.myProfileTab).toBeVisible();
    await expect(homePage.askQuestionTab).toBeVisible();
  });

  test('New Products tab shows the product promotions', async ({ page, homePage }) => {
    // Select the `New Products` tab
    await homePage.newProductsTab.click();

    // The URL stays on the home page root and at least one promo section is displayed;
    // promo titles are marketing content and rotate, so we assert structure, not text.
    await expect(page).toHaveURL(/home\.openweathermap\.org\/$/);
    expect(await homePage.newProductsPromoHeadings.count()).toBeGreaterThan(0);
    await expect(homePage.newProductsPromoHeadings.first()).toBeVisible();
  });

  test('Services tab opens the subscribed services section', async ({ page, homePage }) => {
    // Select the `Services` tab
    await homePage.servicesTab.click();

    // The services table with its columns is displayed
    await expect(page).toHaveURL(/\/myservices$/);
    await expect(homePage.servicesTable).toBeVisible();
    await expect(homePage.servicesTable.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(
      homePage.servicesTable.getByRole('columnheader', { name: 'Price plan' })
    ).toBeVisible();
  });

  test('API keys tab opens the API keys section', async ({ page, homePage }) => {
    // Select the `API keys` tab
    await homePage.apiKeysTab.click();

    // The API keys table and the "Create key" form are displayed
    await expect(page).toHaveURL(/\/api_keys$/);
    await expect(homePage.apiKeysTable).toBeVisible();
    await expect(homePage.apiKeysTable.getByRole('columnheader', { name: 'Key' })).toBeVisible();
    await expect(homePage.generateApiKeyButton).toBeVisible();
  });

  test('Billing plans tab opens the billing plans section', async ({ page, homePage }) => {
    // Select the `Billing plans` tab
    await homePage.billingPlansTab.click();

    // Subscription plan tables with their Subscribe links are displayed
    await expect(page).toHaveURL(/\/subscriptions$/);
    expect(await homePage.billingPlanTables.count()).toBeGreaterThan(0);
    expect(await homePage.subscribeLinks.count()).toBeGreaterThan(0);
  });

  test('Payments tab opens the payments section', async ({ page, homePage }) => {
    // Select the `Payments` tab
    await homePage.paymentsTab.click();

    // The invoices table with its columns is displayed
    await expect(page).toHaveURL(/\/payments$/);
    await expect(homePage.paymentsTable).toBeVisible();
    await expect(homePage.paymentsTable.getByRole('columnheader', { name: 'Date' })).toBeVisible();
    await expect(homePage.paymentsTable.getByRole('columnheader', { name: 'Amount' })).toBeVisible();
  });

  test('Block logs tab opens the block logs section', async ({ page, homePage }) => {
    // Select the `Block logs` tab
    await homePage.blockLogsTab.click();

    // The block log table with its columns is displayed
    await expect(page).toHaveURL(/\/blocks$/);
    await expect(homePage.blockLogsTable).toBeVisible();
    await expect(homePage.blockLogsTable.getByRole('columnheader', { name: 'Action' })).toBeVisible();
    await expect(
      homePage.blockLogsTable.getByRole('columnheader', { name: 'Blocked at' })
    ).toBeVisible();
  });

  test('My orders tab opens the Marketplace orders section', async ({ page, homePage }) => {
    // Select the `My orders` tab
    await homePage.myOrdersTab.click();

    // The separate OpenWeather Marketplace section is displayed with a My Orders heading
    await expect(page).toHaveURL(/\/marketplace\/my_orders$/);
    await expect(homePage.myOrdersHeading).toBeVisible();
  });

  test('My profile tab opens the user settings section', async ({ page, homePage }) => {
    // Select the `My profile` tab
    await homePage.myProfileTab.click();

    // The profile form is displayed, pre-filled with the account's email
    await expect(page).toHaveURL(/\/home$/);
    await expect(homePage.profileUsernameInput).not.toBeEmpty();
    await expect(homePage.profileEmailInput).toHaveValue(testData.auth.validUser.username);
    await expect(homePage.saveProfileButton).toBeVisible();
    await expect(homePage.changePasswordButton).toBeVisible();
  });

  test('Ask a question tab opens the support form', async ({ page, homePage }) => {
    // Select the `Ask a question` tab
    await homePage.askQuestionTab.click();

    // The contact form is displayed with the account's email pre-filled and disabled
    await expect(page).toHaveURL(/\/questions$/);
    await expect(homePage.questionEmailInput).toBeDisabled();
    await expect(homePage.questionEmailInput).toHaveValue(testData.auth.validUser.username);
    await expect(homePage.questionSubjectSelect).toBeVisible();
    await expect(homePage.questionMessageInput).toBeVisible();
  });
});
