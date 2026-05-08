import { CSSProperties } from "react";
import { TextEffect } from "./types";

export const TEXT_EFFECTS: TextEffect[] = ["none", "shadow", "emboss", "engrave", "outline", "glow"];

export function textEffectStyle(effect: TextEffect): CSSProperties {
  switch (effect) {
    case "none":
      return {};
    case "shadow":
      return {
        textShadow: "0.04em 0.06em 0 rgba(0, 0, 0, 0.55)",
      };
    case "emboss":
      return {
        textShadow:
          "-0.015em -0.015em 0 rgba(255, 255, 255, 0.6), 0.02em 0.025em 0.005em rgba(0, 0, 0, 0.55)",
      };
    case "engrave":
      return {
        textShadow:
          "0.02em 0.025em 0 rgba(255, 255, 255, 0.55), -0.015em -0.015em 0 rgba(0, 0, 0, 0.5)",
      };
    case "outline":
      return {
        WebkitTextStroke: "0.025em rgba(0, 0, 0, 0.85)",
        paintOrder: "stroke fill",
      };
    case "glow":
      return {
        textShadow:
          "0 0 0.08em rgba(255, 255, 255, 0.95), 0 0 0.18em rgba(255, 255, 255, 0.6)",
      };
  }
}
