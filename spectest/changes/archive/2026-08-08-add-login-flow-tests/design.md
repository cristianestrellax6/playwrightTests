## Context
The application under test is the live production openweathermap.org site (Rails/Devise session
auth). There is no staging environment, no seeded data, and no way to reset account state. The
account used by the suite is a real free-tier account whose password lives only in `.env` as
`TEST_PASSWORD`.

The previous login suite existed but was deleted in the working tree. Its page object carried two
problems worth fixing rather than restoring: a CSS locator (`.container .panel-body`) for the error
message, and a `page.pause()` inside `getErrorMessage()` that would hang any non-headed run.

## Goals / Non-Goals
- Goals: cover the sign-in happy path and all three rejection paths; re-establish the POM +
  fixture pattern for the E2E suite; keep every scenario read-only and order-independent.
- Non-Goals: sign-out, password reset, registration, "remember me"/`storageState` reuse,
  cross-browser execution, and coverage of the account tabs beyond asserting two are visible.

## Architecture Decisions
- **Decision**: Page Object Model with locators declared in the constructor and actions exposing
  intent (`login(username, password)`), matching `spectest/project.md`. Locators asserted against
  are exposed `readonly` so specs use `expect(locator)` rather than boolean helpers.
  - *Alternative considered*: plain `page` calls in the spec — rejected; the site's markup is
    third-party and drifts, so locators belong in one place for healing.
- **Decision**: `errorMessage` and `successNotice` use role/text locators (`getByText('Invalid
  Email or password.')`, `getByText('Signed in successfully.')`) sourced from
  `test-data/user-data.json`, replacing the legacy `.container .panel-body` CSS locator.
  - *Alternative considered*: keep the CSS locator — rejected; it violates the project locator
    priority and is the most likely thing to break on a redesign.
- **Decision**: no boolean helpers (`isErrorMessageVisible`) and no `page.pause()`. Specs assert
  with web-first assertions so Playwright auto-retries.
- **Decision**: `HomePage` keeps its account-tab locators, but the login spec asserts only on
  `successNotice` plus two tabs. Deeper account-area coverage is a separate capability.

## Infrastructure
- **Data management**: password from `TEST_PASSWORD` via `config/env.ts` (fail-fast at import);
  username and expected messages from `test-data/user-data.json`. No credential is ever inlined.
- **Environment setup**: `BASE_URL` and `TEST_PASSWORD` required locally in `.env`. CI must add
  both as GitHub Actions secrets before this suite can pass there.
- **Execution strategy**: `chromium` project (`testDir: ./tests/e2e`), `fullyParallel: true`. Each
  test gets a fresh context from the Playwright `page` fixture, so no sign-out step is needed;
  `beforeEach` navigates to `BASE_URL`.

## Risks / Trade-offs
- **Account lockout**: Devise can be configured to lock an account after N consecutive failed
  attempts. This suite submits three failing attempts per run, two of them against the real
  account's email. → Keep the failing-attempt count at three, do not add more negative cases
  against the real email, and use the unregistered email for the unknown-user case. If lockout is
  ever observed, move the wrong-password case to a throwaway email.
- **Third-party UI drift**: the navbar `Login` link, field labels, and flash message text are
  outside our control. → Role-based locators plus a single POM; expect `spectest heal` runs after
  upstream redesigns.
- **Production-only execution**: a real sign-in happens on every run. → All scenarios are strictly
  read-only; no test navigates into billing, payments, or profile-edit flows.
- **CI will fail until secrets land**: unavoidable and already true for the API suite, which also
  imports `config/env.ts`. Flagged in the proposal rather than worked around.

## Migration Plan
The old files are already deleted in the working tree; there is nothing to migrate. Recreate
`login.page.ts` / `home.page.ts` fresh from the specs (the deleted versions in `HEAD` are a
starting reference only — do not restore the `page.pause()` or the CSS error locator). Rollback is
`git checkout -- src tests` plus removing the new spec files.

## Open Questions
- ~~Should the wrong-password scenario use a throwaway email instead of the real account's?~~
  Resolved: kept the real account email per the spec scenario text; no lockout observed across
  multiple full-suite runs.
- ~~Is a `test` script going to be added to `package.json`?~~ Resolved: `package.json` now has
  `"test": "playwright test"`.
</content>
</invoke>
