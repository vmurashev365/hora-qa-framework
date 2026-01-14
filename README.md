# Hora Services QA Automation Framework

<!-- Badges -->

[![Test Suite](https://github.com/hora-services/hora-qa-framework/actions/workflows/test-suite.yml/badge.svg)](https://github.com/hora-services/hora-qa-framework/actions/workflows/test-suite.yml)
[![Coverage](https://img.shields.io/badge/coverage-75%25-brightgreen.svg)](./reports/coverage)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Automated testing framework for the Hora Services fleet management system built on Odoo ERP.

---

## ✨ Highlights

- 🏗 **3-Layer BDD Architecture** - Atomic → Domain → Composite steps for maximum reusability
- 🗺 **UI-MAP Pattern** - Decoupled selectors for maintainability and resilience
- 🔄 **Full-Stack Testing** - Web UI, REST/JSON-RPC APIs, Database, Integration tests
- 📱 **Mobile-Ready** - Appium architecture for Android/iOS driver app testing
- 🔐 **Security Testing** - Access control, authentication, GDPR compliance validation
- ⚡ **Performance Testing** - k6 integration for load and stress testing
- 📚 **50+ Reusable Steps** - Product Owners can write tests without coding
- 🐳 **Docker-First** - Containerized Odoo environment for consistent testing
- 📊 **Rich Reporting** - Cucumber HTML reports, Allure reports, screenshots on failure
- 🚀 **CI/CD Ready** - GitHub Actions workflows with nightly regression

---

## 📖 Table of Contents

- [What is this?](#-what-is-this)
- [Quick Start (Step by Step)](#-quick-start-step-by-step)
- [Running Tests](#-running-tests)
- [Viewing Reports](#-viewing-reports)
- [Project Structure](#-project-structure)
- [Writing Tests](#-writing-tests)
- [Troubleshooting](#-troubleshooting)
- [Command Reference](#-command-reference)

---

## 🎯 What is this?

This framework automatically validates the Hora Services system:

- ✅ **Web Interface** — clicks, form filling, display verification
- ✅ **API** — server response validation without using the UI
- ✅ **Database** — verifies data is saved correctly
- ✅ **Security** — checks user access permissions
- ✅ **Performance** — validates system speed under load
- ✅ **Tablet Devices** — testing on Galaxy Tab and iPad

**Key Benefit:** Tests are written in plain English (Gherkin language), so business users can read and even write tests without programming knowledge!

---

## 🚀 Quick Start (Step by Step)

### Step 1: Install Required Software

Before you begin, install these programs on your computer:

| Program | Why You Need It | How to Install |
|---------|-----------------|----------------|
| **Node.js 18+** | Runs the test framework | [Download from nodejs.org](https://nodejs.org/) — choose the LTS version |
| **Docker Desktop** | Runs the Odoo test environment | [Download from docker.com](https://www.docker.com/products/docker-desktop/) |
| **Git** | Downloads the project code | [Download from git-scm.com](https://git-scm.com/) |

> 💡 **Tip:** After installing Docker Desktop, make sure it's running (the whale icon in your system tray should be active).

### Step 2: Download the Project

Open **PowerShell** (or **Terminal** on Mac) and run these commands:

```bash
# Navigate to where you want to store the project
cd C:\Projects

# Download the project
git clone https://github.com/hora-services/hora-qa-framework.git

# Go into the project folder
cd hora-qa-framework
```

> 💡 **How to open PowerShell:** Press `Win + X` and select "Windows PowerShell" or "Terminal".

### Step 3: Install Dependencies

```bash
# Install project libraries (takes 1-2 minutes)
npm install

# Install the browser for testing
npx playwright install chromium
```

> ⏳ The first run may take several minutes — wait for it to complete.

### Step 4: Start the Odoo Test Environment

```bash
# Start Odoo and PostgreSQL in Docker
npm run docker:start
```

**Wait for startup!** The first time, Odoo initialization may take **1-2 minutes**.

Verify it's ready:
1. Open your browser and go to http://localhost:8069
2. You should see the Odoo login page
3. Username: `admin`, Password: `admin`

> ⚠️ **If the page doesn't load:** Wait another minute and refresh. Check status with `docker-compose logs -f odoo`.

### Step 5: Run Your First Test

```bash
# Run quick smoke tests
npm run test:smoke
```

You'll see test progress and results:
- ✅ **Passed** — test completed successfully
- ❌ **Failed** — test found an issue

---

## 🧪 Running Tests

### Common Commands

| What to Test | Command | Duration |
|--------------|---------|----------|
| Quick check (smoke) | `npm run test:smoke` | ~2 min |
| API only | `npm run test:api` | ~3 min |
| Web UI only | `npm run test:web` | ~5 min |
| Integration tests | `npm run test:integration` | ~5 min |
| All tests | `npm run test:all` | ~15 min |
| Tablet tests | `npm run test:tablet` | ~3 min |

### Running Specific Tests

```bash
# By scenario name
npx cucumber-js --name "Access Vehicles page"

# By tag
npx cucumber-js --tags "@smoke"
npx cucumber-js --tags "@critical"
npx cucumber-js --tags "@tablet"
```

### Running with Visible Browser (for debugging)

By default, tests run in background mode (headless). To see what's happening:

**Windows (PowerShell):**
```powershell
$env:HEADLESS="false"; npm run test:smoke
```

**Mac/Linux:**
```bash
HEADLESS=false npm run test:smoke
```

---

## 📊 Viewing Reports

### Cucumber HTML Report (Simple)

After running tests, generate the report:

```bash
npm run report:cucumber
```

Open the file `reports/cucumber/index.html` in your browser.

### Allure Report (Advanced, with Charts)

```bash
# Generate and open report
npm run report:allure:open

# Or with history (shows trends over time)
npm run report:allure:trend:open
```

> 💡 The Allure report will open automatically in your browser.

### Error Screenshots

When a test fails, a screenshot is automatically saved in the folder:
```
reports/screenshots/
```

This makes debugging much easier — you can see exactly what the screen looked like when the error occurred.

---

## 📁 Project Structure

Here's a simplified view of the key folders:

```
hora-qa-framework/
├── features/                  # 📝 Test files (Gherkin language)
│   ├── smoke.feature         #    Quick sanity checks
│   ├── api/                  #    API tests
│   ├── web/fleet/            #    Web interface tests
│   └── mobile/               #    Tablet/mobile tests
│
├── src/                       # 💻 Framework code (for developers)
│   ├── steps/                #    Test step implementations
│   ├── ui-map/               #    UI element locators
│   └── utils/                #    Helper functions
│
├── reports/                   # 📊 Test results
│   ├── cucumber/             #    HTML reports
│   └── screenshots/          #    Error screenshots
│
├── docs/                      # 📚 Documentation
│   ├── STEP_LIBRARY.md       #    Test steps reference
│   └── RUNBOOK.md            #    Troubleshooting guide
│
├── allure-report/            # 📈 Allure HTML report (generated)
├── allure-history/           # 📈 Allure trend history (generated)
├── docker-compose.yml        # 🐳 Docker settings for Odoo
├── cucumber.js               # ⚙️ Cucumber configuration
└── package.json              # 📦 Dependencies & scripts
```

> 💡 **For test writers:** Focus on the `features/` folder — that's where all the test scenarios live!

---

## 📚 Documentation for Different Roles

| Document | Who It's For | What's Inside |
|----------|--------------|---------------|
| **[STEP_LIBRARY.md](docs/STEP_LIBRARY.md)** | Product Owners, Business Analysts | List of all available test steps — write tests without coding! |
| **[RUNBOOK.md](docs/RUNBOOK.md)** | Anyone | Troubleshooting guide and common fixes |
| **[API_TESTING.md](docs/API_TESTING.md)** | QA Engineers | Guide for API testing |
| **[MOBILE_STRATEGY.md](docs/MOBILE_STRATEGY.md)** | QA Engineers | Mobile testing roadmap |
| **[DATA_STRATEGY.md](docs/DATA_STRATEGY.md)** | QA Engineers | Test data management |

---

## ✍️ Writing Tests

Tests are written in **Gherkin** — a simple English-like language that anyone can read and write!

### Example Test

```gherkin
@smoke
Feature: Vehicle Management
  As a fleet manager
  I want to see all vehicles
  So that I can manage my fleet

  Scenario: View the vehicles list
    Given Odoo is accessible at "http://localhost:8069"
    When I navigate to "Vehicles" page
    Then I should see "Vehicles" text
```

### Understanding the Format

| Part | What It Means |
|------|---------------|
| `@smoke` | Tag for grouping (you can run all @smoke tests together) |
| `Feature:` | The area being tested |
| `Scenario:` | One specific test case |
| `Given` | Setup / starting condition |
| `When` | Action you're testing |
| `Then` | Expected result |

### Common Test Steps (Quick Reference)

**Navigation:**
- `Given Odoo is accessible at "http://localhost:8069"` — verify system is up
- `When I navigate to "Vehicles" page` — go to a page
- `When I click "Create" button` — click a button

**Filling Forms:**
- `When I fill "Name" with "John Doe"` — enter text
- `When I select "Truck" from "Type" dropdown` — select from dropdown

**Checking Results:**
- `Then I should see "Success" text` — verify text is visible
- `Then I should see "Save" button` — verify button exists

> 📖 **Full reference:** See [STEP_LIBRARY.md](docs/STEP_LIBRARY.md) for all available steps!

---

## 🧪 Command Reference (Complete List)

### Test Execution

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| `npm run test:smoke`       | Run smoke tests (quick validation)   |
| `npm run test:api`         | Run API tests only                   |
| `npm run test:api:smoke`   | Run API smoke tests                  |
| `npm run test:web`         | Run web UI tests                     |
| `npm run test:integration` | Run integration tests                |
| `npm run test:security`    | Run security tests                   |
| `npm run test:all`         | Run full regression suite (parallel) |
| `npm run test:nightly`     | Run smoke + API + integration        |

### Performance Testing

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run perf:k6:smoke` | Run k6 smoke test (1 min, 10 VUs)     |
| `npm run perf:k6:load`  | Run k6 load test (9 min, staged load) |

### Reporting

| Command                            | Description                                           |
| ---------------------------------- | ----------------------------------------------------- |
| `npm run report:cucumber`          | Generate Cucumber HTML report                         |
| `npm run report:allure`            | Generate Allure report                                |
| `npm run report:allure:open`       | Generate and open Allure report                       |
| `npm run report:allure:trend`      | Generate Allure report with Trend/history preserved   |
| `npm run report:allure:trend:open` | Generate Allure report with Trend/history and open it |

### Allure Trend (Advanced)

| Command                          | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `npm run allure:history:restore` | Restore Trend history into `allure-results/history` |
| `npm run allure:history:save`    | Save `allure-report/history` into `allure-history`  |

### Data Management

| Command            | Description                               |
| ------------------ | ----------------------------------------- |
| `npm run db:seed`  | Seed test data (100 vehicles, 50 drivers) |
| `npm run db:clean` | Clean up test data                        |

### Docker Management

| Command                | Description                        |
| ---------------------- | ---------------------------------- |
| `npm run docker:start` | Start Odoo + PostgreSQL containers |
| `npm run docker:stop`  | Stop containers                    |
| `npm run docker:reset` | Reset containers and volumes       |

### Code Quality

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run lint`         | Run ESLint                      |
| `npm run lint:fix`     | Fix ESLint issues automatically |
| `npm run format`       | Format code with Prettier       |
| `npm run format:check` | Check code formatting           |
| `npm run type-check`   | TypeScript type checking        |
| `npm run build`        | Compile TypeScript              |
| `npm run clean`        | Clean generated files           |

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Remove volumes (reset database)
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables (.env)

| Variable                | Default                 | Description                                  |
| ----------------------- | ----------------------- | -------------------------------------------- |
| `BASE_URL`              | `http://localhost:8069` | Odoo base URL                                |
| `ODOO_USERNAME`         | `admin`                 | Odoo username for UI/API                     |
| `ODOO_PASSWORD`         | `admin`                 | Odoo password for UI/API                     |
| `ODOO_DATABASE`         | `hora_qa_db`            | Odoo database name                           |
| `HEADLESS`              | `true`                  | Run browser headless                         |
| `BROWSER`               | `chromium`              | Browser type                                 |
| `TIMEOUT`               | `30000`                 | Default timeout (ms)                         |
| `SLOW_MO`               | `0`                     | Slow down actions (ms)                       |
| `SCREENSHOT_ON_FAILURE` | `true`                  | Capture on failure                           |
| `DB_ENABLED`            | `true`                  | Enable direct DB checks in integration tests |
| `POSTGRES_HOST`         | `localhost`             | PostgreSQL host                              |
| `POSTGRES_PORT`         | `5432`                  | PostgreSQL port                              |
| `POSTGRES_USER`         | `odoo`                  | PostgreSQL user                              |
| `POSTGRES_PASSWORD`     | `odoo`                  | PostgreSQL password                          |
| `POSTGRES_DATABASE`     | `hora_qa_db`            | PostgreSQL database                          |
| `CTI_MODE`              | `mock`                  | CTI mode (`mock`/`disabled`)                 |
| `OFFLINE_MODE`          | `mock`                  | Offline sync mode (`mock`/`disabled`)        |

### Running in Headed Mode (Debug)

```bash
HEADLESS=false npm run test:smoke
```

### Running with Slow Motion

```bash
SLOW_MO=500 npm run test:smoke
```

## 📝 Writing Tests

### Feature File Example

```gherkin
@smoke
Feature: My Feature
  As a user
  I want to do something
  So that I achieve a goal

  Scenario: My scenario
    Given Odoo is accessible at "http://localhost:8069"
    When I navigate to "Vehicles" page
    Then I should see "Vehicles" text
```

### Available Steps

**Navigation:**

- `Given Odoo is accessible at {string}`
- `When I navigate to {string} page`
- `When I click {string} link`
- `When I refresh the page`

**Interaction:**

- `When I click {string} button`
- `When I fill {string} with {string}`
- `When I select {string} from {string} dropdown`
- `When I check {string} checkbox`

**Assertions:**

- `Then I should see {string} text`
- `Then I should see {string} button`
- `Then {string} field should contain {string}`
- `Then I should be in form view`

## 🔍 Debugging

### Use Playwright Codegen

```bash
npx playwright codegen http://localhost:8069
```

### Run Single Scenario

```bash
npx cucumber-js --name "Access Vehicles page"
```

### Run with Tags

```bash
npx cucumber-js --tags "@critical"
npx cucumber-js --tags "@smoke and not @skip"
```

## 🛠 Troubleshooting

### ❌ "Odoo not accessible" or page won't load

| Try This | How |
|----------|-----|
| 1. Check Docker is running | Look for the whale icon in your system tray |
| 2. Check containers are up | Run `docker-compose ps` — you should see "Up" status |
| 3. Wait longer | First startup can take 1-2 minutes |
| 4. Check logs | Run `docker-compose logs odoo` to see errors |
| 5. Restart Docker | Run `docker-compose down` then `npm run docker:start` |

### ❌ Tests failing — "element not found"

| Try This | How |
|----------|-----|
| 1. Run with visible browser | Use `$env:HEADLESS="false"; npm run test:smoke` |
| 2. Check element exists | Look at the page — is the button/field actually there? |
| 3. Update selectors | UI may have changed — run `npx playwright codegen http://localhost:8069` |

### ❌ "npm command not found"

Node.js may not be installed correctly:
1. Download from [nodejs.org](https://nodejs.org/)
2. Close and reopen PowerShell
3. Test with `node --version` — should show a version number

### ❌ TypeScript errors

```bash
npm run type-check
```

If you see errors, try:
```bash
npm install
npm run build
```

---

## 📊 Test Reports

Reports are automatically generated when you run tests:

| Report Type | Location | How to View |
|-------------|----------|-------------|
| **Cucumber HTML** | `reports/cucumber/index.html` | Open file in browser |
| **Error screenshots** | `reports/screenshots/` | Open images to see failures |
| **Allure Report** | `allure-report/` | Run `npm run report:allure:open` |

### Recommended Workflow

```bash
# 1. Run your tests
npm run test:api

# 2. View the report with trend history
npm run report:allure:trend:open
```

The Allure report will open in your browser showing:
- Pass/fail summary
- Trend charts (if you have history)
- Detailed step-by-step execution
- Screenshots for failed tests

---

## 🏷 Test Tags Quick Reference

Use tags to run specific groups of tests:

| Tag | What It Runs | Command |
|-----|--------------|---------|
| `@smoke` | Quick sanity checks | `npx cucumber-js --tags "@smoke"` |
| `@critical` | Business-critical paths | `npx cucumber-js --tags "@critical"` |
| `@api` | API tests only | `npx cucumber-js --tags "@api"` |
| `@tablet` | Tablet device tests | `npx cucumber-js --tags "@tablet"` |
| `@skip` | (Skips the test) | — |

**Combining tags:**
```bash
# Run smoke tests except skipped ones
npx cucumber-js --tags "@smoke and not @skip"

# Run either critical or smoke tests
npx cucumber-js --tags "@critical or @smoke"
```

---

## 📞 Need Help?

| Question | Where to Look |
|----------|---------------|
| "What steps can I use?" | [STEP_LIBRARY.md](docs/STEP_LIBRARY.md) |
| "Something's broken!" | [RUNBOOK.md](docs/RUNBOOK.md) or Troubleshooting section above |
| "I found a bug" | Open an issue in the GitHub repository |
| "I need a new feature" | Contact the QA team or open a feature request |

---

## 🎉 Happy Testing!

Remember:
- Start with `npm run test:smoke` to verify everything works
- Use visible browser mode (`HEADLESS=false`) when debugging
- Check the [STEP_LIBRARY.md](docs/STEP_LIBRARY.md) for all available test steps
- When in doubt, check the [RUNBOOK.md](docs/RUNBOOK.md)
