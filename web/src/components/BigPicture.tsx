import styled from "styled-components";
import { api } from "../api";

export function BigPicture({ imageName }: { imageName: string | null }) {
  if (!imageName) return null;
  return <Image src={api.imageUrl(imageName)} alt="" />;
}

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  flex: 1;
`;
