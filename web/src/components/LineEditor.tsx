import styled from "styled-components";
import { Line } from "../types";
import { ColorSwatch } from "./ColorSwatch";

type Props = {
  line: Line;
  index: number;
  defaultColor: string;
  onChange: (line: Line) => void;
  onRemove: () => void;
  canRemove: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function LineEditor({ line, index, defaultColor, onChange, onRemove, canRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: Props) {
  const effectiveColor = line.color ?? defaultColor;
  return (
    <Row>
      <Reorder>
        <IconBtn onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move up">↑</IconBtn>
        <IconBtn onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move down">↓</IconBtn>
      </Reorder>
      <TextField
        $bg={effectiveColor}
        value={line.text}
        placeholder={`LINE ${index + 1}`}
        maxLength={32}
        onChange={(e) => onChange({ ...line, text: e.target.value })}
      />
      <ColorSwatch
        value={effectiveColor}
        onChange={(hex) => onChange({ ...line, color: hex })}
        allowClear={line.color !== null}
        onClear={() => onChange({ ...line, color: null })}
        label={`Line ${index + 1} color`}
      />
      <RemoveBtn onClick={onRemove} disabled={!canRemove} aria-label="Remove line">×</RemoveBtn>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const Reorder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const IconBtn = styled.button`
  width: 24px;
  height: 20px;
  background: #2a2a2a;
  color: #ddd;
  border: 1px solid #444;
  border-radius: 3px;
  cursor: pointer;
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const TextField = styled.input<{ $bg: string }>`
  flex: 1;
  height: 56px;
  padding: 0 16px;
  font-size: 1.6rem;
  text-align: center;
  color: #121212;
  background: ${(p) => p.$bg};
  border: 2px solid #000;
  border-radius: 6px;
  outline: none;
  &:focus { box-shadow: 0 0 0 2px #4a90e2; }
`;

const RemoveBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #5a1f1f;
  color: #fff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;
