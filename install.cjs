#!/usr/bin/env node
/**
 * One-click installer for mcp-user-system
 * Detects OS and writes configuration to the correct MCP config file.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const os = require("os");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

function getConfigPath() {
  const platform = os.platform();
  switch (platform) {
    case "darwin":
      return path.join(
        os.homedir(),
        "Library/Application Support/Claude/claude_desktop_config.json"
      );
    case "win32":
      return path.join(os.homedir(), "AppData/Roaming/Claude/claude_desktop_config.json");
    default:
      return path.join(os.homedir(), ".config/claude/claude_desktop_config.json");
  }
}

function readConfig(configPath) {
  try {
    const content = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function writeConfig(configPath, config) {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + "\n");
}

async function main() {
  console.log("=== mcp-user-system Installer ===\n");

  const baseUrl = await question("Backend URL (e.g. https://api.example.com): ");
  const token = await question("Access Token (JWT): ");

  if (!baseUrl || !token) {
    console.error("Error: Both URL and token are required.");
    process.exit(1);
  }

  const configPath = getConfigPath();
  const config = readConfig(configPath);

  if (!config.mcpServers) {
    config.mcpServers = {};
  }

  config.mcpServers["user-system"] = {
    command: "npx",
    args: ["mcp-user-system"],
    env: {
      TUS_BASE_URL: baseUrl.trim(),
      TUS_ACCESS_TOKEN: token.trim(),
    },
  };

  writeConfig(configPath, config);

  console.log(`\nConfiguration written to: ${configPath}`);
  console.log("Restart Claude Desktop to apply changes.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
