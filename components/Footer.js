import styled, { keyframes } from "styled-components";
import Link from "next/link";
import { QUERIES } from "../utils/constants";

const Footer = () => {
  return (
    <FooterWrapper>
      <Divider />
      <FooterContent>
        <Footnote>© 2025 · San Francisco</Footnote>
        <Link href="/colophon" passHref legacyBehavior>
          <Colophon>Colophon</Colophon>
        </Link>
      </FooterContent>
    </FooterWrapper>
  );
};

const footerFade = keyframes`
    from {
        opacity: 0;
        translate: 0 8px;
    } to {
        opacity: 100%;
        translate: 0 0;
    }
`;

const FooterWrapper = styled.footer`
  height: var(--footer-height);
  position: relative;
  max-width: min(100%, calc(1200px + 40px * 2));
  margin-left: auto;
  margin-right: auto;
  padding-left: 40px;
  padding-right: 40px;

  animation: ${footerFade} var(--duration-load) var(--ease-out) both;

  @media ${QUERIES.phoneAndBelow} {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

  background-image: linear-gradient(
    90deg,
    var(--color-bg-base) 0%,
    var(--color-border) 25%,
    var(--color-border) 50%,
    var(--color-border) 75%,
    var(--color-bg-base) 100%
  );

  @media ${QUERIES.laptopAndBelow} {
    background-image: linear-gradient(
      90deg,
      var(--color-bg-base) 0%,
      var(--color-border) 10%,
      var(--color-border) 50%,
      var(--color-border) 90%,
      var(--color-bg-base) 100%
    );
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Footnote = styled.p`
  font-size: var(--font-size-xs);
  font-family: var(--font-sans);
  color: var(--color-text-faint);
`;

const Ampersand = styled.span`
  font-family: var(--font-ampersand);
  font-style: italic;
  font-weight: var(--font-weight-normal);
  padding-right: 1px;
`;

const Colophon = styled.a`
  font-family: var(--font-sans);
  font-size: var(--font-size-xs);
  color: var(--color-text-faint);
  text-decoration: none;

  & :hover {
    color: var(--color-text-base);
    cursor: pointer;
  }
`;

export default Footer;
