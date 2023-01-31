import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const CaseStudy = styled.article`   
    margin-bottom: 10rem;
    color: var(--color-gray-900);
    position: relative;

    @media ${QUERIES.tabletAndBelow} {
        width: 50ch;
    }

    & * {
        font-family: var(--font-sans);
    }

    // Headings

    & h2 {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        color: var(--color-gray-600);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: clamp(2rem, 10vw, 11rem);
        margin-bottom: var(--spacing-1x);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
    }

    & time+h2 {
        margin-top: 0;  // Remove top margin if article starts with H2
    }

    & h3 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-medium);
        line-height: 1.25;;
        color: var(--color-gray-900);
        margin-bottom: 1rem;
        position: absolute;
        width: 32%;  

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-top: 1.75rem;
            margin-bottom: 0.75rem; 
            position: revert;
            width: 100%;
        }
    }

    & h4 {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-normal);
        color: var(--color-gray-600);
        width: 49%;
        margin-left: 51%;
        margin-top: 2rem;
        margin-bottom: var(--spacing-1x);
    }

    // Paragraph

    & p {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-normal);
        color: var(--color-article-body);       
        line-height: 1.5;
        hyphens: auto;
        hanging-punctuation: first;
        width: 49%;
        margin-left: 51%;
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            position: revert;
            width: 100%;
            margin-left: 0;
        }
    }

    & p:first-of-type {  // Project summary
        font-size: var(--font-size-l);
        line-height: 1.4;
        margin-bottom: 10rem;
    }

    & h3+p {
        padding-top: 2px; // To achieve baseline alignment with h3
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