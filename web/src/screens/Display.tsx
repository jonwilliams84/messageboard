import styled from "styled-components";
import { Board } from "../components/Board";
import { BigPicture } from "../components/BigPicture";
import { useBoardState } from "../hooks/useBoardState";

export function Display() {
  const state = useBoardState();
  if (!state) return <Stage />;
  return (
    <Stage>
      {state.photoMode ? (
        <BigPicture backgroundColor={state.backgroundColor} imageName={state.imageName} />
      ) : (
        <Board state={state} />
      )}
    </Stage>
  );
}

const Stage = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
`;
