# Hora Services QA Automation Framework

<!-- Badges -->
[![Test Suite](https://github.com/hora-services/hora-qa-framework/actions/workflows/test-suite.yml/badge.svg)](https://github.com/hora-services/hora-qa-framework/actions/workflows/test-suite.yml)
[![Coverage](https://img.shields.io/badge/coverage-75%25-brightgreen.svg)](./reports/coverage)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A comprehensive BDD-based QA automation framework for testing the Hora Services fleet management system built on Odoo ERP.

## ✨ Highlights

🏗️ **3-Layer BDD Architecture** - Atomic → Domain → Composite steps for maximum reusability  
🗺️ **UI-MAP Pattern** - Decoupled selectors for maintainability and resilience  
🎯 **Full-Stack Testing** - Web UI, REST/JSON-RPC APIs, Database, Integration tests  
📱 **Mobile-Ready** - Appium architecture for Android/iOS driver app testing  
🔒 **Security Testing** - Access control, authentication, GDPR compliance validation  
⚡ **Performance Testing** - k6 integration for load and stress testing  
📝 **50+ Reusable Steps** - Product Owners can write tests without coding  
🐳 **Docker-First** - Containerized Odoo environment for consistent testing  
📊 **Rich Reporting** - Cucumber HTML reports, Allure reports, screenshots on failure  
🤖 **CI/CD Ready** - GitHub Actions workflows with nightly regression

## 🚀 Quick Start

### Prerequisites Checklist

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **k6** (optional, for performance tests) - [Install](https://k6.io/docs/getting-started/installation/)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/hora-services/hora-qa-framework.git
cd hora-qa-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Start Test Environment

```bash
# Start Odoo and PostgreSQL containers
npm run docker:start
# Or: docker-compose up -d

# Wait for Odoo to initialize (60 seconds)
# Check logs: docker-compose logs -f odoo

# Verify Odoo is accessible at http://localhost:8069
```

### 3. Run Your First Test

```bash
# Run smoke tests (2-3 minutes)
npm run test:smoke

# View results in terminal
# Generate HTML report
npm run report:cucumber

# Open report in browser
start reports/cucumber/index.html  # Windows
open reports/cucumber/index.html   # macOS
```

### 4. Explore Test Suites

```bash
# API tests
npm run test:api

# Integration tests
npm run test:integration

# Full regression suite
npm run test:all

# Performance tests (requires k6)
npm run perf:k6:smoke
```

## 📁 Project Structure

```
hora-qa-framework/
├── features/                       # Gherkin feature files (BDD scenarios)
│   ├── smoke.feature              # Smoke tests
│   ├── security.feature           # Security & access control
│   ├── api/                       # API test scenarios
│   ├── integration/               # Integration tests
│   └── web/fleet/                 # Fleet management UI tests
├── src/
│   ├── api/                       # API clients
│   │   ├── clients/              # REST & Odoo JSON-RPC clients
│   │   └── endpoints/            # Fleet API endpoints
│   ├── db/                        # Database clients & queries
│   ├── pages/                     # Page Object Model
│   │   ├── base/                 # Base page classes
│   │   └── web/fleet/            # Fleet module pages
│   ├── steps/                     # Step definitions (3-layer)
│   │   ├── atomic/               # Low-level steps
│   │   ├── domain/               # Business logic steps
│   │   └── composite/            # Complex workflows
│   ├── support/                   # Test framework support
│   │   ├── custom-world.ts       # Cucumber World
│   │   ├── hooks.ts              # Lifecycle hooks
│   │   └── env.ts                # Environment config
│   ├── ui-map/                    # UI-MAP pattern
│   │   ├── pages.ts              # Page URLs
│   │   ├── fields.ts             # Form field labels
│   │   ├── buttons.ts            # Button labels
│   │   └── messages.ts           # Success/error messages
│   ├── types/                     # TypeScript types
│   └── utils/                     # Utilities (retry, wait)
├── config/                        # Configuration files
│   ├── appium.json               # Mobile capabilities
│   └── appium.ts                 # Appium helper
├── perf/k6/                       # Performance tests (k6)
│   ├── smoke.js                  # Quick performance check
│   └── load.js                   # Load test scenarios
├── docs/                          # Documentation
│   ├── STEP_LIBRARY.md           # For Product Owners
│   ├── API_TESTING.md            # API testing guide
│   ├── MOBILE_STRATEGY.md        # Mobile testing roadmap
│   ├── CTI_STRATEGY.md           # Telephony testing
│   ├── DATA_STRATEGY.md          # Test data management
│   └── RUNBOOK.md                # Troubleshooting guide
├── reports/                       # Generated test reports
│   ├── cucumber/                 # Cucumber HTML reports
│   └── screenshots/              # Failure screenshots
├── scripts/                       # Utility scripts
│   ├── generate-report.js        # Report generator
│   ├── clean-test-data.ts        # Data cleanup
│   └── seed-test-data.ts         # Data seeding
├── .github/workflows/             # CI/CD pipelines
│   └── test-suite.yml            # GitHub Actions workflow
├── docker-compose.yml             # Odoo + PostgreSQL setup
├── cucumber.config.ts             # Cucumber configuration
└── package.json                   # Dependencies & scripts
├── cucumber.config.ts       # Cucumber configuration
├── docker-compose.yml       # Docker services
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 Documentation

Comprehensive documentation for different audiences:

- **[STEP_LIBRARY.md](docs/STEP_LIBRARY.md)** - Reference guide for Product Owners to write tests without coding
- **[API_TESTING.md](docs/API_TESTING.md)** - Guide for REST and Odoo JSON-RPC API testing
- **[MOBILE_STRATEGY.md](docs/MOBILE_STRATEGY.md)** - Mobile testing roadmap and Appium architecture
- **[CTI_STRATEGY.md](docs/CTI_STRATEGY.md)** - Computer Telephony Integration testing strategy
- **[DATA_STRATEGY.md](docs/DATA_STRATEGY.md)** - Test data management and best practices
- **[RUNBOOK.md](docs/RUNBOOK.md)** - Troubleshooting guide and operational procedures

## 🧪 Available Commands

### Test Execution

| Command | Description |
|---------|-------------|
| `npm run test:smoke` | Run smoke tests (quick validation) |
| `npm run test:api` | Run API tests only |
| `npm run test:api:smoke` | Run API smoke tests |
| `npm run test:web` | Run web UI tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:security` | Run security tests |
| `npm run test:all` | Run full regression suite (parallel) |
| `npm run test:nightly` | Run smoke + API + integration |

### Performance Testing

| Command | Description |
|---------|-------------|
| `npm run perf:k6:smoke` | Run k6 smoke test (1 min, 10 VUs) |
| `npm run perf:k6:load` | Run k6 load test (9 min, staged load) |

### Reporting

| Command | Description |
|---------|-------------|
| `npm run report:cucumber` | Generate Cucumber HTML report |
| `npm run report:allure` | Generate Allure report |
| `npm run report:allure:open` | Generate and open Allure report |

### Data Management

| Command | Description |
|---------|-------------|
| `npm run db:seed` | Seed test data (100 vehicles, 50 drivers) |
| `npm run db:clean` | Clean up test data |

### Docker Management

| Command | Description |
|---------|-------------|
| `npm run docker:start` | Start Odoo + PostgreSQL containers |
| `npm run docker:stop` | Stop containers |
| `npm run docker:reset` | Reset containers and volumes |

### Code Quality

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run type-check` | TypeScript type checking |
| `npm run build` | Compile TypeScript |
| `npm run clean` | Clean generated files |

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

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `http://localhost:8069` | Odoo base URL |
| `HEADLESS` | `true` | Run browser headless |
| `BROWSER` | `chromium` | Browser type |
| `TIMEOUT` | `30000` | Default timeout (ms) |
| `SLOW_MO` | `0` | Slow down actions (ms) |
| `SCREENSHOT_ON_FAILURE` | `true` | Capture on failure |

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
npx cucumber-js --config cucumber.config.ts --name "Access Vehicles page"
```

### Run with Tags

```bash
npx cucumber-js --config cucumber.config.ts --tags "@critical"
npx cucumber-js --config cucumber.config.ts --tags "@smoke and not @skip"
```

## 🛠 Troubleshooting

### Odoo not accessible

1. Check Docker containers are running: `docker-compose ps`
2. Wait longer for initialization (can take 60+ seconds first time)
3. Check logs: `docker-compose logs odoo`

### Tests failing on selectors

1. Run Playwright codegen to find correct selectors
2. Odoo UI may vary by version - adjust selectors as needed
3. Check if element is in iframe or shadow DOM

### TypeScript errors

```bash
npm run type-check
```

## 📊 Test Reports

Reports are generated in `reports/cucumber/`:
- `cucumber.json` - Raw JSON results
- `index.html` - HTML report (after running `npm run report:cucumber`)
- Screenshots saved in `reports/screenshots/` on failure

## 🏷 Test Tags

| Tag | Description |
|-----|-------------|
| `@smoke` | Smoke tests (quick sanity check) |
| `@critical` | Critical path tests |
| `@skip` | Skip this test |

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Happy Testing! 🎉**
