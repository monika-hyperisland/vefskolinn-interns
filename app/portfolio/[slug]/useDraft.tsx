"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { LocalDraft, PortfolioTheme } from "types/portfolioTypes";
import { mockLocalDraft } from "utils/portfolio/mockPortfolio";

type DraftContextValue = {
  draft: LocalDraft;
  setTheme: (theme: PortfolioTheme) => void;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({
  children,
  initialDraft = mockLocalDraft,
}: {
  children: ReactNode;
  initialDraft?: LocalDraft;
}) {
  const [draft, setDraft] = useState(initialDraft);

  useEffect(() => {
    window.localStorage.setItem(
      "portfolio:draft",
      JSON.stringify(draft)
    );
  }, [draft]);

  const setTheme = useCallback((theme: PortfolioTheme) => {
    setDraft((current) => ({
      ...current,
      content: { ...current.content, theme },
    }));
  }, []);

  return (
    <DraftContext.Provider value={{ draft, setTheme }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDraft(): DraftContextValue {
  const context = useContext(DraftContext);
  const [draft, setDraft] = useState(mockLocalDraft);

  const setTheme = useCallback((theme: PortfolioTheme) => {
    setDraft((current) => ({
      ...current,
      content: { ...current.content, theme },
    }));
  }, []);

  if (context) return context;
  return { draft, setTheme };
}
