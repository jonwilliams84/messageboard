import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { getState, setState } from "../db.js";
import { publish, subscribe } from "../events.js";
import { requireAuth } from "../auth.js";
import { mergeState, validateLines } from "../state-merge.js";

const app = new Hono();

app.get("/", (c) => c.json(getState()));

app.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const lines = body.lines === undefined ? undefined : validateLines(body.lines);
  if (body.lines !== undefined && lines === null) {
    return c.json({ error: "invalid lines" }, 400);
  }
  const next = mergeState(body, getState(), lines);
  const saved = setState(next);
  publish(saved);
  return c.json(saved);
});

app.get("/events", (c) =>
  streamSSE(c, async (stream) => {
    await stream.writeSSE({ event: "state", data: JSON.stringify(getState()) });
    const unsubscribe = subscribe((data) => {
      void stream.writeSSE({ event: "state", data });
    });
    const keepalive = setInterval(() => {
      void stream.writeSSE({ event: "ping", data: "" });
    }, 25_000);
    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        clearInterval(keepalive);
        unsubscribe();
        resolve();
      });
    });
  })
);

export default app;
