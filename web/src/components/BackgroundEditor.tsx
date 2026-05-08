import styled from "styled-components";
import { Background, BoardAnimation, Texture } from "../types";
import { ColorSwatch } from "./ColorSwatch";

type Props = {
  background: Background;
  texture: Texture;
  animation: BoardAnimation;
  onBackground: (bg: Background) => void;
  onTexture: (t: Texture) => void;
  onAnimation: (a: BoardAnimation) => void;
};

const TYPES: Background["type"][] = ["solid", "linear", "radial"];
const TYPE_LABEL: Record<Background["type"], string> = {
  solid: "Solid",
  linear: "Linear gradient",
  radial: "Radial gradient",
};

const TEXTURES: Texture[] = ["none", "dots", "stripes", "grid", "noise", "paper", "fabric", "clouds", "tarmac"];
const ANIMATIONS: BoardAnimation[] = ["none", "pan", "pulse", "shimmer"];

export function BackgroundEditor({ background, texture, animation, onBackground, onTexture, onAnimation }: Props) {
  function setType(type: Background["type"]) {
    if (type === background.type) return;
    const baseColor = background.type === "solid" ? background.color : background.from;
    if (type === "solid") {
      onBackground({ type: "solid", color: baseColor });
    } else if (type === "linear") {
      const to = background.type === "solid" ? "#ffffff" : background.to;
      const angle = background.type === "linear" ? background.angle : 90;
      onBackground({ type: "linear", from: baseColor, to, angle });
    } else {
      const to = background.type === "solid" ? "#ffffff" : background.to;
      onBackground({ type: "radial", from: baseColor, to });
    }
  }

  return (
    <Body>
      <Field>
        <Label>Type</Label>
        <Select value={background.type} onChange={(e) => setType(e.target.value as Background["type"])}>
          {TYPES.map((t) => (
            <option key={t} value={t}>{TYPE_LABEL[t]}</option>
          ))}
        </Select>
      </Field>

      {background.type === "solid" && (
        <Field>
          <Label>Color</Label>
          <ColorSwatch
            value={background.color}
            onChange={(color) => onBackground({ ...background, color })}
            size={56}
            label="Background color"
          />
        </Field>
      )}

      {(background.type === "linear" || background.type === "radial") && (
        <>
          <Field>
            <Label>From</Label>
            <ColorSwatch
              value={background.from}
              onChange={(from) => onBackground({ ...background, from })}
              size={56}
              label="Gradient start"
            />
          </Field>
          <Field>
            <Label>To</Label>
            <ColorSwatch
              value={background.to}
              onChange={(to) => onBackground({ ...background, to })}
              size={56}
              label="Gradient end"
            />
          </Field>
        </>
      )}

      {background.type === "linear" && (
        <Field>
          <Label>Angle ({background.angle}°)</Label>
          <Slider
            type="range"
            min={0}
            max={360}
            value={background.angle}
            onChange={(e) => onBackground({ ...background, angle: Number(e.target.value) })}
          />
        </Field>
      )}

      <Caption>Per-line colors override the background.</Caption>

      <SubGrid>
        <Field>
          <Label>Texture</Label>
          <Select value={texture} onChange={(e) => onTexture(e.target.value as Texture)}>
            {TEXTURES.map((t) => (
              <option key={t} value={t}>{cap(t)}</option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label>Animation</Label>
          <Select value={animation} onChange={(e) => onAnimation(e.target.value as BoardAnimation)}>
            {ANIMATIONS.map((a) => (
              <option key={a} value={a}>{cap(a)}</option>
            ))}
          </Select>
        </Field>
      </SubGrid>

      {animation !== "none" && animation !== "shimmer" && texture === "none" && (
        <Hint>Pick a texture to see the {animation} animation.</Hint>
      )}
    </Body>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Label = styled.span`
  width: 90px;
  flex-shrink: 0;
  color: #aaa;
  font-size: 0.95rem;
`;

const Select = styled.select`
  flex: 1;
  height: 40px;
  padding: 0 8px;
  background: #1a1a1a;
  color: #f0f0f0;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  &:hover { border-color: #666; }
`;

const Slider = styled.input`
  flex: 1;
  accent-color: #4a90e2;
`;

const Caption = styled.div`
  color: #777;
  font-size: 0.85rem;
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 4px;
  padding-top: 14px;
  border-top: 1px solid #333;
  ${Field} { gap: 10px; }
  ${Label} { width: auto; }
`;

const Hint = styled.div`
  color: #d4a04a;
  font-size: 0.85rem;
`;
