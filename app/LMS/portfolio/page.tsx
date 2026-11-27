"use client";
import { useDraft } from "./builder/useDraft";
import { useState } from "react";
import styles from "./portfolio.module.css";
import TopBar from "./builder/TopBar";
import StepRail from "./builder/StepRail";
import SidePanel from "./builder/SidePanel";
import Preview from "./builder/Preview";
import type { PortfolioStepId } from "./builder/steps";

export default function PortfolioBuilderPage() {
  const [activeStep, setActiveStep] = useState<PortfolioStepId>("profile");
  const { 
    draft, 
    isLoaded,
    error,
    setTheme,
    addProject,
    updateProject,
    removeProject,
  } = useDraft();

  const publicationStatus = !isLoaded
  ? "Checking portfolio..."
  : error
    ? "Status unavailable"
    : draft.basedOn
      ? "Published"
      : "Not published yet";

  return (
    <main className={styles.builder} aria-label="Portfolio Builder">
      <TopBar status={publicationStatus} />

      <div className={styles.workspace}>
        <StepRail activeStep={activeStep} onStepChange={setActiveStep} />
        <SidePanel
          activeStep={activeStep}
          draft={draft}
          setTheme={setTheme}
          addProject={addProject}
          updateProject={updateProject}
          removeProject={removeProject}
        />
        <Preview draft={draft} />
      </div>
    </main>
  );
}
