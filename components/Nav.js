import styled from 'styled-components'
import Link from 'next/link'
import GridWrapper from './GridWrapper';
import Fleuron from '../public/favicon.svg'
import Image from 'next/image';
import MaxWidthWrapper from './MaxWidthWrapper';
import { QUERIES } from '../utils/constants';

const Nav = () => {
    return (
        <MaxWidthWrapper>
            <NavWrapper>
                <Home>
                    <Link href='/'>
                        <StyledFleuron/>
                    </Link>
                </Home>
                <NavLinks>
                    <Link href='/work'>Work</Link>
                    <Link href='/blog'>Blog</Link>
                </NavLinks>
            </NavWrapper>
        </MaxWidthWrapper>
    );
}

const NavWrapper = styled(GridWrapper)`
    padding-top: var(--spacing-3x);
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;

    @media ${QUERIES.phoneAndBelow} {
        display: flex;
        gap: var(--spacing-2x);
    }
`

const Home = styled.div`
    max-width: 24px;
`

const StyledFleuron = styled(Fleuron)`
    display: block;
    transform: scale(0.9);
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