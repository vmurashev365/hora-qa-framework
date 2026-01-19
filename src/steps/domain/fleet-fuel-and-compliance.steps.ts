/**
 * Fleet Fuel & Compliance Domain Steps
 *
 * Thin Cucumber bindings that exercise the Odoo Fleet model adapters.
 * Business logic and Odoo mappings live in the model layer.
 */

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../support/custom-world';
import { FleetVehicleModel } from '../../api/models/fleet/FleetVehicleModel';
import { FleetFuelLogModel } from '../../api/models/fleet/FleetFuelLogModel';
import { FleetInspectionModel } from '../../api/models/fleet/FleetInspectionModel';
import type { FuelLog, FleetVehicle, InspectionLog, InspectionResult } from '../../types/fleet';

const TESTDATA_KEYS = {
  vehicle: 'fleet:vehicle',
  fuelLog: 'fleet:fuelLog',
  inspectionLog: 'fleet:inspectionLog',
} as const;

function parseInspectionResult(value: string): InspectionResult {
  if (value === 'pass' || value === 'fail') {
    return value;
  }
  throw new Error(`Invalid inspection result: ${value}. Expected "pass" or "fail".`);
}

Given('a fleet vehicle {string} exists', { timeout: 30000 }, async function (this: CustomWorld, name: string) {
  const vehicles = new FleetVehicleModel(this.odooApi);

  const vehicle = await vehicles.ensureExists({
    name,
    // Provide a deterministic plate so repeated runs are stable.
    licensePlate: name.toUpperCase().replace(/\s+/g, '-'),
    odometer: 0,
    odometerUnit: 'miles',
    active: true,
  });

  this.setTestData<FleetVehicle>(TESTDATA_KEYS.vehicle, vehicle);
});

When(
  'I log fuel of {int} gallons at price {float} for truck {string}',
  { timeout: 30000 },
  async function (this: CustomWorld, gallons: number, pricePerGallon: number, vehicleName: string) {
    const vehicles = new FleetVehicleModel(this.odooApi);
    const fuelLogs = new FleetFuelLogModel(this.odooApi);

    const vehicle = this.getTestData<FleetVehicle>(TESTDATA_KEYS.vehicle) ?? (await vehicles.getByName(vehicleName));

    const fuelLog = await fuelLogs.createFuelLog({
      vehicleId: vehicle.id,
      gallons,
      pricePerGallon,
    });

    this.setTestData<FuelLog>(TESTDATA_KEYS.fuelLog, fuelLog);
  }
);

When(
  'I update odometer of truck {string} to {int} miles',
  { timeout: 30000 },
  async function (this: CustomWorld, vehicleName: string, miles: number) {
    const vehicles = new FleetVehicleModel(this.odooApi);
    const vehicle = this.getTestData<FleetVehicle>(TESTDATA_KEYS.vehicle) ?? (await vehicles.getByName(vehicleName));

    await vehicles.updateOdometer(vehicle.id, miles);

    // Update cached vehicle snapshot for later assertions if needed.
    this.setTestData<FleetVehicle>(TESTDATA_KEYS.vehicle, { ...vehicle, odometer: miles, odometerUnit: 'miles' });
  }
);

Then(
  'the fuel log should be stored correctly for truck {string}',
  { timeout: 30000 },
  async function (this: CustomWorld, vehicleName: string) {
    const vehicles = new FleetVehicleModel(this.odooApi);
    const fuelLogs = new FleetFuelLogModel(this.odooApi);

    const vehicle = this.getTestData<FleetVehicle>(TESTDATA_KEYS.vehicle) ?? (await vehicles.getByName(vehicleName));
    const created = this.getTestData<FuelLog>(TESTDATA_KEYS.fuelLog);

    expect(created, 'Expected a fuel log to be created during scenario').toBeTruthy();
    if (!created) return;

    const latest = await fuelLogs.getLatestForVehicle(vehicle.id);

    expect(latest.vehicleId).toBe(vehicle.id);
    expect(latest.id).toBe(created.id);

    // Values are subject to liter<->gallon conversion; assert with tolerance.
    expect(latest.gallons).toBeCloseTo(created.gallons, 3);
    expect(latest.pricePerGallon).toBeCloseTo(created.pricePerGallon, 3);
    expect(latest.totalCost).toBeCloseTo(created.totalCost, 2);
  }
);

When(
  'I record a {string} inspection for truck {string}',
  { timeout: 30000 },
  async function (this: CustomWorld, resultRaw: string, vehicleName: string) {
    const vehicles = new FleetVehicleModel(this.odooApi);
    const inspections = new FleetInspectionModel(this.odooApi);

    const vehicle = this.getTestData<FleetVehicle>(TESTDATA_KEYS.vehicle) ?? (await vehicles.getByName(vehicleName));
    const result = parseInspectionResult(resultRaw);

    const inspection = await inspections.createInspection(vehicle.id, result);
    this.setTestData<InspectionLog>(TESTDATA_KEYS.inspectionLog, inspection);
  }
);

Then(
  'inspection should be visible in fleet records',
  { timeout: 30000 },
  async function (this: CustomWorld) {
    const inspections = new FleetInspectionModel(this.odooApi);
    const vehicle = this.getTestData<FleetVehicle>(TESTDATA_KEYS.vehicle);
    const created = this.getTestData<InspectionLog>(TESTDATA_KEYS.inspectionLog);

    expect(vehicle, 'Expected vehicle to be present in test data').toBeTruthy();
    expect(created, 'Expected inspection to be created during scenario').toBeTruthy();

    if (!vehicle || !created) return;

    const latest = await inspections.getLatestForVehicle(vehicle.id);
    expect(latest.id).toBe(created.id);
    expect(latest.vehicleId).toBe(vehicle.id);
    expect(latest.inspectionResult).toBe(created.inspectionResult);
  }
);
