import { apiGet, apiGetPage } from "./client.js";

export const tools = [
  {
    name: "invoice_info",
    description: "查看发票设置信息",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "invoice_prepare",
    description: "申请开票前的回显数据（可开票金额等）",
    inputSchema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "invoice_application_list",
    description: "发票申请记录分页列表",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageNum: { type: "string", description: "页码" },
        pageSize: { type: "string", description: "每页条数" },
        invoiceType: { type: "string", description: "发票类型筛选" },
        status: { type: "string", description: "申请状态筛选" },
        keyword: { type: "string", description: "订单号关键字搜索" },
      },
      required: [],
    },
  },
  {
    name: "invoice_application_detail",
    description: "发票申请详情",
    inputSchema: {
      type: "object" as const,
      properties: {
        applicationId: { type: "string", description: "申请ID" },
      },
      required: ["applicationId"],
    },
  },
];

export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "invoice_info":
      return apiGet("/console/invoice/info");
    case "invoice_prepare":
      return apiGet("/console/invoice/application/prepare");
    case "invoice_application_list":
      return apiGetPage("/console/invoice/application/list", {
        pageNum: args.pageNum, pageSize: args.pageSize,
        invoiceType: args.invoiceType, status: args.status, keyword: args.keyword,
      });
    case "invoice_application_detail":
      return apiGet(`/console/invoice/application/detail/${args.applicationId}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
