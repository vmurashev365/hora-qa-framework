/**
 * Service Environment Contract
 *
 * These variables define external integration points used by higher-level
 * domain modules (finance compliance, offline sync, CTI screen pop).
 */

export interface FinanceEnvContract {
  /** Base URL for REST services under test (e.g. https://api.qa.hora-services.com) */
  apiBaseUrl: string;
  /** Bearer token (without the "Bearer" prefix) used for REST API auth */
  apiAuthToken: string;

  /** REST endpoint path for salary calculation (relative to apiBaseUrl or absolute URL) */
  financeSalaryEndpoint: string;
  /** REST endpoint path for IFTA calculation (relative to apiBaseUrl or absolute URL) */
  financeIftaEndpoint: string;
}

export interface OfflineSyncEnvContract {
  /** Base URL for REST services under test (e.g. https://api.qa.hora-services.com) */
  apiBaseUrl: string;
  /** Bearer token (without the "Bearer" prefix) used for REST API auth */
  apiAuthToken: string;

  /** Base URL for Odoo web UI (e.g. https://odoo.qa.hora-services.com) */
  odooBaseUrl: string;
  /** Odoo UI username */
  odooUser: string;
  /** Odoo UI password */
  odooPass: string;

  /** REST endpoint path for load sync status polling (relative to apiBaseUrl or absolute URL) */
  loadStatusEndpoint: string;
}

export interface CtiEnvContract {
  /** Base URL for Odoo web UI (e.g. https://odoo.qa.hora-services.com) */
  odooBaseUrl: string;
  /** Odoo UI username */
  odooUser: string;
  /** Odoo UI password */
  odooPass: string;

  /** WebSocket URL/pattern used by CTI client in the web UI */
  ctiWsPattern: string;
}

/** Full contract (superset) for environments that want to provide everything. */
export type ServiceEnvContract = FinanceEnvContract & OfflineSyncEnvContract & CtiEnvContract;
