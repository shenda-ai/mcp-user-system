import { apiGet, apiGetPage } from "./client.js";

export const tools = [
  {
    name: "dashboard_stats",
    description: "数据看板-统计卡片（已用额度、消费、请求数、活跃用户等），支持个人视图(viewType=1)和团队视图(viewType=2,可查看团队整体汇总数据)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd), timeRange=0时必填" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd), timeRange=0时必填" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_quota",
    description: "数据看板-配额/预算概览，支持团队视图(viewType=2,可指定groupId查看团队预算)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_trend",
    description: "数据看板-消费趋势数据，支持团队视图(viewType=2,可查看团队整体消费趋势)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_model_stats",
    description: "数据看板-模型使用统计（调用次数、Token消耗、费用等），支持团队视图(viewType=2,查看团队模型用量)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        sortBy: { type: "string", description: "排序字段" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_team_model_matrix",
    description: "数据看板-团队×模型消耗矩阵，团队视图(viewType=2)下可按groupId查看指定团队",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        deptId: { type: "string", description: "部门ID" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_budget_progress",
    description: "数据看板-预算消耗进度，支持团队视图(viewType=2,可查看团队整体预算执行情况)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_ranking",
    description: "数据看板-使用排名明细，支持团队视图(viewType=2,可查看团队成员用量排名)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_member_usage",
    description: "数据看板-成员使用情况，团队视图(viewType=2)下可查看团队成员资源用量",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_users",
    description: "数据看板-用户下拉选项",
    inputSchema: {
      type: "object" as const,
      properties: {
        deptId: { type: "string", description: "部门ID(可选)" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_orders",
    description: "数据看板-API调用明细记录列表（分页），支持团队视图(viewType=2,可查看团队整体调用记录)",
    inputSchema: {
      type: "object" as const,
      properties: {
        viewType: { type: "number", description: "视图类型: 1=个人, 2=团队（不传默认1）" },
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        type: { type: "string", description: "调用类型" },
        keyword: { type: "string", description: "搜索关键字" },
        pageNum: { type: "string", description: "页码" },
        pageSize: { type: "string", description: "每页条数" },
        groupId: { type: "string", description: "团队ID（团队视图时可选填）" },
      },
      required: [],
    },
  },
  // /console/dashboard/team-usage — 后端已弃用，不纳入 MCP
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  // viewType 默认 1（个人视图）
  const vt = args.viewType || "1";
  switch (name) {
    case "dashboard_stats":
      return apiGet("/console/dashboard/stats", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_quota":
      return apiGet("/console/dashboard/quota", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_trend":
      return apiGet("/console/dashboard/trend", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_model_stats":
      return apiGet("/console/dashboard/model-stats", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, sortBy: args.sortBy, groupId: args.groupId,
      });
    case "dashboard_team_model_matrix":
      return apiGet("/console/dashboard/team-model-matrix", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, deptId: args.deptId, groupId: args.groupId,
      });
    case "dashboard_budget_progress":
      return apiGet("/console/dashboard/budget-progress", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_ranking":
      return apiGet("/console/dashboard/ranking", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_member_usage":
      return apiGet("/console/dashboard/member-usage", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, groupId: args.groupId,
      });
    case "dashboard_users":
      return apiGet("/console/dashboard/users", { deptId: args.deptId });
    case "dashboard_orders":
      return apiGetPage("/console/dashboard/orders", {
        viewType: vt, timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
        type: args.type, keyword: args.keyword, pageNum: args.pageNum, pageSize: args.pageSize, groupId: args.groupId,
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
