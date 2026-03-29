import { Given, Then } from "@wdio/cucumber-framework";
import { getEnv } from "../../helper/env.js";
import { DatabaseQueries } from "../../pages/saucedemo/database.queries.js";
import { stateStore } from "../../helper/locales.js";

// Get current environment for dynamic database configuration
const getEnvironment = (): string => {
  return getEnv("ENVIRONMENT", "staging");
};

/**
 * Database step definitions for querying users
 * These steps support dynamic environment selection based on ENV variable
 */

// Get user by email from database and store in stateStore
Given(
  "I query user by email {string} from the database",
  async (email: string) => {
    const env = getEnvironment();
    const dbQueries = new DatabaseQueries(env, "saucedemo");
    const user = await dbQueries.getUserByEmail(email);

    // Store user data in stateStore for use in other steps
    stateStore["dbUser"] = user;
    stateStore["userEmail"] = email;

    console.log(`[Database] Querying user by email: ${email} from env: ${env}`);
    console.log(`[Database] User found:`, user ? "Yes" : "No");
  },
);

// Validate user exists in database
Then(
  "user with email {string} should exist in the database",
  async (email: string) => {
    const env = getEnvironment();
    const dbQueries = new DatabaseQueries(env, "saucedemo");
    const user = await dbQueries.getUserByEmail(email);

    if (!user) {
      throw new Error(
        `User with email '${email}' not found in ${env} database`,
      );
    }

    console.log(`[Database] Verified user exists: ${email}`);
  },
);

// Validate user does not exist in database
Then(
  "user with email {string} should not exist in the database",
  async (email: string) => {
    const env = getEnvironment();
    const dbQueries = new DatabaseQueries(env, "saucedemo");
    const user = await dbQueries.getUserByEmail(email);

    if (user) {
      throw new Error(
        `User with email '${email}' unexpectedly found in ${env} database`,
      );
    }

    console.log(`[Database] Verified user does not exist: ${email}`);
  },
);

// Validate stored user has specific field value
Then(
  "user from database should have {string} field with value {string}",
  async (field: string, value: string) => {
    const user = stateStore["dbUser"];

    if (!user) {
      throw new Error(
        "No user data found in stateStore. Did you query a user first?",
      );
    }

    const fieldValue = user[field];

    if (fieldValue !== value) {
      throw new Error(
        `Expected ${field} to be '${value}' but got '${fieldValue}'`,
      );
    }

    console.log(`[Database] Verified ${field} = ${value}`);
  },
);

// Test database connection
Given("I test database connection", async () => {
  const env = getEnvironment();
  const dbQueries = new DatabaseQueries(env, "saucedemo");
  const isConnected = await dbQueries.testAllConnections();

  if (!isConnected) {
    throw new Error(`Failed to connect to ${env} database`);
  }

  console.log(`[Database] Connection successful to env: ${env}`);
});
