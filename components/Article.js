import styled from 'styled-components';
import { QUERIES } from '../utils/constants';

const Article = styled.article`
    margin-top: calc(10rem - var(--back-button-height));
    margin-bottom: 10rem;
    color: var(--color-gray-900);
    width: 58ch;

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
        margin-bottom: 1.25rem;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
            margin-bottom: 1rem;
        }
    }

    & p+h2 {
        margin-top: 2.5rem;

        @media ${QUERIES.tabletAndBelow} {
            margin-top: 2rem;
        }
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

    & > p {
        font-family: var(--font-serif);
        color: var(--color-article-body);
        line-height: 1.5;
        margin-bottom: 1rem;
        overflow-wrap: break-word;
        hyphens: auto;
    }

    & a {
        font-family: inherit;
        color: inherit;
    }

    & a:hover {
        color: var(--color-accent);
    }

    & em {
        font-family: inherit;
    }

    & ol, ul {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: disc;
        margin-left: 1.75rem;
    }

    & li {
        font-family: var(--font-serif);
    }

    /* & blockquote p:first-of-type::before {
        content: '“';
        font-family: var(--font-serif);
        color: var(--color-gray-300);
        float: left;
        line-height: 30%;
        margin-top: 0.2em;
        margin-right: 0.2em;
        font-size: 3em;
    } */

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
`

export default Article;