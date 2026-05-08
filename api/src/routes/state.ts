import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { getState, setState } from "../db.js";
import { publish, subscribe } from "../events.js";
import { requireAuth } from "../auth.js";
import { Background, BoardAnimation, BoardState, Line, Texture } from "../types.js";

const app = new Hono();

const TEXTURES: Texture[] = ["none", "dots", "stripes", "grid", "noise"];
const ANIMATIONS: BoardAnimation[] = ["none", "pan", "pulse", "shimmer"];

app.get("/", (c) => c.json(getState()));

app.post("/", requireAuth, async (c) => {
  const body = await c.req.json<Partial<BoardState>>();
  const current = getState();
  const next: BoardState = {
    lines: validateLines(body.lines) ?? current.lines,
    background: validateBackground(body.background) ?? current.background,
    texture: TEXTURES.includes(body.texture as Texture) ? (body.texture as Texture) : current.texture,
    animation: ANIMATIONS.includes(body.animation as BoardAnimation) ? (body.animation as BoardAnimation) : current.animation,
    defaultFont: typeof body.defaultFont === "string" && body.defaultFont ? body.defaultFont : current.defaultFont,
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
    if (r.font !== undefined && r.font !== null && typeof r.font !== "string") return null;
    lines.push({
      id: r.id,
      text: r.text.slice(0, 64),
      color: typeof r.color === "string" ? r.color : null,
      font: typeof r.font === "string" ? r.font : null,
    });
  }
  return lines;
}

function validateBackground(input: unknown): Background | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;
  if (b.type === "solid" && typeof b.color === "string") return { type: "solid", color: b.color };
  if (b.type === "linear" && typeof b.from === "string" && typeof b.to === "string") {
    const angle = typeof b.angle === "number" ? b.angle : 90;
    return { type: "linear", from: b.from, to: b.to, angle };
  }
  if (b.type === "radial" && typeof b.from === "string" && typeof b.to === "string") {
    return { type: "radial", from: b.from, to: b.to };
  }
  return null;
}

export default app;
