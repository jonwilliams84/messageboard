import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { BoardState, DEFAULT_STATE } from "./types.js";

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
  return JSON.parse(row.json) as BoardState;
}

export function setState(state: BoardState): BoardState {
  const stamped = { ...state, updatedAt: Date.now() };
  setStmt.run(JSON.stringify(stamped), stamped.updatedAt);
  return stamped;
}
