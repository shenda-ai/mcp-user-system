import { apiGet, apiGetPage } from "./client.js";

export const tools = [
  {
    name: "team_tree",
    description: "获取团队组织架构树",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_auth_info",
    description: "获取企业认证信息",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_dissolve_info",
    description: "查询团队解散信息",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
      },
      required: ["deptId"],
    },
  },
  {
    name: "team_ip_whitelist",
    description: "获取IP白名单列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
      },
      required: ["deptId"],
    },
  },
  {
    name: "team_ip_whitelist_by_user",
    description: "通过用户ID查询IP白名单",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "用户ID" },
      },
      required: ["userId"],
    },
  },
  {
    name: "team_members",
    description: "团队成员列表（分页）",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "搜索关键字" },
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "成员状态" },
      },
      required: [],
    },
  },
  {
    name: "team_members_all",
    description: "团队成员列表（全量，不分页）",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "搜索关键字" },
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "成员状态" },
      },
      required: [],
    },
  },
  {
    name: "team_member_detail",
    description: "获取成员详情",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "用户ID" },
      },
      required: ["userId"],
    },
  },
  {
    name: "team_member_usage_trend",
    description: "获取成员使用趋势",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "用户ID" },
        range: { type: "string", description: "时间范围(默认30d)" },
      },
      required: ["userId"],
    },
  },
  {
    name: "team_member_pending_requests",
    description: "获取待审批的成员加入申请",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        phoneNumber: { type: "string", description: "手机号" },
        status: { type: "string", description: "状态" },
      },
      required: [],
    },
  },
  {
    name: "team_member_audit_requests",
    description: "获取已审核的成员申请列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        phoneNumber: { type: "string", description: "手机号" },
        status: { type: "string", description: "状态" },
      },
      required: [],
    },
  },
  {
    name: "team_invite_links",
    description: "邀请链接列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "状态" },
        keyword: { type: "string", description: "关键字" },
      },
      required: [],
    },
  },
  {
    name: "team_roles",
    description: "获取团队角色列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_join_info",
    description: "查询邀请码信息",
    inputSchema: {
      type: "object" as const,
      properties: {
        inviteCode: { type: "string", description: "邀请码" },
      },
      required: ["inviteCode"],
    },
  },
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "team_tree":
      return apiGet("/console/team/tree");
    case "team_auth_info":
      return apiGet("/console/team/authInfo");
    case "team_dissolve_info":
      return apiGet("/console/team/dissolve/info", { deptId: args.deptId });
    case "team_ip_whitelist":
      return apiGet("/console/team/ip-whitelist", { deptId: args.deptId });
    case "team_ip_whitelist_by_user":
      return apiGet("/console/team/ip-whitelist/user", { userId: args.userId });
    case "team_members":
      return apiGetPage("/console/team/members", {
        keyword: args.keyword, deptId: args.deptId, roleId: args.roleId, status: args.status,
      });
    case "team_members_all":
      return apiGet("/console/team/members/all", {
        keyword: args.keyword, deptId: args.deptId, roleId: args.roleId, status: args.status,
      });
    case "team_member_detail":
      return apiGet(`/console/team/members/${args.userId}`);
    case "team_member_usage_trend":
      return apiGet(`/console/team/members/${args.userId}/usage-trend`, { range: args.range });
    case "team_member_pending_requests":
      return apiGet("/console/team/members/pending-requests", {
        deptId: args.deptId, phoneNumber: args.phoneNumber, status: args.status,
      });
    case "team_member_audit_requests":
      return apiGet("/console/team/members/audit-requests", {
        deptId: args.deptId, phoneNumber: args.phoneNumber, status: args.status,
      });
    case "team_invite_links":
      return apiGet("/console/team/invite-links", {
        deptId: args.deptId, roleId: args.roleId, status: args.status, keyword: args.keyword,
      });
    case "team_roles":
      return apiGet("/console/team/roles");
    case "team_join_info":
      return apiGet("/console/team/join/info", { inviteCode: args.inviteCode });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
