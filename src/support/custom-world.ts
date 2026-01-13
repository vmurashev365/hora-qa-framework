/**
 * Custom World for Cucumber
 * Extends the default World with Playwright browser, context, page, and page objects
 */

import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { VehiclesListPage } from '../pages/web/fleet/VehiclesListPage';
import { VehicleFormPage } from '../pages/web/fleet/VehicleFormPage';
import { LoginPage } from '../pages/web/LoginPage';
import { OdooJsonRpcClient } from '../api/clients/OdooJsonRpcClient';
import { RestApiClient } from '../api/clients/RestApiClient';
import { FleetEndpoints } from '../api/endpoints/FleetEndpoints';
import { HttpResponse } from '../types/api';
import { PgClient } from '../db/PgClient';
import { AsteriskMockClient } from '../api/clients/AsteriskMockClient';
import { CouchClient } from '../db/CouchClient';

/**
 * World parameters passed from cucumber.config.ts
 */
export interface WorldParameters {
  baseUrl: string;
  headless: boolean;
  slowMo: number;
  timeout: number;
}

/**
 * Custom World class extending Cucumber's World
 * Contains browser instances, page objects, and test data storage
 */
export class CustomWorld extends World<WorldParameters> {
  // Playwright instances
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  // World parameters (from cucumber.config.ts)
  declare parameters: WorldParameters;

  // Page Objects - Fleet Module
  vehiclesListPage!: VehiclesListPage;
  vehicleFormPage!: VehicleFormPage;
  
  // Page Objects - Authentication
  loginPage!: LoginPage;

  // API Clients
  odooApi!: OdooJsonRpcClient;
  restApi!: RestApiClient;
  fleetEndpoints!: FleetEndpoints;

  // API Response Storage
  lastApiResponse?: HttpResponse;

  // Database Client (PostgreSQL)
  dbClient?: PgClient;

  // Mock Services
  ctiClient?: AsteriskMockClient;
  offlineClient?: CouchClient;

  // Test data storage - use Map for type-safe key-value storage
  testData: Map<string, unknown> = new Map();

  // Scenario metadata
  scenarioName: string = '';
  featureName: string = '';

  constructor(options: IWorldOptions<WorldParameters>) {
    super(options);
  }

  /**
   * Get base URL from parameters or environment
   */
  getBaseUrl(): string {
    return this.parameters.baseUrl || process.env.BASE_URL || 'http://localhost:8069';
  }

  /**
   * Store test data with a key
   */
  setTestData<T>(key: string, value: T): void {
    this.testData.set(key, value);
  }

  /**
   * Retrieve test data by key
   */
  getTestData<T>(key: string): T | undefined {
    return this.testData.get(key) as T | undefined;
  }

  /**
   * Check if test data exists
   */
  hasTestData(key: string): boolean {
    return this.testData.has(key);
  }

  /**
   * Clear all test data
   */
  clearTestData(): void {
    this.testData.clear();
  }

  /**
   * Initialize page objects after page is created
   */
  initializePageObjects(): void {
    this.vehiclesListPage = new VehiclesListPage(this.page);
    this.vehicleFormPage = new VehicleFormPage(this.page);
    this.loginPage = new LoginPage(this.page);
  }
}

// Set the world constructor for Cucumber
setWorldConstructor(CustomWorld);

export default CustomWorld;
