"use client";

import type { LocalDraft, PortfolioTheme } from "types/portfolioTypes";
import styles from "./ThemeStep.module.css";

const themes: Array<{
  key: PortfolioTheme;
  label: string;
  description: string;
}> = [
  { key: "minimal", label: "Minimal", description: "White, high contrast" },
  { key: "editorial", label: "Editorial", description: "Soft grey" },
  { key: "studio", label: "Studio", description: "Dark, high contrast" },
];

type ThemeStepProps = {
  draft: LocalDraft;
  setTheme: (theme: PortfolioTheme) => void;
};

export default function ThemeStep({ draft, setTheme }: ThemeStepProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Choose a preset</legend>
      <div className={styles.grid} role="radiogroup" aria-label="Portfolio theme">
        {themes.map((theme) => {
          const selected = draft.content.theme === theme.key;

          return (
            <label
              key={theme.key}
              className={`${styles.card} ${selected ? styles.selected : ""}`}
            >
              <input
                className={styles.radio}
                type="radio"
                name="portfolio-theme"
                value={theme.key}
                checked={selected}
                onChange={() => setTheme(theme.key)}
              />
              <span
                className={`${styles.preview} ${styles[theme.key]}`}
                aria-hidden="true"
              >
                <span className={styles.previewFrame}>
                  <span className={styles.previewTitle} />
                  <span className={styles.previewContent}>
                    <span className={styles.previewText} />
                    <span className={styles.previewBlocks}>
                      <span />
                      <span />
                    </span>
                  </span>
                </span>
              </span>
              <span className={styles.cardFooter}>
                <span className={styles.cardInfo}>
                  <span>{theme.label}</span>
                  <span className={styles.description}>{theme.description}</span>
                </span>
                <span className={styles.check} aria-hidden="true">
                  {selected ? "✓" : ""}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
