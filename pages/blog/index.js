import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../../utils/blog'

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return {
      props: {
        allPostsData
      }
    }
}

const BlogIndex = ({ allPostsData }) => {
    return (
        <MaxWidthWrapper>
            <Head>
                <title>Blog</title>
            </Head>
            <main>
                <PageHead>Blog</PageHead>
            </main>
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
        </MaxWidthWrapper>
    )
}

const PageHead = styled.h1`
    font-size: 1.25rem;
    margin: 3rem 0;
`

const ListItem = styled.li`
    margin: 0 0 1.25rem 0;
`

export default BlogIndex;