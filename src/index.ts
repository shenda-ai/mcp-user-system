#!/usr/bin/env node
/**
 * MCP Server for token-user-system
 *
 * Provides OpenAPI tools via Model Context Protocol.
 * Supports: wallet, dashboard stats, orders, users, model-stats, trend,
 *           configurable-models, tokens-list, tokens-list-page, team-tree, team-members
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getWalletOverview,
  getDashboardStats,
  getDashboardOrders,
  getDashboardUsers,
  getDashboardModelStats,
  getDashboardTrend,
  getConfigurableModels,
  getTokensList,
  getTokensListPage,
  getTeamTree,
  getTeamMembers,
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
        name: "wallet_overview",
        description: "Get account wallet overview (balance, usable balance, voucher, credit limit, pending amount)",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "dashboard_stats",
        description: "Get dashboard statistics (used quota, consumption, request count, active users, etc.)",
        inputSchema: {
          type: "object" as const,
          properties: {
            timeRange: {
              type: "string" as const,
              description: "Time range: 0=custom, 1=last 3 days, 2=last week, 3=last month, 4=this month, 5=last year, 6=today, 7=this week, 8=this year (default: 1)",
            },
            startDate: {
              type: "string" as const,
              description: "Custom start date (yyyy-MM-dd, required when timeRange=0)",
            },
            endDate: {
              type: "string" as const,
              description: "Custom end date (yyyy-MM-dd, required when timeRange=0)",
            },
          },
        },
      },
      {
        name: "dashboard_orders",
        description: "List API call detail records with optional filters",
        inputSchema: {
          type: "object" as const,
          properties: {
            timeRange: {
              type: "string" as const,
              description: "Time range: 0=custom, 1=last 3 days, 2=last week, 3=last month, 4=this month, 5=last year, 6=today, 7=this week, 8=this year (default: 1)",
            },
            startDate: {
              type: "string" as const,
              description: "Custom start date (yyyy-MM-dd)",
            },
            endDate: {
              type: "string" as const,
              description: "Custom end date (yyyy-MM-dd)",
            },
            type: {
              type: "string" as const,
              description: "Bill type filter",
            },
            keyword: {
              type: "string" as const,
              description: "Keyword filter (matches user name or team nickname)",
            },
          },
        },
      },
      {
        name: "dashboard_users",
        description: "Get user dropdown options for dashboard filtering",
        inputSchema: {
          type: "object" as const,
          properties: {
            deptId: {
              type: "string" as const,
              description: "Department ID to filter users",
            },
          },
        },
      },
      {
        name: "dashboard_model_stats",
        description: "Get model usage statistics (call count, token consumption, cost, etc.)",
        inputSchema: {
          type: "object" as const,
          properties: {
            timeRange: {
              type: "string" as const,
              description: "Time range: 0=custom, 1=last 3 days, 2=last week, 3=last month, 4=this month, 5=last year, 6=today, 7=this week, 8=this year (default: 1)",
            },
            startDate: {
              type: "string" as const,
              description: "Custom start date (yyyy-MM-dd)",
            },
            endDate: {
              type: "string" as const,
              description: "Custom end date (yyyy-MM-dd)",
            },
            sortBy: {
              type: "string" as const,
              description: "Sort by: 'token' or 'amount' (default: amount)",
            },
          },
        },
      },
      {
        name: "dashboard_trend",
        description: "Get consumption trend data over time",
        inputSchema: {
          type: "object" as const,
          properties: {
            timeRange: {
              type: "string" as const,
              description: "Time range: 0=custom, 1=last 3 days, 2=last week, 3=last month, 4=this month, 5=last year, 6=today, 7=this week, 8=this year (default: 1)",
            },
            startDate: {
              type: "string" as const,
              description: "Custom start date (yyyy-MM-dd)",
            },
            endDate: {
              type: "string" as const,
              description: "Custom end date (yyyy-MM-dd)",
            },
          },
        },
      },
      {
        name: "configurable_models",
        description: "List configurable AI models with pricing and features",
        inputSchema: {
          type: "object" as const,
          properties: {
            deptId: {
              type: "string" as const,
              description: "Department ID to filter models",
            },
            ruleMonth: {
              type: "string" as const,
              description: "Rule month in yyyy-MM format",
            },
          },
        },
      },
      {
        name: "tokens_list",
        description: "List all API tokens (keys) with scope check",
        inputSchema: {
          type: "object" as const,
          properties: {
            status: {
              type: "string" as const,
              description: "Token status filter",
            },
            name: {
              type: "string" as const,
              description: "Token name filter",
            },
          },
        },
      },
      {
        name: "tokens_list_page",
        description: "List API tokens with pagination",
        inputSchema: {
          type: "object" as const,
          properties: {
            status: {
              type: "string" as const,
              description: "Token status filter",
            },
            name: {
              type: "string" as const,
              description: "Token name filter",
            },
            pageNum: {
              type: "string" as const,
              description: "Page number (default: 1)",
            },
            pageSize: {
              type: "string" as const,
              description: "Page size (default: 10)",
            },
          },
        },
      },
      {
        name: "team_tree",
        description: "Get team organization structure tree",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "team_members",
        description: "List team members with optional filters",
        inputSchema: {
          type: "object" as const,
          properties: {
            keyword: {
              type: "string" as const,
              description: "Keyword to filter members",
            },
            deptId: {
              type: "string" as const,
              description: "Department ID to filter members",
            },
            roleId: {
              type: "string" as const,
              description: "Role ID to filter members",
            },
            status: {
              type: "string" as const,
              description: "Member status filter",
            },
          },
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
      case "wallet_overview": {
        const data = await getWalletOverview();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "dashboard_stats": {
        const data = await getDashboardStats({
          timeRange: (args?.timeRange as string) || undefined,
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

      case "dashboard_orders": {
        const data = await getDashboardOrders({
          timeRange: (args?.timeRange as string) || undefined,
          startDate: (args?.startDate as string) || undefined,
          endDate: (args?.endDate as string) || undefined,
          type: (args?.type as string) || undefined,
          keyword: (args?.keyword as string) || undefined,
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

      case "dashboard_users": {
        const data = await getDashboardUsers((args?.deptId as string) || undefined);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "dashboard_model_stats": {
        const data = await getDashboardModelStats({
          timeRange: (args?.timeRange as string) || undefined,
          startDate: (args?.startDate as string) || undefined,
          endDate: (args?.endDate as string) || undefined,
          sortBy: (args?.sortBy as string) || undefined,
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

      case "dashboard_trend": {
        const data = await getDashboardTrend({
          timeRange: (args?.timeRange as string) || undefined,
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

      case "configurable_models": {
        const data = await getConfigurableModels({
          deptId: (args?.deptId as string) || undefined,
          ruleMonth: (args?.ruleMonth as string) || undefined,
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

      case "tokens_list": {
        const data = await getTokensList({
          status: (args?.status as string) || undefined,
          name: (args?.name as string) || undefined,
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

      case "tokens_list_page": {
        const data = await getTokensListPage({
          status: (args?.status as string) || undefined,
          name: (args?.name as string) || undefined,
          pageNum: (args?.pageNum as string) || undefined,
          pageSize: (args?.pageSize as string) || undefined,
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

      case "team_tree": {
        const data = await getTeamTree();
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "team_members": {
        const data = await getTeamMembers({
          keyword: (args?.keyword as string) || undefined,
          deptId: (args?.deptId as string) || undefined,
          roleId: (args?.roleId as string) || undefined,
          status: (args?.status as string) || undefined,
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
