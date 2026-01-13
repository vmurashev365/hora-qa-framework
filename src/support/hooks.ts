/**
 * Cucumber Hooks
 * Lifecycle hooks for browser management and test setup/teardown
 */

import { Before, After, BeforeAll, AfterAll, Status } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './custom-world';
import { getEnvConfig } from './env';
import { OdooJsonRpcClient } from '../api/clients/OdooJsonRpcClient';
import { RestApiClient } from '../api/clients/RestApiClient';
import { FleetEndpoints } from '../api/endpoints/FleetEndpoints';
import * as fs from 'fs';
import * as path from 'path';

// Shared browser instance across all scenarios
let browser: Browser;

/**
 * BeforeAll Hook
 * Launches browser once before all scenarios
 */
BeforeAll(async function () {
  const config = getEnvConfig();
  
  console.log('\n🚀 Launching browser...');
  console.log(`   Browser: chromium`);
  console.log(`   Headless: ${config.headless}`);
  console.log(`   Base URL: ${config.baseUrl}`);
  
  browser = await chromium.launch({
    headless: config.headless,
    slowMo: config.slowMo,
  });

  // Ensure reports directory exists
  const reportsDir = path.resolve(process.cwd(), 'reports/cucumber');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Ensure screenshots directory exists
  const screenshotsDir = path.resolve(process.cwd(), 'reports/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log('✅ Browser launched successfully\n');
});

/**
 * Before Hook
 * Creates new context and page for each scenario
 */
Before(async function (this: CustomWorld, scenario) {
  const config = getEnvConfig();
  
  // Store scenario metadata
  this.scenarioName = scenario.pickle.name;
  this.featureName = scenario.gherkinDocument?.feature?.name || 'Unknown Feature';
  
  // Assign shared browser to world
  this.browser = browser;

  // Create new context for isolation
  this.context = await browser.newContext({
    viewport: {
      width: config.viewportWidth,
      height: config.viewportHeight,
    },
    ignoreHTTPSErrors: true,
    // Record video if enabled
    ...(config.videoRecording && {
      recordVideo: {
        dir: 'reports/videos',
        size: { width: 1280, height: 720 },
      },
    }),
  });

  // Set default timeout
  this.context.setDefaultTimeout(config.timeout);

  // Create new page
  this.page = await this.context.newPage();

  // Initialize page objects
  this.initializePageObjects();

  // Initialize API Clients
  this.odooApi = new OdooJsonRpcClient(config.baseUrl);
  this.restApi = new RestApiClient(process.env.REST_BASE_URL || config.baseUrl);
  
  // Authenticate Odoo API client
  try {
    await this.odooApi.authenticate(config.odooDatabase, config.odooUsername, config.odooPassword);
    this.fleetEndpoints = new FleetEndpoints(this.odooApi);
    console.log('✅ API clients initialized');
  } catch (error) {
    console.log(`⚠️ API authentication deferred (will authenticate on first API step)`);
    this.fleetEndpoints = new FleetEndpoints(this.odooApi);
  }

  // Clear test data from previous scenario
  this.clearTestData();

  console.log(`\n📋 Starting: ${this.scenarioName}`);
});

/**
 * After Hook
 * Handles cleanup, screenshots on failure, and resource disposal
 */
After(async function (this: CustomWorld, scenario) {
  const config = getEnvConfig();

  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED && config.screenshotOnFailure) {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const safeName = this.scenarioName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
      const screenshotPath = path.resolve(
        process.cwd(),
        `reports/screenshots/${safeName}_${timestamp}.png`
      );

      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });

      console.log(`📸 Screenshot saved: ${screenshotPath}`);

      // Attach screenshot to report (base64)
      const screenshot = await this.page.screenshot({ type: 'png' });
      this.attach(screenshot, 'image/png');
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
  }

  // Log scenario result
  const status = scenario.result?.status;
  const statusEmoji = status === Status.PASSED ? '✅' : status === Status.FAILED ? '❌' : '⚠️';
  console.log(`${statusEmoji} Finished: ${this.scenarioName} - ${status}`);

  // Close page and context
  if (this.page) {
    await this.page.close().catch(() => {});
  }
  if (this.context) {
    await this.context.close().catch(() => {});
  }
});

/**
 * AfterAll Hook
 * Closes browser after all scenarios complete
 */
AfterAll(async function () {
  console.log('\n🔒 Closing browser...');
  
  if (browser) {
    await browser.close();
  }

  console.log('✅ Browser closed successfully');
  console.log('\n📊 Test run complete. Check reports/cucumber for results.\n');
});
