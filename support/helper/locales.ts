import { driver, $ } from "@wdio/globals";
import * as enLang from "../language/en.json";

/**
 * Base page class providing platform detection and cross-platform selector support
 * Uses WebdriverIO's built-in SessionFlags (isAndroid, isIOS)
 */

export type Platform = "Android" | "iOS";

export class PlatformBase {
  // Access SessionFlags properties via type assertion
  protected get platform(): Platform {
    return driver.isIOS ? "iOS" : "Android";
  }

  protected get isAndroid(): boolean {
    return driver.isAndroid;
  }

  protected get isIOS(): boolean {
    return driver.isIOS;
  }

  /**
   * Returns the appropriate selector based on the current platform
   * Wraps the selector string with $() to return an ElementReference
   * @param selectors Object containing platform-specific selector strings
   * @returns ElementReference for the current platform
   */
  protected getSelector(selectors: {
    android: string;
    ios: string;
  }): ReturnType<typeof $> {
    const selector = this.isAndroid ? selectors.android : selectors.ios;
    return $(selector);
  }
}

// State store - simple object to hold shared data across scenarios/steps
export const stateStore: Record<string, any> = {};

// State store - Clear all stateStore keys
export const clearStateStore = (): void => {
  Object.keys(stateStore).forEach((key) => delete stateStore[key]);
};

// Language constants
export const languages = {
  en: enLang,
};

// Dynamic language getter - always checks current state store
export const getCurrentLanguage = () => {
  return stateStore["language"] || "en";
};

// Dynamic language data getter
export const getLangData = () => {
  return languages[getCurrentLanguage() as keyof typeof languages];
};

// Set language
export const setLanguage = (lang: "en" | "id") => {
  stateStore["language"] = lang;
};

// Get translation text for a specific project, page, and key
export const getText = (project: string, page: string, key: string): string => {
  const langData: any = getLangData();
  return langData?.[project]?.[page]?.[key] || "";
};

// Get all translations for a specific project and page
export const getPageTranslations = (
  project: string,
  page: string,
): Record<string, string> => {
  const langData: any = getLangData();
  return langData?.[project]?.[page] || {};
};
