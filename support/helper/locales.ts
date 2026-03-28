import { browser } from "@wdio/globals";
import * as enLang from "../language/en.json";

/**
 * Base page class providing platform detection and cross-platform selector support
 * Uses WebdriverIO's built-in SessionFlags (isAndroid, isIOS)
 */

export type Platform = "Android" | "iOS";

export class PlatformBase {
  // Access SessionFlags properties via type assertion
  protected get platform(): Platform {
    return (browser as any).isIOS ? "iOS" : "Android";
  }

  protected get isAndroid(): boolean {
    return (browser as any).isAndroid;
  }

  protected get isIOS(): boolean {
    return (browser as any).isIOS;
  }

  /**
   * Returns the appropriate selector based on the current platform
   * @param selectors Object containing platform-specific selectors
   */
  protected getSelector(selectors: { android: string; ios: string }): string {
    return this.isAndroid ? selectors.android : selectors.ios;
  }
}

// Get any environment variable with optional default value
export const getEnv = (key: string, defaultValue?: string): string => {
  return process.env[key] || defaultValue || "";
};

// State store - simple object to hold shared data across scenarios/steps
export const stateStore: Record<string, any> = {};

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
