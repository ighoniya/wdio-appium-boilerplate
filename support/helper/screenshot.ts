import { fileURLToPath } from "url";
import * as fs from "fs";
import * as path from "path";
import { driver } from "@wdio/globals";

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFormattedDateTime = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

const getPlatform = (): string => {
  return driver.isAndroid ? "android" : "ios";
};

export async function screenshotOnFail(result: any): Promise<void> {
  try {
    if (result.passed === false) {
      const screenshotDir = path.join(__dirname, "../../allure-screenshot");
      const formattedDateTime = getFormattedDateTime();
      const platform = getPlatform();

      try {
        if (!fs.existsSync(screenshotDir)) {
          fs.mkdirSync(screenshotDir, { recursive: true });
        }
      } catch (dirError: any) {
        console.error(
          `Failed to create screenshot directory: ${screenshotDir}`,
          dirError.message,
        );
        return;
      }

      let screenshot: string;
      try {
        screenshot = await driver.takeScreenshot();
      } catch (screenshotError: any) {
        console.error(
          "Failed to capture screenshot from driver:",
          screenshotError.message,
        );
        return;
      }

      // Also save to disk
      const filePath: string = `screenshot-${platform}-${formattedDateTime}.png`;
      try {
        const screenshotPath = path.join(screenshotDir, filePath);
        fs.writeFileSync(screenshotPath, screenshot, "base64");
        console.log(`Screenshot saved successfully: ${screenshotPath}`);
      } catch (fileError: any) {
        console.error(
          `Failed to write screenshot file to ${filePath}:`,
          fileError.message,
        );
      }
    }
  } catch (error: any) {
    console.error("Unexpected error in screenshotOnFail:", error.message);
  }
}
