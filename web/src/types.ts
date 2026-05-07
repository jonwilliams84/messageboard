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
