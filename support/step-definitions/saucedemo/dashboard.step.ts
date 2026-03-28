import { Given, Then } from '@wdio/cucumber-framework';
import dashboardPage from '../../pages/saucedemo/dashboard.page.js';

Given('I launched the sauce demo app', async () => {
  // Wait for app to fully load
  await new Promise((resolve) => setTimeout(resolve, 2000));
});

Then('I should see the dashboard title', async () => {
  await dashboardPage.validateDashboardPage();
});
