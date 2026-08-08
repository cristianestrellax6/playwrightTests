# Change: Add Login Flow Tests

## Why
E2E login coverage was removed from the working tree (`src/pages/login.page.ts`,
`src/pages/home.page.ts`, `tests/e2e/LoginTests.spec.ts` deleted; `src/fixtures/app.fixtures.ts`
emptied), so authentication — the only gateway to every account-area feature — currently has zero
automated coverage and no spec describing what it should cover. This change establishes
`user-auth-tests` as the first E2E capability and rebuilds the suite spec-first.

## What Changes
- Add a `user-auth-tests` capability covering the openweathermap.org sign-in flow
- Add scenarios for login form access from the navbar and masked password input
- Add scenarios for valid-credential sign-in (`Signed in successfully.` + account area visible)
- Add scenarios for the three rejection paths — wrong password, unknown email, empty fields — all
  asserting the same generic `Invalid Email or password.` message
- Add a scenario asserting the failure message does not disclose which field was wrong
- Add isolation/safety requirements: fresh context per test, self-navigation to `BASE_URL`,
  credentials only via `config/env.ts` and `test-data/user-data.json`
- Rebuild `LoginPage` and `HomePage` page objects and wire `loginPage` / `homePage` fixtures back
  into `src/fixtures/app.fixtures.ts`
- Drop the legacy CSS locator `.container .panel-body` and the `page.pause()` left in the previous
  `LoginPage.getErrorMessage()`

## Out of Scope
Deliberately excluded from this change (no spec, no tests) — call these out if you want them added:
- Sign-out / session termination
- "Forgot password" and password reset (mutates account state, sends real email)
- "Remember me" and session persistence across contexts (`storageState` reuse)
- Registration / sign-up
- Cross-browser runs — `firefox` / `webkit` projects are not yet scoped to a `testDir`

## Impact
- Affected specs: `user-auth-tests` (new capability)
- Affected code:
  - `src/pages/login.page.ts` (recreate)
  - `src/pages/home.page.ts` (recreate)
  - `src/fixtures/app.fixtures.ts` (add `loginPage`, `homePage` fixtures)
  - `tests/e2e/login.spec.ts` (new; replaces deleted `LoginTests.spec.ts`)
  - `test-data/user-data.json` (already holds the needed strings — no change expected)
- Runs against **production** openweathermap.org with a real account; all scenarios are read-only
- Requires `BASE_URL` and `TEST_PASSWORD` — CI does not inject them yet, so this suite will fail on
  GitHub Actions until those secrets are wired into `.github/workflows/playwright.yml`
</content>
</invoke>
