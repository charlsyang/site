import styled from 'styled-components'
import Link from 'next/link'
import GridWrapper from './GridWrapper';
import Fleuron from '../public/favicon.svg'
import Image from 'next/image';
import MaxWidthWrapper from './MaxWidthWrapper';
import { QUERIES } from '../utils/constants';

const Nav = () => {
    return (
        <>
            {/* <Blur/> */}
            <NavWrapper>
                <NavGrid>
                    <Home href='/'>
                        <StyledFleuron/>
                    </Home>
                    <NavLinks>
                        <Link href='/work'>Work</Link>
                        <Link href='/blog'>Blog</Link>
                    </NavLinks>
                </NavGrid>
            </NavWrapper>
        </>
    );
}

const NavWrapper = styled(MaxWidthWrapper)`
`

const NavGrid = styled(GridWrapper)`
    padding-top: var(--spacing-2x);

    @media ${QUERIES.phoneAndBelow} {
        display: flex;
        gap: var(--spacing-2x);
    }
`

const Blur = styled.div`
    position: fixed;
    top: 0;
    background-color: #000;
    backdrop-filter: blur(16px);
    /* mask-image: linear-gradient(to bottom, #000 0, transparent 100%); */
    width: 100vw;
    height: 48px;

    /* &::after {
        content:"";
        position: fixed;
        top: 0;
        inset:0;
        background-image: linear-gradient(to bottom, var(--color-bg) 0, transparent 100%);
        opacity: 0.3;
    } */
`

const Home = styled(Link)`
    max-width: 24px;
`

const StyledFleuron = styled(Fleuron)`
    display: block;
    transform: scale(0.9) translateY(-1px);
    & path {
        fill: var(--color-gray-600);
        transition: var(--transition-slow);
    }

    &:hover {
        & path {
            fill: var(--color-gray-900);
            transition: var(--transition-default);
        }
    }
`

const NavLinks = styled.nav`
    grid-column: 7 / -1;
    display: flex;
    gap: var(--spacing-4x);
    position: relative;
    
    & a {
        font-size: var(--font-size-s);
        color: var(--color-gray-600);
        text-decoration: none;
    }

    & a:hover {
        color: var(--color-gray-900);
    }

    @media ${QUERIES.phoneAndBelow} {
        gap: var(--spacing-2x);
    }
`

export default Nav;