"use client";

import { useEffect, useState } from "react";
import type { LocalDraft, PortfolioContent } from "types/portfolioTypes";

const STORAGE_KEY = "portfolio-draft";

function createEmptyPortfolio(): PortfolioContent {
  return {
    profile: {
      name: "",
      headline: "",
      tagline: "",
      about: "",
      photoUrl: null,
      location: "",
      skills: [],
      languages: [],
    },
    availability: {
      openToInternships: false,
      availableFrom: new Date(),
      lookingFor: "",
    },
    projects: [],
    contact: {
      email: "",
      linkedinUrl: "",
      githubUrl: "",
      cvUrl: "",
    },
    theme: "minimal",
  };
}

export function useDraft() {
  const [draft, setDraft] = useState<LocalDraft>(() => ({
    content: createEmptyPortfolio(),
    savedAt: "",
    basedOn: null,
  }));
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const localDraft = JSON.parse(saved) as LocalDraft;
        const availableFrom = new Date(
          localDraft.content.availability.availableFrom
        );

        if (Number.isNaN(availableFrom.getTime())) {
          throw new Error("Invalid availability date");
        }

        setDraft({
          ...localDraft,
          content: {
            ...localDraft.content,
            availability: {
              ...localDraft.content.availability,
              availableFrom,
            },
          },
        });
        setHasLocalChanges(true);
      }
    } catch (error) {
      console.error("Could not load portfolio draft:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, isLoaded]);

  const updateProfile = (
    changes: Partial<PortfolioContent["profile"]>
  ) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        profile: { ...previous.content.profile, ...changes },
      },
    }));
  };

  const updateAvailability = (
    changes: Partial<PortfolioContent["availability"]>
  ) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        availability: {
          ...previous.content.availability,
          ...changes,
        },
      },
    }));
  };

  const addProject = () => {
    const newProject: PortfolioContent["projects"][number] = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      imageUrl: null,
      technologies: [],
    };

    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        projects: [...previous.content.projects, newProject],
      },
    }));
  };

  const updateProject = (
    id: string,
    changes: Partial<PortfolioContent["projects"][number]>
  ) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        projects: previous.content.projects.map((project) =>
          project.id === id
            ? { ...project, ...changes, id: project.id }
            : project
        ),
      },
    }));
  };

  const removeProject = (id: string) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        projects: previous.content.projects.filter(
          (project) => project.id !== id
        ),
      },
    }));
  };

  const updateContact = (
    changes: Partial<PortfolioContent["contact"]>
  ) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        contact: { ...previous.content.contact, ...changes },
      },
    }));
  };

  const setTheme = (theme: PortfolioContent["theme"]) => {
    setHasLocalChanges(true);
    setDraft((previous) => ({
      ...previous,
      content: {
        ...previous.content,
        theme,
      },
    }));
  };

  return {
    draft,
    isLoaded,
    hasLocalChanges,
    updateProfile,
    updateAvailability,
    addProject,
    updateProject,
    removeProject,
    updateContact,
    setTheme,
  };
}
