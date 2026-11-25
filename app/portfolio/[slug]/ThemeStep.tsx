"use client";

import styled from "styled-components";
import type { ThemeKey } from "./themes";
import { themes } from "./themes";
import { useDraft } from "./useDraft";

const Fieldset = styled.fieldset`
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

const Legend = styled.legend`
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.label<{ $selected: boolean }>`
  position: relative;
  display: block;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ $selected }) => ($selected ? "#2563eb" : "#d7d9df")};
  border-radius: 12px;
  background: #fff;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#2563eb" : "#8e929d")};
  }

  &:has(input:focus-visible) {
    outline: 3px solid #93c5fd;
    outline-offset: 3px;
  }

  ${({ $selected }) =>
    $selected &&
    `
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    `}
`;

const Radio = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

const Preview = styled.div<{ $theme: ThemeKey }>`
  height: 120px;
  padding: 16px;
  background: ${({ $theme }) =>
    $theme === "editorial"
      ? "#f3eee4"
      : $theme === "minimal"
        ? "#fafafa"
        : "#18181b"};
`;

const PreviewFrame = styled.div<{ $theme: ThemeKey }>`
  height: 100%;
  border: 1px solid ${({ $theme }) => ($theme === "studio" ? "#3f3f46" : "#b8b5ad")};
  background: ${({ $theme }) => ($theme === "studio" ? "#27272a" : "#fff")};
  padding: 10px;
`;

const PreviewTitle = styled.div<{ $theme: ThemeKey }>`
  width: 62%;
  height: 9px;
  margin-bottom: 8px;
  background: ${({ $theme }) => ($theme === "studio" ? "#e4e4e7" : "#202124")};
  border-radius: ${({ $theme }) => ($theme === "minimal" ? "2px" : "0")};
`;

const PreviewText = styled.div<{ $theme: ThemeKey }>`
  display: flex;
  gap: 6px;

  &::before,
  &::after {
    content: "";
    display: block;
    height: 5px;
    background: ${({ $theme }) => ($theme === "studio" ? "#71717a" : "#aaa")};
  }

  &::before {
    width: 32%;
  }

  &::after {
    width: 52%;
  }
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 12px 14px;
  color: #202124;
  font-weight: 700;
`;

const Check = styled.span<{ $selected: boolean }>`
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border: 2px solid ${({ $selected }) => ($selected ? "#2563eb" : "#aaa")};
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? "#2563eb" : "#fff")};
  color: #fff;
  font-size: 13px;

  &::before {
    content: ${({ $selected }) => ($selected ? '"✓"' : '""')};
  }
`;

export default function ThemeStep() {
  const { draft, setTheme } = useDraft();

  return (
    <Fieldset>
      <Legend>Veldu þema</Legend>
      <Grid role="radiogroup" aria-label="Portfolio theme">
        {(Object.keys(themes) as ThemeKey[]).map((themeKey) => {
          const selected = draft.content.theme === themeKey;

          return (
            <Card key={themeKey} $selected={selected}>
              <Radio
                type="radio"
                name="portfolio-theme"
                value={themeKey}
                checked={selected}
                onChange={() => setTheme(themeKey)}
              />
              <Preview $theme={themeKey} aria-hidden="true">
                <PreviewFrame $theme={themeKey}>
                  <PreviewTitle $theme={themeKey} />
                  <PreviewText $theme={themeKey} />
                </PreviewFrame>
              </Preview>
              <CardFooter>
                <span>{themes[themeKey].label}</span>
                <Check $selected={selected} aria-hidden="true" />
              </CardFooter>
            </Card>
          );
        })}
      </Grid>
    </Fieldset>
  );
}