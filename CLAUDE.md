# WDIO Appium Boilerplate - Standardization Guide

---

## Project Structure

`features/{project}/{feature}.feature` - BDD tests
`support/pages/{project}/{page}.page.ts` - Page objects
`support/helper/*.ts` - Helpers (locales, credentials, hooks)
`support/language/{en,id}.json` - Translations
`support/fixtures/credentials/{env}/{type}.json` - Test data

---

## Language Format

**Pattern:** `{project}.{page_name}.{element}` (page uses underscore)

```json
{ "saucedemo": { "dashboard_page": { "title": "Products" } } }
```

**Usage:** `getText('saucedemo', 'dashboard_page', 'title')`

---

## Page Objects

**File:** `{page}.page.ts` | **Class:** `{PageName}Page` | **Extends:** `PlatformBase`

```typescript
import {
  PlatformBase,
  getPageTranslations,
  stateStore,
} from "../helper/locales.js";

export class DashboardPage extends PlatformBase {
  private texts = getPageTranslations("saucedemo", "dashboard_page");

  private selectors = {
    title: {
      android: "id=com.example:id/title",
      ios: '-ios predicate string:name == "Title"',
    },
    dynamic: (param: string) => ({
      android: `//*[@text="${param}"]`,
      ios: `-ios predicate string:name == "${param}"`,
    }),
  };

  public async validatePage(): Promise<void> {
    await expect(this.getSelector(this.selectors.title)).toBeDisplayed();
  }
}
export default new DashboardPage();
```

**Key methods:**

- `this.getSelector(selectors)` - Get platform-specific selector
- `stateStore[key] = value` - Share data across scenarios
- `this.isAndroid / this.isIOS` - Platform detection

---

## Credentials & Environment

**Structure:** `support/fixtures/credentials/{env}/{type}.json`

```json
{ "saucedemo": { "main": { "username": "...", "password": "***" } } }
```

**Usage:** `getUserCredentials(project, userKey)` → `{ username, password }`

**Env:** Set `ENV=staging|production` to switch credential files

---

## Key Helpers

`getText(project, page_name, key)` - Get localized text
`getPageTranslations(project, page_name)` - Get all page translations
`getUserCredentials(project, userKey)` - Get `{ username, password }`
`getCredentials(project, type)` - Get full credential object
`setLanguage("en"|"id")` - Set language (stored in stateStore)
`stateStore` - Shared data object across scenarios

---

## Commands

`npm run wdio` - Run with default config
