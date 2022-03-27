import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import { getAllPostSlugs, getPostData } from '../../utils/blog'
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import { QUERIES } from '../../utils/constants'
import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Article from '../../components/Article'
import Date from '../../components/Date'
import Footer from '../../components/Footer'
import CustomLink from '../../components/CustomLink'

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.slug)
    return {
        props: {
            ...postData
        }
    }
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs()
  return {
    paths,
    fallback: false
  }
}

export default function BlogPost({ code, frontmatter }) {
    const Component = useMemo(() => getMDXComponent(code), [code]);

    return (
        <>
            <Head>
                <title>{frontmatter.title}</title>
            </Head>
            <MaxWidthWrapper>
                <Link href='/'>
                    <BackButton>
                    <LeftArrow>←</LeftArrow><BackText> Back</BackText>
                    </BackButton>
                </Link>
                <Main>
                    <Article>
                        <h1>{frontmatter.title}</h1>
                        <Date dateString={frontmatter.date} />
                        <Component components={{a: CustomLink}}/>
                    </Article>
                </Main>
            </MaxWidthWrapper>
            <Footer/>
        </>
    )
}

const Main = styled.main`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - var(--footer-height) - var(--back-button-height));

    @media ${QUERIES.phoneAndBelow} {
        min-height: calc(100vh - var(--footer-height));
    }
`

const BackButton = styled.a`
    position: sticky;
    top: var(--spacing-5x);
    left: var(--spacing-6x);
    height: var(--back-button-height);
    width: 6rem;
    display: flex;
    align-items: center;
    color: var(--color-gray-600);
    cursor: pointer;

    &:hover {
        color: var(--color-gray-900);
    }

    &:hover span:last-of-type {
        display: revert;
        transform: translateX(var(--spacing-1x));
        opacity: revert;
    }

    @media ${QUERIES.tabletAndBelow} {
        left: var(--spacing-5x);
    }

    @media ${QUERIES.phoneAndBelow} {
        display: none;
    }
`

const LeftArrow = styled.span`
    font-weight: 320;
    font-size: var(--font-size-xl);
`

const BackText = styled.span`
    font-family: var(--font-sans);
    font-size: var(--font-size-m);
    margin-top: 2px;
    opacity: 0%;
    transition: transform 250ms, opacity 250ms;
`
