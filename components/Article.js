import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const Article = styled.article`
    color: var(--color-text-base);
    max-width: 57ch;
    grid-column: 7 / -1;
    counter-reset: sidenote-counter;
    animation: onload-fade var(--duration-load) var(--ease-out) backwards;
    animation-delay: var(--stagger-2);

    @media ${QUERIES.tabletAndBelow} {
        grid-column: 5 / -1;
    }

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
        animation: onload-fade var(--duration-load) var(--ease-out) backwards;
        animation-delay: var(--stagger-1);
    }

    // Headings

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

    & h2:not(:empty):first-child {
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
        font-size: var(--font-size-l);
        font-weight: var(--font-weight-serif);
        color:  var(--color-text-article); 
        line-height: 1.45;
        margin-bottom: 1em;
        hyphens: auto;
        hyphenate-limit-chars: 6 3 2;
        hyphenate-limit-lines: 2;
        hyphenate-limit-last: always;
        hyphenate-limit-zone: 8%;
        hanging-punctuation: first last;

        @media ${QUERIES.phoneAndBelow} {
            line-height: 1.5;
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
        font-size: var(--font-size-l);
        color:  var(--color-text-article); 
        line-height: 1.45;
        position: relative;
    }

    & ul {
        --bullet-width: 8px;
        --bullet-gap: 10px;
        --bullet-indent: calc(var(--bullet-width) + var(--bullet-gap));
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        margin-bottom: 1rem;

        @media ${QUERIES.tabletAndBelow} {
            --bullet-gap: 8px;
        }
        
        @media ${QUERIES.phoneAndBelow} {
            padding-left: var(--spacing-2x);
        }
    }

    & ul > li::before {
        content: "–";
        position: absolute;
        left: calc(var(--bullet-indent) * -1);
        width: var(--bullet-width);
        font-family: var(--font-sans);
        color: var(--color-text-faint);
        margin-top: 1px;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-m);
        }
    }

    & ol {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        margin-bottom: 1rem;
        list-style-type: none;
        counter-reset: list-counter;

        @media ${QUERIES.phoneAndBelow} {
            padding-left: var(--spacing-3x);
        }
    }

    & ol li::before {
        content: counter(list-item);
        font-family: var(--font-sans);
        font-size: var(--font-size-s);
        font-variant-numeric: tabular-nums;
        color: var(--color-text-muted);
        letter-spacing: -0.5px;
        
        position: absolute;
        left: -2em; 
        margin-top: 0.21em; 
        text-align: right; 
        width: 20px;

        @media ${QUERIES.phoneAndBelow} {
            left: -1.8em; 
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
        padding: 2px var(--spacing-s);
        margin: 0 1px;
        background-color: var(--color-bg-solid);
        border-radius: 4px;
    }

    // Superscript

    & sup a {
        font-family: var(--font-sans);
        font-size: var(--font-size-m);
        color: var(--color-text-muted);
        text-decoration: none;
        padding-left: 2px;
        font-feature-settings: 'sups';
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
        font-size: var(--font-size-m);
        color: var(--color-text-article);
    }
`

export default Article;