import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { QUERIES } from "../utils/constants";
import Fleuron from "../public/favicon.svg";
import { keyframes } from "styled-components";

export default function WorkLayout({ children, allPostsData }) {
  const router = useRouter();
  const currentSlug = router.query.slug;

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
            <p>
              Charlsy designs visual and interactive experience for products
              and&nbsp;brands.
            </p>
            <p>
              He cares deeply about quality and holds craftsmanship dear
              to&nbsp;heart.
            </p>
          </Headline>
          {/* <Callout>
            <p>
              Learn more about{" "}
              <Link href="https://charlsy.notion.site/Charlsy-as-a-Designer-d60da6d266e3419b861e422a6a910a80">
                Charlsy as a designer
              </Link>
              .
            </p>
          </Callout> */}
        </Intro>

        {/* Contact links - from current work/index.js */}
        <ContactLinks>
          <div>
            <p>Email</p>
            <Link href="mailto:hi@charlsy.me">hi@charlsy.me</Link>
          </div>
          <div>
            <p>Resume</p>
            <Link href="https://charlsy.cv">charlsy.cv</Link>
          </div>
        </ContactLinks>

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
    fill: var(--color-text-muted);
    transition: var(--transition-slow);
  }

  &:hover {
    & path {
      fill: var(--color-text-base);
      transition: var(--transition-default);
    }
  }
`;

const NavLinks = styled.nav`
  grid-column: 7 / -1;
  display: flex;
  gap: var(--spacing-4x);
  position: relative;

  & a {
    font-size: var(--font-size-s);
    color: var(--color-text-muted);
    text-decoration: none;
  }

  & a:hover {
    color: var(--color-text-base);
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
  flex: 0 0 28%;
  /* max-width: 400px; */
  min-width: 280px;
  padding: var(--spacing-4x);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4x);

  @media ${QUERIES.tabletAndBelow} {
    flex: 0 0 40%;
    min-width: 240px;
  }

  @media ${QUERIES.phoneAndBelow} {
    display: none; /* Hide sidebar on mobile for now */
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
`;

const Intro = styled.section`
  animation: onload-fade var(--duration-load) var(--ease-out) both;
`;

const Headline = styled.div`
  margin-bottom: var(--spacing-3x);

  & p {
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-l);
    line-height: 1.3;
    color: var(--color-text-base);
  }

  & p + p {
    text-indent: 2em;
  }

  @media ${QUERIES.tabletAndBelow} {
    & p {
      font-size: var(--font-size-m);
    }
  }
`;

const Callout = styled.div`
  padding: 16px 20px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-solid);
  color: var(--color-text-article);
  font-weight: var(--font-weight-normal);

  & p {
    line-height: 1.4;
  }
`;

const ContactLinks = styled.div`
  display: flex;
  gap: var(--spacing-4x);
  font-weight: var(--font-weight-normal);
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-1);

  & > div {
    flex: 1;
  }

  & p {
    color: var(--color-text-muted);
    margin-bottom: var(--spacing-xs);
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
