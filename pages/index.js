import Head from "../components/Head";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import styled from "styled-components";
import Link from "next/link";
import { getSortedPostsData } from "../utils/blog";
import Date from "../components/Date";
import GridWrapper from "../components/GridWrapper";
import CustomLink from "../components/CustomLink";
import { QUERIES } from "../utils/constants";
import { ArrowRight } from "react-feather";
import generateRSSFeed from "../utils/generateRSSFeed";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();

  await generateRSSFeed();

  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  let latestPostData;
  if (allPostsData.length > 5) {
    latestPostData = allPostsData.slice(0, 5);
  } else {
    latestPostData = allPostsData;
  }

  return (
    <>
      <Head description="Charlsy's personal site" />
      <MaxWidthWrapper>
        <MainContent>
          <GridWrapper>
            <Intro>
              <p>
                Charlsy <CustomLink href="/work">designs</CustomLink>{" "}
                <Ampersand>&</Ampersand>{" "}
                <CustomLink href="/blog">writes</CustomLink>.{" "}
              </p>
              <p>
                He leads a life that straddles two worlds—a tangible one of
                shaping forms and an ethereal one of tending&nbsp;thoughts.
              </p>
            </Intro>
          </GridWrapper>
          <GridWrapper>
            <Blog>
              <SectionTitle>Blog</SectionTitle>
              <BlogList>
                {latestPostData.map(({ slug, date, title }) => (
                  <BlogItem key={slug}>
                    <Link href={`/blog/${slug}`}>{title}</Link>
                    <StyledDate>
                      <Date dateString={date}></Date>
                    </StyledDate>
                  </BlogItem>
                ))}
                <Link href="/blog" legacyBehavior>
                  <AllBlog>
                    All posts
                    <ArrowRight size={16} />
                  </AllBlog>
                </Link>
              </BlogList>
            </Blog>
            <Contact>
              <SectionTitle>Say hi</SectionTitle>
              <ContactList>
                <ContactItem>
                  <ContactItemLabel>Email</ContactItemLabel>
                  <a href="mailto:hi@charlsy.me">hi@charlsy.me</a>
                </ContactItem>
                <ContactItem>
                  <ContactItemLabel>Twitter/X</ContactItemLabel>
                  <CustomLink rel="me" href="https://x.com/imcharlsy">
                    @imcharlsy
                  </CustomLink>
                </ContactItem>
              </ContactList>
            </Contact>
          </GridWrapper>
        </MainContent>
      </MaxWidthWrapper>
    </>
  );
}

const MainContent = styled.div`
  font-family: var(--font-sans);
  padding-top: 10rem;
  padding-bottom: 5rem;
  min-height: calc(100vh - var(--footer-height) - var(--nav-height));

  & * {
    font-family: inherit;
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-m);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-s);
    }
  }
`;

const Intro = styled.header`
  margin-bottom: 6rem;
  grid-column: 7 / -1;
  max-width: 45ch;
  animation: onload-fade var(--duration-load) var(--ease-out) both;

  @media ${QUERIES.tabletAndBelow} {
    grid-column: 7 / -1;
    margin-bottom: 8rem;
  }

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    margin-bottom: 6rem;
  }

  & p {
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-text-base);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }
  }

  & p + p {
    text-indent: 2em;
  }

  & a {
    font-size: inherit;
  }
`;

const Ampersand = styled.span`
  font-family: var(--font-ampersand);
  font-size: 25px;
  font-style: italic;
  font-weight: var(--font-weight-normal);
  padding-right: 1px;

  @media ${QUERIES.tabletAndBelow} {
    font-size: var(--font-size-l);
  }
`;

const Blog = styled.section`
  grid-column: 6 / -1;
  display: grid;
  grid-column-gap: 24px;
  grid-template-columns: repeat(7, 1fr);
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-1);

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
  }
`;

const SectionTitle = styled.h2`
  grid-column: 1 / 2;
  font-weight: var(--font-weight-normal);
  color: var(--color-text-muted);

  @media ${QUERIES.phoneAndBelow} {
    padding-bottom: var(--spacing-1x);
    border-bottom: 1px solid var(--colo-border);
  }
`;

const BlogList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3x);
  grid-column: 2 / -1;
  align-items: flex-start;
`;

const BlogItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-s);
`;

const AllBlog = styled.a`
  height: var(--back-button-height);
  display: flex;
  align-items: center;
  gap: var(--spacing-s);
  color: var(--color-text-base);
  cursor: pointer;

  & svg {
    transition: transform var(--transition-default);
  }

  &:hover svg {
    transform: translateX(var(--spacing-s));
    transition: transform var(--transition-fast);
  }

  @media ${QUERIES.phoneAndBelow} {
    margin-top: var(--spacing-2x);
  }
`;

const StyledDate = styled.p`
  color: var(--color-text-muted);
`;

const Contact = styled.section`
  grid-column: 6 / -1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 20px;
  margin-top: 5rem;
  animation: onload-fade var(--duration-load) var(--ease-out) both;
  animation-delay: var(--stagger-2);

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
  }
`;

const ContactList = styled.div`
  grid-column: 2 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4x);

  @media ${QUERIES.tabletAndBelow} {
    gap: var(--spacing-3x);
  }
`;

const ContactItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-s);
`;

const ContactItemLabel = styled.p`
  color: var(--color-text-faint);
`;
