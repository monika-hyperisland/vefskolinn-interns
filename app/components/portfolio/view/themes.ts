import type { CSSProperties } from "react";
import type { PortfolioTheme } from "types/portfolioTypes";

type ThemeColours = {
  background: string;
  text: string;
  /* Small labels: LOOKING FOR, dates, the location under the logo. */
  muted: string;
  /* The header line, tab outlines and the lines around the facts. */
  line: string;
  /* Project cards and skill cards. */
  surface: string;
  surfaceText: string;
  /* The empty photo and project image boxes. */
  placeholder: string;
  activeTab: string;
  activeTabText: string;
  footer: string;
  footerText: string;
  badge: string;
  badgeText: string;
};

type Theme = {
  label: string;
  description: string;
  colours: ThemeColours;
};

export const PORTFOLIO_THEMES: Record<PortfolioTheme, Theme> = {
  minimal: {
    label: "Minimal",
    description: "White, high contrast",
    colours: {
      background: "#ffffff",
      text: "#111111",
      muted: "#666666",
      line: "#111111",
      surface: "#ffffff",
      surfaceText: "#111111",
      placeholder: "#e9e9ee",
      activeTab: "#111111",
      activeTabText: "#ffffff",
      footer: "#000000",
      footerText: "#ffffff",
      badge: "#e6f6e9",
      badgeText: "#1e6b34",
    },
  },
  editorial: {
    label: "Editorial",
    description: "Soft grey, lots of space",
    colours: {
      background: "#e7e7e4",
      text: "#1e1e1e",
      muted: "#6b6b69",
      line: "#1e1e1e",
      surface: "#ffffff",
      surfaceText: "#1e1e1e",
      placeholder: "#ffffff",
      activeTab: "#1e1e1e",
      activeTabText: "#ffffff",
      footer: "#f2f2ef",
      footerText: "#1e1e1e",
      badge: "#e6f6e9",
      badgeText: "#1e6b34",
    },
  },
  studio: {
    label: "Studio",
    description: "Dark, warm white",
    colours: {
      background: "#000000",
      text: "#fffaef",
      muted: "#a6a39c",
      line: "#bfbbb3",
      surface: "#fffaef",
      surfaceText: "#111111",
      placeholder: "#fffaef",
      activeTab: "#fffaef",
      activeTabText: "#111111",
      footer: "#fffaef",
      footerText: "#111111",
      badge: "#2f9e44",
      badgeText: "#ffffff",
    },
  },
};

export const DEFAULT_ACCENT_COLOUR = "#e2552d";

export const themeVariables = (
  theme: PortfolioTheme,
  accentColour: string = DEFAULT_ACCENT_COLOUR
): CSSProperties => {
  /* An unknown theme (e.g. old data) falls back to Minimal, the default. */
  const { colours } = PORTFOLIO_THEMES[theme] ?? PORTFOLIO_THEMES.minimal;

  // React's CSSProperties type doesn't know CSS variables, hence the cast.
  return {
    "--portfolio-accent": accentColour,
    "--portfolio-bg": colours.background,
    "--portfolio-text": colours.text,
    "--portfolio-muted": colours.muted,
    "--portfolio-line": colours.line,
    "--portfolio-surface": colours.surface,
    "--portfolio-surface-text": colours.surfaceText,
    "--portfolio-placeholder": colours.placeholder,
    "--portfolio-tab-active": colours.activeTab,
    "--portfolio-tab-active-text": colours.activeTabText,
    "--portfolio-footer": colours.footer,
    "--portfolio-footer-text": colours.footerText,
    "--portfolio-badge": colours.badge,
    "--portfolio-badge-text": colours.badgeText,
  } as CSSProperties;
};
