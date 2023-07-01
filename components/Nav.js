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
            <Blur/>
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
    z-index: 2;
    height: var(--nav-height);
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
    backdrop-filter: blur(16px);
    z-index: 1;
    mask-image: linear-gradient(to bottom, #000 0, transparent 100%);
    width: 100vw;
    height: 48px;
    user-select: none;
    pointer-events: none;

    &::after {
        content:"";
        inset:0;
        position: absolute;
        background-image: linear-gradient(to bottom, var(--color-bg-base) 0, transparent 100%);
        opacity: 0.3;
    }
`

const Home = styled(Link)`
    max-width: 24px;
`

const StyledFleuron = styled(Fleuron)`
    display: block;
    transform: scale(0.9) translateY(-1px);
    & path {
        fill: var(--color-text-muted);
        transition: var(--transition-slow);
    }

    &:hover {
        & path {
            fill: var(--color-text-base);
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
        color: var(--color-text-muted);
        text-decoration: none;
    }

    & a:hover {
        color: var(--color-text-base);
    }

    @media ${QUERIES.phoneAndBelow} {
        gap: var(--spacing-2x);
    }
`

export default Nav;