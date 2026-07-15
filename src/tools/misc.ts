import { apiGet, apiGetPage, apiPost } from "./client.js";

export const tools = [
  // ---- 退款 ----
  {
    name: "refund_list",
    description: "退款订单列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "refund_detail",
    description: "退款订单详情",
    inputSchema: {
      type: "object" as const,
      properties: {
        orderNo: { type: "string", description: "退款订单号" },
      },
      required: ["orderNo"],
    },
  },
  {
    name: "refund_preview",
    description: "退款分配预览（预览退款金额分配方案）",
    inputSchema: {
      type: "object" as const,
      properties: {
        amount: { type: "string", description: "退款金额" },
      },
      required: ["amount"],
    },
  },
  // ---- 资源规则 ----
  {
    name: "resource_rules",
    description: "获取资源分配规则页数据",
    inputSchema: {
      type: "object" as const,
      properties: {
        monthType: { type: "string", description: "月份类型" },
        deptId: { type: "string", description: "部门ID(可选)" },
      },
      required: [],
    },
  },
  {
    name: "resource_quota_validate",
    description: "额度输入校验（检查额度值是否合法）",
    inputSchema: {
      type: "object" as const,
      properties: {
        targetType: { type: "string", description: "目标类型" },
        targetId: { type: "string", description: "目标ID" },
        targetDeptId: { type: "string", description: "目标部门ID" },
        limitType: { type: "string", description: "限制类型" },
        quotaTotal: { type: "string", description: "额度总量" },
      },
      required: [],
    },
  },
  {
    name: "resource_quota_bounds",
    description: "查询额度分配界限",
    inputSchema: {
      type: "object" as const,
      properties: {
        monthType: { type: "string", description: "月份类型" },
        targetType: { type: "string", description: "目标类型" },
        targetId: { type: "string", description: "目标ID" },
        deptId: { type: "string", description: "部门ID" },
      },
      required: [],
    },
  },
  {
    name: "resource_config",
    description: "获取统一资源配置回显数据",
    inputSchema: {
      type: "object" as const,
      properties: {
        monthType: { type: "string", description: "月份类型" },
        targetType: { type: "string", description: "目标类型" },
        targetId: { type: "string", description: "目标ID" },
        deptId: { type: "string", description: "部门ID" },
      },
      required: [],
    },
  },
  // ---- 预警 ----
  {
    name: "alert_setting",
    description: "获取预警设置",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "alert_selected_receivers",
    description: "获取已选的预警接收人列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "alert_selectable_receivers",
    description: "获取可选的预警接收人列表",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "alert_check",
    description: "检查预警状态",
    inputSchema: {
      type: "object" as const,
      properties: {
        groupId: { type: "string", description: "团队ID" },
      },
      required: ["groupId"],
    },
  },
  // ---- 消息中心 ----
  {
    name: "message_list",
    description: "消息列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        category: { type: "string", description: "消息分类" },
        status: { type: "string", description: "消息状态" },
        pageNum: { type: "string", description: "页码" },
        pageSize: { type: "string", description: "每页条数" },
      },
      required: [],
    },
  },
  {
    name: "message_count",
    description: "未读消息数量统计",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "message_popup",
    description: "获取待弹窗消息",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    // ---- 退款 ----
    case "refund_list":
      return apiGetPage("/console/refund/list");
    case "refund_detail":
      return apiGet(`/console/refund/${args.orderNo}`);
    case "refund_preview":
      return apiPost("/console/refund/preview", { amount: args.amount });
    // ---- 资源规则 ----
    case "resource_rules":
      return apiGet("/console/resource/rules", { monthType: args.monthType, deptId: args.deptId });
    case "resource_quota_validate":
      return apiGet("/console/resource/quota/validate", {
        targetType: args.targetType, targetId: args.targetId,
        targetDeptId: args.targetDeptId, limitType: args.limitType, quotaTotal: args.quotaTotal,
      });
    case "resource_quota_bounds":
      return apiGet("/console/resource/quota/bounds", {
        monthType: args.monthType, targetType: args.targetType,
        targetId: args.targetId, deptId: args.deptId,
      });
    case "resource_config":
      return apiGet("/console/resource/config", {
        monthType: args.monthType, targetType: args.targetType,
        targetId: args.targetId, deptId: args.deptId,
      });
    // ---- 预警 ----
    case "alert_setting":
      return apiGet("/console/alert/setting");
    case "alert_selected_receivers":
      return apiGet("/console/alert/receivers/selected");
    case "alert_selectable_receivers":
      return apiGet("/console/alert/receivers/selectable");
    case "alert_check":
      return apiGet("/console/alert/check", { groupId: args.groupId });
    // ---- 消息中心 ----
    case "message_list":
      return apiGetPage("/console/message/list", {
        category: args.category, status: args.status, pageNum: args.pageNum, pageSize: args.pageSize,
      });
    case "message_count":
      return apiGet("/console/message/count");
    case "message_popup":
      return apiGet("/console/message/popup");
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
