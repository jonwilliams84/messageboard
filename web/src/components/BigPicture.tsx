import styled from "styled-components";
import { Background } from "../types";
import { api } from "../api";

export function BigPicture({ background, imageName }: { background: Background; imageName: string | null }) {
  return <Image $bg={backgroundCSS(background)} $url={imageName ? api.imageUrl(imageName) : null} />;
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

const Image = styled.div<{ $bg: string; $url: string | null }>`
  width: 100%;
  height: 100%;
  background-color: transparent;
  background: ${(p) => p.$bg};
  ${(p) => p.$url && `background-image: url(${p.$url}); background-size: contain; background-repeat: no-repeat; background-position: center;`}
`;
