import { Page, Locator } from '@playwright/test';
import * as testData from '../../test-data/user-data.json';

export class LoginPage {
  private readonly page: Page;

  readonly loginLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.getByText(testData.auth.signinErrorMessage);
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /** Follows the navbar `Login` link through to the sign-in form. */
  async openLoginForm(): Promise<void> {
    await this.loginLink.click();
    await this.page.waitForURL(/\/users\/sign_in/);
  }

  /** Fills and submits the sign-in form; assumes the form is already displayed. */
  async submitCredentials(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  /** Full sign-in flow starting from any page that shows the navbar `Login` link. */
  async login(email: string, password: string): Promise<void> {
    await this.openLoginForm();
    await this.submitCredentials(email, password);
  }
}
