import styled from 'styled-components'
import Link from 'next/link'
import GridWrapper from './GridWrapper';
import Favicon from '../public/favicon.svg'
import Image from 'next/image';

const Nav = () => {
    return (
        <NavWrapper>
            <Link href='/'>
                <Image src={Favicon}></Image>
            </Link>
            <NavLinks>
                <Link href='/work'>Work</Link>
                <Link href='/blog'>Blog</Link>
            </NavLinks>
        </NavWrapper>
    );
}

const NavWrapper = styled(GridWrapper)`
    padding-top: var(--spacing-3x);
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
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
`

export default Nav;