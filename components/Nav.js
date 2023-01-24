import styled from 'styled-components'
import Link from 'next/link'
import GridWrapper from './GridWrapper';

const Nav = () => {
    return (
        <NavWrapper>
            <NavLinks>
                <Link href='/work'>Work</Link>
                <Link href='/blog'>Blog</Link>
            </NavLinks>
        </NavWrapper>
    );
}

const NavWrapper = styled(GridWrapper)`
    padding-top: 40px;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
`

const NavLinks = styled.nav`
    grid-column: 7 / -1;
    display: flex;
    gap: var(--spacing-4x);

    & a {
        font-size: var(--font-size-m);
    }
`

export default Nav;