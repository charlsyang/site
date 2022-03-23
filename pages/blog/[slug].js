import Head from 'next/head'
import styled from 'styled-components'
import { getAllPostSlugs, getPostData } from '../../utils/blog'
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Date from '../../components/Date'

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
        <MaxWidthWrapper>
            <Head>
                <title>{frontmatter.title}</title>
            </Head>
            <BlogMeta>
                <Title>{frontmatter.title}</Title>
                <PublisheddDate>
                    <Date dateString={frontmatter.date} />
                </PublisheddDate>
            </BlogMeta>
            <Article>
                <Component/>
            </Article>
        </MaxWidthWrapper>
    )
}

const BlogMeta = styled.header`
    margin-top: 4rem;
    margin-bottom: 3rem;
`

const Title = styled.h1`
    font-size: 1.5rem;
    margin-bottom: .5rem;
`

const PublisheddDate = styled.p`
    color: gray;
`

const Article = styled.article`
    margin-bottom: 240px;

    & h2 {
        margin-top: 2rem;
        margin-bottom: 1rem;
    }

    & p {
        margin-bottom: .5rem;
    }

    & ol, ul {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        list-style: disc;
        margin-left: 1rem;
    }
`