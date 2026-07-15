import { loadConfig } from "../env.js";

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

function getBaseUrl(): string {
  const config = loadConfig();
  return config.baseUrl.replace(/\/+$/, "");
}

/**
 * 发起 GET 请求
 */
export async function apiGet<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const config = loadConfig();
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
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
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
}

/**
 * 发起 GET 请求，返回分页数据（TableDataInfo 格式）
 */
export async function apiGetPage<T = unknown>(path: string, params?: Record<string, string | undefined>): Promise<TableDataInfo<T>> {
  const config = loadConfig();
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
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
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
}

/**
 * 发起 POST 请求
 */
export async function apiPost<T = unknown>(path: string, body?: unknown): Promise<T> {
  const config = loadConfig();
  const url = `${getBaseUrl()}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
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
}
