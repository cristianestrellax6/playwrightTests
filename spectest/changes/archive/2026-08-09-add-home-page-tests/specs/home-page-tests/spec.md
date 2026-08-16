## ADDED Requirements

### Requirement: Home Page Navigation Tabs Visibility
The test suite SHALL verify that all account navigation tabs are visible on the home page immediately
after a user signs in.

#### Scenario: All account tabs are visible after sign-in
- **GIVEN** a registered user has successfully signed in
- **WHEN** the home page is displayed
- **THEN** the `New Products`, `Services`, `API keys`, `Billing plans`, `Payments`, `Block logs`,
  `My orders`, `My profile`, and `Ask a question` tabs are all visible

### Requirement: Home Page Tab Navigation
The test suite SHALL verify that selecting each home page navigation tab takes the signed-in user to the
corresponding account section, verified against the following real destinations and content.

#### Scenario: New Products tab shows the product promotions
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `New Products` tab
- **THEN** the URL remains the home page root
- **AND** at least one promotional product section (a heading paired with a "Learn more" or equivalent
  link) is displayed
- **AND** the assertion does not depend on specific promotion titles (e.g. "OpenWeather Dashboard"),
  since this tab's content is marketing-driven and expected to rotate over time

#### Scenario: Services tab opens the subscribed services section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `Services` tab
- **THEN** the URL navigates to `/myservices`
- **AND** a table listing the user's subscribed services with `Name`, `Description`, `Price plan`,
  `Limits`, and `Details` columns is displayed

#### Scenario: API keys tab opens the API keys section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `API keys` tab
- **THEN** the URL navigates to `/api_keys`
- **AND** a table listing the account's API keys with `Key`, `Name`, `Status`, and `Actions` columns is
  displayed
- **AND** a "Create key" form with an API key name field and a `Generate` button is displayed

#### Scenario: Billing plans tab opens the billing plans section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `Billing plans` tab
- **THEN** the URL navigates to `/subscriptions`
- **AND** the available subscription plan tables (e.g. the "Professional collections" plan table with
  `Name`, `Calls per minute`/`Calls per day`, `Price`, and `Status` columns) are displayed with their
  `Subscribe` links

#### Scenario: Payments tab opens the payments section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `Payments` tab
- **THEN** the URL navigates to `/payments`
- **AND** an invoices table with `Number #`, `Date`, and `Amount` columns is displayed

#### Scenario: Block logs tab opens the block logs section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `Block logs` tab
- **THEN** the URL navigates to `/blocks`
- **AND** a table with `Action`, `Blocked at`, and `Time (sec)` columns is displayed

#### Scenario: My orders tab opens the Marketplace orders section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `My orders` tab
- **THEN** the URL navigates to `/marketplace/my_orders`, a separate "OpenWeather Marketplace" section
  with its own navigation
- **AND** a `My Orders` heading is displayed

#### Scenario: My profile tab opens the user settings section
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `My profile` tab
- **THEN** the URL navigates to `/home`
- **AND** a `User settings` profile form pre-filled with the account's `Username` and `Email` is
  displayed, along with a separate password-change form

#### Scenario: Ask a question tab opens the support form
- **GIVEN** a signed-in user is on the home page
- **WHEN** the user selects the `Ask a question` tab
- **THEN** the URL navigates to `/questions`
- **AND** a contact form with a disabled, pre-filled `Email` field, a `Subject` dropdown, and a
  `Message` field is displayed

### Requirement: Home Page Test Isolation And Safety
The home page test suite SHALL run against the live production account without mutating account state
(billing, payments, orders, API keys) and without depending on the outcome of any other test.

#### Scenario: Each home page test starts from a fresh sign-in
- **GIVEN** the home page suite runs with `fullyParallel: true` in any order
- **WHEN** any single home page test starts
- **THEN** it signs in fresh via the `loginPage` and `homePage` fixtures rather than reusing session
  state from another test

#### Scenario: Tab navigation is read-only
- **WHEN** a home page test selects an account tab
- **THEN** it only asserts on the section, table headers, or static text that is displayed
- **AND** it never clicks `Generate` on the API keys page, any `Subscribe` link on the Billing plans
  page, `Save` or `Change Password` on the My profile page, or `Submit` on the Ask a question page —
  each performs a real, irreversible production action (a new API key, a paid subscription, a changed
  account credential, or a live support email) rather than a safe, read-only assertion
