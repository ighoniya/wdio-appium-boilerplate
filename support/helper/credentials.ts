import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { getEnv } from "./env.js";

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the environment (staging or production) from ENVIRONMENT variable
const getEnvironment = (): string => {
  return getEnv("ENVIRONMENT") || "staging";
};

// Load credentials from the appropriate environment folder
export const getCredentials = (
  project: string,
  credentialType: string = "account",
): any => {
  const environment = getEnvironment();
  const credentialsPath = path.resolve(
    __dirname,
    `../../fixtures/credentials/${environment}/${credentialType}.json`,
  );

  try {
    const data = fs.readFileSync(credentialsPath, "utf-8");
    const credentials = JSON.parse(data);
    return credentials[project] || {};
  } catch (error) {
    console.warn(
      `Warning: Could not load credentials from ${credentialsPath}`,
      error,
    );
    return {};
  }
};

// Get specific user credentials by key
export const getUserCredentials = (
  project: string,
  userKey: string,
  credentialType: string = "account",
): { username: string; password: string } => {
  const credentials = getCredentials(project, credentialType);
  return credentials[userKey] || {};
};
