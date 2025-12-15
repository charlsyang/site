import Head from "../../components/Head";
import styled from "styled-components";
import {
  getSortedPostsData,
  getAllPostSlugs,
  getPostData,
} from "../../utils/blog";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { QUERIES } from "../../utils/constants";
import Date from "../../components/Date";
import MaxWidthWrapper from "../../components/MaxWidthWrapper";
import GridWrapper from "../../components/GridWrapper";
import Article from "../../components/Article";
import CustomLink from "../../components/CustomLink";
import CustomImg from "../../components/CustomImg";
import BackButton from "../../components/BackButton";
import CodeSnippet from "../../components/CodeSnippet";
import SideNote from "../../components/SideNote";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  const allPosts = getSortedPostsData();
  return {
    props: {
      ...postData,
      allPosts,
      slug: params.slug,
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

const BASE_URL = "https://charlsyang.com";

export default function BlogPost({ code, frontmatter, slug }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const ogImage = `${BASE_URL}/api/og?title=${encodeURIComponent(frontmatter.title)}`;

  return (
    <>
      <Head
        title={frontmatter.title}
        description={frontmatter.excerpt}
        ogImage={ogImage}
        path={`/blog/${slug}`}
      />
      <MaxWidthWrapper>
        <MainContent>
          <Back href="/blog">Blog</Back>
          <BlogHead>
            <h1>{frontmatter.title}</h1>
            <Date dateString={frontmatter.date} />
          </BlogHead>
          <Article>
            <Component
              components={{
                a: CustomLink,
                img: CustomImg,
                pre: CodeSnippet,
                SideNote,
              }}
            />
          </Article>
        </MainContent>
      </MaxWidthWrapper>
    </>
  );
}

const MainContent = styled(GridWrapper)`
  position: relative;
  padding: 10rem 0;
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));
`;

const BlogHead = styled.div`
  padding-top: 2px; // baseline align title with article
  grid-column: 3 / 6;
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-1);

  @media ${QUERIES.tabletAndBelow} {
    grid-column: 5 / -1;
  }

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    animation: onload-fade var(--duration-load) var(--ease-out) both;
    animation-delay: 0;
  }

  & h1 {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-medium);
    line-height: 1.4;
    color: var(--color-text-base);
    margin-bottom: var(--spacing-s);
    text-wrap: balance;
  }

  & time {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-muted);
    display: block;
    margin-bottom: 4rem;

    @media ${QUERIES.tabletAndBelow} {
      margin-bottom: 3.5rem;
    }
  }
`;

const Back = styled(BackButton)`
  grid-column: 1 / 3;
  margin-left: 4px;
  margin-top: -10px;
  animation: onload-fade var(--duration-load) var(--ease-out);

  @media ${QUERIES.phoneAndBelow} {
    display: none;
  }
`;
