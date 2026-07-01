import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('seed login page object into src/pages', async () => {
  const target = path.resolve(__dirname, '../src/pages/login.page.ts');
  const content = `import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: /log in|login/i }).first();
    this.emailInput = page.locator('input[name="email"], input[name="user[email]"], input[id="email"]').first();
    this.passwordInput = page.locator('input[name="password"], input[name="user[password]"], input[id="password"]').first();
    this.submitButton = page.getByRole('button', { name: /submit|sign in|log in/i }).first();
  }

  async navigateTo(url = 'https://openweathermap.org/') {
    await this.page.goto(url);
  }

  async openLoginPageFromHeader() {
    await this.loginLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async enterEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async enterPassword(value: string) {
    await this.passwordInput.fill(value);
  }

  async submit() {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getEmailValue() {
    return this.emailInput.inputValue();
  }

  async getPasswordValue() {
    return this.passwordInput.inputValue();
  }

  async isOnSignInPage() {
    return (await this.emailInput.isVisible()) && (await this.passwordInput.isVisible()) && (await this.submitButton.isVisible());
  }
}
`;

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content, 'utf8');
});
