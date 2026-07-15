import { apiGet, apiGetPage } from "./client.js";

export const tools = [
  {
    name: "tokens_list",
    description: "获取全部API密钥列表（带权限校验）",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "密钥状态" },
        name: { type: "string", description: "密钥名称" },
      },
      required: [],
    },
  },
  {
    name: "tokens_list_page",
    description: "分页获取API密钥列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "密钥状态" },
        name: { type: "string", description: "密钥名称" },
        pageNum: { type: "string", description: "页码" },
        pageSize: { type: "string", description: "每页条数" },
      },
      required: [],
    },
  },
  {
    name: "tokens_stats",
    description: "密钥统计概览",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "tokens_configurable_models",
    description: "获取可配置AI模型列表（含定价与功能）",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID(可选)" },
        ruleMonth: { type: "string", description: "规则月份(可选)" },
      },
      required: [],
    },
  },
  {
    name: "tag_list",
    description: "获取所有启用的标签列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "tag_detail",
    description: "获取标签详情",
    inputSchema: {
      type: "object" as const,
      properties: {
        id: { type: "string", description: "标签ID" },
      },
      required: ["id"],
    },
  },
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "tokens_list":
      return apiGet("/console/tokens/list", { status: args.status, name: args.name });
    case "tokens_list_page":
      return apiGetPage("/console/tokens/listPage", {
        status: args.status, name: args.name, pageNum: args.pageNum, pageSize: args.pageSize,
      });
    case "tokens_stats":
      return apiGet("/console/tokens/stats");
    case "tokens_configurable_models":
      return apiGet("/console/tokens/configurable-models", { deptId: args.deptId, ruleMonth: args.ruleMonth });
    case "tag_list":
      return apiGet("/console/tag/list");
    case "tag_detail":
      return apiGet(`/console/tag/${args.id}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
