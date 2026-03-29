import { Browser } from "webdriverio";

declare global {
  const driver: Browser;
  const browser: Browser;
}

export {};
