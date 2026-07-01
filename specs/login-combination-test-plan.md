# Login Combination Test Plan

## Application Overview

Explore the OpenWeather login page and create a Playwright test plan covering login combinations for the sign-in form.

## Test Scenarios

### 1. Login Combinations

**Seed:** `tests/seed.spec.ts`

#### 1.1. Valid credentials login succeeds

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header using the Login link.
    - expect: The sign-in page loads with the Email and Password fields and a Submit button.
  2. Enter the valid username from test-data/user-data.json (testData.validUser.username).
    - expect: The username is populated in the Email field.
  3. Enter the password from process.env.TEST_PASSWORD.
    - expect: The password is populated in the Password field.
  4. Click Submit.
    - expect: The user is signed in and redirected to the members area.

#### 1.2. Invalid password is rejected

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header.
    - expect: The sign-in page is displayed.
  2. Enter the valid username from testData.validUser.username.
    - expect: The Email field contains the username.
  3. Enter an incorrect password value.
    - expect: The Password field contains the incorrect password.
  4. Click Submit.
    - expect: The login attempt fails, and an error or validation message is shown.

#### 1.3. Invalid username is rejected

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header.
    - expect: The sign-in page is displayed.
  2. Enter an invalid email address such as invaliduser@example.com.
    - expect: The Email field contains the invalid username.
  3. Enter the valid password from process.env.TEST_PASSWORD.
    - expect: The Password field contains the valid password.
  4. Click Submit.
    - expect: The login attempt fails, and an error or validation message is shown.

#### 1.4. Empty username and password are blocked

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header.
    - expect: The sign-in page is displayed.
  2. Leave the Email field empty.
    - expect: The field remains empty.
  3. Leave the Password field empty.
    - expect: The field remains empty.
  4. Click Submit.
    - expect: The form does not submit successfully and validation feedback is shown or the user remains on the sign-in page.

#### 1.5. Empty password with valid username is blocked

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header.
    - expect: The sign-in page is displayed.
  2. Enter the valid username from testData.validUser.username.
    - expect: The Email field contains the username.
  3. Leave the password empty.
    - expect: The Password field remains empty.
  4. Click Submit.
    - expect: The login attempt is blocked and validation feedback is shown or the user remains on the sign-in page.

#### 1.6. Empty username with valid password is blocked

**File:** `tests/LoginCombinationTests.spec.ts`

**Steps:**
  1. Open the login page from the site header.
    - expect: The sign-in page is displayed.
  2. Leave the Email field empty.
    - expect: The field remains empty.
  3. Enter the valid password from process.env.TEST_PASSWORD.
    - expect: The Password field contains the password.
  4. Click Submit.
    - expect: The login attempt is blocked and validation feedback is shown or the user remains on the sign-in page.
