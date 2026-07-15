import { apiGet, apiGetPage } from "./client.js";

export const tools = [
  {
    name: "dashboard_stats",
    description: "数据看板-统计卡片（已用额度、消费、请求数、活跃用户等）",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd), timeRange=0时必填" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd), timeRange=0时必填" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_quota",
    description: "数据看板-配额/预算概览",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_trend",
    description: "数据看板-消费趋势数据",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_model_stats",
    description: "数据看板-模型使用统计（调用次数、Token消耗、费用等）",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        sortBy: { type: "string", description: "排序字段" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_team_model_matrix",
    description: "数据看板-团队×模型消耗矩阵",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        deptId: { type: "string", description: "部门ID" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_budget_progress",
    description: "数据看板-预算消耗进度",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_ranking",
    description: "数据看板-使用排名明细",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
      },
      required: [],
    },
  },
  {
    name: "dashboard_member_usage",
    description: "数据看板-成员使用情况",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
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
    description: "数据看板-API调用明细记录列表（分页）",
    inputSchema: {
      type: "object" as const,
      properties: {
        timeRange: { type: "string", description: "时间范围: 0=自定义,1=近3天,2=近一周,3=近一月,4=本月,5=去年,6=今天,7=本周,8=今年" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        type: { type: "string", description: "调用类型" },
        keyword: { type: "string", description: "搜索关键字" },
        pageNum: { type: "string", description: "页码" },
        pageSize: { type: "string", description: "每页条数" },
      },
      required: [],
    },
  },
  // /console/dashboard/team-usage — 后端已弃用，不纳入 MCP
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "dashboard_stats":
      return apiGet("/console/dashboard/stats", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_quota":
      return apiGet("/console/dashboard/quota", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_trend":
      return apiGet("/console/dashboard/trend", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_model_stats":
      return apiGet("/console/dashboard/model-stats", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, sortBy: args.sortBy,
      });
    case "dashboard_team_model_matrix":
      return apiGet("/console/dashboard/team-model-matrix", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate, deptId: args.deptId,
      });
    case "dashboard_budget_progress":
      return apiGet("/console/dashboard/budget-progress", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_ranking":
      return apiGet("/console/dashboard/ranking", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_member_usage":
      return apiGet("/console/dashboard/member-usage", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
      });
    case "dashboard_users":
      return apiGet("/console/dashboard/users", { deptId: args.deptId });
    case "dashboard_orders":
      return apiGetPage("/console/dashboard/orders", {
        timeRange: args.timeRange, startDate: args.startDate, endDate: args.endDate,
        type: args.type, keyword: args.keyword, pageNum: args.pageNum, pageSize: args.pageSize,
      });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
