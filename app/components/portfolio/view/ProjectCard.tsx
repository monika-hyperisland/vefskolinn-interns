import type { PortfolioProject } from "types/portfolioTypes";
import {
  GalleryActionLink,
  GalleryActions,
  GalleryItemContent,
  GalleryItemDescription,
  GalleryItemTitle,
  GalleryTopicMore,
  GalleryTopicPopover,
  GalleryTopicTag,
  GalleryTopicTags,
} from "app/components/gallery/styles";
import {
  DescriptionHover,
  DescriptionPopover,
  ProjectCardContainer,
  ProjectImage,
  ProjectPlaceholder,
} from "./Style";

// Same limit as the Gallery card.
const MAX_DESCRIPTION_LENGTH = 150;

// The Gallery shows 2; a portfolio card is wider, so it fits 3.
const MAX_VISIBLE_TECHNOLOGIES = 3;

/* The GitHub logo from the Gallery card buttons (GalleryItem.tsx), copied
   here so the shared Gallery file stays untouched. */
const GitHubIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.62 5.24-5.11 5.52.4.35.76 1.03.76 2.08v3.07c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
  </svg>
);

/* Cuts at the last whole word before the limit, so no word is split. */
const shorten = (text: string): string =>
  `${text.slice(0, MAX_DESCRIPTION_LENGTH).replace(/\s+\S*$/, "")}…`;

type Props = {
  project: PortfolioProject;
};

/* Looks like the Gallery card, built from its styles, but shows only what a
   portfolio project has: no module, author or recommendation stars. */
export const ProjectCard = ({ project }: Props) => {
  const { title, description, imageUrl, technologies, liveUrl, githubUrl } = project;
  const hasBothLinks = Boolean(liveUrl && githubUrl);
  const isLong = description.length > MAX_DESCRIPTION_LENGTH;
  const visibleTechnologies = technologies.slice(0, MAX_VISIBLE_TECHNOLOGIES);
  const hiddenTechnologies = technologies.slice(MAX_VISIBLE_TECHNOLOGIES);

  return (
    <ProjectCardContainer>
      {imageUrl ? (
        <ProjectImage>
          {/* eslint-disable-next-line @next/next/no-img-element -- students host project images anywhere */}
          <img src={imageUrl} alt={`Screenshot of ${title}`} loading="lazy" />
        </ProjectImage>
      ) : (
        <ProjectPlaceholder aria-hidden="true">[ Project image ]</ProjectPlaceholder>
      )}
      <GalleryItemContent>
        <GalleryItemTitle>{title}</GalleryItemTitle>
        {isLong ? (
          // Like the "+N" tags in the Gallery: the full text pops up on hover,
          // on keyboard focus, or on tap on a phone.
          <DescriptionHover tabIndex={0}>
            {/* Screen readers skip the cut text and read the full one below. */}
            <GalleryItemDescription aria-hidden="true">
              {shorten(description)}
            </GalleryItemDescription>
            <DescriptionPopover>{description}</DescriptionPopover>
          </DescriptionHover>
        ) : (
          <GalleryItemDescription>{description}</GalleryItemDescription>
        )}
        {technologies.length > 0 && (
          <GalleryTopicTags aria-label="Technologies">
            {visibleTechnologies.map((tech) => (
              <GalleryTopicTag key={tech}>#{tech}</GalleryTopicTag>
            ))}
            {/* The rest hide behind "+N", as in the Gallery card. */}
            {hiddenTechnologies.length > 0 && (
              <GalleryTopicMore
                tabIndex={0}
                aria-label={`${hiddenTechnologies.length} more technologies: ${hiddenTechnologies.join(", ")}`}
              >
                +{hiddenTechnologies.length}
                <GalleryTopicPopover aria-hidden="true">
                  {hiddenTechnologies.map((tech) => (
                    <GalleryTopicTag key={tech}>#{tech}</GalleryTopicTag>
                  ))}
                </GalleryTopicPopover>
              </GalleryTopicMore>
            )}
          </GalleryTopicTags>
        )}
        {(liveUrl || githubUrl) && (
          <GalleryActions $multiple={hasBothLinks}>
            {liveUrl && (
              <GalleryActionLink
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                $primary
                $multiple={hasBothLinks}
              >
                ↗ Live page
              </GalleryActionLink>
            )}
            {githubUrl && (
              <GalleryActionLink
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                $primary={false}
                $multiple={hasBothLinks}
              >
                <GitHubIcon />
                GitHub
              </GalleryActionLink>
            )}
          </GalleryActions>
        )}
      </GalleryItemContent>
    </ProjectCardContainer>
  );
};
