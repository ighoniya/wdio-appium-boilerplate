import { expect } from "@wdio/globals";
import { PlatformBase, getPageTranslations } from "../../helper/locales.js";

export class DetailPage extends PlatformBase {
  //   private texts = getPageTranslations("saucedemo", "detail_page");

  private selectors = {
    title: (name: string) => ({
      android: `//android.widget.TextView[@resource-id="com.saucelabs.mydemoapp.android:id/productTV" and @text="${name}"]`,
      ios: `-ios predicate string:name == "${name}"`,
    }),
  };

  public async validateDetailPage(name: string): Promise<void> {
    const titleElement = this.getSelector(this.selectors.title(name));
    await expect(titleElement).toBeDisplayed();
  }
}

export default new DetailPage();
