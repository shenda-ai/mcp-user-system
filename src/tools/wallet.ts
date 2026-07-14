/**
 * OpenAPI client for token-user-system.
 * Calls backend-openapi endpoints under /openapi/*.
 */

import { loadConfig } from "../env.js";

const config = loadConfig();

async function apiCall<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const config = loadConfig();
  const headers: Record<string, string> = {
    Authorization: config.apiKey,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${config.baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return JSON.parse(text) as T;
}

// --- Wallet Overview ---

export interface WalletOverviewVo {
  balance?: number;
  usableBalance?: number;
  voucher?: number;
  creditLimit?: number;
  pendingAmount?: number;
  pendingCount?: number;
}

export async function getWalletOverview(): Promise<WalletOverviewVo> {
  const data = await apiCall<{ code: number; msg: string; data: WalletOverviewVo }>("GET", "/openapi/wallet");
  return data.data;
}

// --- Dashboard Stats ---

export interface DashboardStatsVo {
  usedQuotaTotal?: number;
  lastMonthUsed?: number;
  monthComparePercent?: number;
  usedAmount?: number;
  usedTokens?: number;
  requestCount?: number;
  activeUsers?: number;
  showCompare?: boolean;
  amountComparePercent?: number;
  tokenComparePercent?: number;
  requestComparePercent?: number;
  activeUserCompare?: number;
}

export async function getDashboardStats(params?: {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
}): Promise<DashboardStatsVo> {
  const query = new URLSearchParams();
  if (params?.timeRange) query.append("timeRange", params.timeRange);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: DashboardStatsVo }>(
    "GET",
    `/openapi/dashboard/stats${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Dashboard Orders ---

export interface OrderDetailVo {
  createTime?: string;
  createdAt?: number;
  userId?: number;
  userName?: string;
  teamNickname?: string;
  deptId?: number;
  deptName?: string;
  tokenId?: number;
  tokenName?: string;
  modelName?: string;
  useTime?: number;
  status?: number;
  amount?: number;
  statusText?: string;
  type?: string;
}

export interface TableDataInfo<T> {
  total: number;
  rows: T[];
  code: number;
  msg: string;
}

export async function getDashboardOrders(params?: {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  keyword?: string;
}): Promise<TableDataInfo<OrderDetailVo>> {
  const query = new URLSearchParams();
  if (params?.timeRange) query.append("timeRange", params.timeRange);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.type) query.append("type", params.type);
  if (params?.keyword) query.append("keyword", params.keyword);
  const qs = query.toString();
  return apiCall<TableDataInfo<OrderDetailVo>>(
    "GET",
    `/openapi/dashboard/orders${qs ? "?" + qs : ""}`
  );
}

// --- Dashboard Users ---

export interface DashboardUserOptionVo {
  userId?: number;
  userName?: string;
  nickName?: string;
}

export async function getDashboardUsers(deptId?: string): Promise<DashboardUserOptionVo[]> {
  const query = new URLSearchParams();
  if (deptId) query.append("deptId", deptId);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: DashboardUserOptionVo[] }>(
    "GET",
    `/openapi/dashboard/users${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Dashboard Model Stats ---

export interface DashboardModelStatVo {
  modelName?: string;
  callCount?: number;
  callPercent?: number;
  tokens?: number;
  tokenPercent?: number;
  amount?: number;
  avgAmount?: number;
  amountPercent?: number;
}

export async function getDashboardModelStats(params?: {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}): Promise<DashboardModelStatVo[]> {
  const query = new URLSearchParams();
  if (params?.timeRange) query.append("timeRange", params.timeRange);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: DashboardModelStatVo[] }>(
    "GET",
    `/openapi/dashboard/model-stats${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Dashboard Trend ---

export interface DashboardTrendVo {
  date?: string;
  amount?: number;
  tokens?: number;
}

export async function getDashboardTrend(params?: {
  timeRange?: string;
  startDate?: string;
  endDate?: string;
}): Promise<DashboardTrendVo[]> {
  const query = new URLSearchParams();
  if (params?.timeRange) query.append("timeRange", params.timeRange);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: DashboardTrendVo[] }>(
    "GET",
    `/openapi/dashboard/trend${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Tokens / Configurable Models ---

export interface ModelOptionVo {
  modelCode?: string;
  modelName?: string;
  modelType?: string;
  unitPrice?: number;
  selected?: boolean;
  features?: string[];
  icon?: string;
  customerDiscountRate?: number;
  saleReferenceDiscount?: number;
  hot?: boolean;
}

export async function getConfigurableModels(params?: {
  deptId?: string;
  ruleMonth?: string;
}): Promise<ModelOptionVo[]> {
  const query = new URLSearchParams();
  if (params?.deptId) query.append("deptId", params.deptId);
  if (params?.ruleMonth) query.append("ruleMonth", params.ruleMonth);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: ModelOptionVo[] }>(
    "GET",
    `/openapi/tokens/configurable-models${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Tokens List ---

export interface TokensListVo {
  id?: number;
  groupId?: number;
  deptId?: number;
  userId?: number;
  apiKey?: string;
  status?: number;
  name?: string;
  accessedTime?: number;
  expiredTime?: number;
  remainQuota?: number;
  unlimitedQuota?: boolean;
  modelLimitsEnabled?: boolean;
  modelLimits?: string;
  allowIps?: string;
  usedQuota?: number;
  group?: string;
  crossGroupRetry?: boolean;
  tags?: string;
  createTime?: string;
  baseUrl?: string;
  queryType?: number;
}

export async function getTokensList(params?: {
  id?: string;
  groupId?: string;
  deptId?: string;
  userId?: string;
  status?: string;
  name?: string;
}): Promise<TokensListVo[]> {
  const query = new URLSearchParams();
  if (params?.id) query.append("id", params.id);
  if (params?.groupId) query.append("groupId", params.groupId);
  if (params?.deptId) query.append("deptId", params.deptId);
  if (params?.userId) query.append("userId", params.userId);
  if (params?.status) query.append("status", params.status);
  if (params?.name) query.append("name", params.name);
  const qs = query.toString();
  const data = await apiCall<{ code: number; msg: string; data: TokensListVo[] }>(
    "GET",
    `/openapi/tokens/list${qs ? "?" + qs : ""}`
  );
  return data.data;
}

export async function getTokensListPage(params?: {
  id?: string;
  groupId?: string;
  deptId?: string;
  userId?: string;
  status?: string;
  name?: string;
  pageNum?: string;
  pageSize?: string;
}): Promise<TableDataInfo<TokensListVo>> {
  const query = new URLSearchParams();
  if (params?.id) query.append("id", params.id);
  if (params?.groupId) query.append("groupId", params.groupId);
  if (params?.deptId) query.append("deptId", params.deptId);
  if (params?.userId) query.append("userId", params.userId);
  if (params?.status) query.append("status", params.status);
  if (params?.name) query.append("name", params.name);
  if (params?.pageNum) query.append("pageNum", params.pageNum);
  if (params?.pageSize) query.append("pageSize", params.pageSize);
  const qs = query.toString();
  return apiCall<TableDataInfo<TokensListVo>>(
    "GET",
    `/openapi/tokens/listPage${qs ? "?" + qs : ""}`
  );
}

// --- Team ---

export interface TeamTreeVo {
  deptId?: number;
  deptName?: string;
  deptDesc?: string;
  parentId?: number;
  memberCount?: number;
  quotaUsed?: number;
  quotaTotal?: number;
  isUnlimited?: boolean;
  isEnterpriseAuth?: boolean;
  principal?: string;
  children?: TeamTreeVo[];
}

export async function getTeamTree(): Promise<TeamTreeVo[]> {
  const data = await apiCall<{ code: number; msg: string; data: TeamTreeVo[] }>(
    "GET",
    "/openapi/team/tree"
  );
  return data.data;
}

// --- Team Members ---

export interface UsageTrendItem {
  date?: string;
  amount?: number;
}

export interface TeamMemberListVo {
  userId?: number;
  userName?: string;
  deptUserName?: string;
  described?: string;
  nickName?: string;
  phoneNumber?: string;
  email?: string;
  deptId?: number;
  deptName?: string;
  deptDesc?: string;
  roleId?: number;
  roleName?: string;
  status?: string;
  statusName?: string;
  realNameAuth?: boolean;
  enterpriseAuth?: boolean;
  quotaTotal?: number;
  quotaUsed?: number;
  quotaAvailable?: number;
  limitType?: string;
  createTime?: string;
  lastLoginTime?: string;
  auditStatus?: number;
  auditStatusName?: string;
  requestId?: number;
  editable?: boolean;
  usageTrend?: UsageTrendItem[];
}

export async function getTeamMembers(params?: {
  keyword?: string;
  deptId?: string;
  roleId?: string;
  status?: string;
}): Promise<TableDataInfo<TeamMemberListVo>> {
  const query = new URLSearchParams();
  if (params?.keyword) query.append("keyword", params.keyword);
  if (params?.deptId) query.append("deptId", params.deptId);
  if (params?.roleId) query.append("roleId", params.roleId);
  if (params?.status) query.append("status", params.status);
  const qs = query.toString();
  return apiCall<TableDataInfo<TeamMemberListVo>>(
    "GET",
    `/openapi/team/members${qs ? "?" + qs : ""}`
  );
}
