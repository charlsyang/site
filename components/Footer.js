import styled from 'styled-components';
import Link from 'next/link';

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
`

const Divider = styled.div`
    height: 1px;
    width: 90vw;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    background-image: linear-gradient(
        90deg,
        hsla(0 0% 100% / 0%) 0%,
        hsla(0 0% 100% / 10%) 10%,
        hsla(0 0% 100% / 10%) 50%,
        hsla(0 0% 100% / 10%) 90%,
        hsla(0 0% 100% / 0%) 100%
    );

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
  font-family: var(--ampersand-stack);
  font-style: italic;
  font-weight: var(--font-weight-normal);
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