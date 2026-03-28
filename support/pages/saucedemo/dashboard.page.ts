import { expect, $ } from "@wdio/globals";
import { BasePage } from "../base.page.js";

/**
 * Page object for the Sauce Demo App dashboard
 */
export class DashboardPage extends BasePage {
  private selectors = {
    title: {
      android: "id=com.saucelabs.mydemoapp.android:id/productTV",
      ios: '-ios predicate string:name == "Products"',
    },
  };

  /**
   * Validate that the dashboard page is displayed correctly
   */
  public async validateDashboardPage(): Promise<void> {
    const titleElement = $(this.getSelector(this.selectors.title));
    await expect(titleElement).toBeDisplayed();
    await expect(titleElement).toHaveText("Products");
  }
}

export default new DashboardPage();
