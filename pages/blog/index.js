import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../../utils/blog'
import Footer from '../../components/Footer'
import Date from '../../components/Date'
import BackButton from '../../components/BackButton'
import { QUERIES } from '../../utils/constants'

export async function getStaticProps() {
    const allPostsData = getSortedPostsData();
    return {
      props: {
        allPostsData
      }
    }
}

const BlogIndex = ({ allPostsData }) => {
    return <>
        <Head>
            <title>Blog</title>
        </Head>
        <MaxWidthWrapper>
            <Back href='/' text='Home'/>
            <Main>
                <Content>
                    <PageHead>Blog</PageHead>
                    <BlogList>
                        {allPostsData.map( ({ slug, date, title }) => (
                            <BlogItem key={slug}>
                                <Link href={`/blog/${slug}`}>
                                    {title}
                                </Link>
                                <StyledDate>
                                    <Date dateString={date}></Date>
                                </StyledDate>
                            </BlogItem>
                        ))}
                    </BlogList>
                </Content>
            </Main>
        </MaxWidthWrapper>
    </>;
}

const Main = styled.main`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - var(--footer-height) - var(--back-button-height));
    
    & * {
        font-family: var(--font-sans);
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-m);

        @media ${QUERIES.tabletAndBelow} {
        font-size: var(--font-size-s);
        }
    }
    
    @media ${QUERIES.tabletAndBelow} {
        min-height: calc(100vh - var(--footer-height));
    }
`

const Back = styled(BackButton)`
    position: sticky;
    top: var(--spacing-5x);
    left: var(--spacing-6x);

    @media ${QUERIES.phoneAndBelow} {
        position: relative;
        left: 0;
    }
`

const Content = styled.div`
    width: min(30rem, 100%);
    margin-top: calc(10rem - var(--back-button-height));
    margin-bottom: 10rem;
`

const PageHead = styled.h1`
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-900);
    margin-bottom: var(--spacing-6x);

    @media ${QUERIES.tabletAndBelow} {
        font-size: var(--font-size-m);
        margin-bottom: var(--spacing-4x);
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

const StyledDate = styled.p`
  color: var(--color-gray-600);
`

export default BlogIndex;