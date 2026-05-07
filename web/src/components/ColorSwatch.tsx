import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

type Props = {
  value: string;
  onChange: (hex: string) => void;
  size?: number;
  label?: string;
  allowClear?: boolean;
  onClear?: () => void;
};

export function ColorSwatch({ value, onChange, size = 56, label, allowClear, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <Wrap ref={ref}>
      <Dot $color={value} $size={size} onClick={() => setOpen((o) => !o)} aria-label={label ?? "color"} />
      {open && (
        <Popover>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: 120, height: 60, border: "none", background: "none", cursor: "pointer" }}
          />
          {allowClear && (
            <ClearBtn onClick={() => { onClear?.(); setOpen(false); }}>Use background</ClearBtn>
          )}
        </Popover>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  position: relative;
`;

const Dot = styled.button<{ $color: string; $size: number }>`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 2px solid #1a1a1a;
  cursor: pointer;
  padding: 0;
`;

const Popover = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 10;
  background: #1d1d1d;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ClearBtn = styled.button`
  background: transparent;
  color: #aaa;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  &:hover { color: #fff; border-color: #888; }
`;
