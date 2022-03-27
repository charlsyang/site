import Head from '../../components/Head'
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
import BackButton from '../../components/BackButton'

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
            <Head 
                title={frontmatter.title}
            />
            <MaxWidthWrapper>
                <Back href='/blog' text='Blog'/>
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

    @media ${QUERIES.tabletAndBelow} {
        min-height: calc(100vh - var(--footer-height));
    }
`

const Back = styled(BackButton)`
    position: sticky;
    top: var(--spacing-5x);
    left: var(--spacing-6x);
`