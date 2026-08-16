import { Page, Locator } from '@playwright/test';
import * as testData from '../../test-data/user-data.json';

/** Authenticated account area reached after a successful sign-in. */
export class HomePage {
  readonly successNotice: Locator;

  readonly newProductsTab: Locator;
  readonly servicesTab: Locator;
  readonly apiKeysTab: Locator;
  readonly billingPlansTab: Locator;
  readonly paymentsTab: Locator;
  readonly blockLogsTab: Locator;
  readonly myOrdersTab: Locator;
  readonly myProfileTab: Locator;
  readonly askQuestionTab: Locator;

  // New Products (home root) — headings are marketing promos and rotate, so tests assert
  // structure (at least one heading present), never specific titles.
  readonly newProductsPromoHeadings: Locator;

  // Services
  readonly servicesTable: Locator;

  // API keys — generateApiKeyButton is a locator only; never `.click()` it (creates a real key).
  readonly apiKeysTable: Locator;
  readonly generateApiKeyButton: Locator;

  // Billing plans — subscribeLinks is a locator only; never `.click()` it (real payment).
  readonly billingPlanTables: Locator;
  readonly subscribeLinks: Locator;

  // Payments
  readonly paymentsTable: Locator;

  // Block logs
  readonly blockLogsTable: Locator;

  // My orders (separate "OpenWeather Marketplace" app/chrome)
  readonly myOrdersHeading: Locator;

  // My profile — saveProfileButton/changePasswordButton are locators only; never `.click()`
  // them (mutates the real account's credentials).
  readonly profileUsernameInput: Locator;
  readonly profileEmailInput: Locator;
  readonly saveProfileButton: Locator;
  readonly changePasswordButton: Locator;

  // Ask a question — submitQuestionButton is a locator only; never `.click()` it (sends a
  // real support email).
  readonly questionEmailInput: Locator;
  readonly questionSubjectSelect: Locator;
  readonly questionMessageInput: Locator;
  readonly submitQuestionButton: Locator;

  constructor(page: Page) {
    this.successNotice = page.getByText(testData.auth.signinSuccessMessage);

    // Scoped to the tab container: several tab names (e.g. "Ask a question") also appear as
    // footer links, so an unscoped getByRole('link') would match both.
    const tabNav = page.locator('#myTab');
    this.newProductsTab = tabNav.getByRole('link', { name: 'New Products' });
    this.servicesTab = tabNav.getByRole('link', { name: 'Services' });
    this.apiKeysTab = tabNav.getByRole('link', { name: 'API keys' });
    this.billingPlansTab = tabNav.getByRole('link', { name: 'Billing plans' });
    this.paymentsTab = tabNav.getByRole('link', { name: 'Payments' });
    this.blockLogsTab = tabNav.getByRole('link', { name: 'Block logs' });
    this.myOrdersTab = tabNav.getByRole('link', { name: 'My orders' });
    this.myProfileTab = tabNav.getByRole('link', { name: 'My profile' });
    this.askQuestionTab = tabNav.getByRole('link', { name: 'Ask a question' });

    this.newProductsPromoHeadings = page.getByRole('heading', { level: 2 });

    this.servicesTable = page.getByRole('table');

    this.apiKeysTable = page.getByRole('table');
    this.generateApiKeyButton = page.getByRole('button', { name: 'Generate' });

    this.billingPlanTables = page.getByRole('table');
    this.subscribeLinks = page.getByRole('link', { name: 'Subscribe' });

    this.paymentsTable = page.getByRole('table');

    this.blockLogsTable = page.getByRole('table');

    this.myOrdersHeading = page.getByRole('heading', { name: 'My Orders', level: 1 });

    this.profileUsernameInput = page.getByRole('textbox', { name: 'Username' });
    this.profileEmailInput = page.getByRole('textbox', { name: 'Email' });
    this.saveProfileButton = page.getByRole('button', { name: 'Save' });
    this.changePasswordButton = page.getByRole('button', { name: 'Change Password' });

    this.questionEmailInput = page.getByRole('textbox', { name: '* Email' });
    this.questionSubjectSelect = page.getByRole('combobox', { name: '* Subject' });
    this.questionMessageInput = page.getByRole('textbox', { name: '* Message' });
    this.submitQuestionButton = page.getByRole('button', { name: 'Submit' });
  }
}
