import styled, { css } from "styled-components";

// ============================================
// Button Component
// ============================================

/**
 * Button component with slots for icons.
 *
 * Props:
 * - `variant`: "default" | "secondary" | "elevated" (default: "default")
 * - `size`: "sm" | "md" | "lg" (default: "md")
 * - `iconOnly`: boolean — square icon-only button
 * - `icon`: React element — icon for iconOnly mode
 * - `startIcon`: React element — icon before label (icon + text mode)
 * - `endIcon`: React element — icon after label (icon + text mode)
 * - `as`: "a" | "button" — polymorphic element type
 *
 * @example
 * // Text only
 * <Button>Click me</Button>
 *
 * // Icon + text
 * <Button startIcon={<Icon name="refresh" />}>Shuffle</Button>
 * <Button endIcon={<Icon name="arrowUpRight" />}>Learn more</Button>
 *
 * // Animated icon + text
 * <Button startIcon={<AnimatedIcon $flipping={isFlipping} />}>Shuffle</Button>
 *
 * // Icon only
 * <Button iconOnly icon={<Icon name="pause" />} aria-label="Pause" />
 *
 * // Variants
 * <Button variant="secondary">Cancel</Button>
 * <Button variant="elevated">Submit</Button>
 *
 * // Link button
 * <Button as="a" href="/contact">Contact</Button>
 *
 * // Extend with styled()
 * const PositionedButton = styled(Button)`position: absolute;`;
 */
export function Button({
  variant = "default",
  size = "md",
  iconOnly = false,
  icon,
  startIcon,
  endIcon,
  children,
  ...props
}) {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $iconOnly={iconOnly}
      $hasStartIcon={!!startIcon}
      $hasEndIcon={!!endIcon}
      {...props}
    >
      {iconOnly ? (
        icon
      ) : (
        <>
          {startIcon}
          {children && <ButtonLabel $size={size}>{children}</ButtonLabel>}
          {endIcon}
        </>
      )}
    </StyledButton>
  );
}

export default Button;

// ============================================
// Base Button Styles (exportable for custom use)
// ============================================

export const buttonStyles = css`
  /* Reset */
  border: none;
  margin: 0;
  text-decoration: none;

  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  /* Typography */
  font-size: var(--font-size-xs);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-regular);
  line-height: 1.2;

  /* Shape */
  overflow: hidden;

  /* Interaction */
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease, opacity 0.15s ease,
    background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent, #6366f1);
    outline-offset: 2px;
  }
`;

// ============================================
// Variant Styles
// ============================================

const variantStyles = {
  default: css`
    background: var(--color-bg-inverted);
    color: var(--color-text-inverted);

    @media (hover: hover) {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-bg-inverted),
          var(--color-bg-base) 12%
        );
      }
    }
  `,

  primary: css`
    background: var(--btn-primary-bg);
    color: var(--color-constant-white);
  `,

  secondary: css`
    background: var(--color-bg-hover);
    color: var(--color-text-muted);

    @media (hover: hover) {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-bg-hover),
          var(--color-bg-inverted) 6%
        );
        color: var(--color-text-muted);
      }
    }
  `,

  elevated: css`
    background: var(--btn-elevated-bg);
    backdrop-filter: blur(12px);
    color: var(--color-text-inverted);
    box-shadow: var(--btn-elevated-border), var(--shadow-elevation-medium);

    @media (hover: hover) {
      &:hover {
        background: var(--btn-elevated-bg-hover);
      }
    }

    &:active {
      background: var(--btn-elevated-bg-active);
    }
  `,
};

// ============================================
// Size Variants
// ============================================

const sizeStyles = {
  sm: css`
    height: 28px;
    font-size: 14px;
    --padding-horizontal: 12px;
    --offset: 2px;
    padding: 0 var(--padding-horizontal);
    border-radius: 6px; /* fallback */

    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 10px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,
  md: css`
    height: 32px;
    font-size: 14px;
    --padding-horizontal: 20px;
    --offset: 4px;
    padding: 0 var(--padding-horizontal);
    border-radius: 8px; /* fallback */

    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 12px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,
  lg: css`
    height: 40px;
    font-size: 16px;
    --padding-horizontal: 24px;
    --offset: 4px;
    padding: 0 var(--padding-horizontal);
    border-radius: 12px; /* fallback */

    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 16px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  `,
};

const iconOnlySizeStyles = {
  sm: css`
    width: 28px;
    height: 28px;
    /* border-radius: calc(infinity * 1px); */
    padding: 0;
    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 10px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,
  md: css`
    width: 32px;
    height: 32px;
    /* border-radius: calc(infinity * 1px); */
    padding: 0;
    border-radius: 8px; /* fallback */

    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 12px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,
  lg: css`
    width: 40px;
    height: 40px;
    /* border-radius: calc(infinity * 1px); */
    padding: 0;
    border-radius: 12px; /* fallback */

    @supports (corner-shape: superellipse(1.5)) {
      border-radius: 16px;
      corner-shape: superellipse(1.5);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  `,
};

// Asymmetric padding when icon is present
const iconPaddingStyles = css`
  ${(props) =>
    props.$hasStartIcon &&
    !props.$iconOnly &&
    css`
      padding-left: calc(var(--padding-horizontal) - var(--offset));
    `}

  ${(props) =>
    props.$hasEndIcon &&
    !props.$iconOnly &&
    css`
      padding-right: calc(var(--padding-horizontal) - var(--offset));
    `}
`;

// ============================================
// Styled Components
// ============================================

const StyledButton = styled.button`
  ${buttonStyles}
  ${(props) => variantStyles[props.$variant] || variantStyles.default}
  ${(props) => {
    const size = props.$size || "md";
    return props.$iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size];
  }}
  ${iconPaddingStyles}
`;

const ButtonLabel = styled.span`
  padding-top: 1px;

  ${(props) =>
    props.$size === "lg" &&
    css`
      font-size: var(--font-size-s);
    `}
`;
