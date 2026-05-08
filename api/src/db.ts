import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { Background, BoardAnimation, BoardState, DEFAULT_FONT, DEFAULT_STATE, Line, Texture } from "./types.js";

const DB_PATH = process.env.DB_PATH ?? "./data/messageboard.db";

mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS board_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    json TEXT NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const getStmt = db.prepare<[], { json: string }>("SELECT json FROM board_state WHERE id = 1");
const setStmt = db.prepare<[string, number]>(
  "INSERT INTO board_state (id, json, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET json = excluded.json, updated_at = excluded.updated_at"
);

export function getState(): BoardState {
  const row = getStmt.get();
  if (!row) return DEFAULT_STATE;
  return migrate(JSON.parse(row.json));
}

export function setState(state: BoardState): BoardState {
  const stamped = { ...state, updatedAt: Date.now() };
  setStmt.run(JSON.stringify(stamped), stamped.updatedAt);
  return stamped;
}

const TEXTURES: Texture[] = ["none", "dots", "stripes", "grid", "noise"];
const ANIMATIONS: BoardAnimation[] = ["none", "pan", "pulse", "shimmer"];

function migrate(raw: unknown): BoardState {
  const r = (raw ?? {}) as Record<string, unknown>;
  const lines: Line[] = Array.isArray(r.lines)
    ? (r.lines as unknown[]).map((l, i) => migrateLine(l, i))
    : DEFAULT_STATE.lines;
  return {
    lines,
    background: migrateBackground(r),
    texture: TEXTURES.includes(r.texture as Texture) ? (r.texture as Texture) : "none",
    animation: ANIMATIONS.includes(r.animation as BoardAnimation) ? (r.animation as BoardAnimation) : "none",
    defaultFont: typeof r.defaultFont === "string" && r.defaultFont ? r.defaultFont : DEFAULT_FONT,
    photoMode: r.photoMode === true,
    imageName: typeof r.imageName === "string" ? r.imageName : null,
    updatedAt: typeof r.updatedAt === "number" ? r.updatedAt : 0,
  };
}

function migrateLine(raw: unknown, i: number): Line {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === "string" ? r.id : `l${i + 1}`,
    text: typeof r.text === "string" ? r.text : "",
    color: typeof r.color === "string" ? r.color : null,
    font: typeof r.font === "string" ? r.font : null,
  };
}

function migrateBackground(r: Record<string, unknown>): Background {
  const bg = r.background as Record<string, unknown> | undefined;
  if (bg && typeof bg === "object") {
    if (bg.type === "linear" && typeof bg.from === "string" && typeof bg.to === "string") {
      return { type: "linear", from: bg.from, to: bg.to, angle: typeof bg.angle === "number" ? bg.angle : 90 };
    }
    if (bg.type === "radial" && typeof bg.from === "string" && typeof bg.to === "string") {
      return { type: "radial", from: bg.from, to: bg.to };
    }
    if (bg.type === "solid" && typeof bg.color === "string") {
      return { type: "solid", color: bg.color };
    }
  }
  if (typeof r.backgroundColor === "string") {
    return { type: "solid", color: r.backgroundColor };
  }
  return DEFAULT_STATE.background;
}
