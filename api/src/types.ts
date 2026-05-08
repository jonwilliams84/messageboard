export type SolidBackground = { type: "solid"; color: string };
export type LinearBackground = { type: "linear"; from: string; to: string; angle: number };
export type RadialBackground = { type: "radial"; from: string; to: string };
export type Background = SolidBackground | LinearBackground | RadialBackground;

export type Texture = "none" | "dots" | "stripes" | "grid" | "noise" | "paper" | "fabric" | "clouds" | "tarmac";
export type BoardAnimation = "none" | "pan" | "pulse" | "shimmer";
export type TextEffect = "none" | "shadow" | "emboss" | "engrave" | "outline" | "glow";

export type Line = {
  id: string;
  text: string;
  color: string | null;
  font: string | null;
  textEffect: TextEffect | null;
};

export type BoardState = {
  lines: Line[];
  background: Background;
  texture: Texture;
  animation: BoardAnimation;
  defaultFont: string;
  defaultTextEffect: TextEffect;
  photoMode: boolean;
  imageName: string | null;
  updatedAt: number;
};

export const DEFAULT_FONT = "Bebas Neue";

export const DEFAULT_STATE: BoardState = {
  lines: [
    { id: "l1", text: "", color: null, font: null, textEffect: null },
    { id: "l2", text: "", color: null, font: null, textEffect: null },
    { id: "l3", text: "", color: null, font: null, textEffect: null },
  ],
  background: { type: "solid", color: "#000000" },
  texture: "none",
  animation: "none",
  defaultFont: DEFAULT_FONT,
  defaultTextEffect: "none",
  photoMode: false,
  imageName: null,
  updatedAt: 0,
};
