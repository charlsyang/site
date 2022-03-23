import styled from 'styled-components'
import Link from 'next/link'

const Nav = () => {
    return (
        <NavWrapper>
            <Link href='/blog'>
                <a>Blog</a>
            </Link>
            <Link href='/about'>
                <a>About</a>
            </Link>
        </NavWrapper>
    )
}

const NavWrapper = styled.div`
    display: flex;
    gap: 1rem;
`

export default Nav;