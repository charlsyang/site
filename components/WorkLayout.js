import { useState, useEffect } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { QUERIES } from "../utils/constants";
import Fleuron from "../public/favicon.svg";
import { keyframes } from "styled-components";

export default function WorkLayout({ children, allPostsData }) {
  const router = useRouter();
  const currentSlug = router.query.slug;
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
      <Sidebar>
        <NavWrapper>
          <NavLinks>
            <Home href="/">
              <StyledFleuron />
            </Home>
            <Link href="/work">Work</Link>
            <Link href="/blog">Blog</Link>
          </NavLinks>
        </NavWrapper>
        {/* Intro - from current work/index.js */}
        <Intro>
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
              Currently I am designing the shopping experience on Google Search.
              Learn more about me{" "}
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
              twitter
            </Link>
            <span>/</span>
            <Link href="https://linkedin.com/in/charlsyang" target="_blank">
              linkedin
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
      <ContentArea>{children}</ContentArea>
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

const NavWrapper = styled.div`
  z-index: 2;
  height: var(--nav-height);
  animation: ${navFade} var(--duration-load) var(--ease-out) both;
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
    flex: 1;
    padding: var(--spacing-2x);
    max-width: revert;
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
    display: none; /* Hide sidebar on mobile for now */
  }
`;

const Intro = styled.section`
  margin-top: var(--spacing-4x);
  margin-bottom: 16vh;
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
