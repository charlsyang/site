import styled from 'styled-components'
import Link from 'next/link'

const Nav = () => {
    return (
        <NavWrapper>
            <Link href='/blog'>
                Blog
            </Link>
            <Link href='/about'>
                About
            </Link>
        </NavWrapper>
    );
}

const NavWrapper = styled.div`
    display: flex;
    gap: 1rem;
`

export default Nav;