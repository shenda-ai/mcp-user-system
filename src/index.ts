#!/usr/bin/env node
/**
 * MCP Server for token-user-system
 *
 * Provides wallet management tools via Model Context Protocol.
 * Supports: balance, trend, transactions, coupons, corporate-info
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getBalance,
  getTrend,
  getTransactions,
  getCoupons,
  getCorporateInfo,
} from "./tools/wallet.js";

// ── MCP Server Setup ──

const server = new Server(
  {
    name: "mcp-user-system",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ── Tool Definitions ──

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "wallet_balance",
        description: "Get account wallet overview (balance, usable balance, voucher, credit limit, pending amount)",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "wallet_trend",
        description: "Get consumption trend for a given number of days",
        inputSchema: {
          type: "object" as const,
          properties: {
            days: {
              type: "number" as const,
              description: "Number of days to query (default: 30)",
              default: 30,
            },
          },
        },
      },
      {
        name: "wallet_transactions",
        description: "List wallet transaction records with optional filters",
        inputSchema: {
          type: "object" as const,
          properties: {
            recordType: {
              type: "string" as const,
              description: "Filter by record type",
            },
            startDate: {
              type: "string" as const,
              description: "Start date (YYYY-MM-DD)",
            },
            endDate: {
              type: "string" as const,
              description: "End date (YYYY-MM-DD)",
            },
          },
        },
      },
      {
        name: "wallet_coupons",
        description: "List my cash coupons",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "wallet_corporate_info",
        description: "Get corporate transfer bank account info for recharge",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
    ],
  };
});

// ── Tool Handlers ──

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "wallet_balance": {
        const data = await getBalance();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "wallet_trend": {
        const days = (args?.days as number) || 30;
        const data = await getTrend(days);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "wallet_transactions": {
        const data = await getTransactions({
          recordType: (args?.recordType as string) || undefined,
          startDate: (args?.startDate as string) || undefined,
          endDate: (args?.endDate as string) || undefined,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "wallet_coupons": {
        const data = await getCoupons();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "wallet_corporate_info": {
        const data = await getCorporateInfo();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
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
