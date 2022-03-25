import Head from 'next/head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../utils/blog'
import Date from '../components/Date'
import GridWrapper from '../components/GridWrapper'
import Footer from '../components/Footer'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({allPostsData}) {
  return (
    <>
      <Head>
        <title>Charlsy Yang</title>
        <meta name="description" content="Charlsy’s Personal Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainWrapper>
        <MainContent>
          <GridWrapper>
            <Intro>
              <p>Charlsy designs <Ampersand>&</Ampersand> writes. </p>
              <p>He leads a life that straddles two worlds—a tangible one of shaping 
                forms and an ethereal one of tending thoughts.</p>
            </Intro>
          </GridWrapper>
          <GridWrapper>
            <Blog>
              <SectionTitle>Blog</SectionTitle>
              <BlogList>
                  {allPostsData.map( ({ slug, date, title }) => (
                        <BlogItem key={slug}>
                            <Link href={`/blog/${slug}`}>
                              <a>{title}</a>
                            </Link>
                            <StyledDate>
                              <Date dateString={date}></Date>
                            </StyledDate>
                        </BlogItem>
                      
                  ))}
                  <AllBlog>
                    <Link href='/blog'>
                        <a>All writings</a>
                    </Link>
                    <span>→</span>
                  </AllBlog>
              </BlogList>
            </Blog>
            <Now>
              <SectionTitle>Now</SectionTitle>
              <NowContent>
                <p>Proactively safeguarding my time for only the enterprises that I deem worthwhile:</p>
                <p>Continuing to hone my craft. Currently focused on learning front-end web development (hence this site) and design system.</p>
                <p>Reading extensively and consistently, taking on intellectually challenging text that sparks my interest. Planning to bring the same discipline to writing, publishing more frequently.</p>
                <p>Spending intentional efforts on nurturing friendships, writing letters, scheduling calls— doing things the long, hard, stupid way.</p>
              </NowContent>
              <Reading>
                <ReadingLabel>Reading</ReadingLabel>
                <BookTitle>Understanding Comics</BookTitle>
                <Author>Scott Mcloud</Author>
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
                  <a href="https://twitter.com/imcharlsy">@imcharlsy</a>
                </ContactItem>
              </ContactList>
            </Contact>
          </GridWrapper>
        </MainContent>
      </MainWrapper>
      <Footer/>
    </>
  )
}

const MainWrapper = styled(MaxWidthWrapper)`
  min-height: calc(100vh - 72px);
`

const MainContent = styled.main`
  font-family: var(--font-sans);
  padding-top: 10rem;
  padding-bottom: 5rem;

  & * {
    font-family: inherit;
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-m);
  }
`

const Intro = styled.header`
  margin-bottom: 13rem;
  grid-column: 8 / -1;
  
  & p {
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-gray-900);
  }

  & p+p {
    text-indent: 2.5rem;
  }
`

const Ampersand = styled.span`
  font-family: var(--ampersand-stack);
  font-size: 25px;
  font-style: italic;
  font-weight: var(--font-weight-normal);
`

const Blog = styled.section`
  grid-column: 3 / 8;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`

const SectionTitle = styled.h2`
  grid-column: 1 / 2;
  font-weight: var(--font-weight-normal);
  color: var(--color-gray-600);
`

const BlogList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  grid-column: 2 / -1;
`

const BlogItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-s);
`

const AllBlog = styled.div`
  display: flex;
  gap: var(--spacing-1x);
  margin-top: var(--spacing-5x);

  & span {
    color: var(--color-gray-900);
  }
`

const StyledDate = styled.p`
  color: var(--color-gray-600);
`

const Now = styled.section`
  grid-column: 8 / -1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: var(--spacing-6x);
`

const NowContent = styled.div`
  grid-column: 2 / -1;

  & p {
    color: var(--color-gray-900);
    line-height: 1.5;
  }

  & p+p {
    text-indent: 2.5rem;
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
  grid-column: 8 / -1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 3rem;
`

const ContactList = styled.div`
  grid-column: 2 / -1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4x);
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