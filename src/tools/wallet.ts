import { apiGet, apiPost } from "./client.js";

export const tools = [
  {
    name: "wallet_overview",
    description: "账户钱包概览（余额、可用余额、代金券、授信额度、待处理金额）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "wallet_consumption_trend",
    description: "消费趋势数据",
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
    description: "收支明细列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        recordType: { type: "string", description: "记录类型" },
        startDate: { type: "string", description: "开始日期(yyyy-MM-dd)" },
        endDate: { type: "string", description: "结束日期(yyyy-MM-dd)" },
      },
      required: [],
    },
  },
  {
    name: "wallet_recharge_status",
    description: "查询充值订单状态",
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
    description: "获取对公转账收款信息",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "wallet_coupon_list",
    description: "我的代金券列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        status: { type: "string", description: "代金券状态(可选)" },
      },
      required: [],
    },
  },
  {
    name: "wallet_coupon_buy_status",
    description: "查询代金券购买订单状态",
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
    description: "代金券编码查询",
    inputSchema: {
      type: "object" as const,
      properties: {
        redeemCode: { type: "string", description: "代金券兑换码" },
      },
      required: ["redeemCode"],
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
      return apiGet("/console/wallet/transaction/list", {
        recordType: args.recordType, startDate: args.startDate, endDate: args.endDate,
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
      return apiPost("/console/wallet/coupon/redeem/query", { redeemCode: args.redeemCode });
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
