import Head from "../../components/Head";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  getAllPostSlugs,
  getPostData,
  getPublishedPostsData,
} from "../../utils/work";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { QUERIES } from "../../utils/constants";
import CaseStudy from "../../components/CaseStudy";
import CustomLink from "../../components/CustomLink";
import ProjectHead from "../../components/ProjectHead";
import HeroMock from "../../components/HeroMock";
import MediaRow from "../../components/MediaRow";
import MediaStack from "../../components/MediaStack";
import Contact from "../../components/Contact";
import NextProject from "../../components/NextProject";
import {
  usePageTransition,
  ContentTransition,
} from "../../components/PageTransition";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  const allPostsData = getPublishedPostsData();
  return {
    props: {
      ...postData, // slug, frontmatter, code
      allPostsData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export default function ProjectPost({ allPostsData, code, frontmatter, slug }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const router = useRouter();
  const { setExitDown } = usePageTransition();

  const handleClose = () => {
    setExitDown();
    router.push("/work");
  };

  return (
    <>
      <Head title={frontmatter.title + " – Charlsy Yang"} />
      <ProjectContainer>
        <CloseButton
          onClick={handleClose}
          aria-label="Close and return to work"
        >
          <CloseIcon
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </CloseIcon>
        </CloseButton>
        <ContentTransition>
          <ProjectHead
            title={frontmatter.title}
            subtitle={frontmatter.subtitle}
            timeline={frontmatter.timeline}
            team={frontmatter.team}
            contribution={frontmatter.contribution}
          />
          <CaseStudy>
            <Component
              components={{
                a: CustomLink,
                HeroMock,
                MediaRow,
                MediaStack,
                Contact,
              }}
            />
          </CaseStudy>
          <NextProject allPostsData={allPostsData} currentProjectSlug={slug} />
        </ContentTransition>
      </ProjectContainer>
    </>
  );
}

const ProjectContainer = styled.div`
  position: relative;
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-4x);
  padding-right: var(--spacing-6x);
  background: var(--color-bg-base);

  @media ${QUERIES.tabletAndBelow} {
    padding: var(--spacing-3x);
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: var(--spacing-4x);
  right: var(--spacing-4x);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;

  &:hover {
    color: var(--color-text-base);
    background: var(--color-bg-elevated);
  }

  @media ${QUERIES.tabletAndBelow} {
    top: var(--spacing-3x);
    right: var(--spacing-3x);
  }
`;

const CloseIcon = styled.svg`
  width: 20px;
  height: 20px;
`;
