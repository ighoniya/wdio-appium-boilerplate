/**
 * Cucumber Hooks
 *
 * This module contains all Cucumber hook implementations for managing app lifecycle.
 */

import { stateStore } from "./locales";

// Track scenario count within feature
let scenarioCount = 0;

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
  const appId = "com.saucelabs.mydemoapp.rn";
  const hasPreInstallTag = stateStore["pre-install"];
  const isFirstScenario = scenarioCount === 0;

  scenarioCount++;

  if (hasPreInstallTag) {
    if (isFirstScenario) {
      // 1st scenario: reinstall app to clear data completely
      console.log("@pre-install tag - 1st scenario: reinstalling app...");
      await (driver as any).removeApp(appId);
      await (driver as any).installApp(appId);
      await (driver as any).activateApp(appId);
    } else {
      // Subsequent scenarios: just restart, preserve login state
      console.log("@pre-install tag - subsequent scenario: restarting app...");
      await (driver as any).terminateApp(appId);
      await (driver as any).activateApp(appId);
    }
  } else {
    // No @pre-install: reinstall every time
    console.log("No @pre-install tag: reinstalling app...");
    await (driver as any).removeApp(appId);
    await (driver as any).installApp(appId);
    await (driver as any).activateApp(appId);
  }
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
  // Clear stateStore for this feature
  stateStore["pre-install"] = undefined;
  scenarioCount = 0;
  console.log("Feature completed - cleaned up @pre-install state");
};
