# Change: Add Home Page Tests

## Why
The authenticated account "home" page (the `HomePage` reached after a successful sign-in) currently has
only incidental coverage: `user-auth-tests` checks that two of its nine navigation tabs are visible as a
side effect of verifying login. There is no dedicated coverage for the home page's own structure and
navigation.

## What Changes
- Add a new `home-page-tests` capability covering the authenticated home page reached after sign-in.
- Cover visibility of all nine navigation tabs (`New Products`, `Services`, `API keys`, `Billing plans`,
  `Payments`, `Block logs`, `My orders`, `My profile`, `Ask a question`).
- Cover that selecting each tab navigates to its corresponding account section.
- Cover test isolation and read-only safety, consistent with `user-auth-tests`.
- Out of scope (explicitly deferred): the public, signed-out landing page shown before login. That will
  be planned as its own change later. `src/pages/landing.page.ts` (locators/functions only, no spec) will
  only be created if a task in this change turns out to need it.

## Impact
- Affected specs: `home-page-tests` (new)
- Affected code: reuses the existing `HomePage` POM (`src/pages/home.page.ts`) and `homePage`/`loginPage`
  fixtures (`src/fixtures/app.fixtures.ts`); adds a new spec file under `tests/e2e/`

## Findings From Live Exploration
Verified live against production on 2026-08-09 (signed in as the real test account). Notable drift from
`spectest/project.md` and concrete detail for the scenarios below:
- The public site (`BASE_URL`) has been redesigned into an API-business marketing page. `Login` now
  points to a **different subdomain**, `home.openweathermap.org/users/sign_in` — the existing
  `SIGN_IN_URL` regex in `login.spec.ts` still matches since it isn't domain-anchored, but this is worth
  flagging as drift on the `user-auth-tests` capability (out of scope here).
- After sign-in the visitor lands on `home.openweathermap.org/` with the nine tabs confirmed and their
  real destinations: New Products → `/`, Services → `/myservices`, API keys → `/api_keys`,
  Billing plans → `/subscriptions`, Payments → `/payments`, Block logs → `/blocks`,
  My orders → `/marketplace/my_orders`, My profile → `/home`, Ask a question → `/questions`.
- **My orders** lands in a visually and structurally separate app ("OpenWeather Marketplace", its own
  navbar) rather than staying inside the home-page chrome — worth a note in `design.md`-style comments
  when generating that test.
- Several tabs expose **real, irreversible actions** that a test must never trigger: API keys has a
  "Create key"/Generate control; Billing plans has "Subscribe" links tied to real payment; My profile has
  "Save" and "Change Password" pre-filled with the real account's username/email; Ask a question is a
  live support form (with reCAPTCHA) that emails the real team. The isolation/safety requirement below
  now names these explicitly instead of a generic "read-only" statement.
- Payments and Block logs currently render **empty** tables (no invoices, no blocks) for this account —
  scenarios assert the table/headers are present, not specific row content.
- A cookie-consent banner appears on first visit to the public site; not in scope for this capability
  since navigation starts already signed in, but noted in case a future landing-page capability needs it.
