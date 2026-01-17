/**
 * Loads and validates the "ENV Contract" variables.
 *
 * This module intentionally keeps existing env.ts behavior intact and only
 * enforces required variables when these higher-level modules are used.
 */

import type {
  ServiceEnvContract,
  FinanceEnvContract,
  OfflineSyncEnvContract,
  CtiEnvContract,
} from '../types/env-contract';

// Ensure .env is loaded (env.ts performs dotenv.config at import time).
import '../support/env';

function required(name: string, value: string | undefined): string {
  const v = value?.trim();
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

function optional(value: string | undefined): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/**
 * Prefer contract names, but allow fallback to existing repo variables
 * for backward compatibility.
 */
export function getServiceEnv(): ServiceEnvContract {
  const apiBaseUrl = optional(process.env.API_BASE_URL) ?? optional(process.env.REST_BASE_URL);
  const odooBaseUrl = optional(process.env.ODOO_BASE_URL) ?? optional(process.env.BASE_URL);

  const odooUser = optional(process.env.ODOO_USER) ?? optional(process.env.ODOO_USERNAME);
  const odooPass = optional(process.env.ODOO_PASS) ?? optional(process.env.ODOO_PASSWORD);

  return {
    apiBaseUrl: required('API_BASE_URL', apiBaseUrl),
    apiAuthToken: required('API_AUTH_TOKEN', process.env.API_AUTH_TOKEN),

    odooBaseUrl: required('ODOO_BASE_URL', odooBaseUrl),
    odooUser: required('ODOO_USER', odooUser),
    odooPass: required('ODOO_PASS', odooPass),

    ctiWsPattern: required('CTI_WS_PATTERN', process.env.CTI_WS_PATTERN),

    financeSalaryEndpoint: required('FINANCE_SALARY_ENDPOINT', process.env.FINANCE_SALARY_ENDPOINT),
    financeIftaEndpoint: required('FINANCE_IFTA_ENDPOINT', process.env.FINANCE_IFTA_ENDPOINT),

    loadStatusEndpoint: required('LOAD_STATUS_ENDPOINT', process.env.LOAD_STATUS_ENDPOINT),
  };
}

export function getFinanceEnv(): FinanceEnvContract {
  const apiBaseUrl = optional(process.env.API_BASE_URL) ?? optional(process.env.REST_BASE_URL);

  return {
    apiBaseUrl: required('API_BASE_URL', apiBaseUrl),
    apiAuthToken: required('API_AUTH_TOKEN', process.env.API_AUTH_TOKEN),
    financeSalaryEndpoint: required('FINANCE_SALARY_ENDPOINT', process.env.FINANCE_SALARY_ENDPOINT),
    financeIftaEndpoint: required('FINANCE_IFTA_ENDPOINT', process.env.FINANCE_IFTA_ENDPOINT),
  };
}

export function getOfflineSyncEnv(): OfflineSyncEnvContract {
  const apiBaseUrl = optional(process.env.API_BASE_URL) ?? optional(process.env.REST_BASE_URL);
  const odooBaseUrl = optional(process.env.ODOO_BASE_URL) ?? optional(process.env.BASE_URL);

  const odooUser = optional(process.env.ODOO_USER) ?? optional(process.env.ODOO_USERNAME);
  const odooPass = optional(process.env.ODOO_PASS) ?? optional(process.env.ODOO_PASSWORD);

  return {
    apiBaseUrl: required('API_BASE_URL', apiBaseUrl),
    apiAuthToken: required('API_AUTH_TOKEN', process.env.API_AUTH_TOKEN),

    odooBaseUrl: required('ODOO_BASE_URL', odooBaseUrl),
    odooUser: required('ODOO_USER', odooUser),
    odooPass: required('ODOO_PASS', odooPass),

    loadStatusEndpoint: required('LOAD_STATUS_ENDPOINT', process.env.LOAD_STATUS_ENDPOINT),
  };
}

export function getCtiEnv(): CtiEnvContract {
  const odooBaseUrl = optional(process.env.ODOO_BASE_URL) ?? optional(process.env.BASE_URL);

  const odooUser = optional(process.env.ODOO_USER) ?? optional(process.env.ODOO_USERNAME);
  const odooPass = optional(process.env.ODOO_PASS) ?? optional(process.env.ODOO_PASSWORD);

  return {
    odooBaseUrl: required('ODOO_BASE_URL', odooBaseUrl),
    odooUser: required('ODOO_USER', odooUser),
    odooPass: required('ODOO_PASS', odooPass),
    ctiWsPattern: required('CTI_WS_PATTERN', process.env.CTI_WS_PATTERN),
  };
}
