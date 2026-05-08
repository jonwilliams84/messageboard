import styled from "styled-components";
import { BoardState } from "../types";
import { fontFamily } from "../fonts";
import { textEffectStyle } from "../effects";

export function Board({ state }: { state: BoardState }) {
  return (
    <Stack>
      {state.lines.map((line, i) => (
        <Row key={line.id} $bg={line.color} $first={i === 0}>
          <Text
            style={{
              fontFamily: fontFamily(line.font ?? state.defaultFont),
              ...textEffectStyle(line.textEffect ?? state.defaultTextEffect),
            }}
          >
            {line.text}
          </Text>
        </Row>
      ))}
    </Stack>
  );
}

const Stack = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Row = styled.div<{ $bg: string | null; $first: boolean }>`
  flex: 1;
  min-height: 0;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg ?? "transparent"};
  position: relative;
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

  @supports (text-box-trim: trim-both) {
    text-box-trim: trim-both;
    text-box-edge: cap text;
    transform: none;
  }
`;
