#!/usr/bin/env node
/**
 * One-click installer for mcp-user-system
 * Supports: Claude Desktop, Cursor, VS Code (Cline), and generic JSON output
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

// ── Config paths for different tools ──
function getConfigPaths() {
  const home = os.homedir();
  return {
    claude: {
      darwin: path.join(home, "Library/Application Support/Claude/claude_desktop_config.json"),
      win32: path.join(home, "AppData/Roaming/Claude/claude_desktop_config.json"),
      linux: path.join(home, ".config/claude/claude_desktop_config.json"),
    },
    cursor: {
      darwin: path.join(home, "Library/Application Support/Cursor/mcp.json"),
      win32: path.join(home, "AppData/Roaming/Cursor/mcp.json"),
      linux: path.join(home, ".config/Cursor/mcp.json"),
    },
    vscode: {
      darwin: path.join(home, "Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"),
      win32: path.join(home, "AppData/Roaming/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"),
      linux: path.join(home, ".config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json"),
    },
  };
}

function getGlobalPackagePath() {
  const home = os.homedir();
  if (os.platform() === "win32") {
    return path.join(home, "AppData/Roaming/npm/node_modules/mcp-user-system/dist/index.js");
  }
  return path.join(home, ".npm-global/lib/node_modules/mcp-user-system/dist/index.js");
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

  // Select target tool
  console.log("Select your AI tool:");
  console.log("  1. Claude Desktop (default)");
  console.log("  2. Cursor");
  console.log("  3. VS Code (Cline extension)");
  console.log("  4. Output JSON only (copy manually)\n");

  const toolChoice = await question("Choice [1-4, default 1]: ");
  const toolMap = { "1": "claude", "2": "cursor", "3": "vscode", "4": "json" };
  const tool = toolMap[toolChoice.trim() || "1"] || "claude";

  const baseUrl = await question("Backend URL (e.g. https://api.example.com): ");
  const token = await question("Access Token (JWT): ");

  if (!baseUrl || !token) {
    console.error("Error: Both URL and token are required.");
    process.exit(1);
  }

  const packagePath = getGlobalPackagePath();
  const serverConfig = {
    command: "node",
    args: [packagePath],
    env: {
      TUS_BASE_URL: baseUrl.trim(),
      TUS_ACCESS_TOKEN: token.trim(),
    },
  };

  if (tool === "json") {
    // Just output JSON
    const output = { mcpServers: { "user-system": serverConfig } };
    console.log("\n--- Copy this to your MCP config ---");
    console.log(JSON.stringify(output, null, 2));
    rl.close();
    return;
  }

  // Write to tool-specific config file
  const platform = os.platform();
  const configPaths = getConfigPaths();
  const configPath = configPaths[tool]?.[platform] || configPaths[tool]?.linux;

  if (!configPath) {
    console.error(`Unsupported platform: ${platform}`);
    process.exit(1);
  }

  const config = readConfig(configPath);

  if (tool === "vscode") {
    // VS Code Cline uses "mcpServers" at top level
    if (!config.mcpServers) {
      config.mcpServers = {};
    }
    config.mcpServers["user-system"] = serverConfig;
  } else {
    // Claude Desktop & Cursor
    if (!config.mcpServers) {
      config.mcpServers = {};
    }
    config.mcpServers["user-system"] = serverConfig;
  }

  writeConfig(configPath, config);

  console.log(`\nConfiguration written to: ${configPath}`);
  console.log("Restart your AI tool to apply changes.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
