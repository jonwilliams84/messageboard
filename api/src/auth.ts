import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { randomBytes, timingSafeEqual } from "node:crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const tokens = new Set<string>();

export function isAuthConfigured(): boolean {
  return ADMIN_PASSWORD.length > 0;
}

export function login(password: string): string | null {
  if (!isAuthConfigured()) return "dev-token";
  const a = Buffer.from(password.padEnd(ADMIN_PASSWORD.length).slice(0, ADMIN_PASSWORD.length));
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const token = randomBytes(24).toString("hex");
  tokens.add(token);
  return token;
}

export const requireAuth = createMiddleware(async (c, next) => {
  if (!isAuthConfigured()) return next();
  const header = c.req.header("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !tokens.has(token)) {
    throw new HTTPException(401, { message: "unauthorized" });
  }
  await next();
});
