import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import { getSortedPostsData } from '../../utils/blog'
import Footer from '../../components/Footer'
import Date from '../../components/Date'
import BackButton from '../../components/BackButton'
import { QUERIES } from '../../utils/constants'
import GridWrapper from '../../components/GridWrapper'

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
            <Main>
                <Content>
                    <PageHead>
                        <PageTitle>Blog</PageTitle>
                        <RSS>Subscribe with <a href='/feed.xml'>RSS</a></RSS>
                    </PageHead>
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

const Main = styled(GridWrapper)`
    /* display: flex;
    justify-content: center;
    align-items: flex-start; */
    min-height: calc(100vh - var(--footer-height) - var(--nav-height));
    
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
    grid-column: 7 / -1;
    width: min(30rem, 100%);
    margin-top: 10rem;
    margin-bottom: 10rem;

    @media ${QUERIES.phoneAndBelow} {
        grid-column: 1 / -1;
    }
`

const PageTitle = styled.h1`
    font-size: var(--font-size-l);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-s);
    color: var(--color-text-base);

    @media ${QUERIES.tabletAndBelow} {
        font-size: var(--font-size-m);
    }
`

const RSS = styled.p`
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-normal);
    color: var(--color-text-muted);

    & a {
        font-size: var(--font-size-s);
    }
`

const PageHead = styled.div`
    margin-bottom: var(--spacing-6x);
    animation: onload-fade var(--duration-load) var(--ease-out) both;

    @media ${QUERIES.tabletAndBelow} {
        margin-bottom: var(--spacing-5x);
    }
`
const BlogList = styled.ul`
    display: flex;
    flex-direction: column;
    gap: var(--spacing-3x);
    grid-column: 2 / -1;
    animation: onload-fade var(--duration-load) var(--ease-out) both;
    animation-delay: var(--stagger-1);
`

const BlogItem = styled.li`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-s);
`

const StyledDate = styled.p`
  color: var(--color-text-muted);
`

export default BlogIndex;