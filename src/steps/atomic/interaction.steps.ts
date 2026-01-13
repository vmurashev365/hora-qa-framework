/**
 * Interaction Step Definitions
 * Atomic steps for UI interactions (clicks, fills, selects, etc.)
 * DIRECT selectors - no ui-map yet (Phase 3)
 */

import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/custom-world';

/**
 * When I click {string} button
 * Clicks a button by its accessible name
 */
When('I click {string} button', { timeout: 15000 }, async function (this: CustomWorld, buttonName: string) {
  // Odoo button name aliases (Odoo 17 naming conventions)
  const buttonAliases: Record<string, string> = {
    'Create': 'New',
    'create': 'New',
    'Discard': 'Discard changes',
    'discard': 'Discard changes',
  };
  
  const actualButtonName = buttonAliases[buttonName] || buttonName;
  
  // Click button by role
  await this.page.getByRole('button', { name: actualButtonName }).click();
  
  // Wait for form/view to load
  await this.page.locator('.o_form_view, .o_list_view, .o_kanban_view').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
});

/**
 * When I fill {string} with {string}
 * Fills an input field identified by label
 */
When('I fill {string} with {string}', { timeout: 15000 }, async function (this: CustomWorld, label: string, value: string) {
  // Odoo field label aliases (Odoo adds ? to some labels)
  const labelAliases: Record<string, string> = {
    'License Plate': 'License Plate?',
  };
  
  const actualLabel = labelAliases[label] || label;
  
  // Try textbox role first (most reliable for Odoo)
  let field = this.page.getByRole('textbox', { name: actualLabel });
  
  // Fallback to getByLabel
  if (!(await field.isVisible().catch(() => false))) {
    field = this.page.getByLabel(actualLabel);
  }
  
  await field.fill(value);
  
  // Store the filled value for later assertions
  this.setTestData(`field_${label}`, value);
});

/**
 * When I clear {string} field
 * Clears an input field identified by label
 */
When('I clear {string} field', async function (this: CustomWorld, label: string) {
  const field = this.page.getByLabel(new RegExp(label, 'i'));
  await field.clear();
});

/**
 * When I type {string} in {string}
 * Types text character by character (useful for autocomplete fields)
 */
When('I type {string} in {string}', async function (this: CustomWorld, text: string, label: string) {
  const field = this.page.getByLabel(new RegExp(label, 'i'));
  await field.pressSequentially(text, { delay: 50 });
});

/**
 * When I press {string} key
 * Presses a keyboard key
 */
When('I press {string} key', async function (this: CustomWorld, key: string) {
  await this.page.keyboard.press(key);
});

/**
 * When I press {string} in {string} field
 * Presses a key while focused on a specific field
 */
When('I press {string} in {string} field', async function (this: CustomWorld, key: string, label: string) {
  const field = this.page.getByLabel(new RegExp(label, 'i'));
  await field.press(key);
});

/**
 * When I select {string} from {string} dropdown
 * Selects an option from a dropdown by label
 */
When('I select {string} from {string} dropdown', async function (this: CustomWorld, option: string, label: string) {
  const dropdown = this.page.getByLabel(new RegExp(label, 'i'));
  await dropdown.selectOption({ label: option });
});

/**
 * When I select {string} option
 * Selects an option from a visible dropdown/combobox
 */
When('I select {string} option', async function (this: CustomWorld, option: string) {
  // Try clicking option in dropdown
  const optionElement = this.page.getByRole('option', { name: option });
  
  if (await optionElement.isVisible({ timeout: 2000 }).catch(() => false)) {
    await optionElement.click();
  } else {
    // Try listitem or generic text
    const listItem = this.page.getByRole('listitem').filter({ hasText: option });
    if (await listItem.isVisible({ timeout: 2000 }).catch(() => false)) {
      await listItem.click();
    } else {
      // Odoo-specific dropdown option
      await this.page.locator(`.o_m2o_dropdown_option:has-text("${option}")`).first().click();
    }
  }
  
  await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
});

/**
 * When I check {string} checkbox
 * Checks a checkbox by label
 */
When('I check {string} checkbox', async function (this: CustomWorld, label: string) {
  const checkbox = this.page.getByLabel(new RegExp(label, 'i'));
  await checkbox.check();
});

/**
 * When I uncheck {string} checkbox
 * Unchecks a checkbox by label
 */
When('I uncheck {string} checkbox', async function (this: CustomWorld, label: string) {
  const checkbox = this.page.getByLabel(new RegExp(label, 'i'));
  await checkbox.uncheck();
});

/**
 * When I toggle {string} checkbox
 * Toggles a checkbox by label
 */
When('I toggle {string} checkbox', async function (this: CustomWorld, label: string) {
  const checkbox = this.page.getByLabel(new RegExp(label, 'i'));
  const isChecked = await checkbox.isChecked();
  if (isChecked) {
    await checkbox.uncheck();
  } else {
    await checkbox.check();
  }
});

/**
 * When I click {string} radio button
 * Clicks a radio button by label
 */
When('I click {string} radio button', async function (this: CustomWorld, label: string) {
  const radio = this.page.getByRole('radio', { name: new RegExp(label, 'i') });
  await radio.click();
});

/**
 * When I hover over {string}
 * Hovers over an element by text
 */
When('I hover over {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.getByText(text).first();
  await element.hover();
});

/**
 * When I hover over {string} button
 * Hovers over a button by name
 */
When('I hover over {string} button', async function (this: CustomWorld, buttonName: string) {
  const button = this.page.getByRole('button', { name: new RegExp(buttonName, 'i') });
  await button.hover();
});

/**
 * When I double click {string}
 * Double clicks an element by text
 */
When('I double click {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.getByText(text).first();
  await element.dblclick();
});

/**
 * When I right click {string}
 * Right clicks an element by text
 */
When('I right click {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.getByText(text).first();
  await element.click({ button: 'right' });
});

/**
 * When I focus on {string} field
 * Focuses on an input field
 */
When('I focus on {string} field', async function (this: CustomWorld, label: string) {
  const field = this.page.getByLabel(new RegExp(label, 'i'));
  await field.focus();
});

/**
 * When I click text {string}
 * Clicks on any element containing specific text
 */
When('I click text {string}', async function (this: CustomWorld, text: string) {
  await this.page.getByText(text).first().click();
  await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
});

/**
 * When I click {string} tab
 * Clicks a tab by its name
 */
When('I click {string} tab', async function (this: CustomWorld, tabName: string) {
  const tab = this.page.getByRole('tab', { name: new RegExp(tabName, 'i') });
  await tab.click();
  await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
});

/**
 * When I scroll to {string}
 * Scrolls to an element by text
 */
When('I scroll to {string}', async function (this: CustomWorld, text: string) {
  const element = this.page.getByText(text).first();
  await element.scrollIntoViewIfNeeded();
});

/**
 * When I scroll down
 * Scrolls the page down
 */
When('I scroll down', async function (this: CustomWorld) {
  await this.page.mouse.wheel(0, 500);
});

/**
 * When I scroll up
 * Scrolls the page up
 */
When('I scroll up', async function (this: CustomWorld) {
  await this.page.mouse.wheel(0, -500);
});

/**
 * When I attach file {string} to {string} field
 * Attaches a file to a file input
 */
When('I attach file {string} to {string} field', async function (this: CustomWorld, filePath: string, label: string) {
  const fileInput = this.page.getByLabel(new RegExp(label, 'i'));
  await fileInput.setInputFiles(filePath);
});

/**
 * When I accept the dialog
 * Accepts (clicks OK) on a browser dialog
 */
When('I accept the dialog', async function (this: CustomWorld) {
  this.page.once('dialog', dialog => dialog.accept());
});

/**
 * When I dismiss the dialog
 * Dismisses (clicks Cancel) on a browser dialog
 */
When('I dismiss the dialog', async function (this: CustomWorld) {
  this.page.once('dialog', dialog => dialog.dismiss());
});
