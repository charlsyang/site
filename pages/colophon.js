import Head from 'next/head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import styled from 'styled-components'
import Footer from '../components/Footer'
import { QUERIES } from '../utils/constants'
import BackButton from '../components/BackButton'

export default function Colophon() {
    return (
        <>
            <Head>
                <title>Colophon</title>
            </Head>
            <MaxWidthWrapper>
                <Main>
                    <ContentWrapper>
                        <Title>Colophon</Title>
                        <Content>
                            <p>Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of “de Finibus Bonorum et Malorum” (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
                            <Back href='/'/>
                        </Content>
                    </ContentWrapper>
                </Main>
            </MaxWidthWrapper>
            <Footer/>
        </>
    )
}

const Main = styled.main`
    min-height: calc(100vh - var(--footer-height));
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
`

const ContentWrapper = styled.div`
    display: flex;
    gap: 4rem;
    justify-content: flex-end;
    align-items: baseline;
    margin-bottom: 12vh;

    @media ${QUERIES.tabletAndBelow} {
        margin-bottom: 20vh;
    }

    @media ${QUERIES.phoneAndBelow} {
        flex-direction: column;
        gap: var(--spacing-3x);
    }
` 
 
const Title = styled.h1`
    font-family: var(--font-serif);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xl);
    color: var(--color-gray-900);

    @media ${QUERIES.tabletAndBelow} {
        font-size: var(--font-size-l);
    }
`

const Content = styled.div`
    
    & p {
        font-family: var(--font-sans);
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-m);
        color: var(--color-gray-600);
        max-width: 40ch;

        @media ${QUERIES.tabletAndBelow} {
            font-size: var(--font-size-s);
        }

        @media ${QUERIES.phoneAndBelow} {
            max-width: 100%;
        }
    }

    & p+p {
        text-indent: 1.5em;
    }
`

const Back = styled(BackButton)`
    margin-top: var(--spacing-3x);
`
