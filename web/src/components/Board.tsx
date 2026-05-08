import styled, { css, keyframes } from "styled-components";
import { Background, BoardAnimation, BoardState, Texture } from "../types";
import { fontFamily } from "../fonts";

export function Board({ state }: { state: BoardState }) {
  return (
    <Stack $bg={state.background} $texture={state.texture} $animation={state.animation}>
      {state.animation === "shimmer" && <Shimmer aria-hidden />}
      {state.lines.map((line, i) => (
        <Row
          key={line.id}
          $bg={line.color ?? backgroundFallback(state.background)}
          $first={i === 0}
        >
          <Text style={{ fontFamily: fontFamily(line.font ?? state.defaultFont) }}>
            {line.text}
          </Text>
        </Row>
      ))}
    </Stack>
  );
}

function backgroundCSS(bg: Background): string {
  switch (bg.type) {
    case "solid":
      return bg.color;
    case "linear":
      return `linear-gradient(${bg.angle}deg, ${bg.from}, ${bg.to})`;
    case "radial":
      return `radial-gradient(circle at center, ${bg.from}, ${bg.to})`;
  }
}

function backgroundFallback(bg: Background): string {
  return bg.type === "solid" ? bg.color : bg.from;
}

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function textureCSS(t: Texture) {
  switch (t) {
    case "none":
      return css`background-image: none;`;
    case "dots":
      return css`
        background-image: radial-gradient(rgba(0, 0, 0, 0.18) 1.5px, transparent 1.6px);
        background-size: 18px 18px;
      `;
    case "stripes":
      return css`
        background-image: repeating-linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.12) 0 6px,
          transparent 6px 14px
        );
      `;
    case "grid":
      return css`
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.12) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.12) 1px, transparent 1px);
        background-size: 24px 24px;
      `;
    case "noise":
      return css`
        background-image: ${NOISE_SVG};
        background-size: 160px 160px;
      `;
  }
}

const panKf = keyframes`
  from { background-position: 0 0; }
  to   { background-position: 200px 200px; }
`;

const pulseKf = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.45; }
`;

const shimmerKf = keyframes`
  0%   { transform: translateX(-110%); }
  100% { transform: translateX(110%); }
`;

function textureAnimation(a: BoardAnimation, t: Texture) {
  if (t === "none") return css``;
  if (a === "pan") return css`animation: ${panKf} 18s linear infinite;`;
  if (a === "pulse") return css`animation: ${pulseKf} 4s ease-in-out infinite;`;
  return css``;
}

const Stack = styled.div<{ $bg: Background; $texture: Texture; $animation: BoardAnimation }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: ${(p) => backgroundCSS(p.$bg)};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    ${(p) => textureCSS(p.$texture)};
    ${(p) => textureAnimation(p.$animation, p.$texture)};
  }
`;

const Shimmer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40%;
  pointer-events: none;
  z-index: 4;
  background: linear-gradient(
    100deg,
    transparent 0%,
    rgba(255, 255, 255, 0.18) 50%,
    transparent 100%
  );
  animation: ${shimmerKf} 6s linear infinite;
  mix-blend-mode: overlay;
`;

const Row = styled.div<{ $bg: string; $first: boolean }>`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  position: relative;
  z-index: 1;
  container-type: size;

  ${(p) => !p.$first && `
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0.6cqh;
      min-height: 3px;
      pointer-events: none;
      z-index: 3;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.45),
        rgba(0, 0, 0, 0.25) 60%,
        rgba(0, 0, 0, 0.1)
      );
      box-shadow:
        inset 0 1px 1px rgba(0, 0, 0, 0.35),
        0 1px 0 rgba(255, 255, 255, 0.18);
    }
  `}
`;

const Text = styled.span`
  color: #121212;
  font-size: clamp(1rem, 70cqh, 28rem);
  line-height: 1;
  padding: 0 4cqw;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  position: relative;
  z-index: 2;
  transform: translateY(0.09em);
`;
