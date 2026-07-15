import { apiPostRaw, setToken, getToken } from "./client.js";
import { loadConfig } from "../env.js";
import { aesEncrypt } from "./crypto.js";

// ---- 工具定义 ----
export const tools = [
  {
    name: "login",
    description:
      "使用用户名（或手机号）和密码登录系统，获取访问令牌。" +
      "登录成功后后续请求将自动使用该令牌。",
    inputSchema: {
      type: "object" as const,
      properties: {
        username: { type: "string", description: "用户名或手机号" },
        password: { type: "string", description: "密码" },
      },
      required: ["username", "password"],
    },
  },
  {
    name: "get_token_status",
    description: "查看当前认证状态（是否已登录、token 来源）",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
];

// ---- 处理函数 ----
export async function handle(name: string, args: Record<string, string>): Promise<unknown> {
  switch (name) {
    case "login":
      return doLogin(args.username, args.password);
    case "get_token_status":
      return getTokenStatus();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ---- 内部函数 ----

/**
 * 执行密码登录
 * POST /console/user/login
 * 前端 request 拦截器会将整个 JSON body AES 加密后以 { data: "<base64>" } 发送，
 * 后端有对应的解密过滤器还原原始 body。MCP 需模拟相同行为。
 * 响应格式: { code: 200, msg: "操作成功", token: "eyJ..." }
 */
export async function doLogin(username: string, password: string): Promise<unknown> {
  // 构造原始请求体（与前端登录组件一致）
  const plainBody = { username, password, loginSms: false };
  // AES-128-CBC 加密整个 JSON body → Base64
  const encryptedData = aesEncrypt(JSON.stringify(plainBody));
  // 以 { data: "<encrypted>" } 格式发送（与前端 request.js 拦截器行为一致）
  const response = await apiPostRaw("/console/user/login", { data: encryptedData });

  // Debug: 打印完整后端响应
  if (process.env.TUS_DEBUG) {
    console.error("[MCP-DEBUG] login 响应:", JSON.stringify(response).slice(0, 1000));
  }

  // 兼容多种响应格式：
  // 格式1: { code: 200, msg: "操作成功", token: "eyJ..." }  (AjaxResult.put)
  // 格式2: { code: 200, msg: "操作成功", data: { token: "eyJ..." } }
  // 格式3: { code: 200, data: "eyJ..." }  (token 直接作为 data)
  const code = response.code as number | undefined;
  if (code !== undefined && code !== 200) {
    throw new Error(`登录失败 (${code}): ${response.msg}`);
  }

  // 从多个位置尝试获取 token
  const token = (
    response.token as string | undefined
  ) ?? (
    (response.data as Record<string, unknown> | undefined)?.token as string | undefined
  ) ?? (
    typeof response.data === "string" ? response.data : undefined
  );

  if (!token) {
    // 打印完整响应帮助调试
    const keys = Object.keys(response);
    throw new Error(`登录成功但未返回 token，响应字段: [${keys.join(", ")}]，完整响应: ${JSON.stringify(response).slice(0, 500)}`);
  }

  setToken(token);

  return {
    success: true,
    message: "登录成功，后续请求将自动使用该令牌",
    user: username,
  };
}

/**
 * 尝试使用环境变量中的用户名密码自动登录
 * 返回 true 表示登录成功，false 表示跳过（无凭据或已有 token）
 */
export async function tryAutoLogin(): Promise<boolean> {
  const config = loadConfig();

  // 已有 token 则跳过
  if (getToken()) {
    return false;
  }

  // 无用户名密码则跳过
  if (!config.username || !config.password) {
    return false;
  }

  await doLogin(config.username, config.password);
  return true;
}

/**
 * 强制使用环境变量中的用户名密码重新登录（用于 token 失效后的自动恢复）
 * 返回 true 表示登录成功，false 表示无法重试（未配置凭据）
 */
export async function tryRelogin(): Promise<boolean> {
  const config = loadConfig();

  if (!config.username || !config.password) {
    return false;
  }

  await doLogin(config.username, config.password);
  return true;
}

function getTokenStatus(): unknown {
  const token = getToken();
  const config = loadConfig();

  return {
    authenticated: !!token,
    tokenSource: token
      ? config.accessToken === token
        ? "环境变量 (TUS_ACCESS_TOKEN)"
        : "登录获取"
      : "无",
    hasCredentials: !!(config.username && config.password),
  };
}
