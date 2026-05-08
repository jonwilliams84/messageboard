import { ReactNode } from "react";
import styled, { css, keyframes } from "styled-components";
import { Background, BoardAnimation, Texture } from "../types";

type Props = {
  background: Background;
  texture: Texture;
  animation: BoardAnimation;
  children: ReactNode;
};

export function Stage({ background, texture, animation, children }: Props) {
  return (
    <Frame $bg={background} $texture={texture} $animation={animation}>
      <Content>{children}</Content>
      {animation === "shimmer" && <Shimmer aria-hidden />}
    </Frame>
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

const NOISE_SVG = svgUrl(
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/>",
  160
);

const PAPER_SVG = svgUrl(
  "<filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.045' numOctaves='5' stitchTiles='stitch' seed='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.32 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/>",
  240
);

const CLOUDS_SVG = svgUrl(
  "<filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.013' numOctaves='3' stitchTiles='stitch' seed='5'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 -0.12'/></filter><rect width='100%' height='100%' filter='url(%23c)'/>",
  480
);

const TARMAC_SVG = svgUrl(
  "<filter id='t'><feTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='3' stitchTiles='stitch' seed='1'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23t)'/>",
  220
);

function svgUrl(inner: string, size: number): string {
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${inner}</svg>")`;
}

function textureCSS(t: Texture) {
  switch (t) {
    case "none":
      return css`background-image: none;`;
    case "dots":
      return css`
        background-image: radial-gradient(rgba(0, 0, 0, 0.22) 1.6px, transparent 1.8px);
        background-size: 18px 18px;
      `;
    case "stripes":
      return css`
        background-image: repeating-linear-gradient(
          45deg,
          rgba(0, 0, 0, 0.16) 0 6px,
          transparent 6px 14px
        );
      `;
    case "grid":
      return css`
        background-image:
          linear-gradient(rgba(0, 0, 0, 0.16) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.16) 1px, transparent 1px);
        background-size: 24px 24px;
      `;
    case "noise":
      return css`
        background-image: ${NOISE_SVG};
        background-size: 160px 160px;
      `;
    case "paper":
      return css`
        background-image: ${PAPER_SVG};
        background-size: 240px 240px;
        mix-blend-mode: multiply;
      `;
    case "fabric":
      return css`
        background-image:
          repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18) 0 1px, transparent 1px 4px),
          repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.12) 0 1px, transparent 1px 4px),
          radial-gradient(rgba(255, 255, 255, 0.04) 0.8px, transparent 1px);
        background-size: 4px 4px, 4px 4px, 6px 6px;
      `;
    case "clouds":
      return css`
        background-image: ${CLOUDS_SVG};
        background-size: 480px 480px;
        mix-blend-mode: screen;
      `;
    case "tarmac":
      return css`
        background-image: ${TARMAC_SVG};
        background-size: 220px 220px;
        mix-blend-mode: multiply;
      `;
  }
}

const panKf = keyframes`
  from { background-position: 0 0; }
  to   { background-position: 200px 200px; }
`;

const pulseKf = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.35; }
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

const Frame = styled.div<{ $bg: Background; $texture: Texture; $animation: BoardAnimation }>`
  width: 100%;
  height: 100%;
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

const Content = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
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
    rgba(255, 255, 255, 0.22) 50%,
    transparent 100%
  );
  animation: ${shimmerKf} 6s linear infinite;
  mix-blend-mode: overlay;
`;
