import Head from "../../components/Head";
import styled from "styled-components";
import { getSortedPostsData, getAllPostSlugs, getPostData } from "../../utils/blog";
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
import BlogFooter from "../../components/BlogFooter";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.slug);
  const allPosts = getSortedPostsData();
  return {
    props: {
      ...postData,
      allPosts
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

export default function BlogPost({ allPosts, code, frontmatter, slug }) {
  const Component = useMemo(() => getMDXComponent(code), [code]);
  const readNextPosts = allPosts.filter(post => post.slug !== slug).slice(0, 4);
  // .sort(() => 0.5 - Math.random())

  return (
    <>
      <Head title={frontmatter.title} />
      <MaxWidthWrapper>
        <MainContent>
          <Back href="/blog">Blog</Back>
          <BlogHead>
            <h1>{frontmatter.title}</h1>
            <Date dateString={frontmatter.date} />
          </BlogHead>
          <Article>
            <Component
              components={{ a: CustomLink, img: CustomImg, pre: CodeSnippet, SideNote }}
            />
          </Article>
        </MainContent>
        {/* <BlogFooter readNextPosts={readNextPosts}/> */}
      </MaxWidthWrapper>
    </>
  );
}

const MainContent = styled(GridWrapper)`
  position: relative;
  padding: 10rem 0;
  min-height: calc(100vh - var(--nav-height) - var(--footer-height));

  @media ${QUERIES.phoneAndBelow} {
    padding: 5rem 0;
  }
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
    translate: 0 -56px;
  }
`;
