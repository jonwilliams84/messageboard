import { Hono } from "hono";
import { mkdirSync, createReadStream, existsSync, statSync } from "node:fs";
import { writeFile, readdir, unlink } from "node:fs/promises";
import { extname, join, basename } from "node:path";
import { randomBytes } from "node:crypto";
import { Readable } from "node:stream";
import { requireAuth } from "../auth.js";

const IMAGE_DIR = process.env.IMAGE_DIR ?? "./data/images";
mkdirSync(IMAGE_DIR, { recursive: true });

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);
const MAX_BYTES = 10 * 1024 * 1024;

const app = new Hono();

app.get("/", async (c) => {
  const files = await readdir(IMAGE_DIR);
  return c.json(files.filter((f) => ALLOWED.has(extname(f).toLowerCase())));
});

app.get("/:name", (c) => {
  const name = basename(c.req.param("name"));
  const path = join(IMAGE_DIR, name);
  if (!existsSync(path)) return c.notFound();
  const ext = extname(name).toLowerCase();
  const mime =
    ext === ".png" ? "image/png" :
    ext === ".gif" ? "image/gif" :
    ext === ".webp" ? "image/webp" :
    "image/jpeg";
  c.header("Content-Type", mime);
  c.header("Cache-Control", "public, max-age=31536000, immutable");
  c.header("Content-Length", String(statSync(path).size));
  return c.body(Readable.toWeb(createReadStream(path)) as unknown as ReadableStream);
});

app.post("/", requireAuth, async (c) => {
  const form = await c.req.parseBody();
  const file = form["file"];
  if (!(file instanceof File)) return c.json({ error: "file required" }, 400);
  if (file.size > MAX_BYTES) return c.json({ error: "too large" }, 413);
  const ext = extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) return c.json({ error: "unsupported type" }, 415);
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await writeFile(join(IMAGE_DIR, name), Buffer.from(await file.arrayBuffer()));
  return c.json({ name });
});

app.delete("/:name", requireAuth, async (c) => {
  const name = basename(c.req.param("name"));
  const path = join(IMAGE_DIR, name);
  if (!existsSync(path)) return c.notFound();
  await unlink(path);
  return c.json({ ok: true });
});

export default app;
