"use client";

import { useState } from "react";
import { PortfolioView } from "app/components/portfolio/view/PortfolioView";
import { mockPublicPortfolio } from "app/utils/portfolio/mockPortfolio";
import type { LocalDraft, PublicPortfolio } from "types/portfolioTypes";
import styles from "./Preview.module.css";

type PreviewProps = {
  portfolio?: PublicPortfolio;
  draft: LocalDraft;
};

export default function Preview({ portfolio = mockPublicPortfolio, draft }: PreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const previewPortfolio: PublicPortfolio =
    portfolio === mockPublicPortfolio
      ? {
          content: {
            ...portfolio.content,
            theme: draft.content.theme,
          },
        }
      : portfolio;
  return (
    <section className={styles.preview} aria-label="Portfolio preview">
      <div className={styles.toolbar}>
        <div className={styles.previewLabel}>
          <span className={styles.dot} aria-hidden="true" />
          Portfolio preview
          <span className={styles.sampleLabel}>Sample data until your draft is connected</span>
        </div>
        <div className={styles.devices} role="group" aria-label="Preview device options">
          <button
            type="button"
            aria-pressed={device === "desktop"}
            onClick={() => setDevice("desktop")}
          >
            Desktop
          </button>
          <button
            type="button"
            aria-pressed={device === "mobile"}
            onClick={() => setDevice("mobile")}
          >
            Mobile
          </button>
        </div>
      </div>

      <div className={styles.previewBody}>
        <div className={device === "mobile" ? styles.mobile : styles.desktop} data-device={device}>
          <PortfolioView portfolio={previewPortfolio} />
        </div>
      </div>

      <div className={styles.themeBar} aria-label="Preview theme options">
        <span>Theme</span>
        <div className={styles.themeButtons}>
          {(["minimal","editorial", "studio"] as const).map((theme) => (
            <button
              type="button"
              key={theme}
              disabled
              className={draft.content.theme === theme ? styles.selectedTheme : undefined}
              aria-label={`${draft.content.theme === theme ? "Selected " : ""}${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
              {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
