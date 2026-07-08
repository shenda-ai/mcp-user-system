# mcp-user-system

[MCP](https://modelcontextprotocol.io) server for token-user-system — wallet operations via Model Context Protocol.

Supports: balance, consumption trend, transaction records, coupons, corporate transfer info.

## Prerequisites

- Node.js >= 18
- `TUS_BASE_URL` and `TUS_ACCESS_TOKEN` environment variables

## Installation

### 1. Clone & Build

```bash
git clone https://github.com/shenda-ai/mcp-user-system.git
cd mcp-user-system
npm install
npm run build
```

### 2. Configure Environment

```bash
export TUS_BASE_URL=https://api.example.com
export TUS_ACCESS_TOKEN=eyJhbGciOiJIUzUxMiJ9...
```

Or create a `.env` file (add to `.gitignore`):

```bash
TUS_BASE_URL=https://api.example.com
TUS_ACCESS_TOKEN=eyJhbGciOiJIUzUxMiJ9...
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
        "TUS_ACCESS_TOKEN": "eyJhbGciOiJIUzUxMiJ9..."
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
        "TUS_ACCESS_TOKEN": "eyJhbGciOiJIUzUxMiJ9..."
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
        "TUS_ACCESS_TOKEN": "eyJhbGciOiJIUzUxMiJ9..."
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `wallet_balance` | Get account wallet overview |
| `wallet_trend` | Get consumption trend (`days` param) |
| `wallet_transactions` | List transaction records (with filters) |
| `wallet_coupons` | List cash coupons |
| `wallet_corporate_info` | Get corporate transfer bank info |

## Development

```bash
npm run dev      # Watch mode
npm run build    # Compile TypeScript
npm start        # Run compiled server
```

## License

MIT
