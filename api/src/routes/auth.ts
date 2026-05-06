import { Hono } from "hono";
import { isAuthConfigured, login } from "../auth.js";

const app = new Hono();

app.get("/config", (c) => c.json({ required: isAuthConfigured() }));

app.post("/login", async (c) => {
  const body = await c.req.json<{ password?: string }>().catch(() => ({} as { password?: string }));
  const token = login(body.password ?? "");
  if (!token) return c.json({ error: "invalid password" }, 401);
  return c.json({ token });
});

export default app;
