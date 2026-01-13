/**
 * VehiclesListPage - Page object for Fleet Vehicles List view
 * Handles vehicle list operations in Odoo Fleet module
 */

import { Page } from 'playwright';
import { OdooBasePage } from '../../base/OdooBasePage';

/**
 * Vehicle data interface
 */
export interface VehicleData {
  licensePlate?: string;
  model?: string;
  driver?: string;
  status?: string;
  tags?: string[];
}

/**
 * VehiclesListPage - Fleet Vehicles List Page Object
 */
export class VehiclesListPage extends OdooBasePage {
  // Page-specific selectors
  private readonly vehicleSelectors = {
    // List view
    vehicleRow: '.o_data_row',
    licensePlateColumn: 'td[data-field="license_plate"]',
    modelColumn: 'td[data-field="model_id"]',
    driverColumn: 'td[data-field="driver_id"]',
    
    // Form fields
    licensePlateInput: 'input[name="license_plate"]',
    modelSelect: 'div[name="model_id"] input',
    driverSelect: 'div[name="driver_id"] input',
    
    // Buttons
    createVehicleBtn: '.o_list_button_add',
    
    // Views
    vehiclesListView: '.o_list_view',
    vehicleFormView: '.o_form_view',
  };

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Vehicles list page
   * @param baseUrl - Base URL of Odoo instance
   */
  async navigateToVehicles(baseUrl: string): Promise<void> {
    const url = `${baseUrl}/web#model=fleet.vehicle&view_type=list`;
    await this.page.goto(url);
    await this.waitForPageLoad();
    await this.waitForOdooReady();
  }

  /**
   * Check if we're on the Vehicles list page
   */
  async isOnVehiclesListPage(): Promise<boolean> {
    try {
      await this.waitForLoadingComplete();
      
      // Check URL contains fleet.vehicle
      const url = this.getCurrentUrl();
      if (!url.includes('fleet.vehicle')) {
        return false;
      }
      
      // Check list view is visible
      return await this.isListView();
    } catch {
      return false;
    }
  }

  /**
   * Click Create button to open new vehicle form
   */
  async clickCreateVehicle(): Promise<void> {
    await this.waitForLoadingComplete();
    
    // Try role-based selector first, using .first() for Odoo 17 which may have duplicate buttons
    const createBtn = this.page.getByRole('button', { name: /^new$/i }).first();
    if (await createBtn.isVisible()) {
      await createBtn.click();
    } else {
      // Fallback to Odoo-specific selector with .first()
      await this.page.locator(this.vehicleSelectors.createVehicleBtn).first().click();
    }
    
    await this.waitForLoadingComplete();
  }

  /**
   * Check if we're on the Vehicle form (create/edit)
   */
  async isOnVehicleForm(): Promise<boolean> {
    await this.waitForLoadingComplete();
    return await this.isFormView();
  }

  /**
   * Fill License Plate field
   * @param licensePlate - License plate value
   */
  async fillLicensePlate(licensePlate: string): Promise<void> {
    await this.waitForLoadingComplete();
    
    // Try label-based selector first
    const field = this.page.getByLabel(/license plate/i);
    if (await field.isVisible()) {
      await field.fill(licensePlate);
    } else {
      // Fallback to name selector
      await this.page.locator(this.vehicleSelectors.licensePlateInput).fill(licensePlate);
    }
  }

  /**
   * Get License Plate field value
   */
  async getLicensePlateValue(): Promise<string> {
    await this.waitForLoadingComplete();
    
    // Try label-based selector first
    const field = this.page.getByLabel(/license plate/i);
    if (await field.isVisible()) {
      return await field.inputValue();
    }
    
    // Fallback to name selector
    return await this.page.locator(this.vehicleSelectors.licensePlateInput).inputValue();
  }

  /**
   * Fill Model field (Many2one with autocomplete)
   * @param model - Model name to select
   */
  async fillModel(model: string): Promise<void> {
    await this.waitForLoadingComplete();
    
    const modelInput = this.page.locator(this.vehicleSelectors.modelSelect);
    await modelInput.fill(model);
    
    // Wait for dropdown and select first option
    await this.page.waitForTimeout(500);
    const dropdown = this.page.locator('.o_m2o_dropdown_option').first();
    if (await dropdown.isVisible()) {
      await dropdown.click();
    }
    
    await this.waitForLoadingComplete();
  }

  /**
   * Fill Driver field (Many2one with autocomplete)
   * @param driver - Driver name to select
   */
  async fillDriver(driver: string): Promise<void> {
    await this.waitForLoadingComplete();
    
    const driverInput = this.page.locator(this.vehicleSelectors.driverSelect);
    await driverInput.fill(driver);
    
    // Wait for dropdown and select first option
    await this.page.waitForTimeout(500);
    const dropdown = this.page.locator('.o_m2o_dropdown_option').first();
    if (await dropdown.isVisible()) {
      await dropdown.click();
    }
    
    await this.waitForLoadingComplete();
  }

  /**
   * Fill vehicle form with data
   * @param data - Vehicle data object
   */
  async fillVehicleForm(data: VehicleData): Promise<void> {
    if (data.licensePlate) {
      await this.fillLicensePlate(data.licensePlate);
    }
    
    if (data.model) {
      await this.fillModel(data.model);
    }
    
    if (data.driver) {
      await this.fillDriver(data.driver);
    }
  }

  /**
   * Save vehicle form
   */
  async saveVehicle(): Promise<void> {
    await this.clickSave();
  }

  /**
   * Get list of license plates from the list view
   */
  async getLicensePlatesFromList(): Promise<string[]> {
    await this.waitForLoadingComplete();
    
    const licensePlates: string[] = [];
    const cells = this.page.locator(this.vehicleSelectors.licensePlateColumn);
    const count = await cells.count();
    
    for (let i = 0; i < count; i++) {
      const text = await cells.nth(i).textContent();
      if (text) {
        licensePlates.push(text.trim());
      }
    }
    
    return licensePlates;
  }

  /**
   * Search for vehicle by license plate
   * @param licensePlate - License plate to search
   */
  async searchByLicensePlate(licensePlate: string): Promise<void> {
    await this.search(licensePlate);
  }

  /**
   * Get vehicle count in list
   */
  async getVehicleCount(): Promise<number> {
    return await this.getListRowCount();
  }

  /**
   * Click on vehicle row by license plate
   * @param licensePlate - License plate of vehicle to click
   */
  async clickVehicleByLicensePlate(licensePlate: string): Promise<void> {
    await this.waitForLoadingComplete();
    
    const row = this.page.locator('.o_data_row').filter({
      has: this.page.locator(`td:has-text("${licensePlate}")`)
    }).first();
    
    await row.click();
    await this.waitForLoadingComplete();
  }

  /**
   * Alias for clickVehicleByLicensePlate
   * @param licensePlate - License plate of vehicle to click
   */
  async clickVehicleByPlate(licensePlate: string): Promise<void> {
    await this.clickVehicleByLicensePlate(licensePlate);
  }

  /**
   * Search for vehicle by license plate
   * @param licensePlate - License plate to search
   */
  async searchVehicle(licensePlate: string): Promise<void> {
    await this.search(licensePlate);
  }

  /**
   * Get vehicle row locator by license plate
   * @param licensePlate - License plate to find
   */
  getVehicleByPlate(licensePlate: string) {
    return this.page.locator('.o_data_row').filter({
      has: this.page.locator(`td:has-text("${licensePlate}")`)
    }).first();
  }

  /**
   * Check if vehicle exists in list by license plate
   * @param licensePlate - License plate to check
   */
  async vehicleExistsInList(licensePlate: string): Promise<boolean> {
    await this.waitForLoadingComplete();
    
    const licensePlates = await this.getLicensePlatesFromList();
    return licensePlates.includes(licensePlate);
  }

  /**
   * Delete current vehicle (from form view)
   */
  async deleteVehicle(): Promise<void> {
    await this.waitForLoadingComplete();
    
    // Click Action menu
    const actionBtn = this.page.getByRole('button', { name: /action/i });
    await actionBtn.click();
    
    // Click Delete
    const deleteOption = this.page.getByRole('menuitem', { name: /delete/i });
    await deleteOption.click();
    
    // Confirm deletion in modal
    const confirmBtn = this.page.getByRole('button', { name: /ok|confirm|yes/i });
    await confirmBtn.click();
    
    await this.waitForLoadingComplete();
  }
}

export default VehiclesListPage;
