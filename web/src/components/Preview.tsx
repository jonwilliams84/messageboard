import styled from "styled-components";
import { BoardState } from "../types";
import { Board } from "./Board";
import { BigPicture } from "./BigPicture";

export function Preview({ state }: { state: BoardState }) {
  return (
    <Frame>
      <Inner>
        {state.photoMode ? (
          <BigPicture backgroundColor={state.backgroundColor} imageName={state.imageName} />
        ) : (
          <Board state={state} />
        )}
      </Inner>
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

const Inner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
