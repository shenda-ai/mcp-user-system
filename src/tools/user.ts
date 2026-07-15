import { apiGet } from "./client.js";

// ---- 工具定义 ----
export const tools = [
  {
    name: "get_user_info",
    description: "获取当前登录用户信息（含角色、权限）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_user_profile",
    description: "获取个人资料详情",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_user_role_list",
    description: "获取用户角色列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_user_workbench",
    description: "获取工作台列表（可切换的团队/部门）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_user_auth_info",
    description: "获取用户实名认证信息",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "switch_workbench",
    description: "切换工作台（切换当前操作的团队/部门视图）",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "目标部门ID" },
      },
      required: ["deptId"],
    },
  },
];

// ---- 处理函数 ----
export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "get_user_info":
      return apiGet("/getInfo");
    case "get_user_profile":
      return apiGet("/system/user/profile");
    case "get_user_role_list":
      return apiGet("/console/user/roleList");
    case "get_user_workbench":
      return apiGet("/console/user/workbench");
    case "get_user_auth_info":
      return apiGet("/console/user/authInfo");
    case "switch_workbench":
      return apiGet(`/console/user/workbench/${args.deptId}/switch`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
