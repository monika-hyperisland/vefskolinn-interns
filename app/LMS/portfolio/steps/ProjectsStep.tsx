"use client";
import { useState } from "react";
import { ImageUploadField } from "UIcomponents/imageUpload/ImageUploadField";
import styles from "./ProjectsStep.module.css";
import type { PortfolioProject } from "types/portfolioTypes";

type ProjectsStepProps = {
  projects: PortfolioProject[];
  addProject: () => void;
  updateProject: (
    id: string,
    changes: Partial<PortfolioProject>
  ) => void;
  removeProject: (id: string) => void;
};

export default function ProjectsStep({
  projects,
  addProject,
  updateProject: updateDraftProject,
  removeProject,
}: ProjectsStepProps) {
  const [newTechnology, setNewTechnology] = useState("");

  // Converts the existing form's field updates
  // into the format expected by useDraft().
  const updateProject = <K extends keyof PortfolioProject,>(
    id: string,
    field: K,
    value: PortfolioProject[K]
  ) => {
    updateDraftProject(id, { [field]: value } as Partial<PortfolioProject>);
  };

  const addTechnology = (projectId: string) => {
    const tech = newTechnology.trim();
    if (
      tech &&
      projects
        .find((p) => p.id === projectId)
        ?.technologies.some((t) => t.toLowerCase() === tech.toLowerCase()) === false
    ) {
      updateProject(
        projectId,
        "technologies",
        [...(projects.find((p) => p.id === projectId)?.technologies || []), tech]
      );
      setNewTechnology("");
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      updateProject(
        projectId,
        "technologies",
        project.technologies.filter((t) => t !== tech)
      );
    }
  };

  return (
    <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.projectsList}>
        {projects.map((project, index) => (
          <div key={project.id} className={styles.projectCard}>
            <div className={styles.projectHeader}>
              <span className={styles.projectNumber}>{String(index + 1).padStart(2, "0")}</span>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className={styles.deleteButton}
                aria-label={`Remove ${project.title || "project"}`}
              >
                Remove project
              </button>
            </div>

            <ImageUploadField
              id={`project-image-${project.id}`}
              prefix={`portfolio-project-${index}`}
              label="Project image"
              description="JPG or PNG · wide images work best"
              value={project.imageUrl || ""}
              onChange={(url) => updateProject(project.id, "imageUrl", url)}
            />

            <label className={styles.field}>
              <span>Project title</span>
              <input
                value={project.title}
                onChange={(e) => updateProject(project.id, "title", e.target.value)}
                placeholder="Name of your project"
              />
            </label>

            <label className={styles.field}>
              <span>Description</span>
              <textarea
                rows={3}
                value={project.description}
                onChange={(e) => updateProject(project.id, "description", e.target.value)}
                placeholder="What did you build? What was your role?"
              />
            </label>

            <div className={styles.field}>
              <span>Technologies</span>
              <div className={styles.technologies}>
                {project.technologies.map((tech) => (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => removeTechnology(project.id, tech)}
                    className={styles.techTag}
                    aria-label={`Remove ${tech}`}
                  >
                    {tech} ×
                  </button>
                ))}
              </div>
              <div className={styles.techInput}>
                <input
                  aria-label="New technology"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTechnology(project.id);
                    }
                  }}
                  placeholder="React, TypeScript, etc."
                />
                <button
                  type="button"
                  onClick={() => addTechnology(project.id)}
                  className={styles.addButton}
                >
                  + Add
                </button>
              </div>
            </div>

            <div className={styles.twoColumns}>
              <label className={styles.field}>
                <span>Live link (optional)</span>
                <input
                  type="url"
                  value={project.liveUrl}
                  onChange={(e) => updateProject(project.id, "liveUrl", e.target.value)}
                  placeholder="https://project.com"
                />
              </label>
              <label className={styles.field}>
                <span>GitHub link (optional)</span>
                <input
                  type="url"
                  value={project.githubUrl}
                  onChange={(e) => updateProject(project.id, "githubUrl", e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {projects.length < 6 && (
        <button type="button" onClick={addProject} className={styles.addProjectButton}>
          + Add Project
        </button>
      )}

      {projects.length === 6 && (
        <p className={styles.maxProjects}>Maximum 6 projects reached</p>
      )}

      <p className={styles.draftNote}>
      Your projects are saved automatically in this browser.
      They are not public until you publish your portfolio.      </p>
    </form>
  );
}