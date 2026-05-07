import styled from "styled-components";
import { api } from "../api";

export function BigPicture({ backgroundColor, imageName }: { backgroundColor: string; imageName: string | null }) {
  return <Image $bg={backgroundColor} $url={imageName ? api.imageUrl(imageName) : null} />;
}

const Image = styled.div<{ $bg: string; $url: string | null }>`
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.$bg};
  background-image: ${(p) => (p.$url ? `url(${p.$url})` : "none")};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
