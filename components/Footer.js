import styled from 'styled-components';
import Link from 'next/link';
import { QUERIES } from '../utils/constants'

const Footer = () => {
    return (
        <FooterWrapper>
            <Divider/>
            <FooterContent>
                <Footnote>© 2022 · Design <Ampersand>&</Ampersand> built in Seattle</Footnote>
                <Link href='/colophon'>
                    <Colophon>Colophon</Colophon>
                </Link>
            </FooterContent>
        </FooterWrapper>
    )
}


const FooterWrapper = styled.footer`
    height: var(--footer-height);
    position: relative;
    max-width: min(100%, calc(1200px + 40px * 2));
    margin-left: auto;
    margin-right: auto;
    padding-left: 40px;
    padding-right: 40px;

    @media ${QUERIES.phoneAndBelow} {
        padding-left: 24px;
        padding-right: 24px;
    }
`

const Divider = styled.div`
    height: 1px;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    
    background-image: linear-gradient(
        90deg,
        var(--color-bg) 0%,
        var(--color-divider) 25%,
        var(--color-divider) 50%,
        var(--color-divider) 75%,
        var(--color-bg) 100%
    );

    @media ${QUERIES.laptopAndBelow} {
        background-image: linear-gradient(
            90deg,
            var(--color-bg) 0%,
            var(--color-divider) 10%,
            var(--color-divider) 50%,
            var(--color-divider) 90%,
            var(--color-bg) 100%
        );
    }
`

const FooterContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
`

const Footnote = styled.p`
    font-size: var(--font-size-xs);
    font-family: var(--font-sans);
    color: var(--color-gray-300);
`

const Ampersand = styled.span`
  font-family: var(--font-ampersand);
  font-style: italic;
  font-weight: var(--font-weight-normal);
  padding-right: 1px;
`

const Colophon = styled.a`
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--color-gray-300);
    text-decoration: none;

    & :hover {
        color: var(--color-gray-900);
        cursor: pointer;
    }
`

export default Footer;