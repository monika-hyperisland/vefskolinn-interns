export const themes = {
  minimal: { label: "Minimal" },
  editorial: { label: "Editorial" },
  studio: { label: "Studio" },
} as const;

export type ThemeKey = keyof typeof themes;
