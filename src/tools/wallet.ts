import { apiGet, apiGetPage, apiPost } from "./client.js";

export const tools = [
  {
    name: "wallet_overview",
    description: "账户钱包概览（余额、可用余额、代金券、授信额度、待处理金额）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "wallet_consumption_trend",
    description: "消费趋势数据（可按指定天数查看历史消费走势）",
    inputSchema: {
      type: "object" as const,
      properties: {
        days: { type: "string", description: "查询天数(默认30)" },
      },
      required: [],
    },
  },
  {
    name: "wallet_transaction_list",
    description: "收支明细列表（支持分页，可按recordType筛选收支类型）",
    inputSchema: {
      type: "object" as const,
      properties: {
        recordType: { type: "string", description: "记录类型" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
        pageNum: { type: "number", description: "页码（默认1）" },
        pageSize: { type: "number", description: "每页条数（默认10）" },
      },
      required: [],
    },
  },
  {
    name: "wallet_recharge_status",
    description: "查询充值订单状态（根据订单号查询充值是否到账）",
    inputSchema: {
      type: "object" as const,
      properties: {
        orderNo: { type: "string", description: "订单号" },
      },
      required: ["orderNo"],
    },
  },
  {
    name: "wallet_recharge_corporate_info",
    description: "获取对公转账收款信息（企业对公充值时查询银行账户信息）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "wallet_coupon_list",
    description: "我的代金券列表（可按status筛选：0=未使用,1=已使用,2=已过期）",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "代金券状态(可选): 0=未使用,1=已使用,2=已过期" },
      },
      required: [],
    },
  },
  {
    name: "wallet_coupon_buy_status",
    description: "查询代金券购买订单状态（根据订单号查询购买是否成功）",
    inputSchema: {
      type: "object" as const,
      properties: {
        orderNo: { type: "string", description: "订单号" },
      },
      required: ["orderNo"],
    },
  },
  {
    name: "wallet_coupon_query",
    description: "代金券编码查询（输入编码可查询代金券面额、有效期、使用状态等详细信息）",
    inputSchema: {
      type: "object" as const,
      properties: {
        couponCode: { type: "string", description: "代金券编码" },
      },
      required: ["couponCode"],
    },
  },
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "wallet_overview":
      return apiGet("/console/wallet/overview");
    case "wallet_consumption_trend":
      return apiGet("/console/wallet/consumption/trend", { days: args.days });
    case "wallet_transaction_list":
      return apiGetPage("/console/wallet/transaction/list", {
        recordType: args.recordType, startDate: args.startDate, endDate: args.endDate,
        pageNum: args.pageNum, pageSize: args.pageSize,
      });
    case "wallet_recharge_status":
      return apiGet(`/console/wallet/recharge/status/${args.orderNo}`);
    case "wallet_recharge_corporate_info":
      return apiGet("/console/wallet/recharge/corporate/info");
    case "wallet_coupon_list":
      return apiGet("/console/wallet/coupon/list", { status: args.status });
    case "wallet_coupon_buy_status":
      return apiGet(`/console/wallet/coupon/buy/status/${args.orderNo}`);
    case "wallet_coupon_query":
      return apiPost("/console/wallet/coupon/redeem/query", { couponCode: args.couponCode });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
