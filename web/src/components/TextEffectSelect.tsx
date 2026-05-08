import styled from "styled-components";
import { TEXT_EFFECTS } from "../effects";
import { TextEffect } from "../types";

type Props = {
  value: TextEffect | null;
  fallback?: TextEffect;
  onChange: (e: TextEffect | null) => void;
  allowInherit?: boolean;
  inheritLabel?: string;
  compact?: boolean;
};

const LABELS: Record<TextEffect, string> = {
  none: "Plain",
  shadow: "Shadow",
  emboss: "Emboss",
  engrave: "Engrave",
  outline: "Outline",
  glow: "Glow",
};

export function TextEffectSelect({ value, onChange, allowInherit, inheritLabel, compact }: Props) {
  return (
    <Select
      $compact={!!compact}
      value={value ?? "__inherit"}
      onChange={(e) => onChange(e.target.value === "__inherit" ? null : (e.target.value as TextEffect))}
    >
      {allowInherit && <option value="__inherit">{inheritLabel ?? "Default"}</option>}
      {TEXT_EFFECTS.map((t) => (
        <option key={t} value={t}>{LABELS[t]}</option>
      ))}
    </Select>
  );
}

const Select = styled.select<{ $compact: boolean }>`
  height: ${(p) => (p.$compact ? "32px" : "40px")};
  padding: 0 8px;
  font-size: ${(p) => (p.$compact ? "0.85rem" : "1rem")};
  background: #1a1a1a;
  color: #f0f0f0;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  &:hover { border-color: #666; }
`;
