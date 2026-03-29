Feature: Sauce Demo App Detail Product

  Scenario: As User, I can view the detail product orange
    Given I launched the sauce demo app
    Then I should see the dashboard title on sauce demo app
    When I click the card product of "Sauce Labs Backpack (test)" on dashboard sauce demo app
    Then I should see the title product on detail sauce demo app