import Head from '../../components/Head'
import styled from 'styled-components'
import { getAllPostSlugs, getPostData } from '../../utils/work'
import { getMDXComponent } from "mdx-bundler/client"
import { useMemo } from "react"
import { QUERIES } from '../../utils/constants'
import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import CaseStudy from '../../components/CaseStudy'
import CustomLink from '../../components/CustomLink'
import ProjectHead from '../../components/ProjectHead'
import HeroMock from '../../components/HeroMock'
import MediaRow from '../../components/MediaRow'
import MediaStack from '../../components/MediaStack'
import Contact from '../../components/Contact'

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.slug)
    return {
        props: {
            ...postData // slug, frontmatter, code
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

ProjectPost.theme = 'dark'

export default function ProjectPost({ code, frontmatter, slug }) {
    const Component = useMemo(() => getMDXComponent(code), [code]);

    return (
        <>
            <Head 
                title={frontmatter.title}
            />
            <MaxWidthWrapper>
                <Main>
                    <ProjectHead
                        title={frontmatter.title}
                        subtitle={frontmatter.subtitle}
                        timeline={frontmatter.timeline}
                        team={frontmatter.team}
                        contribution={frontmatter.contribution}
                    />
                    <CaseStudy>
                        <Component components={{
                            a: CustomLink, 
                            HeroMock,
                            MediaRow,
                            MediaStack,
                            Contact
                        }}/>
                    </CaseStudy>
                </Main>
            </MaxWidthWrapper>
        </>
    )
}

const Main = styled.main`
    min-height: calc(100vh - var(--footer-height) - var(--back-button-height));

    @media ${QUERIES.tabletAndBelow} {
        min-height: calc(100vh - var(--footer-height));
    }
`