import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  private loginLink: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  private errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: 'Login' });
    this.usernameInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Submit' });
    this.errorMessage = page.getByText('Invalid Email or password.');
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async clickLoginLink(): Promise<void> {
    await this.loginLink.click();
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.clickLoginLink(); // Click the login link to open the login form
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  getErrorMessage(): Locator {
    return this.errorMessage;
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}
