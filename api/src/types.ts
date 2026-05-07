export type Line = {
  id: string;
  text: string;
  color: string | null;
};

export type BoardState = {
  lines: Line[];
  backgroundColor: string;
  photoMode: boolean;
  imageName: string | null;
  updatedAt: number;
};

export const DEFAULT_STATE: BoardState = {
  lines: [
    { id: "l1", text: "", color: null },
    { id: "l2", text: "", color: null },
    { id: "l3", text: "", color: null },
  ],
  backgroundColor: "#000000",
  photoMode: false,
  imageName: null,
  updatedAt: 0,
};
