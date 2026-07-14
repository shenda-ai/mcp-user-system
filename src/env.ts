/**
 * Environment variable loader for mcp-user-system.
 */

export interface Config {
  baseUrl: string;
  apiKey: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function loadConfig(): Config {
  return {
    baseUrl: requireEnv("TUS_BASE_URL"),
    apiKey: requireEnv("TUS_API_KEY"),
  };
}
