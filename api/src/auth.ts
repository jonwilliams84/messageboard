import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { randomBytes, timingSafeEqual } from "node:crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const API_KEY = process.env.API_KEY ?? "";
const tokens = new Set<string>();

export function isAuthConfigured(): boolean {
  return ADMIN_PASSWORD.length > 0 || API_KEY.length > 0;
}

export function login(password: string): string | null {
  if (!ADMIN_PASSWORD && !API_KEY) return "dev-token";
  if (!ADMIN_PASSWORD) return null;
  if (!safeEqual(password, ADMIN_PASSWORD)) return null;
  const token = randomBytes(24).toString("hex");
  tokens.add(token);
  return token;
}

export const requireAuth = createMiddleware(async (c, next) => {
  if (!isAuthConfigured()) return next();
  const header = c.req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new HTTPException(401, { message: "unauthorized" });
  if (API_KEY && safeEqual(token, API_KEY)) return next();
  if (tokens.has(token)) return next();
  throw new HTTPException(401, { message: "unauthorized" });
});

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
