import { useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { QUERIES } from "../utils/constants";
import Fleuron from "../public/favicon.svg";
import MasonryTune, {
  DEFAULT_FADE_GRADIENTS,
  MASONRY_TUNE_DEFAULTS,
} from "./MasonryTune";

export default function WorkLayout({ children, allPostsData }) {
  const router = useRouter();
  const currentSlug = router.query.slug;
  // Case studies stay hidden on phone; only the /work index shows the grid.
  const showGridOnPhone = router.pathname === "/work";
  const showTune =
    showGridOnPhone &&
    (router.query.tune === "1" || router.query.tune === "true");
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container>
      {/* Same technique as components/Nav.js Blur — overlays grid on phone */}
      {showGridOnPhone && <NavBlur aria-hidden="true" />}
      <Sidebar>
        <NavWrapper $overlayGrid={showGridOnPhone}>
          <NavLinks>
            <Home href="/">
              <StyledFleuron />
            </Home>
            <Link href="/work">Work</Link>
            <Link href="/blog">Blog</Link>
          </NavLinks>
        </NavWrapper>
        {/* Intro - from current work/index.js */}
        <Intro $overlapGrid={showGridOnPhone}>
          <Headline>
            <h1>Charlsy Yang</h1>
            <p>Software Designer</p>
          </Headline>
          <Description>
            <p>
              I design software with a high bar for visual craft, a bias for
              prototyping, an affinity with code, and a lot of care. I am
              passionate about toolmaking and storytelling on the web and new
              computer interfaces.
            </p>
            <p>
              Currently I work on{" "}
              <Link href="https://effects.youtube.com" target="_blank">
                effects creation
              </Link>{" "}
              at YouTube. Learn more about me{" "}
              <Link href="https://charlsy.notion.site/Charlsy-as-a-Designer-d60da6d266e3419b861e422a6a910a80">
                as a designer
              </Link>
              .
            </p>
          </Description>
          <ContactLinks>
            <Link href="mailto:hi@charlsy.me">hi@charlsy.me</Link>
            <span>/</span>
            <Link href="https://x.com/imcharlsy" target="_blank">
              X (Twitter)
            </Link>
            <span>/</span>
            <Link href="https://linkedin.com/in/charlsyang" target="_blank">
              LinkedIn
            </Link>
          </ContactLinks>
        </Intro>

        {/* Project list - simplified from ProjectCard grid */}
        {/* <ProjectSection>
          <SectionHeading>Projects</SectionHeading>
          <ProjectList>
            {allPostsData?.map((project) => (
              <li key={project.slug}>
                <ProjectLink
                  href={`/work/${project.slug}`}
                  $active={currentSlug === project.slug}
                >
                  {project.title}
                </ProjectLink>
              </li>
            ))}
          </ProjectList>
        </ProjectSection> */}

        <Footer>
          <p>{time ?? "—"}</p>
          <p>San Francisco CA</p>
        </Footer>
      </Sidebar>
      <ContentArea $showOnPhone={showGridOnPhone}>
        {children}
        {/* Top/bottom edge dissolves — eased multi-stop (see MasonryTune) */}
        {showGridOnPhone && <GridTopFade aria-hidden="true" />}
        {showGridOnPhone && <GridBottomFade aria-hidden="true" />}
      </ContentArea>
      {showTune && <MasonryTune />}
    </Container>
  );
}

// ============================================
// Styled Components
// ============================================

const navFade = keyframes`
    from {
        opacity: 0;
        translate: 0 -8px;
    } to {
        opacity: 100%;
        translate: 0 0;
    }
`;

/*
 * Matches components/Nav.js Blur exactly:
 * backdrop-filter + mask-image gradient + tinted bg gradient ::after
 */
const NavBlur = styled.div`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 48px;
    z-index: 3;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    -webkit-mask-image: linear-gradient(to bottom, #000 0, transparent 100%);
    mask-image: linear-gradient(to bottom, #000 0, transparent 100%);
    pointer-events: none;
    user-select: none;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
        to bottom,
        var(--color-bg-base) 0,
        transparent 100%
      );
      opacity: 0.3;
    }
  }
`;

/*
 * Top dissolve at the grid band’s top edge (mirror of bottom).
 * Lives on ContentArea so Nav stays untouched — grid runs under nav blur.
 * Opaque toward the top (`to top`); tune overwrites --masonry-top-fade-*.
 */
const GridTopFade = styled.div`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    z-index: 5;
    height: var(
      --masonry-top-fade-height,
      ${MASONRY_TUNE_DEFAULTS.topFadeHeightPx}px
    );
    pointer-events: none;
    user-select: none;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      backdrop-filter: blur(
        var(--masonry-top-fade-blur, ${MASONRY_TUNE_DEFAULTS.topFadeBlurPx}px)
      );
      -webkit-backdrop-filter: blur(
        var(--masonry-top-fade-blur, ${MASONRY_TUNE_DEFAULTS.topFadeBlurPx}px)
      );
      -webkit-mask-image: var(
        --masonry-top-fade-mask-gradient,
        ${DEFAULT_FADE_GRADIENTS.topMask}
      );
      mask-image: var(
        --masonry-top-fade-mask-gradient,
        ${DEFAULT_FADE_GRADIENTS.topMask}
      );
    }

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: var(
        --masonry-top-fade-tint-gradient,
        ${DEFAULT_FADE_GRADIENTS.topTint}
      );
      opacity: var(
        --masonry-top-fade-tint,
        ${MASONRY_TUNE_DEFAULTS.topFadeTint}
      );
    }
  }
`;

/*
 * Bottom dissolve into page bg.
 *
 * Tint + mask use multi-stop eased gradients (see utils/easedGradient.js /
 * CodePen “HD CSS gradients w/ easing”) so alpha isn’t a harsh 2-stop ramp.
 * Tune widget (?tune=1) overwrites --masonry-fade-*-gradient on :root.
 */
const GridBottomFade = styled.div`
  display: none;

  @media ${QUERIES.phoneAndBelow} {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 5;
    height: var(--masonry-fade-height, ${MASONRY_TUNE_DEFAULTS.fadeHeightPx}px);
    pointer-events: none;
    user-select: none;

    /* Soften tiles — nav-style blur, masked with eased multi-stop */
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      backdrop-filter: blur(
        var(--masonry-fade-blur, ${MASONRY_TUNE_DEFAULTS.fadeBlurPx}px)
      );
      -webkit-backdrop-filter: blur(
        var(--masonry-fade-blur, ${MASONRY_TUNE_DEFAULTS.fadeBlurPx}px)
      );
      -webkit-mask-image: var(
        --masonry-fade-mask-gradient,
        ${DEFAULT_FADE_GRADIENTS.mask}
      );
      mask-image: var(
        --masonry-fade-mask-gradient,
        ${DEFAULT_FADE_GRADIENTS.mask}
      );
    }

    /* Eased multi-stop dissolve into page bg (opaque at bottom) */
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: var(
        --masonry-fade-tint-gradient,
        ${DEFAULT_FADE_GRADIENTS.tint}
      );
      opacity: var(--masonry-fade-tint, ${MASONRY_TUNE_DEFAULTS.fadeTint});
    }
  }
`;

const NavWrapper = styled.div`
  z-index: 2;
  height: var(--nav-height);
  animation: ${navFade} var(--duration-load) var(--ease-out) both;

  @media ${QUERIES.phoneAndBelow} {
    order: 1;
    width: 100%;
    box-sizing: border-box;
    padding: var(--spacing-2x);

    ${({ $overlayGrid }) =>
      $overlayGrid &&
      css`
        /* Float over the grid so masonry runs underneath the nav */
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 4;
      `}
  }
`;

const Home = styled(Link)`
  max-width: 24px;
`;

const StyledFleuron = styled(Fleuron)`
  display: block;
  transform: scale(0.9) translateY(-1px);
  & path {
    fill: var(--color-theme);
    transition: var(--transition-slow);
  }
`;

const NavLinks = styled.nav`
  grid-column: 7 / -1;
  display: flex;
  gap: var(--spacing-4x);
  position: relative;
  align-items: center;

  & a {
    font-size: var(--font-size-s);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  & a:hover {
    color: var(--color-theme);
  }

  @media ${QUERIES.phoneAndBelow} {
    gap: var(--spacing-2x);
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media ${QUERIES.phoneAndBelow} {
    position: relative;
    flex-direction: column;
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }
`;

const Sidebar = styled.aside`
  flex: 0 0 32%;
  max-width: 480px;
  min-width: 320px;
  padding: var(--spacing-3x) var(--spacing-4x);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  @media ${QUERIES.tabletAndBelow} {
    flex: 0 0 40%;
    min-width: 320px;
  }

  @media ${QUERIES.phoneAndBelow} {
    /* Flatten so nav / intro / footer can reorder around the grid band */
    display: contents;
  }
`;

const ContentArea = styled.main`
  position: relative;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  margin: var(--spacing-1x);
  margin-left: 0;
  border-radius: 16px;
  background-color: var(--color-bg-solid);
  border: 1px solid var(--color-border);

  @media ${QUERIES.phoneAndBelow} {
    display: ${({ $showOnPhone }) => ($showOnPhone ? "block" : "none")};
    order: 2;
    flex: none;
    width: 100%;
    box-sizing: border-box;
    /*
     * Offset the band ~half nav-height so visible tiles start mid-nav.
     * (padding-top won't shift PageTransition's absolute child.)
     * Nav still overlays the upper portion of this band.
     */
    margin: 0;
    margin-top: var(
      --masonry-top-inset,
      ${MASONRY_TUNE_DEFAULTS.topInsetPx}px
    );
    height: var(
      --masonry-grid-height,
      ${MASONRY_TUNE_DEFAULTS.gridHeightVh}vh
    );
    border: none;
    border-radius: 0;
    /* Match body so any gap under the fade is invisible */
    background-color: var(--color-bg-base);
  }
`;

const Intro = styled.section`
  margin-top: var(--spacing-4x);
  margin-bottom: 16vh;

  @media ${QUERIES.phoneAndBelow} {
    order: 3;
    width: 100%;
    box-sizing: border-box;
    padding: 0 var(--spacing-2x);
    margin-bottom: var(--spacing-4x);
    /* Default: normal spacing when case study (no grid) */
    margin-top: var(--spacing-4x);

    /* Pull only the headline up onto the grid's soft bottom edge */
    ${({ $overlapGrid }) =>
      $overlapGrid &&
      css`
        margin-top: calc(
          -1 * var(--masonry-headline-overlap, ${MASONRY_TUNE_DEFAULTS.headlineOverlapPx}px)
        );
        position: relative;
        z-index: 6;
      `}
  }
`;

const Headline = styled.div`
  font-family: var(--font-serif);
  font-weight: var(--font-weight-serif);
  font-size: 22px;
  color: var(--color-text-base);
  line-height: 1.2;
  margin-bottom: var(--spacing-3x);
  animation: onload-fade var(--duration-load) var(--ease-out) both;

  & h1 {
    font-weight: var(--font-weight-serif);
  }

  & p {
    color: var(--color-text-muted);
  }

  @media ${QUERIES.phoneAndBelow} {
    /* Keep name + role in the dissolve; bio starts on solid bg below */
    margin-bottom: var(--spacing-4x);
  }
`;

const Description = styled.div`
  margin-bottom: var(--spacing-5x);

  & p {
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-s);
    line-height: 1.45;
    color: var(--color-text-base);
    margin-bottom: var(--spacing-1x);
    text-wrap: pretty;
    hyphens: auto;
  }

  & p:first-of-type {
    animation: onload-fade var(--duration-load) var(--ease-out) both;
    animation-delay: var(--stagger-1);
  }

  & p:last-of-type {
    animation: onload-fade var(--duration-load) var(--ease-out) both;
    animation-delay: var(--stagger-2);
  }
`;

const ContactLinks = styled.div`
  display: flex;
  gap: var(--spacing-s);
  font-weight: var(--font-weight-normal);
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-3);

  & > div {
    flex: 1;
  }

  & p {
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-xs);
  }

  & span {
    color: var(--color-theme);
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  font-size: var(--font-size-xxs);
  color: var(--color-theme);
  /* margin-top: auto;/ */

  @media ${QUERIES.phoneAndBelow} {
    order: 4;
    width: 100%;
    box-sizing: border-box;
    padding: 0 var(--spacing-2x) var(--spacing-2x);
  }
`;

const ProjectSection = styled.section`
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-2x);
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-2);
`;

const SectionHeading = styled.h2`
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-2x);
`;

const ProjectList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1x);
`;

const ProjectLink = styled(Link)`
  display: block;
  padding: var(--spacing-1x) 0;
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-m);
  color: ${({ $active }) =>
    $active ? "var(--color-text-base)" : "var(--color-text-muted)"};
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-text-base);
  }

  ${({ $active }) =>
    $active &&
    `
    &::before {
      content: "→ ";
    }
  `}
`;
