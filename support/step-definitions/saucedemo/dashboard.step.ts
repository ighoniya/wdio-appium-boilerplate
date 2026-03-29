import { Given, When, Then } from "@wdio/cucumber-framework";
import dashboardPage from "../../pages/saucedemo/dashboard.page.js";
import {
  getUserCredentials,
  getCredentials,
} from "../../helper/credentials.js";
import { getEnv } from "../../helper/env.js";

Given("I launched the sauce demo app", async () => {
  // Verify environment config
  console.log("=== Environment Config ===");
  console.log("ENV:", getEnv("ENV"));
  console.log("ENVIRONMENT:", getEnv("ENVIRONMENT"));
  console.log("BASE_URL:", getEnv("BASE_URL"));

  // Verify credentials loading
  const credentials = getUserCredentials("saucedemo", "main", "account");
  console.log("=== Credentials (saucedemo/main) ===");
  console.log("Username:", credentials.username);
  console.log("Password:", credentials.password);
  console.log("===============================");

  // Verify credentials loading
  const credentialsV2 = getCredentials("saucedemo");
  console.log("=== Credentials (saucedemo/main) V2 ===");
  console.log("Username:", credentialsV2["main"].username);
  console.log("Password:", credentialsV2["main"].password);
  console.log("===============================");

  // Wait for app to fully load
  await new Promise((resolve) => setTimeout(resolve, 2000));
});

Then("I should see the dashboard title on sauce demo app", async () => {
  await dashboardPage.validateDashboardPage();
});

When(
  "I click the card product of {string} on dashboard sauce demo app",
  async (name: string) => {
    await dashboardPage.doClickCardProductName(name);
  },
);
