Feature: Database Query Integration
  As a QA engineer
  I want to query and validate data in the database
  So I can verify data integrity across systems

  Background:
    Given I test database connection

  Scenario: Query existing user by email
    When I query user by email "test@example.com" from the database
    Then user with email "test@example.com" should exist in the database

  Scenario: Validate user field values
    When I query user by email "test@example.com" from the database
    Then user with email "test@example.com" should exist in the database
    And user from database should have "status" field with value "active"

  Scenario: Handle non-existent user
    When I query user by email "nonexistent@example.com" from the database
    Then user with email "nonexistent@example.com" should not exist in the database

  Scenario: Database connection test
    When I query user by email "test@example.com" from the database
    Then user with email "test@example.com" should exist in the database
