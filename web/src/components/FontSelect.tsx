import styled from "styled-components";
import { FONTS, fontFamily } from "../fonts";

type Props = {
  value: string | null;
  fallback?: string;
  onChange: (name: string | null) => void;
  allowInherit?: boolean;
  inheritLabel?: string;
  compact?: boolean;
};

export function FontSelect({ value, fallback, onChange, allowInherit, inheritLabel, compact }: Props) {
  const display = value ?? fallback ?? FONTS[0]!.name;
  return (
    <Select
      $compact={!!compact}
      style={{ fontFamily: fontFamily(display) }}
      value={value ?? "__inherit"}
      onChange={(e) => onChange(e.target.value === "__inherit" ? null : e.target.value)}
    >
      {allowInherit && (
        <option value="__inherit" style={{ fontFamily: "inherit" }}>
          {inheritLabel ?? "Default"}
        </option>
      )}
      {FONTS.map((f) => (
        <option key={f.name} value={f.name} style={{ fontFamily: f.family }}>
          {f.name}
        </option>
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
