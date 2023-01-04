import MaxWidthWrapper from '../../components/MaxWidthWrapper'
import Head from 'next/head'
import styled from 'styled-components'
import Footer from '../../components/Footer'
import GridWrapper from '../../components/GridWrapper'
import Link from 'next/link'
import { QUERIES } from '../../utils/constants'

export default function WorkIndex() {
    return (
        <>
            <Head>
                <title>Work</title>
            </Head>
            <MaxWidthWrapper>
                <GridWrapper>
                    <Main>
                        <Headline>Charlsy designs visual and interactive experience for products and brands.</Headline>
                        <h2>Projects</h2>
                        <Link href='/work/test-project'>Test Project</Link>   
                    </Main>
                </GridWrapper>
            </MaxWidthWrapper>
            <Footer/>
        </>
    )
}

const Main = styled.main`
    grid-column: 8 / -1;
    min-height: calc(100vh - var(--footer-height));
`

const Headline = styled.p`
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-gray-900);
    text-indent: 2em;
    margin-top: 10rem;
    margin-bottom: 5rem;

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }
`

