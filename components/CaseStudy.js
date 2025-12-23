import styled from "styled-components";
import { QUERIES } from "../utils/constants";

const CaseStudy = styled.article`
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-2);
  display: flex;
  flex-direction: column;
  align-items: center;

  & * {
    font-family: var(--font-sans);
  }

  // Text elements
  & h2,
  & h3,
  & h4,
  & > p {
    width: 100%;
    max-width: 640px;
  }

  // Headings

  & h2 {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: clamp(4rem, 10vw, 11rem);
    margin-bottom: var(--spacing-1x);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-xxs);
    }
  }

  & h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.25;
    color: var(--color-text-base);
    margin-bottom: 1rem;

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
      margin-bottom: 0.75rem;
    }
  }

  & h4 {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-muted);
    margin-top: 3rem;
    margin-bottom: var(--spacing-2x);

    @media ${QUERIES.tabletAndBelow} {
      margin-bottom: 0.75rem;
    }
  }

  // Paragraph

  & > p {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-article);
    line-height: 1.5;
    hyphens: auto;
    hanging-punctuation: first;
    margin-bottom: 1rem;

    @media ${QUERIES.phoneAndBelow} {
      font-size: var(--font-size-s);
    }
  }

  & > p:first-of-type {
    // Project summary
    font-size: var(--font-size-l);
    margin-bottom: 6rem;

    @media ${QUERIES.phoneAndBelow} {
      font-size: var(--font-size-m);
      margin-bottom: 4rem;
    }
  }

  & a {
    font-family: inherit;
    color: inherit;
  }

  & a:hover,
  a:hover * {
    color: var(--color-link-hover);
  }

  & em {
    font-family: inherit;
  }

  & strong {
    font-family: inherit;
    font-weight: var(--font-weight-bold);
  }

  // Image

  & h2 + figure,
  h3 + figure,
  h4 + figure {
    margin-top: var(--spacing-3x); // trim top margin for images after headings
  }
`;

export default CaseStudy;
