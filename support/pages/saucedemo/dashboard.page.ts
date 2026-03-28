import { expect, $ } from "@wdio/globals";
import { BasePage } from "../base.page.js";
import { getPageTranslations } from "../../helper/locales.js";

/**
 * Page object for the Sauce Demo App dashboard
 */
export class DashboardPage extends BasePage {
  private texts = getPageTranslations("saucedemo", "dashboard_page");

  private selectors = {
    title: {
      android: "id=com.saucelabs.mydemoapp.android:id/productTV",
      ios: '-ios predicate string:name == "Products"',
    },
    titleV2: {
      android: `//*[contains(@text,"${this.texts.title}")]`,
      ios: `-ios predicate string:name == "${this.texts.title}"`,
    },
  };

  /**
   * Validate that the dashboard page is displayed correctly
   */
  public async validateDashboardPage(): Promise<void> {
    const titleElement = $(this.getSelector(this.selectors.title));
    await expect(titleElement).toBeDisplayed();
    await expect(titleElement).toHaveText(this.texts.title);
  }
}

export default new DashboardPage();
