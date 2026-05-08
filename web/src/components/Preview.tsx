import styled from "styled-components";
import { BoardState } from "../types";
import { Board } from "./Board";
import { BigPicture } from "./BigPicture";
import { Stage } from "./Stage";

export function Preview({ state }: { state: BoardState }) {
  return (
    <Frame>
      <Stage background={state.background} texture={state.texture} animation={state.animation}>
        {state.photoMode ? (
          <BigPicture imageName={state.imageName} />
        ) : (
          <Board state={state} />
        )}
      </Stage>
    </Frame>
  );
}

const Frame = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  border-radius: 8px;
  border: 1px solid #333;
  overflow: hidden;
`;
