import { fileURLToPath } from "url";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// Polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppConfig {
  APP: string;
  APP_PACKAGE: string;
}

export interface PlatformConfig {
  [appName: string]: AppConfig;
}

export interface EnvConfig {
  ENVIRONMENT: string;
  BASE_URL: string;
  APPIUM_PORT: number;
  MAX_INSTANCES: number;
  APP_CONFIG: {
    ANDROID: PlatformConfig;
    IOS: PlatformConfig;
  };
  [key: string]:
    | string
    | number
    | { ANDROID: PlatformConfig; IOS: PlatformConfig };
}

// Get env file name based on ENV variable (same logic as wdio.conf.ts)
const getEnvFileName = (): string => {
  const env = process.env.ENV;
  if (env) {
    return `.env.${env}.yaml`;
  }
  return ".env.yaml";
};

// Load config from YAML file
const config = (() => {
  const envFile = getEnvFileName();
  const configPath = path.resolve(__dirname, "../environment", envFile);

  console.log(`[env.ts] Loading config from: ${envFile}`);

  const content = fs.readFileSync(configPath, "utf-8");
  return yaml.load(content) as EnvConfig;
})();

// Get environment variable with optional default value
export const getEnv = (key: string, defaultValue?: string): string => {
  const value = config[key as keyof EnvConfig];
  if (typeof value === "string") {
    return value;
  }
  return defaultValue || "";
};

// Get app configuration for platform and app name (returns full config object)
export const getAppConfig = (platform: string, appName: string): AppConfig => {
  const platformKey = platform.toUpperCase() as "ANDROID" | "IOS";
  const appConfig = config.APP_CONFIG[platformKey]?.[appName];
  if (!appConfig) {
    throw new Error(`[env.ts] App config not found: ${platformKey}.${appName}`);
  }
  return appConfig;
};
