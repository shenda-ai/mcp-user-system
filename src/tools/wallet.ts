/**
 * Wallet API client for token-user-system.
 * Mirrors the front-end request.js interceptor logic.
 */

import { loadConfig } from "../env.js";

const config = loadConfig();

async function apiCall<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const config = loadConfig();
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.accessToken}`,
    "Content-Type": "application/json",
    "Crypto-Version": "*.*.*",
    accountType: "S_",
    platformType: "skill",
    DeviceType: "pc",
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

// --- Balance ---

export interface BalanceVo {
  balance?: number;
  usableBalance?: number;
  voucher?: number;
  creditLimit?: number;
  pendingAmount?: number;
  pendingCount?: number;
}

export async function getBalance(): Promise<BalanceVo> {
  const data = await apiCall<{ code: number; data: BalanceVo }>("GET", "/console/wallet/overview");
  return data.data;
}

// --- Trend ---

export interface TrendItem {
  date: string;
  amount: number;
}

export async function getTrend(days: number = 30): Promise<TrendItem[]> {
  const data = await apiCall<{ code: number; data: TrendItem[] }>("GET", `/console/wallet/consumption/trend?days=${days}`);
  return data.data;
}

// --- Transactions ---

export interface TransactionRecord {
  typeName?: string;
  recordType?: string;
  orderNo?: string;
  eventTime?: string;
  amount?: number;
  status?: string;
}

export async function getTransactions(params?: {
  recordType?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TransactionRecord[]> {
  const query = new URLSearchParams();
  if (params?.recordType) query.append("recordType", params.recordType);
  if (params?.startDate) query.append("startDate", params.startDate);
  if (params?.endDate) query.append("endDate", params.endDate);
  const qs = query.toString();
  const data = await apiCall<{ code: number; data: TransactionRecord[] }>(
    "GET",
    `/console/wallet/transaction/list${qs ? "?" + qs : ""}`
  );
  return data.data;
}

// --- Coupons ---

export interface CouponCount {
  unredeemedCount?: number;
  redeemedCount?: number;
  voidedCount?: number;
}

export interface Coupon {
  couponCode?: string;
  amount?: number;
  status?: string;
  expireDeadline?: string;
}

export interface CouponVo {
  count?: CouponCount;
  coupons?: Coupon[];
}

export async function getCoupons(): Promise<CouponVo> {
  const data = await apiCall<{ code: number; data: CouponVo }>("GET", "/console/wallet/coupon/list");
  return data.data;
}

// --- Corporate Info ---

export interface CorporateInfo {
  accountName?: string;
  bankName?: string;
  accountNo?: string;
  bankCode?: string;
}

export async function getCorporateInfo(): Promise<CorporateInfo> {
  const data = await apiCall<{ code: number; data: CorporateInfo }>("GET", "/console/wallet/recharge/corporate/info");
  return data.data;
}
