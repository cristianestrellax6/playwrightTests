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

  constructor(page: Page) {
    this.successNotice = page.getByText(testData.auth.signinSuccessMessage);

    this.newProductsTab = page.getByRole('link', { name: 'New Products' });
    this.servicesTab = page.getByRole('link', { name: 'Services' });
    this.apiKeysTab = page.getByRole('link', { name: 'API keys' });
    this.billingPlansTab = page.getByRole('link', { name: 'Billing plans' });
    this.paymentsTab = page.getByRole('link', { name: 'Payments' });
    this.blockLogsTab = page.getByRole('link', { name: 'Block logs' });
    this.myOrdersTab = page.getByRole('link', { name: 'My orders' });
    this.myProfileTab = page.getByRole('link', { name: 'My profile' });
    this.askQuestionTab = page.getByRole('link', { name: 'Ask a question' });
  }
}
