import Head from 'next/head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import Nav from '../components/Nav'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../utils/blog'

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
      <main>
        <Heading>
        Charlsy writes, designs, and codes. He leads the life of a craftsman 
        who makes and that of a thinker who ponders.
        </Heading>
        {/* <Nav/> */}
        <SectionTitle>Blog</SectionTitle>
        <ul>
            {allPostsData.map( ({ slug, date, title }) => (
                <ListItem key={slug}>
                    <Link href={`/blog/${slug}`}>
                        <a>{title}</a>
                    </Link>
                    <p>{date}</p>
                </ListItem>
            ))}
        </ul>
      </main>
    </MaxWidthWrapper>
  )
}

const Heading = styled.h1`
  font-size: 1.75rem;
  margin-top: 10rem;
  margin-bottom: 5rem;
  line-height: 1.2;
`

const ListItem = styled.li`
    margin: 0 0 1.25rem 0;
`

const SectionTitle = styled.h2`
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`