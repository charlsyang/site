import { tomato, tomatoDark, sand, sandDark } from "@radix-ui/colors";

export const THEME = {
  colors: {
    ...sand,
    ...tomato,
  },

  weights: {
    normal: 400,
    medium: 500,
    bold: 600,
  },
};

export const DARKTHEME = {
  colors: {
    ...sandDark,
    ...tomatoDark,
  },

  weights: {
    normal: 360,
    medium: 460,
    bold: 560,
  },
};

export const WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  bold: 600,
};

/* Desktop first */

export const BREAKPOINTS = {
  phoneMax: 550,
  tabletMax: 1100,
  laptopMax: 1600,
};

export const QUERIES = {
  phoneAndBelow: `(max-width: ${BREAKPOINTS.phoneMax / 16}rem)`,
  tabletAndBelow: `(max-width: ${BREAKPOINTS.tabletMax / 16}rem)`,
  laptopAndBelow: `(max-width: ${BREAKPOINTS.laptopMax / 16}rem)`,
};

export const FAMILIES = {
  fallbackSerif:
    "Iowan Old Style, Apple Garamond, Baskerville, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
  fallbackSans:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
  fallbackMono:
    "Menlo, Consolas, Monaco, Liberation Mono, Lucida Console, monospace",
  ampersand:
    "Baskerville, Apple Garamond, Iowan Old Style, Athelas, Palatino, Times New Roman, Droid Serif, Times, Source Serif Pro, serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
};
