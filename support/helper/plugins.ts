import { driver } from "@wdio/globals";

export function convertProductName(name: string): string {
  if (driver.isIOS) {
    // Remove space + Convert "(color)" to " - Color" (e.g., "Sauce Labs Backpack (orange)" → "Sauce Labs Backpack - Orange")
    return name.replace(/\s\((\w+)\)/, (_, color) => ` - ${color.charAt(0).toUpperCase() + color.slice(1)}`);
  }
  return name;
}