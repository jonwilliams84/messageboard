import { randomUUID } from "node:crypto";
import { Background, BoardAnimation, BoardState, Line, TextEffect, Texture } from "./types.js";

export const TEXTURES: Texture[] = [
  "none", "dots", "stripes", "grid", "noise", "paper", "fabric", "clouds", "tarmac",
];
export const ANIMATIONS: BoardAnimation[] = ["none", "pan", "pulse", "shimmer"];
export const TEXT_EFFECTS: TextEffect[] = ["none", "shadow", "emboss", "engrave", "outline", "glow"];

export type ShorthandLine =
  | string
  | {
      text: string;
      color?: string | null;
      font?: string | null;
      textEffect?: TextEffect | null;
    };

/**
 * Merge a partial-state body onto current state. Unknown or invalid sub-fields
 * fall back to current; lines must be passed in already-validated (or
 * undefined to keep existing).
 */
export function mergeState(body: Record<string, unknown>, current: BoardState, lines: Line[] | null | undefined): BoardState {
  return {
    lines: lines ?? current.lines,
    background: validateBackground(body.background) ?? current.background,
    texture: TEXTURES.includes(body.texture as Texture) ? (body.texture as Texture) : current.texture,
    animation: ANIMATIONS.includes(body.animation as BoardAnimation) ? (body.animation as BoardAnimation) : current.animation,
    defaultFont: typeof body.defaultFont === "string" && body.defaultFont ? body.defaultFont : current.defaultFont,
    defaultTextEffect: TEXT_EFFECTS.includes(body.defaultTextEffect as TextEffect)
      ? (body.defaultTextEffect as TextEffect)
      : current.defaultTextEffect,
    photoMode: typeof body.photoMode === "boolean" ? body.photoMode : current.photoMode,
    imageName:
      body.imageName === undefined
        ? current.imageName
        : typeof body.imageName === "string"
          ? body.imageName
          : null,
    updatedAt: 0,
  };
}

export function validateLines(input: unknown): Line[] | null {
  if (!Array.isArray(input)) return null;
  const out: Line[] = [];
  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.text !== "string") return null;
    if (r.color !== null && r.color !== undefined && typeof r.color !== "string") return null;
    if (r.font !== null && r.font !== undefined && typeof r.font !== "string") return null;
    if (
      r.textEffect !== null &&
      r.textEffect !== undefined &&
      !TEXT_EFFECTS.includes(r.textEffect as TextEffect)
    )
      return null;
    out.push({
      id: r.id,
      text: r.text.slice(0, 64),
      color: typeof r.color === "string" ? r.color : null,
      font: typeof r.font === "string" ? r.font : null,
      textEffect: TEXT_EFFECTS.includes(r.textEffect as TextEffect) ? (r.textEffect as TextEffect) : null,
    });
  }
  return out;
}

export function expandShorthandLines(input: unknown): Line[] | null {
  if (!Array.isArray(input)) return null;
  const out: Line[] = [];
  for (const raw of input) {
    if (typeof raw === "string") {
      out.push({ id: randomUUID(), text: raw.slice(0, 64), color: null, font: null, textEffect: null });
      continue;
    }
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (typeof r.text !== "string") return null;
    if (r.color !== null && r.color !== undefined && typeof r.color !== "string") return null;
    if (r.font !== null && r.font !== undefined && typeof r.font !== "string") return null;
    if (
      r.textEffect !== null &&
      r.textEffect !== undefined &&
      !TEXT_EFFECTS.includes(r.textEffect as TextEffect)
    )
      return null;
    out.push({
      id: randomUUID(),
      text: r.text.slice(0, 64),
      color: typeof r.color === "string" ? r.color : null,
      font: typeof r.font === "string" ? r.font : null,
      textEffect: TEXT_EFFECTS.includes(r.textEffect as TextEffect) ? (r.textEffect as TextEffect) : null,
    });
  }
  return out;
}

export function validateBackground(input: unknown): Background | null {
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
