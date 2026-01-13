@smoke
Feature: Fleet Management Smoke Test
  As a Fleet Manager
  I want to manage vehicles
  So that I can track the company fleet

  Background:
    Given Odoo is accessible at "http://localhost:8069"
     And I login with username "admin" and password "admin"

  @critical @smoke-001
  Scenario: Access Vehicles page
    When I navigate to "Vehicles" page
    Then I should see "Vehicles" text

  @critical @smoke-002
  Scenario: Open vehicle creation form
    When I navigate to "Vehicles" page
    And I click "New" button
    Then I should see "License Plate" text

  @critical @smoke-003
  Scenario: Fill vehicle license plate field
    When I navigate to "Vehicles" page
    And I click "New" button
    And I fill "License Plate" with "MD-TEST-001"
    Then "License Plate" field should contain "MD-TEST-001"

  @smoke-004
  Scenario: Discard vehicle creation
    When I navigate to "Vehicles" page
    And I click "New" button
    And I click "Discard" button
    Then I should see "New Request" text
