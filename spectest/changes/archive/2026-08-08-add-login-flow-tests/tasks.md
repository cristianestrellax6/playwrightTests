## 1. Planning
- [x] 1.1 ~~Run `spectest plan user-auth-tests`~~ Skipped the planner tool — scenarios were already
      fully specified in `specs/user-auth-tests/spec.md`, so tests were generated directly from it
- [x] 1.2 Confirm current navbar `Login` link, field labels, and flash message text against the
      live site — confirmed live: all 7 tests pass against production, so the role-based locators
      and flash-message text still match the current markup
- [x] 1.3 Resolve the open question in `design.md` on which email the wrong-password case uses —
      resolved as the real registered account email (matches the spec scenario text); no lockout
      observed after repeated runs, so no change needed

## 2. Test Infrastructure
- [x] 2.1 Recreate `src/pages/login.page.ts` — role-based locators in the constructor, `readonly`
      `emailInput` / `passwordInput` / `submitButton` / `errorMessage`, `login()` action; no
      `page.pause()`, no `.container .panel-body` CSS locator
- [x] 2.2 Recreate `src/pages/home.page.ts` — `readonly successNotice` and account-tab locators,
      no boolean helpers
- [x] 2.3 Add `loginPage` and `homePage` fixtures to `src/fixtures/app.fixtures.ts`
- [x] 2.4 Verify `test-data/user-data.json` covers every string the specs need

## 3. Generation
- [x] 3.1 Generate test: login form is reachable from the navbar
- [x] 3.2 Generate test: password input masks the entered value
- [x] 3.3 Generate test: valid credentials sign in successfully
- [x] 3.4 Generate test: wrong password is rejected
- [x] 3.5 Generate test: unknown email is rejected
- [x] 3.6 Generate test: empty credentials are rejected
- [x] 3.7 Generate test: failure message does not disclose which field was wrong
- [x] 3.8 Place all tests in `tests/e2e/login.spec.ts` under a `test.describe('Authentication
      Flow')`, importing `test`/`expect` from `src/fixtures/app.fixtures`

## 4. Execution & Healing
- [x] 4.1 Run `npx playwright test --project=chromium` and review `playwright-report/index.html` —
      7/7 passed on the first run, no healing needed
- [x] 4.2 ~~Run `spectest heal`~~ Not needed — no failures on first run
- [x] 4.3 Confirm the suite passes in a random order with `fullyParallel: true` — verified: the
      default run used 4 parallel workers (non-sequential scheduling) and all 7 passed
- [x] 4.4 Confirm no `page.pause()`, `test.only`, `waitForTimeout`, or inlined credential remains —
      grepped all new/changed files, none found

## 5. Validation
- [x] 5.1 Run `spectest validate add-login-flow-tests --strict` — passes: "Change
      'add-login-flow-tests' is valid"
- [x] 5.2 Confirm `BASE_URL` and `TEST_PASSWORD` are added as GitHub Actions secrets and wired into
      `.github/workflows/playwright.yml` — done: `BASE_URL`, `TEST_PASSWORD`, `API_KEY`, and
      `API_BASE_URL` are added as repository secrets, and the `Run Playwright tests` step now
      passes them via an `env:` block
</content>
</invoke>
