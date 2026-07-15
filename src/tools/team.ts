import { apiGet, setToken } from "./client.js";

export const tools = [
  {
    name: "team_tree",
    description: "获取当前团队的组织架构树，展示部门层级关系和成员分布。用于了解团队整体结构。",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_auth_info",
    description: "获取当前团队的企业认证信息，包括认证状态、企业名称、统一社会信用代码等。用于确认团队是否已完成企业认证。",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_dissolve_info",
    description: "查询团队解散相关信息。仅当团队处于解散流程中时才会返回有效数据。",
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
    description: "获取指定部门的IP白名单列表。只有白名单内的IP地址才能访问该团队的相关服务。",
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
    description: "通过用户ID查询该用户所属部门的IP白名单。",
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
    description: "获取团队成员列表，支持按关键字、部门、角色、状态筛选，支持分页。返回成员的基本信息（姓名、手机号、角色、状态等）。",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "搜索关键字（姓名或手机号）" },
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "成员状态" },
        pageNum: { type: "string", description: "页码(string, 默认1)" },
        pageSize: { type: "string", description: "每页条数(string, 默认10)" },
      },
      required: [],
    },
  },
  {
    name: "team_members_all",
    description: "获取团队成员全量列表（不分页），支持按关键字、部门、角色、状态筛选。适用于需要导出全部成员的场景。",
    inputSchema: {
      type: "object" as const,
      properties: {
        keyword: { type: "string", description: "搜索关键字（姓名或手机号）" },
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "成员状态" },
      },
      required: [],
    },
  },
  {
    name: "team_member_detail",
    description: "获取指定成员的详细信息，包括用户ID、姓名、手机号、角色、所属部门、使用量等。",
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
    description: "获取指定成员在指定时间范围内的使用量趋势数据（按天统计）。可用于分析成员的使用习惯和消耗情况。",
    inputSchema: {
      type: "object" as const,
      properties: {
        userId: { type: "string", description: "用户ID" },
        days: { type: "string", description: "查询天数(string, 默认30天)" },
      },
      required: ["userId"],
    },
  },
  {
    name: "team_member_pending_requests",
    description: "获取待审批的成员加入申请列表，支持分页和按状态筛选。管理员可通过此接口查看并处理新成员的加入申请。",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        phoneNumber: { type: "string", description: "手机号" },
        status: { type: "string", description: "状态" },
        pageNum: { type: "string", description: "页码(string, 默认1)" },
        pageSize: { type: "string", description: "每页条数(string, 默认10)" },
      },
      required: [],
    },
  },
  {
    name: "team_member_audit_requests",
    description: "获取已审核的成员加入申请列表（包括已通过和已拒绝），支持分页和按状态筛选。",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        phoneNumber: { type: "string", description: "手机号" },
        status: { type: "string", description: "状态" },
        pageNum: { type: "string", description: "页码(string, 默认1)" },
        pageSize: { type: "string", description: "每页条数(string, 默认10)" },
      },
      required: [],
    },
  },
  {
    name: "team_invite_links",
    description: "获取团队邀请链接列表，支持分页和按角色、状态、关键字筛选。管理员可通过此接口查看和管理已创建的邀请链接。",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID" },
        roleId: { type: "string", description: "角色ID" },
        status: { type: "string", description: "状态" },
        keyword: { type: "string", description: "关键字" },
        pageNum: { type: "string", description: "页码(string, 默认1)" },
        pageSize: { type: "string", description: "每页条数(string, 默认10)" },
      },
      required: [],
    },
  },
  {
    name: "team_roles",
    description: "获取当前团队可用的角色列表，包括角色ID、名称和权限配置。用于了解团队内有哪些角色可供选择。",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "team_join_info",
    description: "通过邀请码查询团队加入信息，可获知目标团队的名称、部门ID等基本信息，供用户确认是否加入。",
    inputSchema: {
      type: "object" as const,
      properties: {
        inviteCode: { type: "string", description: "邀请码" },
      },
      required: ["inviteCode"],
    },
  },
  {
    name: "team_list",
    description: "获取当前用户可切换的所有团队（工作台）列表，显示团队名称和角色。可用于确定要切换到哪个团队。",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "team_current",
    description: "查看当前所在团队的详细信息，包括团队ID、名称、角色、权限概要等。",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "team_switch",
    description: "切换到指定团队。切换后当前请求的认证令牌会自动更新为新团队的令牌，后续所有请求将在新团队上下文中执行。需先从 team_list 获取可用的 deptId。",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "要切换到的目标团队ID（从 team_list 获取）" },
      },
      required: ["deptId"],
    },
  },
];

// 提取分页响应中的 rows 和 total
// apiGet 已解包 .data，所以响应可能是:
// 1. { total, rows } — 后端 data 为 TableDataInfo 时
// 2. { code, total, rows, msg } — 后端直接返回 TableDataInfo 时
// 3. 数组 — data 直接为列表时
function extractPageData(response: unknown): unknown {
  if (Array.isArray(response)) {
    return { rows: response, total: response.length };
  }
  if (response && typeof response === "object") {
    const obj = response as Record<string, unknown>;
    if (Array.isArray(obj.rows)) {
      return { rows: obj.rows, total: obj.total ?? obj.rows.length };
    }
  }
  return response;
}

async function doTeamList(): Promise<unknown> {
  return apiGet("/console/user/workbench");
}

async function doTeamCurrent(): Promise<unknown> {
  const info = await apiGet<Record<string, unknown>>("/getInfo");
  const user = info.user as Record<string, unknown> | undefined;
  return {
    groupId: user?.groupId,
    groupName: user?.groupName,
    roles: info.roles,
    permissions: info.permissions,
  };
}

async function doSwitchTeam(deptId: string): Promise<unknown> {
  // apiGet 会解包 .data，如果后端返回 { code, token } 则 apiGet 返回整个对象
  const response = await apiGet<Record<string, unknown>>(`/console/user/workbench/switch/${deptId}`);

  const token = (response.token as string | undefined)
    ?? ((response.data as Record<string, unknown> | undefined)?.token as string | undefined)
    ?? (typeof response.data === "string" ? response.data : undefined);

  if (!token) {
    throw new Error("切换团队成功但未返回新令牌");
  }

  setToken(token);

  return {
    success: true,
    message: "团队切换成功，后续请求将在新团队上下文中执行",
    deptId,
  };
}

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
      return extractPageData(await apiGet("/console/team/members", {
        keyword: args.keyword, deptId: args.deptId, roleId: args.roleId, status: args.status,
        pageNum: args.pageNum, pageSize: args.pageSize,
      }));
    case "team_members_all":
      return apiGet("/console/team/members/all", {
        keyword: args.keyword, deptId: args.deptId, roleId: args.roleId, status: args.status,
      });
    case "team_member_detail":
      return apiGet(`/console/team/members/${args.userId}`);
    case "team_member_usage_trend":
      return apiGet(`/console/team/members/${args.userId}/usage-trend`, { days: args.days });
    case "team_member_pending_requests":
      return extractPageData(await apiGet("/console/team/members/pending-requests", {
        deptId: args.deptId, phoneNumber: args.phoneNumber, status: args.status,
        pageNum: args.pageNum, pageSize: args.pageSize,
      }));
    case "team_member_audit_requests":
      return extractPageData(await apiGet("/console/team/members/audit-requests", {
        deptId: args.deptId, phoneNumber: args.phoneNumber, status: args.status,
        pageNum: args.pageNum, pageSize: args.pageSize,
      }));
    case "team_invite_links":
      return extractPageData(await apiGet("/console/team/invite-links", {
        deptId: args.deptId, roleId: args.roleId, status: args.status, keyword: args.keyword,
        pageNum: args.pageNum, pageSize: args.pageSize,
      }));
    case "team_roles":
      return apiGet("/console/team/roles");
    case "team_join_info":
      return apiGet("/console/team/join/info", { inviteCode: args.inviteCode });
    case "team_list":
      return doTeamList();
    case "team_current":
      return doTeamCurrent();
    case "team_switch":
      return doSwitchTeam(args.deptId);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
