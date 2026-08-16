## 1. Planning
- [x] 1.1 Explored the authenticated home page live (signed in via the existing test account) and
      confirmed all nine tabs and their destinations — see "Findings From Live Exploration" in
      `proposal.md`
- [x] 1.2 Confirmed what each tab actually navigates to (route/heading/table columns); scenarios in
      `specs/home-page-tests/spec.md` now assert concrete, verified outcomes instead of placeholders
- [x] 1.3 No public/pre-login locators were needed to reach the home page (sign-in already lands there
      directly) — `landing.page.ts` is not created by this change

## 2. Generation
- [x] 2.1 Generated the tab-visibility test (`all account tabs are visible after sign-in`)
- [x] 2.2 Generated the nine tab-navigation tests, extending `HomePage` (`src/pages/home.page.ts`) with
      the locators each destination needs (tables, headings, form fields), scoping the nine tab links to
      `#myTab` after discovering several tab names (e.g. "Ask a question") collide with footer links
- [x] 2.3 Isolation & safety scenarios are enforced structurally rather than as standalone tests (fresh
      `beforeEach` sign-in per test, `fullyParallel: true`, and no test ever calls `.click()` on
      `generateApiKeyButton`, `subscribeLinks`, `saveProfileButton`, `changePasswordButton`, or
      `submitQuestionButton`) — matches the precedent set by `user-auth-tests`' isolation requirement
- [x] 2.4 Generated tests live in `tests/e2e/home.spec.ts` under `test.describe('Home Page')`, using the
      `loginPage`/`homePage` fixtures

## 3. Execution & Healing
- [x] 3.1 Ran `npx playwright test tests/e2e/home.spec.ts --project=chromium` — one healing round needed
      (see below), then 10/10 passed, repeated 3 times for stability (30/30 total)
- [x] 3.2 Healed one failure: `askQuestionTab` matched two elements (tab + footer link both named
      "Ask a question"); fixed by scoping all nine tab locators to `page.locator('#myTab')`
- [x] 3.3 Verified all home page tests pass, are read-only (no test clicks Generate/Subscribe/
      Save/Change Password/Submit), and leave no account data mutated
- [x] 3.4 Ran the full suite (`npx playwright test --project=chromium`, home + login) to check for
      regressions from the `HomePage` change — none; a pre-existing `login.spec.ts` flake surfaced under
      4-worker parallelism (timeout waiting for the `Login` link), reproduced twice on different login
      tests, passed 7/7 single-worker. Root cause is very likely the cookie-consent banner noted in
      `proposal.md`'s "Findings From Live Exploration" intercepting the click on some fresh contexts.
      This is pre-existing, out of `home-page-tests` scope, and unrelated to this change's code — flagged
      for a separate follow-up on `user-auth-tests`, not fixed here
