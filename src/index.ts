#!/usr/bin/env node
/**
 * MCP Server for token-user-system
 *
 * Provides tools via Model Context Protocol, organized by domain:
 * auth, user, dashboard, wallet, team, tokens, invoice, misc
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import * as authTools from "./tools/auth.js";
import * as userTools from "./tools/user.js";
import * as dashboardTools from "./tools/dashboard.js";
import * as walletTools from "./tools/wallet.js";
import * as teamTools from "./tools/team.js";
import * as tokensTools from "./tools/tokens.js";
import * as invoiceTools from "./tools/invoice.js";
import * as miscTools from "./tools/misc.js";

// ── Merge all tool definitions ──

const allTools = [
  ...authTools.tools,
  ...userTools.tools,
  ...dashboardTools.tools,
  ...walletTools.tools,
  ...teamTools.tools,
  ...tokensTools.tools,
  ...invoiceTools.tools,
  ...miscTools.tools,
];

// ── MCP Server Setup ──

const server = new Server(
  {
    name: "mcp-user-system",
    version: "2.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ── Tool List Handler ──

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

// ── Tool Call Router ──

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const parsedArgs = (args ?? {}) as Record<string, string>;

  // 构建域路由映射
  const domains: Array<{
    names: string[];
    handler: (name: string, args: Record<string, string>) => Promise<unknown>;
  }> = [
    { names: authTools.tools.map((t) => t.name), handler: authTools.handle },
    { names: userTools.tools.map((t) => t.name), handler: userTools.handle },
    { names: dashboardTools.tools.map((t) => t.name), handler: dashboardTools.handle },
    { names: walletTools.tools.map((t) => t.name), handler: walletTools.handle },
    { names: teamTools.tools.map((t) => t.name), handler: teamTools.handle },
    { names: tokensTools.tools.map((t) => t.name), handler: tokensTools.handle },
    { names: invoiceTools.tools.map((t) => t.name), handler: invoiceTools.handle },
    { names: miscTools.tools.map((t) => t.name), handler: miscTools.handle },
  ];

  // 找到匹配的域并执行
  for (const domain of domains) {
    if (domain.names.includes(name)) {
      try {
        const data = await domain.handler(name, parsedArgs);
        const text = data !== undefined
          ? JSON.stringify(data, null, 2)
          : JSON.stringify({ message: "操作成功，无返回数据" });
        return {
          content: [{ type: "text" as const, text }],
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  }

  return {
    content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

// ── Start Server ──

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mcp-user-system server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
