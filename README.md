# Hora Services QA Automation Framework

A BDD-based QA automation framework for testing Odoo applications using Playwright and Cucumber.

## 🚀 Quick Start

### Prerequisites

- **Node.js 20+** - [Download](https://nodejs.org/)
- **Docker & Docker Compose** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

### 1. Installation

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd hora-qa-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env if needed (defaults work for local development)
```

### 3. Start Test Environment

```bash
# Start Odoo and PostgreSQL containers
docker-compose up -d

# Wait for Odoo to be ready (about 60 seconds)
# You can check status with:
docker-compose logs -f odoo

# Verify Odoo is accessible
# Open http://localhost:8069 in your browser
```

### 4. Run Tests

```bash
# Run smoke tests
npm run test:smoke

# Run all tests
npm run test:all
```

### 5. View Reports

```bash
# Generate HTML report
npm run report:cucumber

# Open the report (located at reports/cucumber/index.html)
```

## 📁 Project Structure

```
hora-qa-framework/
├── features/                   # Gherkin feature files
│   └── smoke.feature          # Smoke test scenarios
├── src/
│   ├── pages/                 # Page Object Model
│   │   ├── base/
│   │   │   ├── BasePage.ts    # Abstract base page
│   │   │   └── OdooBasePage.ts # Odoo-specific base
│   │   └── web/
│   │       └── fleet/
│   │           └── VehiclesListPage.ts
│   ├── steps/                 # Step definitions
│   │   └── atomic/           # Atomic/reusable steps
│   │       ├── navigation.steps.ts
│   │       ├── interaction.steps.ts
│   │       └── assertions.steps.ts
│   ├── support/              # Test support files
│   │   ├── env.ts           # Environment config
│   │   ├── custom-world.ts  # Cucumber World
│   │   └── hooks.ts         # Lifecycle hooks
│   ├── types/               # TypeScript types
│   │   └── cucumber.ts
│   └── utils/               # Utility functions
│       └── wait.ts
├── reports/                  # Test reports (generated)
│   ├── cucumber/
│   └── screenshots/
├── scripts/
│   └── generate-report.js   # Report generator
├── cucumber.config.ts       # Cucumber configuration
├── docker-compose.yml       # Docker services
├── package.json
├── tsconfig.json
└── README.md
```

## 🧪 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:smoke` | Run smoke tests (tagged @smoke) |
| `npm run test:all` | Run all tests |
| `npm run report:cucumber` | Generate HTML report |
| `npm run type-check` | TypeScript type checking |
| `npm run lint` | Run ESLint |
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
