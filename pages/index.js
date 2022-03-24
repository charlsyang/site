import Head from 'next/head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import Nav from '../components/Nav'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../utils/blog'
import Date from '../components/Date'
import GridWrapper from '../components/GridWrapper'

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
    <MaxWidthWrapper home>
      <Head>
        <title>Charlsy’s Site</title>
        <meta name="description" content="Charlsy’s personal website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContent>
        <GridWrapper>
          <Header>
            <p>Charlsy designs <Ampersand>&</Ampersand> writes. </p>
            <p>He leads a life that straddles two worlds—a tangible one of shaping 
              forms and an ethereal one of tending thoughts.</p>
          </Header>
        </GridWrapper>
        {/* <Nav/> */}
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
      </PageContent>
    </MaxWidthWrapper>
  )
}

const PageContent = styled.main`
  font-family: var(--font-sans);

  & * {
    font-family: inherit;
  }
`

const Header = styled.div`
  margin-top: 12rem;
  margin-bottom: 13rem;
  grid-column: 8 / -1;
  
  & p {
    font-weight: 400;
    font-size: 1.5rem;
    line-height: 1.3;
  }

  & p+p {
    text-indent: 2.5rem;
  }
`

const Ampersand = styled.span`
  font-family: var(--ampersand-stack);
  font-size: 25px;
  font-style: italic;
  font-weight: 400;
`

const Blog = styled.section`
  grid-column: 3 / 8;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
`

const SectionTitle = styled.h2`
  grid-column: 1 / 2;
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
  gap: 4px;
`

const StyledDate = styled.p`
`

const Now = styled.section`
  grid-column: 8 / -1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
`

const NowContent = styled.div`
  grid-column: 2 / -1;

  & p+p {
    text-indent: 2.5rem;
  }
`

const Reading = styled.div`
  grid-column: 2 / -1;
`

const ReadingLabel = styled.p`
`

const BookTitle = styled.p`
`

const Author = styled.p`
`

const Contact = styled.section`
  grid-column: 8 / -1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-top: 3rem;
`

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const ContactItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ContactItemLabel = styled.p`
`