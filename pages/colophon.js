import Head from '../components/Head'
import MaxWidthWrapper from '../components/MaxWidthWrapper'
import styled from 'styled-components'
import Footer from '../components/Footer'
import { QUERIES } from '../utils/constants'
import BackButton from '../components/BackButton'
import CustomLink from '../components/CustomLink'

export default function Colophon() {
    return (
        <>
            <Head 
                title="Colophon"
            />
            <MaxWidthWrapper>
                <Main>
                    <ContentWrapper>
                        <Title>Colophon</Title>
                        <Content>
                            <p>
                                Given the nature of a one-man team, the site is designed—inevitably—part 
                                in <CustomLink href='https://www.figma.com/'>Figma</CustomLink>, part in <CustomLink href='https://code.visualstudio.com/'>VS Code</CustomLink>. 
                                The type is set in <CustomLink href='https://abcdinamo.com/typefaces/diatype'>Diatype</CustomLink> from
                                 Dinamo, <CustomLink href='https://www.ludwigtype.de/fonts/marat/overview'>Marat</CustomLink> by Ludwig Übele,  and <CustomLink href='https://input.djr.com/'>Input Mono</CustomLink> by DJR.
                            </p>
                            <p>
                                Technology-wise the site is built with <CustomLink href='https://nextjs.org/'>Next.js</CustomLink>, 
                                furnished with <CustomLink href='https://styled-components.com/'>Styled Components</CustomLink>, and 
                                deployed with <CustomLink href='https://vercel.com/'>Vercel</CustomLink>. You can poke at my lame code <CustomLink href='https://github.com/charlsyang/site'>on Github</CustomLink>.
                            </p>
                            <p>
                                Thanks for visiting. Among myriads of other sites having you on mine is nothing 
                                less than a pleasure. Have a good one.
                            </p>
                            <Back href='/'>Home</Back>
                        </Content>
                    </ContentWrapper>
                </Main>
            </MaxWidthWrapper>
        </>
    )
}

const Main = styled.main`
    min-height: calc(100vh - var(--footer-height) - var(--nav-height));
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

    @media ${QUERIES.phoneAndBelow} {
        flex-direction: column;
        gap: var(--spacing-3x);
    }
` 
 
const Title = styled.h1`
    font-family: var(--font-serif);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xl);
    color: var(--color-text-base);
    animation: onload-fade var(--duration-load) var(--ease-out) both;

    @media ${QUERIES.tabletAndBelow} {
        font-size: var(--font-size-l);
    }
`

const Content = styled.div`
    animation: onload-fade var(--duration-load) var(--ease-out) both;
    animation-delay: var(--stagger-1);
    
    & p {
        font-family: var(--font-sans);
        font-weight: var(--font-weight-normal);
        font-size: var(--font-size-m);
        color: var(--color-text-article);
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

    & p > a {
        /* color: var(--color-text-muted); */
        color: var(--color-text-article);
    }

    & p > a:hover {
        color: var(--color-link-hover);
    }
`

const Back = styled(BackButton)`
    margin-top: var(--spacing-3x);
`
