import styled from "styled-components";
import { Board } from "../components/Board";
import { BigPicture } from "../components/BigPicture";
import { Stage } from "../components/Stage";
import { useBoardState } from "../hooks/useBoardState";

export function Display() {
  const state = useBoardState();
  if (!state) return <FullScreen />;
  return (
    <FullScreen>
      <Stage background={state.background} texture={state.texture} animation={state.animation}>
        {state.photoMode ? (
          <BigPicture imageName={state.imageName} />
        ) : (
          <Board state={state} />
        )}
      </Stage>
    </FullScreen>
  );
}

const FullScreen = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
`;
