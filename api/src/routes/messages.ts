import { Hono } from "hono";
import { getState, setState } from "../db.js";
import { publish } from "../events.js";
import { requireAuth } from "../auth.js";
import { expandShorthandLines, mergeState } from "../state-merge.js";

const app = new Hono();

app.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body || typeof body !== "object") return c.json({ error: "invalid body" }, 400);

  const lines = body.lines === undefined ? undefined : expandShorthandLines(body.lines);
  if (body.lines !== undefined && lines === null) {
    return c.json({ error: "invalid lines (expected string[] or {text,color?,font?,textEffect?}[])" }, 400);
  }

  const next = mergeState(body, getState(), lines);
  const saved = setState(next);
  publish(saved);
  return c.json(saved);
});

export default app;
