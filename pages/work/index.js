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
                        <Headline>
                            <p>Charlsy designs visual and interactive experience for products and brands.</p>
                            <p>He will graduate in June 2023 and is looking for full-time product design roles. Previously he worked at Rubrik, IDEO, Tide, and NIO.</p>
                        </Headline>
                        <h2>Projects</h2>
                        <Link href='/work/aura'>Enliven the Aura</Link>   
                    </Main>
                </GridWrapper>
            </MaxWidthWrapper>
        </>
    )
}

const Main = styled.main`
    grid-column: 7 / -1;
    min-height: calc(100vh - var(--footer-height));
`

const Headline = styled.div`
    font-size: var(--font-size-xl);
    line-height: 1.3;
    color: var(--color-gray-900);
    margin-top: 10rem;
    margin-bottom: 5rem;

    @media ${QUERIES.tabletAndBelow} {
      font-size: var(--font-size-l);
    }

    & p+p {
        text-indent: 2em;
    }
`

