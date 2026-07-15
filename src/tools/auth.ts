import { apiGetRaw, apiPostRaw, setToken, getToken } from "./client.js";
import { loadConfig } from "../env.js";
import { aesEncrypt } from "./crypto.js";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

// ---- 工具定义 ----
export const tools = [
  {
    name: "fetch_captcha",
    description:
      "获取图形验证码。返回验证码图片路径和 uuid。" +
      "调用后请用 Read 工具查看图片内容（通常是简单的数学计算题），算出答案后调用 login 工具登录。",
    inputSchema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "login",
    description:
      "使用用户名、密码和验证码登录系统。" +
      "需先调用 fetch_captcha 获取 uuid，再识别验证码图片得出答案后调用此工具。" +
      "登录成功后后续请求将自动使用该令牌。",
    inputSchema: {
      type: "object" as const,
      properties: {
        username: { type: "string", description: "用户名或手机号" },
        password: { type: "string", description: "密码" },
        captchaCode: { type: "string", description: "验证码计算结果（如数学题 3+5=? 则填 8）" },
        uuid: { type: "string", description: "验证码对应的 uuid（来自 fetch_captcha）" },
      },
      required: ["username", "password", "captchaCode", "uuid"],
    },
  },
  {
    name: "set_access_token",
    description:
      "直接设置或更新访问令牌（JWT token）。" +
      "适用于已有 token 的场景，token 失效时可随时调用此工具更新，无需重启服务。",
    inputSchema: {
      type: "object" as const,
      properties: {
        token: { type: "string", description: "JWT 访问令牌（以 eyJ 开头）" },
      },
      required: ["token"],
    },
  },
  {
    name: "get_token_status",
    description: "查看当前认证状态（是否已设置 token、token 来源）",
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
    case "fetch_captcha":
      return doFetchCaptcha();
    case "login":
      return doLogin(args.username, args.password, args.captchaCode, args.uuid);
    case "set_access_token":
      return doSetToken(args.token);
    case "get_token_status":
      return getTokenStatus();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// ---- 内部函数 ----

/**
 * 获取图形验证码
 * GET /captchaImage → { code: 200, captchaEnabled: true, uuid: "...", img: "<base64>" }
 * 将 base64 图片保存到临时文件，返回文件路径和 uuid
 */
async function doFetchCaptcha(): Promise<unknown> {
  const response = await apiGetRaw("/captchaImage");

  const captchaEnabled = response.captchaEnabled as boolean | undefined;
  if (!captchaEnabled) {
    return {
      captchaEnabled: false,
      message: "验证码未启用，可直接调用 login 工具登录（captchaCode 和 uuid 传空字符串）",
      uuid: "",
      imagePath: "",
    };
  }

  const img = response.img as string | undefined;
  const uuid = response.uuid as string | undefined;

  if (!img || !uuid) {
    throw new Error("验证码接口返回数据异常：缺少 img 或 uuid 字段");
  }

  // 将 base64 图片保存到临时文件
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `captcha_${uuid}.jpg`);
  fs.writeFileSync(tmpFile, Buffer.from(img, "base64"));

  return {
    captchaEnabled: true,
    uuid,
    imagePath: tmpFile,
    message: "验证码已获取，请用 Read 工具查看图片内容，识别数学算式并计算结果，然后调用 login 工具登录",
  };
}

/**
 * 执行密码登录（含验证码）
 * POST /console/user/login
 * 前端 request 拦截器会将整个 JSON body AES 加密后以 { data: "<base64>" } 发送
 */
async function doLogin(
  username: string,
  password: string,
  captchaCode: string,
  uuid: string
): Promise<unknown> {
  // 构造原始请求体（与前端登录组件一致）
  const plainBody = {
    username,
    password,
    code: captchaCode,
    uuid: uuid || "",
    loginSms: false,
  };

  // AES-128-CBC 加密整个 JSON body → Base64
  const encryptedData = aesEncrypt(JSON.stringify(plainBody));

  // 以 { data: "<encrypted>" } 格式发送
  const response = await apiPostRaw("/console/user/login", { data: encryptedData });

  const code = response.code as number | undefined;
  if (code !== undefined && code !== 200) {
    throw new Error(`登录失败 (${code}): ${response.msg}`);
  }

  // 从多个位置尝试获取 token
  const token =
    (response.token as string | undefined) ??
    ((response.data as Record<string, unknown> | undefined)?.token as string | undefined) ??
    (typeof response.data === "string" ? response.data : undefined);

  if (!token) {
    const keys = Object.keys(response);
    throw new Error(
      `登录成功但未返回 token，响应字段: [${keys.join(", ")}]，完整响应: ${JSON.stringify(response).slice(0, 500)}`
    );
  }

  setToken(token);

  return {
    success: true,
    message: "登录成功，后续请求将自动使用该令牌",
    user: username,
  };
}

function doSetToken(token: string): unknown {
  if (!token || !token.startsWith("eyJ")) {
    throw new Error("无效的 token，应提供以 eyJ 开头的 JWT 令牌");
  }
  setToken(token);
  return {
    success: true,
    message: "令牌已更新，后续请求将自动使用该令牌",
    tokenPreview: token.slice(0, 20) + "...",
  };
}

function getTokenStatus(): unknown {
  const token = getToken();
  const config = loadConfig();

  return {
    authenticated: !!token,
    tokenSource: token
      ? config.accessToken === token
        ? "环境变量 (TUS_ACCESS_TOKEN)"
        : "对话中设置"
      : "未设置",
  };
}
