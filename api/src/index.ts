import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import state from "./routes/state.js";
import messages from "./routes/messages.js";
import images from "./routes/images.js";
import auth from "./routes/auth.js";

const app = new Hono();
app.use("*", logger());
app.use("/api/*", cors());

app.route("/api/state", state);
app.route("/api/messages", messages);
app.route("/api/images", images);
app.route("/api/auth", auth);
app.get("/api/health", (c) => c.json({ ok: true }));

const STATIC_DIR = process.env.STATIC_DIR ?? "../web/dist";
if (existsSync(STATIC_DIR)) {
  app.use("/*", serveStatic({ root: STATIC_DIR }));
  app.get("*", async (c) => {
    const html = await readFile(`${STATIC_DIR}/index.html`, "utf8");
    return c.html(html);
  });
}

const port = Number(process.env.PORT ?? 42069);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`messageboard api listening on http://localhost:${info.port}`);
});
