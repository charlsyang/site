import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const Article = styled.article`
    margin-top: calc(10rem - var(--back-button-height));
    margin-bottom: 10rem;
    color: var(--color-text-base);
    max-width: 60ch;

    @media ${QUERIES.tabletAndBelow} {
        width: 50ch;
    }

    & * {
        font-family: var(--font-sans);
        font-size: var(--font-size-l);
        color:  var(--color-text-article); 
        
        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    // Headings

    & h1 {
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-base);
        margin-bottom: var(--spacing-s);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    & time {
        font-size: var(--font-size-m);
        font-weight: var(--font-weight-normal);
        color: var(--color-text-muted);
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
        color: var(--color-text-base);
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
        color: var(--color-text-muted);
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
        font-weight: var(--font-weight-medium);
        color: var(--color-text-base);
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

    & p {
        font-family: var(--font-serif);
        line-height: 1.45;
        margin-bottom: 1rem;
        hyphens: auto;
        hanging-punctuation: first;

        @media ${QUERIES.phoneAndBelow} {
            line-height: 1.4;
        }
    }

    & a {
        font-family: inherit;
        color: inherit;
    }

    & a:hover, a:hover * {
        color: var(--color-link-hover);
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
        --bullet-gap: 10px;
        --bullet-indent: calc(var(--bullet-width) + var(--bullet-gap));
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            --bullet-gap: 8px;
        }
        
        @media ${QUERIES.phoneAndBelow} {
            padding-left: var(--spacing-2x);
        }
    }

    & ul > li::before {
        content: "⁃";
        position: absolute;
        left: calc(var(--bullet-indent) * -1);
        width: var(--bullet-width);
        font-family: var(--font-sans);
        color: var(--color-text-faint);

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    & ol {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-bottom: 1rem;
        list-style-type: none;
        counter-reset: list-item;

        @media ${QUERIES.phoneAndBelow} {
            padding-left: var(--spacing-3x);
        }
    }

    & ol li::before {
        content: counter(list-item) '.';
        position: absolute;
        left: -36px;
        padding-top: 4px;
        font-family: var(--font-sans);
        font-size: var(--font-size-s);
        color: var(--color-text-muted);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.5px;
        
        text-align: right; 
        width: 32px;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-xs);
            left: -34px;
            padding-top: 3.5px;
        }
    }

    // Image

    & h2+figure, h3+figure, h4+figure {  
        margin-top: var(--spacing-3x); // trim top margin for images after headings
    }

    // Blockquote

    & blockquote {
        border-left: 2px solid var(--color-border);
        padding-left: 1rem;
        margin: 2rem 0;
    }

    & blockquote p {
        font-weight: var(--font-weight-normal);
        color: var(--color-text-muted);
    }

    // Inline code

    & p > code {
        font-family: var(--font-mono);
        font-size: var(--font-size-xs);
        padding: 2px 4px;
        background-color: var(--color-bg-solid);
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
        color: var(--color-text-muted);
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
        border: none;
        border-top: 1px solid var(--color-border);
        margin-bottom: var(--spacing-5x);
    }

    // Table
    & table {
        width: 100%;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    & th, td {
        padding: 4px;
        font-family: var(--font-serif);
    }
`

export default Article;