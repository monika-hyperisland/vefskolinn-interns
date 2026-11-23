export const themes = {
  editorial: { label: "Editorial" },
  minimal: { label: "Minimal" },
  studio: { label: "Studio" },
} as const;

export type ThemeKey = keyof typeof themes;
