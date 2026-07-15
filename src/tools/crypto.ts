/**
 * AES-128-CBC 加密工具（与前端 crypto-js 保持一致）
 *
 * Key: 'Kvz4P00D79JiXdM8' (16 字节)
 * IV: 同 Key
 * Padding: PKCS7
 * 输出: Base64
 */
import { createCipheriv } from "crypto";

const AES_KEY = "Kvz4P00D79JiXdM8";

export function aesEncrypt(data: string): string {
  const key = Buffer.from(AES_KEY, "latin1");
  const iv = key; // 前端 iv = key
  const cipher = createCipheriv("aes-128-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(data, "utf8"), cipher.final()]);
  return encrypted.toString("base64");
}
