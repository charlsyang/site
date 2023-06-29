import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const CaseStudy = styled.article`   
    color: var(--color-text-base);
    position: relative;

    @media ${QUERIES.phoneAndBelow} {
    }

    & * {
        font-family: var(--font-sans);
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
        line-height: 1.25;;
        color: var(--color-text-base);
        margin-bottom: 1rem;
        position: absolute;
        width: 32%;  

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-l);
            margin-bottom: 0.75rem; 
            position: revert;
            width: 100%;
        }
    }

    & h4 {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-normal);
        color: var(--color-text-muted);
        width: 49%;
        margin-left: 51%;
        margin-top: 4rem;
        margin-bottom: var(--spacing-2x);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
            margin-left: 0;
            margin-top: 3rem;
            margin-bottom: 0.75rem; 
            position: revert;
            width: 100%;
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
        width: 49%;
        margin-left: 51%;
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            position: static;
            width: 100%;
            margin-left: 0;
        }

        @media ${QUERIES.phoneAndBelow} {
            font-size: var(--font-size-s);
        }
    }

    & > p:first-of-type {  // Project summary
        font-size: var(--font-size-l);
        margin-bottom: 10rem;

        @media ${QUERIES.phoneAndBelow} {
            font-size: var(--font-size-m);
            margin-bottom: 6rem;
        }
    }

    & h3+p {
        padding-top: 2px; // To achieve baseline alignment with h3
    }

    & h3+h4 {
        margin-top: 0; // Remove top margin when h4 directly follows h3
    }

    & a {
        font-family: inherit;
        color: inherit;
    }

    & a:hover, a:hover * {
        color: var(--color-accent);
    }

    & em {
        font-family: inherit;
    }

    & strong {
        font-family: inherit;
        font-weight: var(--font-weight-bold);
    }

    // Image

    & h2+figure, h3+figure, h4+figure {  
        margin-top: var(--spacing-3x); // trim top margin for images after headings
    }

`

export default CaseStudy;