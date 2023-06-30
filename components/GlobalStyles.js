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

    @font-face {
        font-family: 'Marat';
        font-weight: 400;
        font-style: normal;
        font-display: swap;
        src: url(/fonts/Marat-Regular.woff2) format('woff2');
    }
    
    @font-face {
        font-family: 'Marat';
        font-weight: 400;
        font-style: italic;
        font-display: swap;
        src: url(/fonts/Marat-RegularItalic.woff2) format('woff2');
    }

    /* DESIGN TOKENS */

    html {

        /* Typography */
        
        --font-sans: 'Diatype', ${FAMILIES.fallbackSans};
        --font-serif: 'Marat', ${FAMILIES.fallbackSerif};
        --font-mono: 'SF Mono', ${FAMILIES.fallbackMono};
        --font-ampersand: ${FAMILIES.ampersand};

        --font-size-base: 16;
        --font-size-xxs: calc(12 / var(--font-size-base) * 1rem);
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
    font-family: var(--fallback-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: auto;
}

    html,
    body {
        font-family: var(--font-sans);
        line-height: 1.5;
        background: var(--color-bg-base);
        min-height: 100%;
    }

    :root {
        --color-bg-base: ${THEME.colors.mauve1};
        --color-bg-solid: ${THEME.colors.mauve3};
        --color-bg-hover: ${THEME.colors.mauve4};
        --color-bg-selected: ${THEME.colors.violet5};
        --color-text-base: ${THEME.colors.mauve12};
        --color-text-article: ${DARKTHEME.colors.mauve6};
        --color-text-muted: ${THEME.colors.mauve11};
        --color-text-faint: ${THEME.colors.mauve9};
        --color-border: ${THEME.colors.mauve6};
        --color-link-border: ${THEME.colors.mauve8};
        --color-link-hover: ${THEME.colors.violet9};

        --font-weight-normal: ${THEME.weights.normal};
        --font-weight-medium: ${THEME.weights.medium};
        --font-weight-bold: ${THEME.weights.bold};
    }

    [data-theme='dark'] {
        --color-bg-base: ${DARKTHEME.colors.mauve1};
        --color-bg-solid: ${DARKTHEME.colors.mauve3};
        --color-bg-hover: ${DARKTHEME.colors.mauve4};
        --color-bg-selected: ${DARKTHEME.colors.violet5};
        --color-text-base: ${DARKTHEME.colors.mauve12};
        --color-text-article: ${THEME.colors.mauve8};
        --color-text-muted: ${DARKTHEME.colors.mauve11};
        --color-text-faint: ${DARKTHEME.colors.mauve9};
        --color-border: ${DARKTHEME.colors.mauve6};
        --color-link-border: ${DARKTHEME.colors.mauve8};
        --color-link-hover: ${DARKTHEME.colors.violet9};

        --font-weight-normal: ${DARKTHEME.weights.normal};
        --font-weight-medium: ${DARKTHEME.weights.medium};
        --font-weight-bold: ${DARKTHEME.weights.bold};
    }

    a {
        color: var(--color-text-base);
        text-decoration-color: var(--color-link-border);
        text-decoration-thickness: 1.5px;
        text-underline-offset: 2.4px;
        text-decoration-skip-ink: auto;        
        transition: all var(--transition-default);
    }

    a:hover {
        color: var(--color-link-hover);
        text-decoration-color: var(--color-link-hover);
        transition: all var(--transition-fast);
    }

    ::selection {
        background-color: var(--color-bg-selected);
    }

    img {
        max-width: 100%;
        display: block;
    }

`;

export default GlobalStyles;