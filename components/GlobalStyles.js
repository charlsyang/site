import { createGlobalStyle } from 'styled-components';
import { FAMILIES, WEIGHTS, THEME, DARKTHEME } from '../utils/constants';

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
        
        --font-sans: 'Diatype', ${FAMILIES.fallbackSans};
        --font-serif: freight-text-pro, ${FAMILIES.fallbackSerif};
        --font-mono: ${FAMILIES.fallbackMono};
        --font-ampersand: ${FAMILIES.ampersand};

        --font-size-base: 16;
        --font-size-xs: calc(14 / var(--font-size-base) * 1rem);
        --font-size-s: calc(16 / var(--font-size-base) * 1rem);
        --font-size-m: calc(18 / var(--font-size-base) * 1rem);
        --font-size-l: calc(20 / var(--font-size-base) * 1rem);
        --font-size-xl: calc(24 / var(--font-size-base) * 1rem);

        /* Spacing */

        --spacing-base: 8px;
        --spacing-s: calc(var(--spacing-base) / 2);
        --spacing-1x: var(--spacing-base);
        --spacing-2x: calc(var(--spacing-base) * 2);
        --spacing-3x: calc(var(--spacing-base) * 3);
        --spacing-4x: calc(var(--spacing-base) * 4);
        --spacing-5x: calc(var(--spacing-base) * 5);
        --spacing-6x: calc(var(--spacing-base) * 6);

        --footer-height: calc(var(--spacing-base) * 7);
        --back-button-height: var(--spacing-6x);

        /* Animation */

        --transition-fast: 160ms;
        --transition-default: 240ms;
        --transition-slow: 320ms;

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
        --color-accent-hsl: 240 95% 76%;
        --color-accent: hsla(var(--color-accent-hsl) / 1);
        --color-accent-500: hsla(var(--color-accent-hsl) / .5);
        --color-accent-300: hsla(var(--color-accent-hsl) / .3);
    }

    :root {
        --color-bg: ${THEME.colors.mauve1};
        --color-gray-900: ${THEME.colors.mauve12};
        --color-gray-600: ${THEME.colors.mauve11};
        --color-gray-300: ${THEME.colors.mauve9};
        --color-article-body: ${DARKTHEME.colors.mauve7};
        --color-link-underline: ${THEME.colors.mauve8};
        --color-divider: ${THEME.colors.mauve4};
        --font-weight-normal: ${THEME.weights.normal};
        --font-weight-medium: ${THEME.weights.medium};
        --font-weight-bold: ${THEME.weights.bold};
    }

    [data-theme='dark'] {
        --color-bg: ${DARKTHEME.colors.mauve1};
        --color-gray-900: ${DARKTHEME.colors.mauve12};
        --color-gray-600: ${DARKTHEME.colors.mauve10};
        --color-gray-300: ${DARKTHEME.colors.mauve8};
        --color-article-body: ${DARKTHEME.colors.mauve11};
        --color-link-underline: var(--color-gray-300);
        --color-divider: ${DARKTHEME.colors.mauve4};
        --font-weight-normal: ${DARKTHEME.weights.normal};
        --font-weight-medium: ${DARKTHEME.weights.medium};
        --font-weight-bold: ${DARKTHEME.weights.bold};
    }

    a {
        color: var(--color-gray-900);
        text-decoration-color: var(--color-link-underline);
        text-decoration-thickness: 1.5px;
        text-underline-offset: 2.4px;
        text-decoration-skip-ink: auto;        
        transition: all var(--transition-default);
    }

    a:hover {
        color: var(--color-accent);
        text-decoration-color: var(--color-accent);
        transition: all var(--transition-fast);
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