/**
 * Cucumber Hooks
 *
 * This module contains all Cucumber hook implementations for managing app lifecycle.
 */

import { driver } from "@wdio/globals";
import { stateStore, clearStateStore } from "./locales";
import { getAppConfig } from "./env";
import { screenshotOnFail } from "./screenshot";

// Track scenario count within feature
let scenarioCount = 0;

// Get platform from environment variable (default: Android)
export const platform = process.env.PLATFORM || "Android";

// Get app name from environment variable (default: DEFAULT_APP)
export const appName = process.env.APP_NAME || "DEFAULT_APP";

// Get app configuration from YAML (returns full config object)
export const appConfig = getAppConfig(platform, appName);

/**
 * Runs before a Cucumber Feature.
 * Resets scenario counter and checks if feature has @pre-install tag.
 *
 * @param {string} uri      path to feature file
 * @param {any}    feature  Cucumber feature object
 */
export const beforeFeature = async function (
  uri: string,
  feature: any,
): Promise<void> {
  // Reset scenario counter for new feature
  scenarioCount = 0;

  // Check if feature has @pre-install tag
  const hasPreInstallTag = feature.tags?.some(
    (tag: any) => tag.name === "@pre-install",
  );
  stateStore["pre-install"] = hasPreInstallTag;
  console.log(`Feature ${feature.name} - @pre-install: ${hasPreInstallTag}`);
};

/**
 *
 * Runs before a Cucumber Scenario.
 * Handles conditional app installation based on @pre-install tag.
 *
 * - With @pre-install tag:
 *   - 1st scenario: Reinstall app to ensure clean state
 *   - Subsequent scenarios: Just terminate + activate (preserves login/session state)
 * - Without @pre-install tag:
 *   - Always reinstall the app for each scenario (fresh state)
 *
 * @param {any} world - World object containing pickle and gherkinDocument info
 */
export const beforeScenario = async function (world: any): Promise<void> {
  const appName = appConfig.APP;
  const appPackage = appConfig.APP_PACKAGE;
  const hasPreInstallTag = stateStore["pre-install"];
  const isFirstScenario = scenarioCount === 0;

  scenarioCount++;

  if (hasPreInstallTag) {
    if (isFirstScenario) {
      // 1st scenario: reinstall app to clear data completely
      console.log("@pre-install tag - 1st scenario: reinstalling app...");
      await driver.removeApp(appPackage);
      await driver.installApp(appName);
      await driver.activateApp(appPackage);
    } else {
      // Subsequent scenarios: just restart, preserve login state
      console.log("@pre-install tag - subsequent scenario: restarting app...");
      await driver.terminateApp(appPackage);
      await driver.activateApp(appPackage);
    }
  } else {
    // No @pre-install: reinstall every time
    console.log("No @pre-install tag: reinstalling app...");
    await driver.removeApp(appPackage);
    await driver.installApp(appName);
    await driver.activateApp(appPackage);
  }
};

/**
 * Runs after a Cucumber Scenario.
 * Takes screenshot if scenario failed and attaches to Allure.
 *
 * @param {any}    world   world object containing pickle and test step
 * @param {any}    result  results object containing scenario results
 */
export const afterScenario = async function (
  world: any,
  result: any,
): Promise<void> {
  await screenshotOnFail(result);
};

/**
 *
 * Runs after a Cucumber Feature.
 * Clears stateStore for this feature and resets scenario counter.
 *
 * @param {string} uri     path to feature file
 * @param {any}    result  results object containing feature results
 */
export const afterFeature = async function (
  uri: string,
  result: any,
): Promise<void> {
  // Reset scenario counter
  scenarioCount = 0;

  // Clear all stateStore keys
  clearStateStore();

  console.log("Feature completed - cleaned up");
};
