import Head from '../components/Head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../utils/blog'
import Date from '../components/Date'
import GridWrapper from '../components/GridWrapper'
import CustomLink from '../components/CustomLink'
import { QUERIES } from '../utils/constants'
import { ArrowRight } from 'react-feather'
import Balancer from 'react-wrap-balancer'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({allPostsData}) {
  let latestPostData;
  if (allPostsData.length > 5) {
    latestPostData = allPostsData.slice(0, 5)
  } else {
    latestPostData = allPostsData
  };

  return <>
    <Head 
      title="Charlsy Yang"
      description="Charlsy’s personal site"
    />
    <MaxWidthWrapper>
      <MainContent>
        <GridWrapper>
          <Intro>
              <p>Charlsy <CustomLink href='/work'>designs</CustomLink> <Ampersand>&</Ampersand> <CustomLink href='/blog'>writes</CustomLink>. </p>
              <p>He leads a life that straddles two worlds—a tangible one of shaping 
              forms and an ethereal one of tending&nbsp;thoughts.</p>
          </Intro>
        </GridWrapper>
        <GridWrapper>
          <Blog>
            <SectionTitle>Blog</SectionTitle>
            <BlogList>
                {latestPostData.map( ({ slug, date, title }) => (
                      <BlogItem key={slug}>
                          <Link href={`/blog/${slug}`}>
                            {title}
                          </Link>
                          <StyledDate>
                            <Date dateString={date}></Date>
                          </StyledDate>
                      </BlogItem>
                ))}
                <Link href='/blog' legacyBehavior>
                  <AllBlog>
                      All posts<ArrowRight size={16}/>
                  </AllBlog>
                </Link>
            </BlogList>
          </Blog>
          <Now>
            <SectionTitle>Now</SectionTitle>
            <NowContent>
              <p>Proactively guarding my time for only the enterprises that I deem worthwhile:</p>
              <p>Continuing to hone my craft. Currently focused on learning front-end web development (hence this site) and design system.</p>
              <p>Reading extensively and consistently, taking on intellectually stimulating text that sparks my interest. Planning to bring the same discipline to writing, publishing more frequently.</p>
              <p>Putting intentional efforts in nurturing friendships, writing letters and making calls—doing things <CustomLink href='https://www.youtube.com/watch?v=WjSOZI90PmE'>the long, hard, stupid way.</CustomLink></p>
            </NowContent>
            <Reading>
              <ReadingLabel>Reading</ReadingLabel>
              <CustomLink href='https://www.amazon.com/End-Education-Redefining-Value-School/dp/0679750312'>The End of Education</CustomLink>
              <Author>Neil Postman</Author>
            </Reading>
          </Now>
          <Contact>
            <SectionTitle>Say hi</SectionTitle>
            <ContactList>
              <ContactItem>
                <ContactItemLabel>email</ContactItemLabel>
                <a href="mailto:hi@charlsy.me">hi@charlsy.me</a>
              </ContactItem>
              <ContactItem>
                <ContactItemLabel>twitter</ContactItemLabel>
                <CustomLink href="https://twitter.com/imcharlsy">@imcharlsy</CustomLink>
              </ContactItem>
            </ContactList>
          </Contact>
        </GridWrapper>
      </MainContent>
    </MaxWidthWrapper>
  </>;
}


const MainContent = styled.main`
  font-family: var(--font-sans);
  padding-top: 10rem;
  padding-bottom: 5rem;
  min-height: calc(100vh - var(--footer-height));

  & * {
    font-family: inherit;
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-m);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-s);
    }
  }
`

const Intro = styled.header`
  margin-bottom: 10rem;
  grid-column: 7 / -1;
  max-width: 45ch;

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
    color: var(--color-gray-900);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }
  }

  & p+p {
    text-indent: 2em;
  }

  & a {
    font-size: inherit;
  }
`
/* & span:nth-of-type(2) {
    text-indent: 2em;
  }
*/

/*
const StyledBalancer = styled(Balancer)`
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-gray-900);

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    } 
`*/

const Ampersand = styled.span`
  font-family: var(--font-ampersand);
  font-size: 25px;
  font-style: italic;
  font-weight: var(--font-weight-normal);
  padding-right: 1px;

  @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }
`

const Blog = styled.section`
  grid-column: 1 / 6;
  display: grid;
  grid-column-gap: 24px;
  grid-template-columns: repeat(5, 1fr);

  @media ${QUERIES.tabletAndBelow} {
    grid-column: 1 / 7;
  }

  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
  }
`

const SectionTitle = styled.h2`
  grid-column: 1 / 2;
  font-weight: var(--font-weight-normal);
  color: var(--color-gray-600);

  @media ${QUERIES.phoneAndBelow} {
    padding-bottom: var(--spacing-1x);
    border-bottom: 1px solid var(--color-divider);
  }
`

const BlogList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3x);
  grid-column: 2 / -1;
`

const BlogItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-s);
`

const AllBlog = styled.a`
  height: var(--back-button-height);
  margin-top: var(--spacing-3x);
  display: flex;
  align-items: center;
  gap: var(--spacing-s);
  color: var(--color-gray-900);
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
`

const StyledDate = styled.p`
  color: var(--color-gray-600);
`

const Now = styled.section`
  grid-column: 7 / -2;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: var(--spacing-6x);

  @media ${QUERIES.tabletAndBelow} {
    grid-column: 7 / -1;
    grid-row-gap: var(--spacing-4x);
  }
  
  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
    margin-top: var(--spacing-6x);
  }
`

const NowContent = styled.div`
  grid-column: 2 / -1;

  & p {
    color: var(--color-gray-900);
    line-height: 1.5;
    hyphens: auto;
  }

  & p+p {
    text-indent: 1.5em;
  }
`

const Reading = styled.div`
  grid-column: 2 / -1;
`

const ReadingLabel = styled.p`
  font-weight: var(--font-weight-bold);
  letter-spacing: 1px;
  text-transform: lowercase;
  font-variant: small-caps;
  color: var(--color-gray-300);
  margin-bottom: var(--spacing-1x);
`

const BookTitle = styled.p`
  color: var(--color-gray-900);
`

const Author = styled.p`
  color: var(--color-gray-600);
`

const Contact = styled.section`
  grid-column: 7 / -2;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 5rem;

  @media ${QUERIES.tabletAndBelow} {
    grid-column: 7 / -1;
  }
  
  @media ${QUERIES.phoneAndBelow} {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
  }
`

const ContactList = styled.div`
  grid-column: 2 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4x);

  @media ${QUERIES.tabletAndBelow} {
    gap: var(--spacing-3x);
  }
`

const ContactItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-s);
`

const ContactItemLabel = styled.p`
  color: var(--color-gray-300);
`