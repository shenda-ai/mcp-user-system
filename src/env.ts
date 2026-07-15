/**
 * Environment variable loader for mcp-user-system.
 */

export interface Config {
  baseUrl: string;
  accessToken?: string;
  username?: string;
  password?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function loadConfig(): Config {
  const accessToken = optionalEnv("TUS_ACCESS_TOKEN");
  const username = optionalEnv("TUS_USERNAME");
  const password = optionalEnv("TUS_PASSWORD");

  if (!accessToken && (!username || !password)) {
    throw new Error(
      "Authentication required: provide TUS_ACCESS_TOKEN, or both TUS_USERNAME and TUS_PASSWORD"
    );
  }

  return {
    baseUrl: requireEnv("TUS_BASE_URL"),
    accessToken,
    username,
    password,
  };
}
