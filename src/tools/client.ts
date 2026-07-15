import { loadConfig } from "../env.js";
import { tryRelogin } from "./auth.js";

interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

interface TableDataInfo<T = unknown> {
  code: number;
  msg: string;
  total: number;
  rows: T[];
}

// ── Token management ──

let currentToken: string | undefined = loadConfig().accessToken;

export function getToken(): string | undefined {
  return currentToken;
}

export function setToken(token: string): void {
  currentToken = token;
}

// ── Helpers ──

function getBaseUrl(): string {
  const config = loadConfig();
  return config.baseUrl.replace(/\/+$/, "");
}

function getAuthHeaders(): Record<string, string> {
  const token = currentToken ?? loadConfig().accessToken;
  if (!token) {
    throw new Error("未登录，请先使用 login 工具登录，或在环境变量中配置 TUS_ACCESS_TOKEN");
  }
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * 判断错误是否为认证相关错误（token 过期、无效等）
 */
function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  // HTTP 401
  if (msg.includes("401")) return true;
  // 业务错误关键词
  const authKeywords = ["token", "认证", "登录", "过期", "expired", "unauthorized", "无效"];
  return authKeywords.some((kw) => msg.includes(kw));
}

/**
 * 尝试自动重新登录并重试请求
 * 如果配置了用户名密码且当前错误是认证错误，则重新登录后重试一次
 */
async function withAutoRetry<T>(requestFn: () => Promise<T>): Promise<T> {
  try {
    return await requestFn();
  } catch (err) {
    if (!isAuthError(err)) {
      throw err;
    }
    // 尝试用用户名密码重新登录
    const reloggedIn = await tryRelogin();
    if (!reloggedIn) {
      throw err; // 无法重试，抛出原始错误
    }
    // 用新 token 重试
    return await requestFn();
  }
}

/**
 * 发起 GET 请求
 */
export async function apiGet<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  return withAutoRetry(async () => {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          query.append(key, value);
        }
      }
    }
    const qs = query.toString();
    const url = `${getBaseUrl()}${path}${qs ? "?" + qs : ""}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const json: ApiResponse<T> = JSON.parse(text);
      if (json.code !== 200) {
        throw new Error(`API error (${json.code}): ${json.msg}`);
      }
      // 兼容 R<> 格式（有 data 字段）和 AjaxResult 格式（无 data 字段）
      if ('data' in json) {
        return json.data;
      }
      return json;
    } finally {
      clearTimeout(timeout);
    }
  });
}

/**
 * 发起 GET 请求，返回分页数据（TableDataInfo 格式）
 */
export async function apiGetPage<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<TableDataInfo<T>> {
  return withAutoRetry(async () => {
    const query = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          query.append(key, value);
        }
      }
    }
    const qs = query.toString();
    const url = `${getBaseUrl()}${path}${qs ? "?" + qs : ""}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const json = JSON.parse(text);
      if (json.code !== undefined && json.code !== 200 && json.code !== 0) {
        throw new Error(`API error (${json.code}): ${json.msg}`);
      }
      return json as TableDataInfo<T>;
    } finally {
      clearTimeout(timeout);
    }
  });
}

/**
 * 发起 POST 请求（携带 Authorization 头）
 */
export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  return withAutoRetry(async () => {
    const url = `${getBaseUrl()}${path}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const json: ApiResponse<T> = JSON.parse(text);
      if (json.code !== 200) {
        throw new Error(`API error (${json.code}): ${json.msg}`);
      }
      return json.data;
    } finally {
      clearTimeout(timeout);
    }
  });
}

/**
 * 发起 POST 请求，不携带 Authorization 头，返回完整 JSON 响应
 * 用于登录等无需认证的接口
 */
export async function apiPostRaw(path: string, body?: unknown): Promise<Record<string, unknown>> {
  const url = `${getBaseUrl()}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return JSON.parse(text) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
}
