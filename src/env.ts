/**
 * Environment variable loader for mcp-user-system.
 */

export interface Config {
  baseUrl: string;
  accessToken: string;
}

export function loadConfig(): Config {
  const baseUrl = process.env["TUS_BASE_URL"] || "https://models.ipsunion.com/prod-api";
  const accessToken = process.env["TUS_ACCESS_TOKEN"];

  if (!accessToken) {
    throw new Error("Missing required environment variable: TUS_ACCESS_TOKEN");
  }

  return {
    baseUrl,
    accessToken,
  };
}
