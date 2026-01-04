import styled from "styled-components";

// ============================================
// Icon SVG Definitions
// ============================================

const ICONS = {
  play: (
    <path
      d="M9.24394 2.36758C7.41419 1.18362 5 2.49701 5 4.67639V19.3238C5 21.5032 7.41419 22.8166 9.24394 21.6326L20.5624 14.3089C22.2371 13.2253 22.2372 10.775 20.5624 9.69129L9.24394 2.36758Z"
      fill="currentColor"
    />
  ),
  pause: (
    <>
      <path
        d="M5.75 3C4.7835 3 4 3.7835 4 4.75V19.25C4 20.2165 4.7835 21 5.75 21H8.25C9.2165 21 10 20.2165 10 19.25V4.75C10 3.7835 9.2165 3 8.25 3H5.75Z"
        fill="currentColor"
      />
      <path
        d="M15.75 3C14.7835 3 14 3.7835 14 4.75V19.25C14 20.2165 14.7835 21 15.75 21H18.25C19.2165 21 20 20.2165 20 19.25V4.75C20 3.7835 19.2165 3 18.25 3H15.75Z"
        fill="currentColor"
      />
    </>
  ),
  refresh: (
    <>
      <path
        d="M18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.9 8H8.1M11.9 12H12.1M15.9 16H16.1M8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8ZM12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12ZM16.5 16C16.5 16.2761 16.2761 16.5 16 16.5C15.7239 16.5 15.5 16.2761 15.5 16C15.5 15.7239 15.7239 15.5 16 15.5C16.2761 15.5 16.5 15.7239 16.5 16Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  fix: (
    // <path
    //   d="M4.24023 14.75C5.37278 17.9543 8.42869 20.25 12.0208 20.25C16.5771 20.25 20.2708 16.5563 20.2708 12C20.2708 7.44365 16.5771 3.75 12.0208 3.75C9.20364 3.75 7.32073 4.95438 5.4998 7.00891M4.7498 4V7.5C4.7498 7.77614 4.97366 8 5.2498 8H8.7498"
    //   stroke="currentColor"
    //   strokeWidth="1.5"
    //   strokeLinecap="round"
    //   strokeLinejoin="round"
    // />
    <>
      <path
        d="M5 4V7.25C5 7.66421 5.33579 8 5.75 8H8.75M19.0118 20V16.75C19.0118 16.3358 18.6761 16 18.2618 16H15.0118M4 12C4 16.4183 7.58172 20 12 20C14.6362 20 17.0303 18.7249 18.5 16.7578M20 12C20 7.58172 16.4183 4 12 4C9.36378 4 6.96969 5.27512 5.5 7.24224"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </>
  ),
  arrowUpRight: (
    <path
      d="M18 15V6M18 6H9M18 6L6.25 17.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

// ============================================
// Size Presets
// ============================================

const SIZES = {
  sm: 16,
  md: 16,
  lg: 18,
};

// ============================================
// Icon Component
// ============================================

/**
 * Icon component with centralized SVG definitions and sizing.
 *
 * @param {Object} props
 * @param {'play' | 'pause' | 'refresh' | 'fix'} props.name - Icon identifier
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - Predefined size
 * @param {string} [props.color] - Icon color (accepts CSS vars)
 * @param {string} [props.className] - For animations or custom styles
 * @param {React.CSSProperties} [props.style] - Inline style overrides
 */

export default function Icon({
  name,
  size = "md",
  color,
  className,
  style,
  ...props
}) {
  const iconPath = ICONS[name];

  if (!iconPath) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const sizeValue = SIZES[size] || SIZES.md;

  return (
    <IconWrapper
      className={className}
      style={{ ...style, "--icon-color": color }}
      {...props}
    >
      <svg
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {iconPath}
      </svg>
    </IconWrapper>
  );
}

// ============================================
// Styled Components
// ============================================

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--icon-color, currentColor);
  line-height: 0;

  svg {
    display: block;
    flex-shrink: 0;
  }
`;

// ============================================
// Named Exports for Direct SVG Access (if needed)
// ============================================

export { ICONS, SIZES };
