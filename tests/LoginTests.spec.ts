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

    expect(await homePage.successVisible()).toBe(true);
    expect(await homePage.getSuccessText()).toContain('Signed in successfully.');
  });
});
