import styled from "styled-components";

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Label>
      <span>{label}</span>
      <Track $on={checked} onClick={() => onChange(!checked)} role="switch" aria-checked={checked}>
        <Thumb $on={checked} />
      </Track>
    </Label>
  );
}

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #f0f0f0;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Track = styled.button<{ $on: boolean }>`
  width: 52px;
  height: 28px;
  border-radius: 14px;
  border: none;
  background: ${(p) => (p.$on ? "#4a90e2" : "#444")};
  position: relative;
  cursor: pointer;
  transition: background 0.15s;
  padding: 0;
`;

const Thumb = styled.span<{ $on: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(p) => (p.$on ? "26px" : "2px")};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  transition: left 0.15s;
`;
