import styled, { css } from "styled-components";
import Icon from "./Icon";

function ButtonNew({
  size = "md",
  variant = "emphasis",
  icon,
  iconPosition = "leading",
  children,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      $iconPosition={iconPosition}
      $icon={icon}
      {...props}
    >
      {icon && iconPosition === "leading" && <Icon name={icon} size={size} />}
      {children && <Label size={size}>{children}</Label>}
      {icon && iconPosition === "trailing" && <Icon name={icon} size={size} />}
    </Button>
  );
}

export default ButtonNew;

const Button = styled.button`
  /* Reset */
  border: none;
  margin: 0;
  text-decoration: none;

  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  /* Typography */
  font-size: 14px;
  font-family: var(--font-sans);
  font-weight: 500;
  line-height: 1.2;

  /* Shape */
  border-radius: calc(infinity * 1px);
  overflow: hidden;

  /* Appearance */
  background: white;
  color: black;

  /* Sizing */

  --padding-horizontal: 16px;
  padding: 0 var(--padding-horizontal);

  ${(props) =>
    props.size === "sm" &&
    css`
      height: 28px;
      --padding-horizontal: 12px;
      --offset: 2px;
    `}
  ${(props) =>
    props.size === "md" &&
    css`
      height: 32px;
      --padding-horizontal: 20px;
      --offset: 4px;
    `}
  ${(props) =>
    props.size === "lg" &&
    css`
      height: 40px;
      --padding-horizontal: 24px;
      --offset: 6px;
    `}
    ${(props) =>
    props.size === "icon" &&
    css`
      --padding-horizontal: 0;
      --padding-vertical: 0;
      width: 40px;
      height: 40px;
    `}

  ${(props) =>
    props.$iconPosition === "leading" &&
    css`
      padding-left: calc(var(--padding-horizontal) - var(--offset));
    `}

  ${(props) =>
    props.$iconPosition === "trailing" &&
    css`
      padding-right: calc(var(--padding-horizontal) - var(--offset));
    `}

  /* Interaction */
  cursor: pointer;
  user-select: none;
  transition: transform 0.15s ease, opacity 0.15s ease,
    background-color 0.3s ease, color 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background-color: color-mix(in srgb, white, black 8%);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: default;
    color: color-mix(in srgb, black, white 40%);
  }

  /* Accessible focus state */
  &:focus-visible {
    outline: 2px solid var(--color-accent, #6366f1);
    outline-offset: 2px;
  }
`;

const Label = styled.span`
  font-size: var(--font-size-xs);
  font-family: var(--font-sans);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-base);
  padding-top: 1px;

  ${(props) =>
    props.size === "lg" &&
    css`
      font-size: var(--font-size-s);
    `}
`;
