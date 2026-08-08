# Test Project Context

## Purpose
Personal Playwright automation framework (`playwrightTests`) used to build and exercise
end-to-end and API test coverage against [OpenWeatherMap](https://openweathermap.org/).

Two suites live side by side:
- **API suite** — contract/behavior coverage of the OpenWeather public REST API
  (currently the Geocoding `GET /geo/1.0/direct` endpoint).
- **E2E suite** — browser coverage of the openweathermap.org web app, starting with
  the authentication flow (login link → email/password → signed-in dashboard).

The project doubles as a sandbox for spec-first automation: SpecTest specs drive the
Playwright Test Agents (planner → generator → healer) rather than tests being hand-written first.

## Tech Stack
- **Playwright Test** `@playwright/test` ^1.61.1 — runner, assertions, `APIRequestContext`
- **TypeScript** (strict mode, ES2021 target, `moduleResolution: bundler`) — see `tsconfig.json`
- **Node.js** LTS (`@types/node` ^26) — CommonJS package (`"type": "commonjs"`)
- **dotenv** ^17 — secrets and environment URLs loaded from a gitignored `.env`
- **GitHub Actions** — `.github/workflows/playwright.yml`, runs on push/PR to `main`/`master`
- **Playwright MCP server** — `playwright run-test-mcp-server`, wired up in `.vscode/mcp.json`
  for the planner/generator/healer agents
- **SpecTest** — spec + change-proposal layer under `spectest/`

## Test Project Conventions

### Test Code Style
- TypeScript throughout, `strict: true`. No `any` in test or client code — model API payloads
  as explicit interfaces (see `api/types/geo.types.ts`).
- File naming:
  - Page objects: `<name>.page.ts` (`login.page.ts`)
  - Components: `<name>.component.ts` (`navbar.component.ts`)
  - Fixtures: `<scope>.fixtures.ts` (`app.fixtures.ts`, `api.fixtures.ts`)
  - API clients: `<domain>.client.ts` (`geo.client.ts`)
  - API types: `<domain>.types.ts`
  - Specs: `*.spec.ts`, grouped by domain folder (`tests/api/geo/get.locations.spec.ts`)
- Every spec file opens with a `test.describe` naming the feature or endpoint under test
  (`'Authentication Flow'`, `'GET /geo/1.0/direct'`).
- Test titles read as behavior statements: `should return coordinates for a valid city`,
  `invalid password is rejected`.
- Locator priority: `getByRole` with an accessible name first, then `getByText`, then semantic
  HTML. Avoid CSS class/ID selectors — `page.locator('.container .panel-body')` in the login
  page is legacy and should be replaced when that page object is touched.
- Never leave `page.pause()` or `test.only` in committed code (`forbidOnly` fails CI).
- No `page.waitForTimeout()` / `sleep()` — rely on Playwright auto-waiting and web-first assertions.
- Two-space indentation, single quotes, semicolons.

### Test Architecture Patterns
```
api/
  endpoints.ts            # endpoint path constants (currently unused/empty — populate before growth)
  clients/<d>.client.ts   # thin typed wrappers over APIRequestContext; return the raw APIResponse
  types/<d>.types.ts      # response interfaces
  fixtures/api.fixtures.ts# extends base test with apiContext + one fixture per client
src/
  pages/<p>.page.ts       # Page Object Model — locators in the constructor, actions as methods
  components/<c>.component.ts # shared UI regions (navbar) reused across pages
  fixtures/app.fixtures.ts# extends base test with per-page fixtures for the E2E suite
config/env.ts             # typed, fail-fast accessor for required env vars
test-data/*.json          # static, non-secret test data (usernames, expected messages)
tests/api/<domain>/       # API specs   (project: `api`)
tests/e2e/                # browser specs (project: `chromium`)
```

Key decisions:
- **Fixture-first**: specs import `test`/`expect` from a fixtures module, never directly from
  `@playwright/test`. Page objects and API clients are injected, never constructed inside a test.
- **Page Object Model** for E2E: locators declared once in the constructor; methods expose intent
  (`login(username, password)`), and locators needed for assertions are exposed as `readonly`
  so specs assert with `expect(locator)` rather than boolean helpers.
- **Client + types for API**: clients own URL/query construction and auth (`appid`); specs own the
  assertions on status and body. Clients return the `APIResponse` so specs can assert on status codes.
- **Test data split**: secrets (`TEST_PASSWORD`, `API_KEY`) come from `.env` via `config/env.ts`;
  static strings (usernames, expected UI messages) come from `test-data/user-data.json`.
  Never inline a credential in a spec.
- **Fail-fast config**: `config/env.ts` throws on a missing variable at import time rather than
  letting tests fail with a confusing runtime error.
- **Playwright projects** split the suites: `api` (`testDir: ./tests/api`, `baseURL: API_BASE_URL`)
  and `chromium` (`testDir: ./tests/e2e`). `firefox`/`webkit` projects exist but are not yet scoped
  to a `testDir` — scope or remove them before relying on cross-browser runs.

### Testing Strategy
- Framework: Playwright
- Spec format: SpecTest (human-readable test specs under `spectest/specs/`)
- Generation: Use Playwright Test Agents (planner, generator, healer) via the `playwright-test` MCP server
- Maintenance: Automated healing for failing tests (`spectest heal`)
- Planning: Create test plans before generating tests (`spectest plan <spec-id>`)
- Coverage: Focus on critical user flows and edge cases
- Test isolation: every test is independent and runnable in any order; `fullyParallel: true`
- Negative coverage is expected alongside happy paths — invalid credentials, empty input,
  nonexistent resources, and auth failures (401) each get their own test.
- Reporting: HTML reporter; `trace: 'on-first-retry'`. CI retries twice with a single worker.

### Git Workflow
- `main` is the default branch and the PR target. Feature/experiment work happens on short-lived
  branches (`AItest`, `claudeTest`, `testClaude`).
- CI (`Playwright Tests` workflow) runs on push and PR to `main`/`master`; the HTML report is
  uploaded as an artifact with 30-day retention.
- Commit messages are short, imperative, and scoped to one change (`added api test.`,
  `add env.ts and tsconfig.json, to get the env vars as const`).
- Never commit `.env`, `test-results/`, or `playwright-report/` — all gitignored.
- SpecTest changes ship as their own PR, and archiving a change (`changes/` → `changes/archive/`)
  is a separate PR from the implementation.

## Domain Context
The application under test is **OpenWeatherMap**:

- **Web app** (`https://openweathermap.org/`) — a Rails/Devise-style site. Sign-in is reached via a
  `Login` link in the navbar, with `Email` / `Password` textboxes and a `Submit` button. Success is
  confirmed by the flash message `Signed in successfully.`; any credential failure (bad password,
  unknown user, or empty fields) produces the same generic `Invalid Email or password.` message.
  Once signed in, the account area exposes tabs: New Products, Services, API keys, Billing plans,
  Payments, Block logs, My Orders, My profile, Ask a question.
- **Geocoding API** (`https://api.openweathermap.org`, path `/geo/1.0/direct`) — resolves a
  free-text place query to coordinates. Query semantics:
  - `q` is a comma-joined `city[,state][,country]` string; `state` is only meaningful for `US`.
  - `limit` caps the number of results (default 5 in `GeoClient`).
  - `appid` is the API key, passed as a query parameter on every request.
  - A nonexistent city returns `200` with an empty array, **not** a 404.
  - An invalid `appid` returns `401`.
  - `state` is present in responses only for US locations; `local_names` is optional.

## Important Constraints
- **Live third-party system.** Tests run against production openweathermap.org — there is no
  staging environment, no seeded data, and no way to reset state. Tests must be read-only and
  must not create, mutate, or delete account data.
- **Rate limits.** The free OpenWeather API tier is rate-limited (60 calls/min). Keep API suites
  lean and avoid tight loops; a burst of parallel workers can trigger `429`s that look like
  product bugs. Consider throttling or mocking before scaling the API suite up.
- **Secrets.** `TEST_PASSWORD` and `API_KEY` are real credentials for a real account. They live
  only in the local `.env` and must be provided as GitHub Actions secrets for CI — the workflow
  does not currently inject them, so any test importing `config/env.ts` will fail on CI until it does.
- **Non-deterministic upstream data.** Geocoding results can change (ordering, `local_names`,
  new entries). Assert on shape and invariants (`expect.any(String)`, `toBeLessThanOrEqual`,
  `state === 'Illinois'`) rather than exact result arrays or counts.
- **Third-party UI drift.** The site's markup is outside our control; prefer role-based locators
  and expect healing runs after upstream redesigns.
- **No `npm test` script yet.** `package.json` has an empty `scripts` block; run `npx playwright test`.
  Add a `test` script before relying on the SpecTest workflow's `npm test` step.

## Application Under Test
| Dependency | Purpose | Notes for setup / mocking |
|---|---|---|
| `https://openweathermap.org/` (`BASE_URL`) | Web UI under test — auth, account tabs | Requires a registered account; `TEST_PASSWORD` in `.env` |
| `https://api.openweathermap.org` (`API_BASE_URL`) | REST API under test | Configured as the `api` project `baseURL`; note the `.env` value includes a `/data/2.5/` suffix while Geo calls use the absolute `/geo/1.0/direct` path |
| OpenWeather Geocoding API `/geo/1.0/direct` | Endpoint currently covered | Free tier; `appid` query param auth |
| OpenWeather API key (`API_KEY`) | Auth for all API calls | Free-tier key; new keys can take ~10 min to activate |
| Devise/Rails session auth | Web login mechanism | Cookie-session based; no `storageState` reuse configured yet — each E2E test logs in fresh |
| GitHub Actions (ubuntu-latest) | CI execution | Installs browsers with `npx playwright install --with-deps` |

### Required environment variables (`.env`, gitignored)
| Variable | Used by | Example |
|---|---|---|
| `BASE_URL` | E2E navigation | `https://openweathermap.org/` |
| `API_BASE_URL` | `api` project `baseURL`, `apiContext` fixture | `https://api.openweathermap.org/data/2.5/` |
| `API_KEY` | `GeoClient` `appid` param | *(secret)* |
| `TEST_PASSWORD` | Login specs | *(secret)* |
