# mcp-user-system

[MCP](https://modelcontextprotocol.io) server for token-user-system — Console 前台全量查询接口 via Model Context Protocol.

Provides AI agents with authenticated access to the Console (前台) query APIs, covering user info, dashboard statistics, wallet, team management, token usage, invoices, and miscellaneous lookups.

Supports: user profiles, dashboard stats & trends, wallet overview, team & member management, token consumption, invoice queries, and more.

## Prerequisites

- Node.js >= 18
- `TUS_BASE_URL` and `TUS_ACCESS_TOKEN` environment variables

## Installation

### 1. Install globally

```bash
npm install -g mcp-user-system
```

Or clone & build manually:

```bash
git clone https://github.com/shenda-ai/mcp-user-system.git
cd mcp-user-system
npm install
npm run build
```

### 2. Configure Environment

```bash
export TUS_BASE_URL=https://api.example.com
export TUS_ACCESS_TOKEN=your-jwt-access-token
```

Or create a `.env` file (add to `.gitignore`):

```bash
TUS_BASE_URL=https://api.example.com
TUS_ACCESS_TOKEN=your-jwt-access-token
```

> **Access Token** is a JWT Bearer Token obtained after user login. Include it as `Authorization: Bearer <token>` in upstream requests.

### 3. Test Run

```bash
npm start
```

## MCP Client Configuration

### Claude Desktop (macOS)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

### Cursor / VS Code

Add to settings (Cursor: `~/.cursor/mcp.json`, VS Code: settings.json):

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

### Claude Code (CLI)

Add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

## Available Tools

**62 tools** organized by domain:

| Domain | Count | Description |
|--------|-------|-------------|
| **user** | 6 | User profile, preferences, and account info |
| **dashboard** | 10 | Dashboard statistics, trends, rankings, model usage, member usage |
| **wallet** | 8 | Wallet overview, transactions, balance history, recharge records |
| **team** | 14 | Team/department management, member CRUD, role & permission queries |
| **tokens** | 6 | Token consumption details, usage aggregation, billing records |
| **invoice** | 4 | Invoice list, invoice detail, red-punch status queries |
| **misc** | 14 | Refund management, resource rules, alert settings, message center |

## Authentication

This MCP server uses **Access Token** (JWT Bearer Token) authentication. The token is obtained after user login and passed via the `TUS_ACCESS_TOKEN` environment variable. All upstream API requests include it as `Authorization: Bearer <token>`.

## Development

```bash
npm run dev      # Watch mode
npm run build    # Compile TypeScript
npm start        # Run compiled server
```

## License

MIT
# mcp-user-system

[MCP](https://modelcontextprotocol.io) server for token-user-system — Console 前台全量查询接口 via Model Context Protocol.

Provides AI agents with authenticated access to the Console (前台) query APIs, covering user info, dashboard statistics, wallet, team management, token usage, invoices, and miscellaneous lookups.

Supports: user profiles, dashboard stats & trends, wallet overview, team & member management, token consumption, invoice queries, and more.

## Prerequisites

- Node.js >= 18
- `TUS_BASE_URL` and `TUS_ACCESS_TOKEN` environment variables

## Installation

### 1. Install globally

```bash
npm install -g mcp-user-system
```

Or clone & build manually:

```bash
git clone https://github.com/shenda-ai/mcp-user-system.git
cd mcp-user-system
npm install
npm run build
```

### 2. Configure Environment

```bash
export TUS_BASE_URL=https://api.example.com
export TUS_ACCESS_TOKEN=your-jwt-access-token
```

Or create a `.env` file (add to `.gitignore`):

```bash
TUS_BASE_URL=https://api.example.com
TUS_ACCESS_TOKEN=your-jwt-access-token
```

> **Access Token** is a JWT Bearer Token obtained after user login. Include it as `Authorization: Bearer <token>` in upstream requests.

### 3. Test Run

```bash
npm start
```

## MCP Client Configuration

### Claude Desktop (macOS)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

### Cursor / VS Code

Add to settings (Cursor: `~/.cursor/mcp.json`, VS Code: settings.json):

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

### Claude Code (CLI)

Add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "user-system": {
      "command": "node",
      "args": ["/path/to/mcp-user-system/dist/index.js"],
      "env": {
        "TUS_BASE_URL": "https://api.example.com",
        "TUS_ACCESS_TOKEN": "your-jwt-access-token"
      }
    }
  }
}
```

## Available Tools

**62 tools** organized by domain:

| Domain | Count | Description |
|--------|-------|-------------|
| **user** | 6 | User profile, preferences, and account info |
| **dashboard** | 10 | Dashboard statistics, trends, rankings, model usage, member usage |
| **wallet** | 8 | Wallet overview, transactions, balance history, recharge records |
| **team** | 14 | Team/department management, member CRUD, role & permission queries |
| **tokens** | 6 | Token consumption details, usage aggregation, billing records |
| **invoice** | 4 | Invoice list, invoice detail, red-punch status queries |
| **misc** | 14 | Model list, announcements, notifications, system config, and other lookups |

## Authentication

This MCP server uses **Access Token** (JWT Bearer Token) authentication. The token is obtained after user login and passed via the `TUS_ACCESS_TOKEN` environment variable. All upstream API requests include it as `Authorization: Bearer <token>`.

## Development

```bash
npm run dev      # Watch mode
npm run build    # Compile TypeScript
npm start        # Run compiled server
```

## License

MIT
