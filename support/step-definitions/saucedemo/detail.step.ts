import { When, Then } from "@wdio/cucumber-framework";
import detailPage from "../../pages/saucedemo/detail.page.js";
import { stateStore } from "../../helper/locales.js";

Then("I should see the title product on detail sauce demo app", async () => {
  if (stateStore["productName"]) {
    await detailPage.validateDetailPage(stateStore["productName"]);
  } else {
    throw new Error("We can't detect the product name for title");
  }
});
