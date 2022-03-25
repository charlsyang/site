import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
    */
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }

    @font-face {
        font-family: 'Diatype';
        font-weight: 100 700;
        font-display: swap;
        src: url(/fonts/ABCDiatypeVariable.woff2) format('woff2');
    }  

    /* DESIGN TOKENS */

    html {

        /* Typography */
        
        --fallback-sans: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
            Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        --fallback-serif: Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, 
            Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
        --ampersand-stack: Baskerville, Apple Garamond, Iowan Old Style, Athelas, Palatino, 
            Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, 
            Segoe UI Emoji, Segoe UI Symbol;

        --font-sans: 'Diatype', var(--fallback-sans);
        --font-serif: 'Newsreader', var(--fallback-serif);
        
        --font-weight-normal: 360;
        --font-weight-bold: 700;

        --font-size-base: 16;
        --font-size-xs: calc(14 / var(--font-size-base) * 1rem);
        --font-size-s: calc(16 / var(--font-size-base) * 1rem);
        --font-size-m: calc(18 / var(--font-size-base) * 1rem);
        --font-size-l: calc(20 / var(--font-size-base) * 1rem);
        --font-size-xl: calc(24 / var(--font-size-base) * 1rem);

        /* Color */

        --color-bg: hsl(0 0% 9%);
        --color-accent-hsl: 240 95% 76%;
        --color-accent: hsla(var(--color-accent-hsl) / 1);
        --color-accent-500: hsla(var(--color-accent-hsl) / .5);
        --color-accent-300: hsla(var(--color-accent-hsl) / .3);
        --color-gray-900: hsla(0 0% 100% / 0.9);
        --color-gray-600: hsla(0 0% 100% / 0.6);
        --color-gray-300: hsla(0 0% 100% / 0.3);

        /* Spacing */
        --spacing-base: 8px;
        --spacing-s: calc(var(--spacing-base) / 2);
        --spacing-1x: var(--spacing-base);
        --spacing-2x: calc(var(--spacing-base) * 2);
        --spacing-3x: calc(var(--spacing-base) * 3);
        --spacing-4x: calc(var(--spacing-base) * 4);
        --spacing-5x: calc(var(--spacing-base) * 5);
        --spacing-6x: calc(var(--spacing-base) * 6);

        --footer-height: calc(var(--spacing-base) * 8);

        /* Animation */
        --transition-default: 240ms;
    }

    /* GLOBAL STYLES */

    *,
    *:before,
    *:after {
    box-sizing: border-box;
    line-height: 1.5;
    font-family: var(--fallback-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
    }

    html,
    body {
        font-family: var(--font-sans);
        background: var(--color-bg);
        min-height: 100%;
    }

    a {
        color: var(--color-gray-900);
        text-decoration-color: var(--color-gray-300);
        text-decoration-thickness: 1.25px;
        text-underline-offset: 2.4px;
        transition: all var(--transition-default);
    }

    a:hover {
        color: var(--color-accent);
        text-decoration-color: var(--color-accent);
    }

    ::selection {
        background-color: var(--color-accent-300);
    }

    img {
        max-width: 100%;
        display: block;
    }

`;

export default GlobalStyles;