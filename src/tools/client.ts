import { loadConfig } from "../env.js";
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

// ── Token 管理（支持对话中动态更新） ──

let currentToken: string | undefined = loadConfig().accessToken;

export function getToken(): string | undefined {
  return currentToken;
}

export function setToken(token: string): void {
  currentToken = token;
}

// ── Debug logging ──

function debugLog(label: string, ...args: unknown[]): void {
  if (process.env.TUS_DEBUG) {
    console.error(`[MCP-DEBUG] ${label}`, ...args);
  }
}

// ── Helpers ──

function getBaseUrl(): string {
  const config = loadConfig();
  return config.baseUrl.replace(/\/+$/, "");
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
    throw new Error("未配置访问令牌，请使用 set_access_token 工具设置 token，或在环境变量中配置 TUS_ACCESS_TOKEN");
  }
  return {
    ...COMMON_HEADERS,
    "Authorization": `Bearer ${token}`,
  };
}

/**
 * 发起 GET 请求
 * 与前端 request.js 一致：params 加密后作为 ?data=<encrypted> 发送
 */
export async function apiGet<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const cleanParams: Record<string, string> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        cleanParams[key] = value;
      }
    }
  }
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
}

/**
 * 发起 GET 请求，返回分页数据（TableDataInfo 格式）
 * 与前端 request.js 一致：params 加密后作为 ?data=<encrypted> 发送
 */
export async function apiGetPage<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<TableDataInfo<T>> {
  const cleanParams: Record<string, string> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        cleanParams[key] = value;
      }
    }
  }
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
}

/**
 * 发起 POST 请求（携带 Authorization 头）
 * 与前端 request.js 一致：body 加密后以 { data: "<encrypted>" } 发送
 */
export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
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
}

/**
 * 发起 GET 请求，不携带 Authorization 头，返回完整 JSON 响应
 * 用于验证码等无需认证的接口
 */
export async function apiGetRaw(path: string): Promise<Record<string, unknown>> {
  const url = `${getBaseUrl()}${path}`;
  debugLog(`GET(raw) ${url}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: COMMON_HEADERS,
      signal: controller.signal,
    });

    const text = await res.text();
    debugLog(`GET(raw) ${path} → ${res.status}`, text.slice(0, 500));
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return JSON.parse(text) as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
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
