# Appium WebDriverIO Test Automation Boilerplate

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![WebdriverIO](https://img.shields.io/badge/WebdriverIO-9.27-red)](https://webdriver.io)
[![Appium](https://img.shields.io/badge/Appium-2.0-blue)](https://appium.io)
[![BDD](https://img.shields.io/badge/BDD-Gherkin-orange)](https://cucumber.io/docs/gherkin/)

A standardized Appium WebDriverIO test automation framework for mobile application testing using TypeScript and BDD (Cucumber) on Android and iOS platforms.

---

## Recommended VSCode Extensions

Install these extensions for better productivity:

| Extension                          | Purpose                                      | Install                                                                                      |
| ---------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `alexkrechik.cucumberautocomplete` | Gherkin syntax highlighting and autocomplete | [Link](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete) |
| `webdriverio.webdriverio`          | WebdriverIO official extension               | [Link](https://marketplace.visualstudio.com/items?itemName=webdriverio.webdriverio)          |

---

## Prerequisites

### System Requirements

- Node.js (v18 or higher)
- npm or yarn
- Java (for Appium)

### Android Setup

- Android Studio with SDK
- Android Emulator
- Appium UiAutomator2 Driver

### iOS Setup

- Xcode
- iOS Simulator
- Appium XCUITest Driver
- macOS only

### Installation

```bash
# Install npm dependencies
npm install

# Install Appium globally
npm install -g appium

# Install drivers
appium driver install uiautomator2  # Android
appium driver install xcuitest      # iOS
```

---

## Appium Server Configuration

- **Host:** `0.0.0.0`
- **Port:** `4723`

---

## Appium Inspector Configuration

```bash
# Devices check for Android
adb devices

# Devices check for iOS Simulator
xcrun simctl list devices

# Driver list for checking compatibility
appium driver list
```

### Android Capabilities

```json
{
  "appium:deviceName": "emulator-5554",
  "appium:platformVersion": "14",
  "platformName": "Android",
  "appium:automationName": "UiAutomator2"
}
```

### iOS Capabilities

```json
{
  "appium:deviceName": "iPhone 15",
  "appium:platformVersion": "17.0",
  "platformName": "iOS",
  "appium:automationName": "XCUITest"
}
```

---

## Quick Start

```bash
# Run Android tests
npm run test:android

# Run iOS tests
npm run test:ios

# Run with default config
npm run wdio

# Generate Allure report
npm run allure-generate

# Open Allure report
npm run allure-open

# Export to single HTML file
npm run allure-export

# Clean up Allure directories
npm run allure-delete
```

---

## Environment Configuration

Available environments:

- `staging` - For iOS testing
- `production` - For Android testing

```bash
# Android (uses production env)
ENV=production PLATFORM=Android npm run wdio

# iOS (uses staging env)
ENV=staging PLATFORM=iOS npm run wdio
```

---

## @pre-install Tag Behavior

The `@pre-install` tag controls how the app is installed between scenarios in a feature file:

### With `@pre-install` tag

- **First scenario:** Full app reinstall to ensure clean state
- **Subsequent scenarios:** Just terminate and activate the app (preserves login/session state)

### Without `@pre-install` tag

- Always reinstall the app for each scenario (fresh state every time)

### Example

```gherkin
@pre-install
Feature: User Login Flow

  Scenario: User logs in with valid credentials
    Given I navigate to the login page
    When I log in with valid credentials
    Then I am redirected to the home page

  Scenario: User views profile
    Given I am logged in
    When I tap on profile
    Then profile page is displayed
```

In the example above, the app is reinstalled only before the first scenario, and session state is preserved for the second scenario.

---

## Documentation References

- [WebdriverIO Documentation](https://webdriver.io)
- [Appium Documentation](https://appium.io)
- [Cucumber Gherkin Syntax](https://cucumber.io/docs/gherkin)
- [Allure Report](https://allurereport.org)

---

## License

ISC
