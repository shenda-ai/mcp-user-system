import { loadConfig } from "../env.js";
import { tryRelogin } from "./auth.js";
import { aesEncrypt } from "./crypto.js";

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

// ── Debug logging ──

function debugLog(label: string, ...args: unknown[]): void {
  if (process.env.TUS_DEBUG) {
    console.error(`[MCP-DEBUG] ${label}`, ...args);
  }
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
  // 后端所有接口均在 /api 路径下
  return config.baseUrl.replace(/\/+$/, "") + "/api";
}

// ── 标准请求头（与前端 request.js 拦截器一致） ──

const COMMON_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Crypto-Version": "1.0.0",
  "accountType": "S_",
  "platformType": "WEB_",
  "DeviceType": "browser",
};

function getAuthHeaders(): Record<string, string> {
  const token = currentToken ?? loadConfig().accessToken;
  if (!token) {
    throw new Error("未登录，请先使用 login 工具登录，或在环境变量中配置 TUS_ACCESS_TOKEN");
  }
  return {
    ...COMMON_HEADERS,
    "Authorization": `Bearer ${token}`,
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
 * 与前端 request.js 一致：params 加密后作为 ?data=<encrypted> 发送
 */
export async function apiGet<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  return withAutoRetry(async () => {
    // 构建参数对象（过滤空值）
    const cleanParams: Record<string, string> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          cleanParams[key] = value;
        }
      }
    }
    // 加密参数：JSON → AES → Base64 → ?data=<encrypted>
    // 注意：与前端一致，不做 encodeURIComponent，后端用 replace(" ","+") 补偿
    const hasParams = Object.keys(cleanParams).length > 0;
    const url = hasParams
      ? `${getBaseUrl()}${path}?data=${aesEncrypt(JSON.stringify(cleanParams))}`
      : `${getBaseUrl()}${path}`;
    debugLog(`GET ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const text = await res.text();
      debugLog(`GET ${path} → ${res.status}`, text.slice(0, 500));
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
 * 与前端 request.js 一致：params 加密后作为 ?data=<encrypted> 发送
 */
export async function apiGetPage<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<TableDataInfo<T>> {
  return withAutoRetry(async () => {
    // 构建参数对象（过滤空值）
    const cleanParams: Record<string, string> = {};
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
          cleanParams[key] = value;
        }
      }
    }
    // 加密参数：JSON → AES → Base64 → ?data=<encrypted>
    // 注意：与前端一致，不做 encodeURIComponent，后端用 replace(" ","+") 补偿
    const hasParams = Object.keys(cleanParams).length > 0;
    const url = hasParams
      ? `${getBaseUrl()}${path}?data=${aesEncrypt(JSON.stringify(cleanParams))}`
      : `${getBaseUrl()}${path}`;
    debugLog(`GET(page) ${url}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
        signal: controller.signal,
      });

      const text = await res.text();
      debugLog(`GET(page) ${path} → ${res.status}`, text.slice(0, 500));
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
 * 与前端 request.js 一致：body 加密后以 { data: "<encrypted>" } 发送
 */
export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  return withAutoRetry(async () => {
    const url = `${getBaseUrl()}${path}`;
    // 加密 body：JSON → AES → Base64 → { data: "<encrypted>" }
    const encryptedBody = body
      ? { data: aesEncrypt(JSON.stringify(body)) }
      : undefined;
    const bodyStr = encryptedBody ? JSON.stringify(encryptedBody) : undefined;
    debugLog(`POST ${url}`, body ? `原始: ${JSON.stringify(body).slice(0, 300)}` : "(无body)");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: bodyStr,
        signal: controller.signal,
      });

      const text = await res.text();
      debugLog(`POST ${path} → ${res.status}`, text.slice(0, 500));
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
  const bodyStr = body ? JSON.stringify(body) : undefined;
  debugLog(`POST(raw) ${url}`, bodyStr?.slice(0, 500));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: COMMON_HEADERS,
      body: bodyStr,
      signal: controller.signal,
    });

    const text = await res.text();
    debugLog(`POST(raw) ${path} → ${res.status}`, text.slice(0, 500));
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return JSON.parse(text) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
}
