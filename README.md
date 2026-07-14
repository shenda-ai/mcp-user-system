# mcp-user-system

[MCP](https://modelcontextprotocol.io) server for token-user-system — OpenAPI operations via Model Context Protocol.

Supports: wallet overview, dashboard stats, orders, users, model stats, trend.

## Prerequisites

- Node.js >= 18
- `TUS_BASE_URL` and `TUS_API_KEY` environment variables

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
export TUS_API_KEY=your-openapi-key
```

Or create a `.env` file (add to `.gitignore`):

```bash
TUS_BASE_URL=https://api.example.com
TUS_API_KEY=your-openapi-key
```

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
        "TUS_API_KEY": "your-openapi-key"
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
        "TUS_API_KEY": "your-openapi-key"
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
        "TUS_API_KEY": "your-openapi-key"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `wallet_overview` | Get account wallet overview (balance, usable balance, voucher, credit limit, pending amount) |
| `dashboard_stats` | Get dashboard statistics (used quota, consumption, request count, active users, etc.) |
| `dashboard_orders` | List API call detail records with optional filters |
| `dashboard_users` | Get user dropdown options for dashboard filtering |
| `dashboard_model_stats` | Get model usage statistics (call count, token consumption, cost, etc.) |
| `dashboard_trend` | Get consumption trend data over time |

## Development

```bash
npm run dev      # Watch mode
npm run build    # Compile TypeScript
npm start        # Run compiled server
```

## License

MIT
