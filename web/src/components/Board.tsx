import styled from "styled-components";
import { BoardState } from "../types";

export function Board({ state }: { state: BoardState }) {
  return (
    <Stack $bg={state.backgroundColor}>
      {state.lines.map((line, i) => (
        <Row key={line.id} $bg={line.color ?? state.backgroundColor} $first={i === 0}>
          <Text>{line.text}</Text>
        </Row>
      ))}
    </Stack>
  );
}

const Stack = styled.div<{ $bg: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.$bg};
  overflow: hidden;
`;

const Row = styled.div<{ $bg: string; $first: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  position: relative;

  ${(p) => !p.$first && `
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0.5rem;
      background: rgba(0, 0, 0, 0.18);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
  `}
`;

const Text = styled.span`
  color: #121212;
  font-size: clamp(4rem, 22vh, 28rem);
  line-height: 1;
  padding: 0 2rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;
