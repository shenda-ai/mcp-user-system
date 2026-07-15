import { apiPostRaw, setToken, getToken } from "./client.js";
import { loadConfig } from "../env.js";

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
 * POST /console/user/login  body: { username, password, loginSms: false }
 * 响应格式: { code: 200, msg: "操作成功", token: "eyJ..." }
 */
export async function doLogin(username: string, password: string): Promise<unknown> {
  const response = await apiPostRaw("/console/user/login", {
    username,
    password,
    loginSms: false,
  });

  if (response.code !== 200) {
    throw new Error(`登录失败 (${response.code}): ${response.msg}`);
  }

  const token = response.token as string | undefined;
  if (!token) {
    throw new Error("登录成功但未返回 token");
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
