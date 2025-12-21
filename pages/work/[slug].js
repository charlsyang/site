import Head from "../../components/Head";
import styled from "styled-components";
import { getAllPostSlugs, getPostData, getPublishedPostsData } from "../../utils/work";
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

  return (
    <>
      <Head title={frontmatter.title + " – Charlsy Yang"} />
      <ProjectContainer>
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
      </ProjectContainer>
    </>
  );
}

const ProjectContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  padding: var(--spacing-4x);
  padding-right: var(--spacing-6x);

  @media ${QUERIES.tabletAndBelow} {
    padding: var(--spacing-3x);
  }
`;
