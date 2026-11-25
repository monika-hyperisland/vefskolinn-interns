import { DEFAULT_ACCENT_COLOUR, themeVariables } from "app/components/portfolio/view/themes";
import type { PortfolioTheme } from "types/portfolioTypes";

/* The style object holds CSS variables, which CSSProperties doesn't type. */
const vars = (style: ReturnType<typeof themeVariables>) =>
  style as Record<string, string>;

describe("themeVariables", () => {
  it("gives each theme its own colours", () => {
    expect(vars(themeVariables("minimal"))["--portfolio-bg"]).toBe("#ffffff");
    expect(vars(themeVariables("studio"))["--portfolio-bg"]).toBe("#000000");
  });

  it("uses the student's accent colour", () => {
    expect(vars(themeVariables("minimal", "#3b82f6"))["--portfolio-accent"]).toBe("#3b82f6");
  });

  it("falls back to the default orange when the accent colour is missing or empty", () => {
    expect(vars(themeVariables("minimal"))["--portfolio-accent"]).toBe(DEFAULT_ACCENT_COLOUR);
    expect(vars(themeVariables("minimal", ""))["--portfolio-accent"]).toBe(DEFAULT_ACCENT_COLOUR);
  });

  it("falls back to Minimal for an unknown theme", () => {
    expect(themeVariables("classic" as PortfolioTheme)).toEqual(themeVariables("minimal"));
  });
});
