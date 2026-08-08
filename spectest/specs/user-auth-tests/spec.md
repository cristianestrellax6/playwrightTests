# user-auth-tests Specification

## Purpose
TBD - created by archiving change add-login-flow-tests. Update Purpose after archive.
## Requirements
### Requirement: Login Form Access
The test suite SHALL verify that the sign-in form is reachable from the site navbar and presents
the fields required to authenticate.

#### Scenario: Login form is reachable from the navbar
- **GIVEN** a signed-out visitor is on the openweathermap.org home page
- **WHEN** the visitor clicks the `Login` link in the navbar
- **THEN** the sign-in page is displayed
- **AND** the `Email` textbox, the `Password` textbox, and the `Submit` button are all visible

#### Scenario: Password input masks the entered value
- **GIVEN** the sign-in form is displayed
- **WHEN** a value is typed into the `Password` textbox
- **THEN** the textbox renders the value as masked input rather than plain text

### Requirement: Valid Credential Sign-In
The test suite SHALL verify that a registered user with valid credentials is authenticated and
lands in the account area.

#### Scenario: Valid credentials sign in successfully
- **GIVEN** a signed-out visitor is on the sign-in form
- **WHEN** the visitor submits the registered account email and the password from `TEST_PASSWORD`
- **THEN** the flash message `Signed in successfully.` is displayed
- **AND** the authenticated account area is shown with its `API keys` and `My profile` tabs visible

### Requirement: Invalid Credential Rejection
The test suite SHALL verify that every failed sign-in attempt is rejected with the site's generic
error message and leaves the visitor unauthenticated. The message MUST NOT differ between a wrong
password, an unknown email, and empty fields, so that the form does not disclose which accounts
exist.

#### Scenario: Wrong password is rejected
- **GIVEN** a signed-out visitor is on the sign-in form
- **WHEN** the visitor submits the registered account email with an incorrect password
- **THEN** the error message `Invalid Email or password.` is displayed
- **AND** the `Signed in successfully.` flash message is not displayed

#### Scenario: Unknown email is rejected
- **GIVEN** a signed-out visitor is on the sign-in form
- **WHEN** the visitor submits an unregistered email together with any password
- **THEN** the error message `Invalid Email or password.` is displayed
- **AND** the visitor remains on the sign-in form, unauthenticated

#### Scenario: Empty credentials are rejected
- **GIVEN** a signed-out visitor is on the sign-in form
- **WHEN** the visitor submits the form with both the `Email` and `Password` fields left blank
- **THEN** the error message `Invalid Email or password.` is displayed
- **AND** the visitor remains on the sign-in form, unauthenticated

#### Scenario: Failure message does not disclose which field was wrong
- **WHEN** a wrong-password attempt and an unknown-email attempt are each submitted
- **THEN** both attempts produce the identical `Invalid Email or password.` message

### Requirement: Login Test Isolation And Safety
The login test suite SHALL run against the live production site without mutating account state and
without depending on the outcome of any other test.

#### Scenario: Each login test starts signed out
- **GIVEN** the login suite runs with `fullyParallel: true` in any order
- **WHEN** any single login test starts
- **THEN** it begins from a fresh browser context with no reused session state
- **AND** it navigates to `BASE_URL` itself rather than relying on a previous test's navigation

#### Scenario: Credentials are never inlined in a spec
- **WHEN** the login specs reference the account password
- **THEN** the value is read from `TEST_PASSWORD` via `config/env.ts`
- **AND** static strings such as the username and expected messages come from
  `test-data/user-data.json`
</content>
</invoke>

