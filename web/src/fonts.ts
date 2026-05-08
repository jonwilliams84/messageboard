export type FontOption = {
  name: string;
  family: string;
};

export const FONTS: FontOption[] = [
  { name: "Bebas Neue", family: "'Bebas Neue', sans-serif" },
  { name: "Anton", family: "'Anton', sans-serif" },
  { name: "Oswald", family: "'Oswald', sans-serif" },
  { name: "Bungee", family: "'Bungee', sans-serif" },
  { name: "Permanent Marker", family: "'Permanent Marker', cursive" },
  { name: "Lobster", family: "'Lobster', cursive" },
];

export const DEFAULT_FONT_NAME = "Bebas Neue";

export function fontFamily(name: string): string {
  return FONTS.find((f) => f.name === name)?.family ?? FONTS[0]!.family;
}
