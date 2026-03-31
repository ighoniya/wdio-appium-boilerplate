import { driver, expect } from "@wdio/globals";
import {
  PlatformBase,
  getPageTranslations,
  stateStore,
} from "../../helper/locales.js";

/**
 * Page object for the Sauce Demo App dashboard
 */
export class DashboardPage extends PlatformBase {
  private texts = getPageTranslations("saucedemo", "dashboard_page");

  private selectors = {
    title: {
      android: "id=com.saucelabs.mydemoapp.android:id/productTV",
      ios: '//XCUIElementTypeStaticText[@name="title"]',
    },
    titleV2: {
      android: `//*[contains(@text,"${this.texts.title}")]`,
      ios: `name == "${this.texts.title}"`,
    },
    cardProduct: (name: string) => ({
      android: `//android.widget.TextView[@content-desc="Product Title" and @text="${name}"]/preceding-sibling::*[@content-desc="Product Image"]`,
      ios: `//XCUIElementTypeStaticText[@name="Product Name" and @label="${name}"]/preceding-sibling::XCUIElementTypeImage[@label="Product Image"]`,
    }),
  };

  /**
   * Validate that the dashboard page is displayed correctly
   */
  public async validateDashboardPage(): Promise<void> {
    const titleElement = this.getSelector(this.selectors.title);
    await expect(titleElement).toBeDisplayed();
    if (driver.isAndroid){
      await expect(titleElement).toHaveText(this.texts.title);
    }
  }

  public async doClickCardProductName(name: string): Promise<void> {
    stateStore["productName"] = name;
    await this.getSelector(this.selectors.cardProduct(name)).click();
  }
}

export default new DashboardPage();
