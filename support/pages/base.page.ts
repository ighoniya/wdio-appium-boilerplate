import { browser } from "@wdio/globals";

export type Platform = "Android" | "iOS";

/**
 * Base page class providing platform detection and cross-platform selector support
 * Uses WebdriverIO's built-in SessionFlags (isAndroid, isIOS)
 */
export class BasePage {
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
