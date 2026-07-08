/**
 * Environment variable loader for mcp-user-system.
 */

export interface Config {
  baseUrl: string;
  accessToken: string;
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
    accessToken: requireEnv("TUS_ACCESS_TOKEN"),
  };
}
