import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { getState, setState } from "../db.js";
import { publish, subscribe } from "../events.js";
import { requireAuth } from "../auth.js";
import { BoardState, Line } from "../types.js";

const app = new Hono();

app.get("/", (c) => c.json(getState()));

app.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<BoardState>>();
  const current = getState();
  const next: BoardState = {
    lines: validateLines(body.lines) ?? current.lines,
    backgroundColor: typeof body.backgroundColor === "string" ? body.backgroundColor : current.backgroundColor,
    photoMode: typeof body.photoMode === "boolean" ? body.photoMode : current.photoMode,
    imageName: body.imageName === undefined ? current.imageName : body.imageName,
    updatedAt: 0,
  };
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

function validateLines(input: unknown): Line[] | null {
  if (!Array.isArray(input)) return null;
  const lines: Line[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.text !== "string") return null;
    if (r.color !== null && typeof r.color !== "string") return null;
    lines.push({ id: r.id, text: r.text.slice(0, 64), color: r.color });
  }
  return lines;
}

export default app;
