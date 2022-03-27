

export const WEIGHTS = {
    normal: 360,
    medium: 460,
    bold: 560,
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