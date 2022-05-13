import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const Article = styled.article`
    margin-top: calc(10rem - var(--back-button-height));
    margin-bottom: 10rem;
    color: var(--color-gray-900);
    width: 60ch;

    @media ${QUERIES.tabletAndBelow} {
        width: 50ch;
    }

    & * {
        font-family: var(--font-sans);
        font-size: var(--font-size-l);
        color:  var(--color-article-body);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    // Headings

    & h1 {
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
        color: var(--color-gray-900);
        margin-bottom: var(--spacing-s);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    & time {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-normal);
        color: var(--color-gray-600);
        display: block;
        margin-bottom: 4rem;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-bottom: 3.5rem;
        }
    }

    & h2 {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-bold);
        color: var(--color-gray-900);
        margin-top: 2.5rem;
        margin-bottom: 1.25rem;

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
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-medium);
        color: var(--color-gray-600);
        margin-top: 2rem;
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-top: 1.75rem;
            margin-bottom: 0.75rem;   
        }
    }

    & h4 {
        font-family: var(--font-serif);
        font-size: var(--font-size-m);
        font-weight: 500;
        color: var(--color-gray-900);
        font-style: italic;
        margin-top: 1.5rem;
        margin-bottom: 0.25rem;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-top: 1.25rem;
            margin-bottom: 0.25rem;
        }
    }

    // Paragraph

    & > p {
        font-family: var(--font-serif);
        color: var(--color-article-body);
        line-height: 1.5;
        margin-bottom: 1rem;
        hyphens: auto;
        hanging-punctuation: first;
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

   // List

   & li, li * {
        font-family: var(--font-serif);
        position: relative;
    }

    & ul {
        --bullet-width: 8px;
        --bullet-gap: 16px;
        --bullet-indent: calc(var(--bullet-width) + var(--bullet-gap));
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-left: var(--bullet-indent);
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            --bullet-gap: 12px;
        }
    }

    & ul > li::before {
        content: "*";
        position: absolute;
        left: calc(var(--bullet-indent) * -1);
        top: 4px;
        width: var(--bullet-width);
        color: var(--color-gray-600);
        font-family: var(--font-sans);
        font-size: var(--font-size-xl);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-l);
        }
    }

    & ol {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
        list-style-type: decimal;
        padding-left: var(--spacing-4x);
    }

    & ol li::marker {
        font-family: var(--font-sans);
        font-size: var(--font-size-s);
        color: var(--color-gray-600);
        font-variant-numeric: tabular-nums;
        letter-spacing: -1px;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-xs);
            padding-left: var(--spacing-3x);
        }
    }

    // Image

    & h2+figure, h3+figure, h4+figure {  
        margin-top: var(--spacing-3x); // trim top margin for images after headings
    }

    // Blockquote

    & blockquote p {
        font-family: var(--font-serif);
        font-style: italic;
        margin-top: 2rem;
    }

    & blockquote p+p {
        margin-top: 0;
        text-indent: 1.8em;
    }

    & blockquote p:last-of-type {
        margin-bottom: 2rem;
    }

    // Inline code

    & p > code {
        font-family: var(--font-mono);
        font-size: var(--font-size-xs);
        padding: 2px 4px;
        background-color: var(--mauve6);
        border-radius: 3px;
    }

    // Superscript

    & sup a {
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: var(--font-weight-medium);
        text-decoration: none;
        position: relative;
        top: -0.4em;
        padding-left: 2px;
    }

    & sup a::before {
        content: "[";
        font-feature-settings: 'sups';
    } 

    & sup a::after {
        content: "]";
    } 

    // Footnotes 

    & .footnotes::before {
        content: "* * *";
        color: var(--color-gray-600);
        display: block;
        text-align: center;
        letter-spacing: .5em;
        margin-bottom: var(--spacing-3x);
    }

    & .data-footnote-backref {
        font-family: var(--font-mono);
        text-decoration: none;
        position: relative;
        top: 1px;
    }

    & .footnotes {
        margin-top: 80px;
    }

    & #footnote-label {
        display: none;
    }

    // Divider

    & hr {
        border-top: .5px solid var(--color-divider);
        margin-bottom: var(--spacing-5x);
    }
`

export default Article;